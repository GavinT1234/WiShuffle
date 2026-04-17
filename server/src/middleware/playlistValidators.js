import { getPlaylist } from "../services/playlistService.js";
import { getVideoDetails } from "../services/youtubeService.js";

export async function validatePlaylist(req, res, next) {
    const id = parseInt(req.params.id);
    const playlist = await getPlaylist(id);
    if (!playlist) {
        const error = new Error('Playlist does not exist.');
        error.status = 404;
        return next(error);
    }
    next();
}

export async function validateParent(req, res, next) {
    const id = parseInt(req.body.parentId);
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