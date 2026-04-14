import express from 'express';
import { updateProfileHandler, getUserProfileHandler, searchUsersHandler } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();
router.patch('/me', authenticate, updateProfileHandler);
router.get('/search', authenticate, searchUsersHandler);
router.get('/:userId', getUserProfileHandler);

export default router;