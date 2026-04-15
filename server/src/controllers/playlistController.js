import { addSong, createPlaylist, deletePlaylist, deleteSong, getNext, getPlaylist, getPlaylistContent, getPlaylistOrdering, getPlaylists, getPlaylistSongs, getSongs, updatePlaylist } from '../services/playlistService.js'

export async function getPlaylistsHandler(req, res, next) {
    try {
        const playlists = await getPlaylists(req.user.id);
        res.status(200).json(playlists);
    } catch (error) {
        next(error);
    }
}

export async function getPlaylistHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const playlist = await getPlaylist(id);
        res.status(200).json(playlist);
    } catch (error) {
        next(error);
    }
}

export async function getPlaylistSongsHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const songs = await getPlaylistSongs(id);
        res.status(200).json(songs);
    } catch (error) {
        next(error);
    }
}

export async function getPlaylistContentHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const items = await getPlaylistContent(id);
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
}

export async function getPlaylistOrderingHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const ordering = await getPlaylistOrdering(id);
        res.status(200).json(ordering);
    } catch (error) {
        next(error);
    }
}

export async function createPlaylistHandler(req, res, next) {
    try {
        const { name, shuffle, parentId } = req.body;
        let position = 0;
        if (parentId) {
            position = await getNext(parentId);
        }
        const playlist = await createPlaylist({name, shuffle, parentId, position, ownerId: req.user.id});
        res.status(200).json(playlist);
    } catch (error) {
        next(error);
    }
}

export async function addSongHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const position = await getNext(id);
        const {name, author, url} = req.body;
        const song = await addSong({name, author, url, isSong: true, parentId: id, position, ownerId: req.user.id});
        res.status(200).json(song);
    } catch (error) {
        next(error);
    }
}

export async function updatePlaylistHandler(req, res, next) {
    try {
        const id = req.params.id;
        const {name, shuffle} = req.body;
        const playlist = await updatePlaylist(id, {name, shuffle});
        res.status(200).json(playlist);
    } catch (error) {
        next(error);
    }
}

export async function deletePlaylistHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        await deletePlaylist(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function deleteSongHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        await deleteSong(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function getSongsHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const songs = await getSongs(id);
        res.status(200).json(songs);
    } catch (error) {
        next(error);
    }
}