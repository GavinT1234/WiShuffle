import { create, singlePlaylist, userPlaylists, update, playlistSongs, add, removeSong, playlistOrdering, next, ownership, remove } from '../repositories/playlistRepo.js'

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

export async function getNext(id) {
    const nextPos = await next(id);
    if (nextPos) return nextPos;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function getPlaylistOrdering(id) {
    const ordering = await playlistOrdering(id);
    if (ordering) return ordering;
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

export async function addSong(songData) {
    const song = await add(songData);
    if (song) return song;
    else {
        const error = new Error(`Playlist not found`);
        error.status(400);
        throw error;
    }
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

export async function deleteSong(id) {
    const song = await removeSong(id);
    if (song) return;
    else {
        const error = new Error(`Song not found`);
        error.status = 404;
        throw error;
    }
}

export async function getSongs(playlistId) {
    const songs = await playlistSongs(playlistId);
    if (songs) return;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function ownershipCheck(id) {
    const item = await ownership(id);
    if (item) return item;
    else {
        const error = new Error(`Item not found`);
        error.status = 404;
        throw error;
    }
}