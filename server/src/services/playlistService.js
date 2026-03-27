import { playlists } from '../repositories/playlistRepo.js'

export async function getPlaylists(ownerId) {
    const playlists = userPlaylists(ownerId);
    return playlists;
}