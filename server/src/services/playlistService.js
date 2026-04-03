import { create, getSingle, getUser, update } from '../repositories/playlistRepo.js'

export async function getPlaylists(ownerId) {
    const playlists = getUser(ownerId);
    return playlists;
}

export async function getPlaylist(id) {
    const playlist = getSingle(id);
    if (playlist) return playlist;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function createPlaylist({playlistData}) {
    const playlist = create({playlistData});
    return playlist;
}

export async function updatePlaylist({playlistData}) {
    const playlist = update({playlistData});
    if (playlist) return playlist;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}

export async function deletePlaylist(id) {
    const playlist = remove(id);
    if (playlist) return;
    else {
        const error = new Error(`Playlist not found`);
        error.status = 404;
        throw error;
    }
}