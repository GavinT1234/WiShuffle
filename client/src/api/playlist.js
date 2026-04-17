import { request } from "./index";

export const fetchPlaylists = () => request("/playlists");

export const fetchPlaylistContent = (id) => request(`/playlists/${id}/all`);

export const createPlaylist = (data) =>
    request("/playlists", { method: "POST", body: JSON.stringify(data) });

export const updatePlaylist = (id, data) =>
    request(`/playlists/${id}`, { method: "PUT", body: JSON.stringify(data) });

export const deletePlaylist = (id) =>
    request(`/playlists/${id}`, { method: "DELETE" });

export const addSong = (playlistId, data) =>
    request(`/playlists/${playlistId}/songs`, {
       method: "POST",
       body: JSON.stringify(data),
    });

export const deleteSong = (songId) =>
    request(`/playlists/${songId}`, { method: "DELETE" });