import { playlists } from '../repositories/playlistRepo.js'

export async function getPlaylists(ownerId) {
    const playlists = playlists(ownerId);
    return playlists;
}