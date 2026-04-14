import express from 'express';
import {
  sendFriendRequestHandler,
  acceptFriendRequestHandler,
  rejectFriendRequestHandler,
  removeFriendHandler,
  getFriendsHandler,
  getPendingRequestsHandler,
  getSentRequestsHandler
} from '../controllers/friendController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = express.Router();

// Send friend request
router.post('/request', authenticate, sendFriendRequestHandler);

// Accept friend request
router.patch('/request/:friendRequestId/accept', authenticate, acceptFriendRequestHandler);

// Reject friend request
router.delete('/request/:friendRequestId', authenticate, rejectFriendRequestHandler);

// Get all friends
router.get('/', authenticate, getFriendsHandler);

// Get pending friend requests
router.get('/requests/pending', authenticate, getPendingRequestsHandler);

// Get sent friend requests
router.get('/requests/sent', authenticate, getSentRequestsHandler);

// Remove friend
router.delete('/:friendId', authenticate, removeFriendHandler);

export default router;
