import * as friendRepo from '../repositories/friendRepo.js';

export async function sendFriendRequestHandler(req, res) {
  try {
    const userId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ message: 'receiverId is required' });
    }

    const request = await friendRepo.sendFriendRequest(userId, parseInt(receiverId));
    res.status(201).json(request);
  } catch (error) {
    console.error(error);
    if (error.message.includes('already exists') || error.message.includes('yourself')) {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to send friend request' });
  }
}

export async function acceptFriendRequestHandler(req, res) {
  try {
    const { friendRequestId } = req.params;

    const request = await friendRepo.acceptFriendRequest(parseInt(friendRequestId));
    res.status(200).json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to accept friend request' });
  }
}

export async function rejectFriendRequestHandler(req, res) {
  try {
    const { friendRequestId } = req.params;

    await friendRepo.rejectFriendRequest(parseInt(friendRequestId));
    res.status(200).json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to reject friend request' });
  }
}

export async function removeFriendHandler(req, res) {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    await friendRepo.removeFriend(userId, parseInt(friendId));
    res.status(200).json({ message: 'Friend removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to remove friend' });
  }
}

export async function getFriendsHandler(req, res) {
  try {
    const userId = req.user.id;

    const friends = await friendRepo.getFriends(userId);
    res.status(200).json(friends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch friends' });
  }
}

export async function getPendingRequestsHandler(req, res) {
  try {
    const userId = req.user.id;

    const requests = await friendRepo.getPendingRequests(userId);
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch pending requests' });
  }
}

export async function getSentRequestsHandler(req, res) {
  try {
    const userId = req.user.id;

    const requests = await friendRepo.getSentRequests(userId);
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch sent requests' });
  }
}
