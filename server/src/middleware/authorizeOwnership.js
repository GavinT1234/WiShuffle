import { getPlaylist, ownershipCheck } from "../services/playlistService.js";
import * as roomRepo from "../repositories/roomRepo.js";

export function authorizeOwnership(entityType) {
    return async (req, res, next) => {
        const id = parseInt(req.params.id);
        
        let entity;
        if (entityType === 'room') {
            entity = await roomRepo.getById(id);
        } else {
            entity = await ownershipCheck(id);
        }
        
        if (!entity || entity.ownerId !== req.user.id) {
            const error = new Error('Forbidden: insufficient permission.');
            error.status = 403;
            return next(error);
        }
        next();
    };
}

export async function authorizeParentOwnership(req, res, next) {
    const id = parseInt(req.body.parentId);
    if (id) {
        const playlist = await ownershipCheck(id);
        if (!playlist || playlist.ownerId !== req.user.id) {
            const error = new Error('Forbidden: insufficient permission.');
            error.status = 403;
            return next(error);
        }
    }

    next();
}