import express from 'express';
import { addSongHandler, createPlaylistHandler, deletePlaylistHandler, deleteSongHandler, getPlaylistContentHandler, getPlaylistHandler, getPlaylistOrderingHandler, getPlaylistsHandler, getPlaylistSongsHandler, updatePlaylistHandler } from '../controllers/playlistController.js'
import { authenticate } from '../middleware/authenticate.js';
import { authorizeOwnership, authorizeParentOwnership } from '../middleware/authorizeOwnership.js';
import { validateParent, validatePlaylist } from '../middleware/validator.js';

const router = express.Router();

// Playlists
router.get('/', authenticate, getPlaylistsHandler);
router.get('/:id', authenticate, authorizeOwnership('playlist'), validatePlaylist, getPlaylistHandler);
router.get('/:id/all', authenticate, authorizeOwnership('playlist'), validatePlaylist, getPlaylistContentHandler);
router.post('/', authenticate, authorizeParentOwnership, validateParent, createPlaylistHandler);
router.put('/:id', authenticate, authorizeOwnership('playlist'), updatePlaylistHandler);
router.delete('/:id', authenticate, authorizeOwnership('playlist'), deletePlaylistHandler);
router.get('/:id/order', getPlaylistOrderingHandler);

// Songs
router.get('/:id/songs', authenticate, authorizeOwnership('playlist'), validatePlaylist, getPlaylistSongsHandler);
router.post('/:id/songs', authenticate, authorizeOwnership('playlist'), addSongHandler);
router.delete('/songs/:id', authenticate, authorizeOwnership('playlist'), deleteSongHandler);

export default router;