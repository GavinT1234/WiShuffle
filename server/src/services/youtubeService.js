import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/ // Just the video ID
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

// Get video details
export const getVideoDetails = async (videoId) => {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId]
    });
    
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error('Video not found');
    }
    
    const video = response.data.items[0];
    
    return {
      id: video.id,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      thumbnail: video.snippet.thumbnails.default.url,
      thumbnailMedium: video.snippet.thumbnails.medium.url,
      thumbnailHigh: video.snippet.thumbnails.high.url,
      duration: video.contentDetails.duration,
      viewCount: video.statistics.viewCount,
      likeCount: video.statistics.likeCount,
      description: video.snippet.description
    };
  } catch (error) {
    console.error('YouTube API error:', error);
    throw error;
  }
};

// Search for videos
export const searchVideos = async (query, maxResults = 10) => {
  try {
    const response = await youtube.search.list({
      part: ['snippet'],
      q: query,
      maxResults,
      type: ['video'],
      //videoCategoryId: '10' // To only search for music
    });
    
    return response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default.url,
      thumbnailMedium: item.snippet.thumbnails.medium.url,
      publishedAt: item.snippet.publishedAt
    }));
  } catch (error) {
    console.error('YouTube search error:', error);
    throw error;
  }
};

// Parse ISO 8601 duration to seconds
export const parseDuration = (duration) => {
  // Duration format: PT4M13S (4 minutes 13 seconds)
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match[1] || '').replace('H', '') || 0;
  const minutes = (match[2] || '').replace('M', '') || 0;
  const seconds = (match[3] || '').replace('S', '') || 0;
  
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};

// Format seconds to MM:SS
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default {
  extractVideoId,
  getVideoDetails,
  searchVideos,
  parseDuration,
  formatDuration
};