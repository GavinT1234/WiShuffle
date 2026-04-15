import { request } from "./index";

export const getAllRooms = async () => {
  const response = await request("/rooms/");
  console.log(response);
  return response;
};

export const createRoom = async ({ name, tags = [] }) => {
  const response = await request("/rooms/", {
    method: "POST",
    body: JSON.stringify({ name, tags }),
  });
  console.log(response);
  return response;
};

export const getRoom = async (roomId) => {
  return await request(`/rooms/${roomId}`);
};

export const joinDJQueue = async (roomId, userId) => {
  return await request(`/rooms/${roomId}/dj/join`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
};

export const leaveDJQueue = async (roomId, userId) => {
  return await request(`/rooms/${roomId}/dj/leave`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
};

export const passDJ = async (roomId) => {
  return await request(`/rooms/${roomId}/dj/pass`, {
    method: "POST",
  });
};

export const queueVideo = async (roomId, url, title) => {
  return await request(`/rooms/${roomId}/songs`, {
    method: "POST",
    body: JSON.stringify({ youtubeUrl: url, title }),
  });
};

export const playVideo = async (roomId) => {
  return await request(`/rooms/${roomId}/play`, {
    method: "POST",
  });
};

export const pauseVideo = async (roomId) => {
  return await request(`/rooms/${roomId}/pause`, {
    method: "POST",
  });
};

export const seekVideo = async (roomId, seconds) => {
  return await request(`/rooms/${roomId}/seek`, {
    method: "POST",
    body: JSON.stringify({ seconds }),
  });
};

export const getPlaylist = async (roomId) => {
  return await request(`/rooms/${roomId}/playlist`);
};

export const deleteRoom = async (roomId) => {
  return await request(`/rooms/${roomId}`, {
    method: "DELETE",
  });
};

export const getTags = async () => {
  return await request(`/rooms/tags`);
}