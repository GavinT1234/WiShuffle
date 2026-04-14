import {
  getRoomState,
  addUserToRoom,
  removeUserFromRoom, getRoomsState,
} from '../../services/roomService.js';

import { redis } from '../../config/redis.js';
import { extractVideoId } from '../../services/youtubeService.js';

export function registerRoomHandlers(io, socket) {
  // Join a room
  socket.on('room:join', async ({ roomId }, ack) => {
    console.log(`[Socket] User ${socket.user.id} joining room ${roomId}, socket rooms:`, [...socket.rooms]);
    if (!roomId) {
      if (ack) ack({ ok: false, error: 'Missing roomId' });
      return;
    }
    console.log(`[Socket] User ${socket.user.id} joining room ${roomId}`);

    try {
      // If user was already in a room, leave first
      if (socket.currentRoom && socket.currentRoom !== roomId) {
        await leaveRoom(socket.currentRoom);
      }

      socket.join(`room:${roomId}`);
      console.log(`[Socket] After join, socket rooms:`, [...socket.rooms]);
      socket.currentRoom = roomId;

      await addUserToRoom(roomId, socket.user.id);
      const state = await getRoomState(roomId);

      // Broadcast updated state to all users in the room (including joiner)
      io.to(`room:${roomId}`).emit('room:state', state);

      // Get current playback state and send it to the new user
      try {
        const playbackData = await redis.hGetAll(`room:${roomId}:playback`);
        const djQueue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

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
            playState: playbackData.playState || 'paused',
            roomId
          };
          socket.emit('room:video_load', payload);
        }

        // Also send the DJ queue
        socket.emit('dj:queue_updated', { queue: djQueue, roomId });
      } catch (err) {
        console.error('Error fetching playback state:', err);
      }

      // Ack the joiner with current state
      if (ack) ack({ ok: true, state });
    } catch (error) {
      console.error('Error in room:join:', error);
      if (ack) ack({ ok: false, error: error.message });
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
  // ── Join DJ Queue ──
  socket.on('dj:join_queue', async ({ roomId }) => {
    try {
      console.log(`🎧 User ${socket.id} joining DJ queue in room ${roomId}`);

      const userId = String(socket.user.id);

      // Check if already in queue
      const queue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);
      if (queue.includes(userId)) {
        console.log(`⚠️  User ${userId} already in queue`);
        socket.emit('dj:error', { message: 'Already in queue' });
        return;
      }

      // Add to queue
      await redis.rPush(`room:${roomId}:djQueue`, userId);

      const newQueue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

      // Broadcast to room only
      io.to(`room:${roomId}`).emit('dj:queue_updated', { queue: newQueue, roomId });

      // Broadcast updated room state
      const state = await getRoomState(roomId);
      io.to(`room:${roomId}`).emit('room:state', state);

      // Tell this user if they're now DJ
      const isDJ = newQueue[0] === userId;
      socket.emit('dj:status', { isDJ });

      console.log(`✅ User ${userId} joined queue. Position: ${newQueue.indexOf(userId) + 1}/${newQueue.length}`);

    } catch (error) {
      console.error('❌ Join queue error:', error);
      socket.emit('dj:error', { message: error.message });
    }
  });

  // ── Leave DJ Queue ──
  socket.on('dj:leave_queue', async ({ roomId }) => {
    try {
      console.log(`👋 User ${socket.id} leaving DJ queue in room ${roomId}`);

      const userId = String(socket.user.id);

      await redis.lRem(`room:${roomId}:djQueue`, 1, userId);

      const newQueue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

      io.to(`room:${roomId}`).emit('dj:queue_updated', { queue: newQueue, roomId });

      // Broadcast updated room state
      const state = await getRoomState(roomId);
      io.to(`room:${roomId}`).emit('room:state', state);

      console.log(`✅ User ${userId} left queue. Remaining: ${newQueue.length}`);

    } catch (error) {
      console.error('❌ Leave queue error:', error);
      socket.emit('dj:error', { message: error.message });
    }
  });

  // ── Queue Video (DJ only) ──
  socket.on('dj:queue_video', async ({ roomId, input, title }, ack) => {
    try {
      console.log(`🎵 Received dj:queue_video from ${socket.id} in room ${roomId}:`, { input, title });

      const userId = String(socket.user.id);
      const queue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

      console.log(`   DJ check: userId=${userId}, currentDJ=${queue[0]}, isQueueEmpty=${queue.length === 0}`);

      // Only DJ can load videos
      if (queue[0] !== userId) {
        console.log(`❌ User ${userId} is not DJ (DJ is ${queue[0]})`);
        socket.emit('dj:error', { message: 'Only DJ can queue videos' });
        if (ack) ack({ ok: false, error: 'Only DJ can queue videos' });
        return;
      }

      // Extract video ID using robust regex
      const videoId = extractVideoId(input);
      console.log(`   Extracted videoId: "${videoId}" from input: "${input}"`);

      if (!videoId) {
        console.error(`❌ Could not extract video ID from: ${input}`);
        socket.emit('dj:error', { message: 'Please enter a valid YouTube video URL or ID' });
        if (ack) ack({ ok: false, error: 'Invalid YouTube URL' });
        return;
      }

      const song = {
        videoId,
        title: title || videoId,
      };

      console.log(`   Saving to Redis for room ${roomId}:`, song);

      // Set as current playback
      await redis.hSet(`room:${roomId}:playback`, 'videoId', videoId);
      await redis.hSet(`room:${roomId}:playback`, 'title', song.title);
      await redis.hSet(`room:${roomId}:playback`, 'elapsedSeconds', '0');
      await redis.hSet(`room:${roomId}:playback`, 'playState', 'playing');
      await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

      const payload = {
        song,
        elapsedSeconds: 0,
        playState: 'playing',
        roomId  // Include roomId so clients can filter
      };

      console.log(`📢 Broadcasting room:video_load to room ${roomId}`);

      // Send immediately to the DJ
      socket.emit('room:video_load', payload);

      // Broadcast to all other users in the room
      socket.broadcast.to(`room:${roomId}`).emit('room:video_load', payload);

      // Also broadcast updated room state for redundancy
      const state = await getRoomState(roomId);
      io.to(`room:${roomId}`).emit('room:state', state);

      if (ack) ack({ ok: true });
      console.log(`✅ Broadcast emitted`);

    } catch (error) {
      console.error('❌ Queue video error:', error);
      socket.emit('dj:error', { message: error.message });
      if (ack) ack({ ok: false, error: error.message });
    }
  });

  // ── Play (DJ only) ──
  socket.on('dj:play', async ({ roomId }) => {
    try {
      const userId = String(socket.user.id);
      const queue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

      if (queue[0] !== userId) {
        return socket.emit('dj:error', { message: 'Only DJ can play' });
      }

      await redis.hSet(`room:${roomId}:playback`, 'playState', 'playing');
      await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

      io.to(`room:${roomId}`).emit('room:video_play', { roomId });
      console.log(`▶️  Playing in room ${roomId}`);

    } catch (error) {
      console.error('❌ Play error:', error);
    }
  });

  // ── Pause (DJ only) ──
  socket.on('dj:pause', async ({ roomId }) => {
    try {
      const userId = String(socket.user.id);
      const queue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

      if (queue[0] !== userId) {
        return socket.emit('dj:error', { message: 'Only DJ can pause' });
      }

      await redis.hSet(`room:${roomId}:playback`, 'playState', 'paused');
      await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

      io.to(`room:${roomId}`).emit('room:video_pause', { roomId });
      console.log(`⏸️  Paused in room ${roomId}`);

    } catch (error) {
      console.error('❌ Pause error:', error);
    }
  });

  // ── Seek (DJ only) ──
  socket.on('dj:seek', async ({ roomId, positionSeconds }) => {
    try {
      const userId = String(socket.user.id);
      const queue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

      if (queue[0] !== userId) {
        return socket.emit('dj:error', { message: 'Only DJ can seek' });
      }

      await redis.hSet(`room:${roomId}:playback`, 'elapsedSeconds', positionSeconds.toString());
      await redis.hSet(`room:${roomId}:playback`, 'timestamp', Date.now().toString());

      io.to(`room:${roomId}`).emit('room:video_seek', { positionSeconds, roomId });
      console.log(`⏩ Seeked to ${positionSeconds}s in room ${roomId}`);

    } catch (error) {
      console.error('❌ Seek error:', error);
    }
  });

  // ── Pass DJ (DJ only) ──
  socket.on('dj:next', async ({ roomId }) => {
    try {
      const userId = String(socket.user.id);
      const queue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

      if (queue[0] !== userId) {
        return socket.emit('dj:error', { message: 'Only current DJ can pass' });
      }

      // Move first DJ to end of queue
      const currentDJ = await redis.lPop(`room:${roomId}:djQueue`);
      if (currentDJ) {
        await redis.rPush(`room:${roomId}:djQueue`, currentDJ);
      }

      const newQueue = await redis.lRange(`room:${roomId}:djQueue`, 0, -1);

      io.to(`room:${roomId}`).emit('dj:queue_updated', { queue: newQueue, roomId });
      io.to(`room:${roomId}`).emit('dj:changed', { djId: newQueue[0], roomId });

      // Broadcast updated room state
      const state = await getRoomState(roomId);
      io.to(`room:${roomId}`).emit('room:state', state);

      console.log(`🔄 DJ passed from ${currentDJ} to ${newQueue[0]} in room ${roomId}`);

    } catch (error) {
      console.error('❌ Pass DJ error:', error);
    }
  });

}

export function getRoomsHandler(io, socket) {
  socket.on('rooms:state', async (ack) => {
    const rooms = await getRoomsState();
    ack({ ok: true, state: rooms });
  });
}