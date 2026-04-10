import { allSongs, create, singlePlaylist, userPlaylists, update, playlistSongs } from '../repositories/playlistRepo.js'

export async function getPlaylists(ownerId) {
    const playlists = await userPlaylists(ownerId);
    return playlists;
}

export async function getPlaylist(id) {
    const playlist = await singlePlaylist(id);
    if (playlist) return playlist;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function getPlaylistSongs(id) {
    const songs = await playlistSongs(id);
    if (songs) return songs;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function createPlaylist(playlistData) {
    
    const playlist = await create(playlistData);
    return playlist;
}

export async function updatePlaylist(id, playlistData) {
    const playlist = await update(id, playlistData);
    if (playlist) return playlist;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function deletePlaylist(id) {
    const playlist = await remove(id);
    if (playlist) return;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function getSongs(playlistId) {
    const songs = await allSongs(playlistId);
    if (songs) return;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}