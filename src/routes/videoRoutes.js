import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /api/videos/current:
 *   get:
 *     summary: Get current video
 *     description: Returns the YouTube video ID for the player
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: Video ID returned successfully
 */
router.get('/current', (req, res) => {
  res.json({ 
    videoId: 'B12UEbZh72o'
  });
});

/**
 * @swagger
 * /api/videos/playlist:
 *   get:
 *     summary: Get video playlist
 *     tags: [Videos]
 *     responses:
 *       200:
 *         description: Returns playlist of videos
 */
router.get('/playlist', (req, res) => {
  res.json([
    { id: 1, title: 'Video 1', videoId: 'kgOwsTbIHq4' },
    { id: 2, title: 'Video 2', videoId: 'dQw4w9WgXcQ' },
    { id: 3, title: 'Video 3', videoId: 'y6120QOlsfU' }
  ]);
});

/**
 * @swagger
 * /api/videos/{id}:
 *   get:
 *     summary: Get specific video
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ 
    id,
    videoId: 'B12UEbZh72o',
    title: 'Sample Video'
  });
});

/**
 * @swagger
 * /api/videos/load:
 *   post:
 *     summary: Load a new video
 *     tags: [Videos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoId:
 *                 type: string
 */
router.post('/load', (req, res) => {
  const { videoId } = req.body;
  // TODO: Broadcast to WebSocket clients
  res.json({ 
    message: 'Video loaded',
    videoId 
  });
});

export default router;