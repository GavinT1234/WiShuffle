import { request } from "./index";

export const searchYouTube = async (query) => {
  return await request(`/youtube/search?q=${encodeURIComponent(query)}`);
};

export const getVideoDetails = async (videoId) => {
  return await request(`/youtube/video/${videoId}`);
};

export const extractVideoId = async (url) => {
  return await request("/youtube/extract", {
    method: "POST",
    body: JSON.stringify({ url }),
  });
};