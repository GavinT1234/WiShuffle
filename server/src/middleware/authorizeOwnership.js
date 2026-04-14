import { getPlaylist, ownershipCheck } from "../services/playlistService.js";

export async function authorizeOwnership(req, res, next) {
    const id = parseInt(req.params.id);
    const playlist = await ownershipCheck(id);
    if (playlist.ownerId !== req.user.id) {
        const error = new Error('Forbidden: insufficient permission.');
        error.status = 403;
        return next(error);
    }
    next();
}

export async function authorizeParentOwnership(req, res, next) {
    const id = parseInt(req.body.parentId);
    if (id) {
        const playlist = await ownershipCheck(id);
        if (playlist.ownerId !== req.user.id) {
            const error = new Error('Forbidden: insufficient permission.');
            error.status = 403;
            return next(error);
        }
    }

    next();
}