import express from 'express';
import { updateProfileHandler } from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

router.patch('/me', authenticate, updateProfileHandler);

export default router;
