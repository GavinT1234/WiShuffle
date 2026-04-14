import {
  getAllRooms,
  getRoomById,
  createRoom,
  deleteRoom,
} from '../services/roomService.js';

import { extractVideoId, getVideoDetails } from '../services/youtubeService.js';

export async function getAllRoomsHandler(req, res) {
  let rooms = await getAllRooms();
  res.status(200).json(rooms);
}

export async function getRoomByIdHandler(req, res) {
  const id = parseInt(req.params.id);
  const room = await getRoomById(id);
  res.status(200).json(room);
}

export async function createRoomHandler(req, res) {
  const { name, tags } = req.body;
  const newRoom = await createRoom({
    name,
    tags,
    ownerId: req.user.id,
  });
  res.status(201).json(newRoom);
}

export async function deleteRoomHandler(req, res) {
  const id = parseInt(req.params.id);
  await deleteRoom(id);
  res.status(204).send();
}

export async function addVideoToQueueHandler(req, res) {
  try {
    const { roomId } = req.params;
    const { youtubeUrl } = req.body;
    
    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    const videoDetails = await getVideoDetails(videoId);
    
    await redis.rPush(`room:${roomId}:playlist`, videoId);
    
    await redis.setEx(
      `video:${videoId}:info`,
      86400,
      JSON.stringify(videoDetails)
    );
        
    res.json({
      success: true,
      videoId,
      video: videoDetails
    });
    
  } catch (error) {
    console.error('Add song error:', error);
    res.status(500).json({ error: error.message });
  }
}

  export async function getQueueHandler(req, res) {
    try {
    const { roomId } = req.params;
    
    const videoIds = await redis.lRange(`room:${roomId}:playlist`, 0, -1);
    
    // Get metadata for each video
    const playlist = await Promise.all(
      videoIds.map(async (videoId) => {
        // Try to get from cache first
        const cached = await redis.get(`video:${videoId}:info`);
        if (cached) {
          return JSON.parse(cached);
        }
        
        const details = await getVideoDetails(videoId);
        
        await redis.setEx(
          `video:${videoId}:info`,
          86400,
          JSON.stringify(details)
        );
        
        return details;
      })
    );
    
    res.json(playlist);
    
  } catch (error) {
    console.error('Get playlist error:', error);
    res.status(500).json({ error: error.message });
  }
}
