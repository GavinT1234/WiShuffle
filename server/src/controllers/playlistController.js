import { createPlaylist, deletePlaylist, getPlaylist, getPlaylists, updatePlaylist } from '../services/playlistService.js'

export async function getPlaylistsHandler(req, res) {
    const playlists = await getPlaylists(req.user.id);
    res.status(200).json(playlists);
}

export async function getPlaylistHandler(req, res) {
    const playlist = await getPlaylist(id);
    res.status(200).json(playlist);
}

export async function createPlaylistHandler(req, res) {
    const { title, shuffle, parentPlaylist } = req.body;
    const playlist = await createPlaylist({title, shuffle, parentId, ownerId: req.user.id})
    res.status(200).json(playlist);
}

export async function updatePlaylistHandler(req, res) {
    const {title, shuffle} = req.body;
    const playlist = await updatePlaylist({title, shuffle});
    res.status(200).json(playlist);
}

export async function deletePlaylistHandler(req, res) {
    const id = parseInt(req.params.id);
    await deletePlaylist(id);
    res.status(204).send();
}