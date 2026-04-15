import { getPlaylist } from "../services/playlistService.js";

export async function validatePlaylist(req, res, next) {
    const id = parseInt(req.params.id);
    console.log(id);
    const playlist = await getPlaylist(id);
    console.log(playlist);
    if (!playlist) {
        const error = new Error('Playlist does not exist.');
        error.status = 404;
        return next(error);
    }
    next();
}

export async function validateParent(req, res, next) {
    const id = parseInt(req.body.parentId);
    console.log(id);
    if (id) {
        const playlist = await getPlaylist(id);
        if (!playlist) {
            const error = new Error('Playlist does not exist.');
            error.status = 404;
            return next(error);
        }
    }
    next();
}