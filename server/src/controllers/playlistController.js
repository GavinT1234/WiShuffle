import { addSong, createPlaylist, deletePlaylist, deleteSong, getNext, getPlaylist, getPlaylistContent, getPlaylistOrdering, getPlaylists, getPlaylistsAll, getPlaylistSongs, getSongs, seedPlaylist, updatePlaylist } from '../services/playlistService.js'
import { extractVideoId, getVideoDetails } from '../services/youtubeService.js';

export async function getPlaylistsHandler(req, res, next) {
    try {
        const playlists = await getPlaylists(req.user.id);
        res.status(200).json(playlists);
    } catch (error) {
        next(error);
    }
}

export async function getPlaylistsAllHandler(req, res, next) {
    try {
        const playlists = await getPlaylistsAll(req.user.id);
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
        res.status(201).json(playlist);
    } catch (error) {
        next(error);
    }
}

export async function addSongHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const position = await getNext(id);
        let {name, author, url} = req.body;
        if (url) {
            if (!name || !author) {
                try {
                    const videoId = await extractVideoId(url);
                    const {title, channelTitle } = await getVideoDetails(videoId);
                    if (!name) name = title;
                    if (!author) author = channelTitle;
                }
                catch (error) {
                    throw error;
                }
            }
        }
        else {
            const error = new Error('No URL provided');
            error.status = 400;
            throw error;
        }
        const song = await addSong({name, author, url, isSong: true, parentId: id, position, ownerId: req.user.id});
        res.status(201).json(song);
    } catch (error) {
        next(error);
    }
}

export async function updatePlaylistHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const {name, shuffle, position} = req.body;
        const playlist = await updatePlaylist(id, {name, shuffle, position});
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

export async function seedPlaylistHandler(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        const ownerId = req.user.id;
        const seedlist = await seedPlaylist(id, ownerId);
        res.status(201).json(seedlist);
    } catch (error) {
        next(error);
    }
}