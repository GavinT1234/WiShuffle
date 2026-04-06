import express from 'express';
import { createPlaylistHandler, deletePlaylistHandler, getPlaylistHandler, getPlaylistsHandler, updatePlaylistHandler } from '../controllers/playlistController.js'
import { authenticate } from '../middleware/authenticate.js';
import { authorizeOwnership } from '../middleware/authorizeOwnership.js';

const router = express.Router();
router.get('/', authenticate, getPlaylistsHandler);
router.get('/:id', authenticate, authorizeOwnership, getPlaylistHandler)
router.get('/:id/songs', authenticate, authorizeOwnership, getPlaylistHandler)
router.post('/', authenticate, createPlaylistHandler);
router.put('/:id', authenticate, authorizeOwnership, updatePlaylistHandler);
router.delete('/:id', authenticate, authorizeOwnership, deletePlaylistHandler);

export default router;