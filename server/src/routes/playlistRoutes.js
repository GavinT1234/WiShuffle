import express from 'express';
import { addSongHandler, createPlaylistHandler, deletePlaylistHandler, deleteSongHandler, getPlaylistHandler, getPlaylistOrderingHandler, getPlaylistsHandler, getPlaylistSongsHandler, updatePlaylistHandler } from '../controllers/playlistController.js'
import { authenticate } from '../middleware/authenticate.js';
import { authorizeOwnership } from '../middleware/authorizeOwnership.js';

const router = express.Router();
router.get('/', authenticate, getPlaylistsHandler);
router.get('/:id', authenticate, authorizeOwnership, getPlaylistHandler);
router.get('/:id/songs', authenticate, authorizeOwnership, getPlaylistSongsHandler);
router.get('/:id/order', authenticate, authorizeOwnership, getPlaylistOrderingHandler);
router.post('/', authenticate, createPlaylistHandler);
router.post('/:id/songs', authenticate, authorizeOwnership, addSongHandler);
router.put('/:id', authenticate, authorizeOwnership, updatePlaylistHandler);
router.delete('/:id', authenticate, authorizeOwnership, deletePlaylistHandler);
router.delete('/songs/:id', authenticate, authorizeOwnership, deleteSongHandler);

export default router;