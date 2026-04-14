import express from 'express';
import { getAllRoomsHandler, getRoomByIdHandler, createRoomHandler, deleteRoomHandler, addVideoToQueueHandler, getQueueHandler, getTagsHandler } from '../controllers/roomController.js'
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();
router.get('/', getAllRoomsHandler);
router.get('/tags', getTagsHandler);
router.get('/:id', getRoomByIdHandler);
router.post('/', authenticate, createRoomHandler);
router.delete('/:id', deleteRoomHandler);
router.post('/:roomId/queue', authenticate, addVideoToQueueHandler);
router.get('/:roomId/queue', getQueueHandler);

export default router;