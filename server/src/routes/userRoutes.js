import express from 'express';
import { updateProfileHandler, getUserProfileHandler } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();
router.patch('/me', authenticate, updateProfileHandler);
router.get('/:userId', getUserProfileHandler);

export default router;