import { createPlaylist, deletePlaylist, getPlaylist, getPlaylists, getSongs, updatePlaylist } from '../services/playlistService.js'

export async function getPlaylistsHandler(req, res) {
    const playlists = await getPlaylists(req.user.id);
    res.status(200).json(playlists);
}

export async function getPlaylistHandler(req, res) {
    const id = parseInt(req.params.id);
    const playlist = await getPlaylist(id);
    res.status(200).json(playlist);
}

export async function getPlaylistSongsHandler(req, res) {
    const id = parseInt(req.params.id);
    const songs = await getPlaylistSongs(id);
    res.status(200).json(songs);
}

export async function createPlaylistHandler(req, res) {
    const { title, shuffle, parentId } = req.body;
    // if (parentId) {
        
    // }
    const playlist = await createPlaylist({title, shuffle, parentId, ownerId: req.user.id})
    res.status(200).json(playlist);
}

export async function updatePlaylistHandler(req, res) {
    const id = req.params.id;
    const {title, shuffle} = req.body;
    const playlist = await updatePlaylist(id, {title, shuffle});
    res.status(200).json(playlist);
}

export async function deletePlaylistHandler(req, res) {
    const id = parseInt(req.params.id);
    await deletePlaylist(id);
    res.status(204).send();
}

export async function getSongsHandler(req, res) {
    const id = parseInt(req.params.id);
    const songs = await getSongs(id);
    res.status(200).json(songs);
}