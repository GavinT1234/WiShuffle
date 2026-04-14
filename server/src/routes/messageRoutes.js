import express from 'express';
import {
  sendMessageHandler,
  getConversationHandler,
  getConversationsHandler,
  markAsReadHandler,
  deleteMessageHandler
} from '../controllers/messageController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Send message
router.post('/', authenticate, sendMessageHandler);

// Get all conversations
router.get('/conversations', authenticate, getConversationsHandler);

// Get conversation with a specific user
router.get('/:partnerId', authenticate, getConversationHandler);

// Mark messages from a user as read
router.patch('/:senderId/read', authenticate, markAsReadHandler);

// Delete a message
router.delete('/:messageId', authenticate, deleteMessageHandler);

export default router;
