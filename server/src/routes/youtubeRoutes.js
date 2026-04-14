import express from 'express';
import { getVideoDetailsHandler, getVideoIDHandler, searchVideosHandler } from '../controllers/youtubeController.js';

const router = express.Router();
router.get('/video/:videoId', getVideoDetailsHandler);
router.post('/extract', getVideoIDHandler);
router.get('/search', searchVideosHandler);

export default router;