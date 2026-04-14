import { addSong, createPlaylist, deletePlaylist, deleteSong, getNext, getPlaylist, getPlaylistOrdering, getPlaylists, getPlaylistSongs, getSongs, updatePlaylist } from '../services/playlistService.js'

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

export async function getPlaylistOrderingHandler(req, res) {
    const id = parseInt(req.params.id);
    const ordering = await getPlaylistOrdering(id);
    res.status(200).json(ordering);
}

export async function createPlaylistHandler(req, res) {
    const { name, shuffle, parentId } = req.body;
    let position = 0;
    if (parentId) {
        position = await getNext(parentId);
    }
    const playlist = await createPlaylist({name, shuffle, parentId, position, ownerId: req.user.id});
    res.status(200).json(playlist);
}

export async function addSongHandler(req, res) {
    const id = parseInt(req.params.id);
    const position = await getNext(id);
    const {name, author, url} = req.body;
    const song = await addSong({name, author, url, isSong: true, parentId: id, position, ownerId: req.user.id});
    res.status(200).json(song);
}

export async function updatePlaylistHandler(req, res) {
    const id = req.params.id;
    const {name, shuffle} = req.body;
    const playlist = await updatePlaylist(id, {name, shuffle});
    res.status(200).json(playlist);
}

export async function deletePlaylistHandler(req, res) {
    const id = parseInt(req.params.id);
    await deletePlaylist(id);
    res.status(204).send();
}

export async function deleteSongHandler(req, res) {
    const id = parseInt(req.params.id);
    await deleteSong(id);
    res.status(204).send();
}

export async function getSongsHandler(req, res) {
    const id = parseInt(req.params.id);
    const songs = await getSongs(id);
    res.status(200).json(songs);
}