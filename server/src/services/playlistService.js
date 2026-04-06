import { allSongs, create, getSingle, getUser, update } from '../repositories/playlistRepo.js'

export async function getPlaylists(ownerId) {
    const playlists = await getUser(ownerId);
    return playlists;
}

export async function getPlaylist(id) {
    const playlist = await getSingle(id);
    if (playlist) return playlist;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function createPlaylist({playlistData}) {
    
    const playlist = await create({playlistData});
    return playlist;
}

export async function updatePlaylist({playlistData}) {
    const playlist = await update({playlistData});
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