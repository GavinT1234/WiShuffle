
export async function authorizeOwnership(req, res, next) {
    const id = parseInt(req.params.id);
    const playlist = await getPlaylist(id);
    if (playlist.ownerId !== req.user.id) {
        const error = new Error('Forbidden: insufficient permission.');
        error.status = 403;
        return next(error);
    }
    next();
}