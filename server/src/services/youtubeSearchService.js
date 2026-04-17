import { GetListByKeyword } from 'youtube-search-api';

export async function searchYouTube(query, maxResults = 10) {
  try {
    console.log(`🔍 Searching YouTube for: "${query}"`);
    
    const results = await GetListByKeyword(query, false, maxResults);
    
    // Map to a cleaner format
    const videos = results.items
      .filter(item => item.type === 'video')
      .map(item => ({
        videoId: item.id,
        title: item.title,
        thumbnail: item.thumbnail?.thumbnails?.[0]?.url || null,
        channelTitle: item.channelTitle,
        duration: item.length?.simpleText || 'Unknown',
      }));
    
    console.log(`✅ Found ${videos.length} videos`);
    return videos;
    
  } catch (error) {
    console.error('❌ YouTube search error:', error);
    throw new Error('Failed to search YouTube');
  }
}