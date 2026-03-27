import express from 'express';
import { getPlaylistsHandler } from '../controllers/playlistController.js'
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();
router.get('/', authenticate, getPlaylistsHandler);

export default router;