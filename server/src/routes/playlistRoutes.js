import express from 'express';
import { addSongHandler, createPlaylistHandler, deletePlaylistHandler, deleteSongHandler, getPlaylistHandler, getPlaylistOrderingHandler, getPlaylistsHandler, getPlaylistSongsHandler, updatePlaylistHandler } from '../controllers/playlistController.js'
import { authenticate } from '../middleware/authenticate.js';
import { authorizeOwnership, authorizeParentOwnership } from '../middleware/authorizeOwnership.js';
import { validateParent, validatePlaylist } from '../middleware/validator.js';

const router = express.Router();

// Playlists
router.get('/', authenticate, getPlaylistsHandler);
router.get('/:id', authenticate, authorizeOwnership, validatePlaylist, getPlaylistHandler);
router.post('/', authenticate, authorizeParentOwnership, validateParent, createPlaylistHandler);
router.put('/:id', authenticate, authorizeOwnership, updatePlaylistHandler);
router.delete('/:id', authenticate, authorizeOwnership, deletePlaylistHandler);
router.get('/:id/order', getPlaylistOrderingHandler);

// Songs
router.get('/:id/songs', authenticate, authorizeOwnership, validatePlaylist, getPlaylistSongsHandler);
router.post('/:id/songs', authenticate, authorizeOwnership, addSongHandler);
router.delete('/songs/:id', authenticate, authorizeOwnership, deleteSongHandler);

export default router;