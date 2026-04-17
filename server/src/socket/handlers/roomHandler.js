import {
  getRoomState,
  addUserToRoom,
  removeUserFromRoom, getRoomsState,
} from '../../services/roomService.js';

import { redis } from '../../config/redis.js';
import { extractVideoId } from '../../services/youtubeService.js';

// Track active room syncing intervals
const roomSyncIntervals = new Map();

function startRoomSync(io, roomId) {
  // Only start one interval per room
  if (roomSyncIntervals.has(roomId)) return;

  const intervalId = setInterval(async () => {
    try {
      const playbackData = await redis.hGetAll(`room:${roomId}:playback`);
      if (!playbackData || !playbackData.videoId) {
        // Room has no active playback, clear interval
        console.log(`⏹️ No playback in room ${roomId}, stopping sync`);
        clearInterval(intervalId);
        roomSyncIntervals.delete(roomId);
        return;
      }

      // Calculate current elapsed time based on playback state
      let elapsedSeconds = parseInt(playbackData.elapsedSeconds || '0');
      const timestamp = parseInt(playbackData.timestamp || Date.now());
      const timeSinceUpdate = (Date.now() - timestamp) / 1000;

      // Only add time if actively playing
      if (playbackData.playState === 'playing') {
        elapsedSeconds += timeSinceUpdate;
      }

      // Send time update to all users in room
      io.to(`room:${roomId}`).emit('room:time_update', {
        roomId,
        videoId: playbackData.videoId,
        elapsedSeconds: Math.floor(elapsedSeconds),
        playState: playbackData.playState || 'playing',
        timestamp: Date.now() // Client uses this for drift correction
      });
    } catch (err) {
      console.error(`[Sync] Error syncing room ${roomId}:`, err);
    }
  }, 100); // Send time update every 100ms for smooth sync

  roomSyncIntervals.set(roomId, intervalId);
}

function stopRoomSync(roomId) {
  if (roomSyncIntervals.has(roomId)) {
    clearInterval(roomSyncIntervals.get(roomId));
    roomSyncIntervals.delete(roomId);
  }
}

export function registerRoomHandlers(io, socket) {
  // Join a room
  socket.on('room:join', async ({ roomId }, ack) => {
    console.log(`[Socket] User ${socket.user.id} joining room ${roomId}, socket rooms:`, [...socket.rooms]);
    if (!roomId) {
      if (ack) ack({ ok: false, error: 'Missing roomId' });
      return;
    }

    let state = null;
    try {
      console.log(`[Socket] User ${socket.user.id} joining room ${roomId}`);

      // If user was already in a room, leave first
      if (socket.currentRoom && socket.currentRoom !== roomId) {
        await leaveRoom(socket.currentRoom);
      }

      socket.join(`room:${roomId}`);
      console.log(`[Socket] After join, socket rooms:`, [...socket.rooms]);
      socket.currentRoom = roomId;

      await addUserToRoom(roomId, socket.user.id);
      state = await getRoomState(roomId);

      // Broadcast updated state to all users in the room (including joiner)
      io.to(`room:${roomId}`).emit('room:state', state);

      // Get current playback state and send it to the new user
      try {
        const playbackData = await redis.hGetAll(`room:${roomId}:playback`);
        const playlist = await redis.lRange(`room:${roomId}:playlist`, 0, -1);

        if (playbackData && playbackData.videoId) {
          console.log(`📤 Sending current playback to new user:`, playbackData);

          // Calculate elapsed time based on how long since the last state update
          let elapsedSeconds = parseInt(playbackData.elapsedSeconds || '0');
          const timestamp = parseInt(playbackData.timestamp || Date.now());
          const timeSinceUpdate = (Date.now() - timestamp) / 1000;

          // Only add elapsed time if the video is playing
          if (playbackData.playState === 'playing') {
            elapsedSeconds += timeSinceUpdate;
          }

          const payload = {
            song: {
              videoId: playbackData.videoId,
              title: playbackData.title || playbackData.videoId,
            },
            elapsedSeconds: Math.floor(elapsedSeconds),
            playState: playbackData.playState || 'playing',
            roomId
          };
          socket.emit('room:video_load', payload);
        }

        // Send the playlist
        socket.emit('room:queue_updated', { queue: playlist, roomId });
      } catch (err) {
        console.error('Error fetching playback state:', err);
        // Don't let playback state errors prevent room:join from completing
      }

      // Ack the joiner with current state
      if (ack) {
        console.log(`[Socket] Sending ack for room:join`);
        ack({ ok: true, state });
      }
    } catch (error) {
      console.error('Error in room:join:', error);
      if (ack) {
        console.log(`[Socket] Sending error ack for room:join:`, error.message);
        ack({ ok: false, error: error.message });
      }
    }
  });

  // Leave a room manually
  socket.on('room:leave', async ({ roomId }) => {
    if (!roomId) return;
    console.log(`[Socket] User ${socket.user.id} leaving room ${roomId}`);
    await leaveRoom(roomId);
  });

  // Handle disconnect
  socket.on('disconnect', async () => {
    if (socket.currentRoom) {
      console.log(`[Socket] User ${socket.user.id} disconnected from room ${socket.currentRoom}`);
      await leaveRoom(socket.currentRoom);
    }
  });

  // Helper function
  async function leaveRoom(roomId) {
    if (!roomId) return;
    try {
      await removeUserFromRoom(roomId, socket.user.id);
      socket.leave(`room:${roomId}`);

      const state = await getRoomState(roomId);

      // Broadcast updated state to remaining users
      io.to(`room:${roomId}`).emit('room:state', state);

      if (socket.currentRoom === roomId) socket.currentRoom = null;
    } catch (err) {
      console.error(`[Socket] Error leaving room ${roomId}:`, err);
    }
  }

  // ── Queue Video (Any user) ──
  socket.on('room:queue_video', async ({ roomId, input, title }, ack) => {
    try {
      console.log(`🎵 Received room:queue_video from ${socket.id} in room ${roomId}:`, { input, title });

      // Extract video ID using robust regex
      const videoId = extractVideoId(input);
      console.log(`   Extracted videoId: "${videoId}" from input: "${input}"`);

      if (!videoId) {
        console.error(`❌ Could not extract video ID from: ${input}`);
        socket.emit('room:error', { message: 'Please enter a valid YouTube video URL or ID' });
        if (ack) ack({ ok: false, error: 'Invalid YouTube URL' });
        return;
      }

      const song = {
        videoId,
        title: title || videoId,
      };

      console.log(`   Adding to playlist for room ${roomId}:`, song);

      // Get current playlist
      const currentPlaylist = await redis.lRange(`room:${roomId}:playlist`, 0, -1);
      const isFirstVideo = currentPlaylist.length === 0;

      // Add video to playlist
      await redis.rPush(`room:${roomId}:playlist`, videoId);

      // If this is the first video, load it immediately
      if (isFirstVideo) {
        await redis.hSet(`room:${roomId}:playback`, 'videoId', videoId);
        await redis.hSet(`room:${roomId}:playback`, 'title', song.title);
        await redis.hSet(`room:${roomId}:playback`, 'elapsedSeconds', '0');
        await redis.hSet(`room:${roomId}:playback`, 'playState', 'playing');
        await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

        // Start syncing this room
        console.log(`🔄 Starting sync for room ${roomId}`);
        startRoomSync(io, roomId);

        const payload = {
          song,
          elapsedSeconds: 0,
          playState: 'playing',
          roomId
        };

        console.log(`📢 Broadcasting first video to room ${roomId}`);
        // Ensure sender gets the event immediately
        socket.emit('room:video_load', payload);
        // Then broadcast to everyone (including others in the room)
        io.to(`room:${roomId}`).emit('room:video_load', payload);
      }

      // Broadcast updated playlist to room
      const updatedPlaylist = await redis.lRange(`room:${roomId}:playlist`, 0, -1);
      io.to(`room:${roomId}`).emit('room:queue_updated', { queue: updatedPlaylist, roomId });
      socket.broadcast.to(`room:${roomId}`).emit('room:video_load', payload);

      if (ack) ack({ ok: true });
      console.log(`✅ Video queued`);

    } catch (error) {
      console.error('❌ Queue video error:', error);
      socket.emit('room:error', { message: error.message });
      if (ack) ack({ ok: false, error: error.message });
    }
  });

  // ── Play (Any user) ──
  socket.on('room:video_play', async ({ roomId }) => {
    try {
      await redis.hSet(`room:${roomId}:playback`, 'playState', 'playing');
      await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

      io.to(`room:${roomId}`).emit('room:video_play', { roomId });
      const playbackData = await redis.hGetAll(`room:${roomId}:playback`);
      console.log(`▶️  Playing in room ${roomId}`);

    } catch (error) {
      console.error('❌ Play error:', error);
    }
  });

  // ── Pause (Any user) ──
  socket.on('room:video_pause', async ({ roomId }) => {
  try {
    console.log(`⏸️ ========== PAUSE EVENT ==========`);
    console.log(`   User: ${socket.user.id}`);
    console.log(`   Room: ${roomId}`);
    console.log(`   Stack trace:`);
    console.trace(); 
    console.log(`=====================================`);

    // Get current playback state to calculate elapsed time
    const playbackData = await redis.hGetAll(`room:${roomId}:playback`);
    
    if (playbackData && playbackData.videoId) {
      let elapsedSeconds = parseInt(playbackData.elapsedSeconds || '0');
      const timestamp = parseInt(playbackData.timestamp || Date.now());
      const timeSinceUpdate = (Date.now() - timestamp) / 1000;

      // If video was playing, add the elapsed time
      if (playbackData.playState === 'playing') {
        elapsedSeconds += timeSinceUpdate;
      }

      await redis.hSet(`room:${roomId}:playback`, 'elapsedSeconds', Math.floor(elapsedSeconds).toString());
    }
    
    await redis.hSet(`room:${roomId}:playback`, 'playState', 'paused');
    await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

    io.to(`room:${roomId}`).emit('room:video_pause', { roomId });
    console.log(`⏸️ Paused in room ${roomId}`);
  } catch (error) {
    console.error('❌ Pause error:', error);
  }
});

  // ── Seek (Any user) ──
  socket.on('room:video_seek', async ({ roomId, positionSeconds }) => {
    try {
      await redis.hSet(`room:${roomId}:playback`, 'elapsedSeconds', Math.floor(positionSeconds).toString());
      await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

      io.to(`room:${roomId}`).emit('room:video_seek', { positionSeconds, roomId });
      console.log(`⏩ Seeked to ${positionSeconds}s in room ${roomId}`);

    } catch (error) {
      console.error('❌ Seek error:', error);
    }
  });

  // ── Next Video (Skip to next in queue) ──
  socket.on('room:next_video', async ({ roomId }) => {
    try {
      console.log(`⏭️  Advancing to next video in room ${roomId}`);

      // Remove current video from queue
      await redis.lPop(`room:${roomId}:playlist`);
      const nextPlaylist = await redis.lRange(`room:${roomId}:playlist`, 0, -1);

      if (nextPlaylist.length === 0) {
        // Queue is empty
        console.log(`📭 Queue empty in room ${roomId}`);
        stopRoomSync(roomId);
        io.to(`room:${roomId}`).emit('room:queue_empty', { roomId });
        // Clear playback
        await redis.del(`room:${roomId}:playback`);
      } else {
        // Load next video
        const nextVideoId = nextPlaylist[0];
        console.log(`📹 Loading next video ${nextVideoId} in room ${roomId}`);

        // Fetch video metadata (title might be in cache or we use videoId as fallback)
        let videoTitle = nextVideoId;
        const cachedInfo = await redis.get(`video:${nextVideoId}:info`);
        if (cachedInfo) {
          const info = JSON.parse(cachedInfo);
          videoTitle = info.title || nextVideoId;
        }

        await redis.hSet(`room:${roomId}:playback`, 'videoId', nextVideoId);
        await redis.hSet(`room:${roomId}:playback`, 'title', videoTitle);
        await redis.hSet(`room:${roomId}:playback`, 'elapsedSeconds', '0');
        await redis.hSet(`room:${roomId}:playback`, 'playState', 'playing');
        await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

        const payload = {
          song: {
            videoId: nextVideoId,
            title: videoTitle,
          },
          elapsedSeconds: 0,
          playState: 'playing',
          roomId
        };

        // Ensure everyone in room gets the next video
        io.to(`room:${roomId}`).emit('room:video_load', payload);
      }

      // Broadcast updated playlist
      io.to(`room:${roomId}`).emit('room:queue_updated', { queue: nextPlaylist, roomId });

    } catch (error) {
      console.error('❌ Next video error:', error);
      socket.emit('room:error', { message: error.message });
    }
  });

}

export function getRoomsHandler(io, socket) {
  socket.on('rooms:state', async (ack) => {
    const rooms = await getRoomsState();
    ack({ ok: true, state: rooms });
  });
}
