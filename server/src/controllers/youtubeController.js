import { getVideoDetails, searchVideos, extractVideoId } from '../services/youtubeService.js';

export async function getVideoDetailsHandler(req, res) {
    try {
    const { videoId } = req.params;
    const video = await getVideoDetails(videoId);
    res.json(video);
  } catch (error) {
    res.status(404).json({ error: 'Video not found' });
  }
}

export async function getVideoIDHandler(req, res) {
    try {
    const { url } = req.body;
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }
    
    const video = await getVideoDetails(videoId);
    res.json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function searchVideosHandler(req, res) {
    try {
    const { q, maxResults = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query required' });
    }
    
    const videos = await searchVideos(q, parseInt(maxResults));
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}