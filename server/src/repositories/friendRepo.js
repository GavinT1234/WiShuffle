import prisma from '../config/db.js';

export async function sendFriendRequest(initiatorId, receiverId) {
  // Don't allow friending yourself
  if (initiatorId === receiverId) {
    throw new Error('Cannot add yourself as a friend');
  }

  // Check if friendship already exists in either direction
  const existingFriendship = await prisma.friend.findFirst({
    where: {
      OR: [
        { initiatorId: initiatorId, receiverId: receiverId },
        { initiatorId: receiverId, receiverId: initiatorId }
      ]
    }
  });

  if (existingFriendship) {
    throw new Error('Friend request already exists');
  }

  return prisma.friend.create({
    data: {
      initiatorId,
      receiverId,
      status: 'pending'
    },
    include: {
      initiator: {
        select: { id: true, username: true, avatarUrl: true }
      },
      receiver: {
        select: { id: true, username: true, avatarUrl: true }
      }
    }
  });
}

export async function acceptFriendRequest(friendRequestId) {
  return prisma.friend.update({
    where: { id: friendRequestId },
    data: { status: 'accepted' },
    include: {
      initiator: {
        select: { id: true, username: true, avatarUrl: true, description: true }
      },
      receiver: {
        select: { id: true, username: true, avatarUrl: true, description: true }
      }
    }
  });
}

export async function rejectFriendRequest(friendRequestId) {
  return prisma.friend.delete({
    where: { id: friendRequestId }
  });
}

export async function removeFriend(userId, friendId) {
  return prisma.friend.deleteMany({
    where: {
      OR: [
        { initiatorId: userId, receiverId: friendId, status: 'accepted' },
        { initiatorId: friendId, receiverId: userId, status: 'accepted' }
      ]
    }
  });
}

export async function getFriends(userId) {
  const friendships = await prisma.friend.findMany({
    where: {
      status: 'accepted',
      OR: [
        { initiatorId: userId },
        { receiverId: userId }
      ]
    },
    include: {
      initiator: {
        select: { id: true, username: true, avatarUrl: true, description: true, topSongs: true }
      },
      receiver: {
        select: { id: true, username: true, avatarUrl: true, description: true, topSongs: true }
      }
    }
  });

  // Normalize to show the friend's info (not the current user's)
  return friendships.map(friendship => {
    if (friendship.initiatorId === userId) {
      return {
        id: friendship.id,
        friend: friendship.receiver
      };
    } else {
      return {
        id: friendship.id,
        friend: friendship.initiator
      };
    }
  });
}

export async function getPendingRequests(userId) {
  return prisma.friend.findMany({
    where: {
      receiverId: userId,
      status: 'pending'
    },
    include: {
      initiator: {
        select: { id: true, username: true, avatarUrl: true, description: true }
      }
    }
  });
}

export async function getSentRequests(userId) {
  return prisma.friend.findMany({
    where: {
      initiatorId: userId,
      status: 'pending'
    },
    include: {
      receiver: {
        select: { id: true, username: true, avatarUrl: true }
      }
    }
  });
}
