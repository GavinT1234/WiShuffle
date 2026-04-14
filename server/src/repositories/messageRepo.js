import prisma from '../config/db.js';

export async function sendMessage(senderId, receiverId, content) {
  if (!content.trim()) {
    throw new Error('Message content cannot be empty');
  }

  return prisma.message.create({
    data: {
      senderId,
      receiverId,
      content: content.trim()
    },
    include: {
      sender: {
        select: { id: true, username: true, avatarUrl: true }
      },
      receiver: {
        select: { id: true, username: true, avatarUrl: true }
      }
    }
  });
}

export async function getConversation(userId1, userId2, limit = 50) {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    },
    include: {
      sender: {
        select: { id: true, username: true, avatarUrl: true }
      },
      receiver: {
        select: { id: true, username: true, avatarUrl: true }
      }
    },
    orderBy: { createdAt: 'asc' },
    take: limit
  });
}

export async function getConversations(userId) {
  // Get unique conversations
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    include: {
      sender: {
        select: { id: true, username: true, avatarUrl: true }
      },
      receiver: {
        select: { id: true, username: true, avatarUrl: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Group by conversation partner and get latest message
  const conversationMap = new Map();
  messages.forEach(message => {
    const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
    if (!conversationMap.has(partnerId)) {
      conversationMap.set(partnerId, {
        partnerId: partnerId,
        partnerInfo: message.senderId === userId ? message.receiver : message.sender,
        lastMessage: message.content,
        lastMessageTime: message.createdAt,
        unreadCount: 0
      });
    }
    if (message.receiverId === userId && !message.isRead) {
      conversationMap.get(partnerId).unreadCount++;
    }
  });

  return Array.from(conversationMap.values());
}

export async function markAsRead(userId, senderId) {
  return prisma.message.updateMany({
    where: {
      senderId: senderId,
      receiverId: userId,
      isRead: false
    },
    data: { isRead: true }
  });
}

export async function deleteMessage(messageId, userId) {
  const message = await prisma.message.findUnique({
    where: { id: messageId }
  });

  if (!message || message.senderId !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.message.delete({
    where: { id: messageId }
  });
}
