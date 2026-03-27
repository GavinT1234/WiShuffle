import { getPlaylists } from '../services/playlistService.js'

export async function getPlaylistsHandler(req, res) {
    const playlists = await getPlaylists(req.user.id);
    res.status(200).json(playlists);
}