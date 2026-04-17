import * as messageRepo from '../../repositories/messageRepo.js';

export function registerMessageHandlers(io, socket) {
  // Send a direct message
  socket.on('message:send', async ({ receiverId, content }, ack) => {
    try {
      const senderId = socket.user.id;
      const senderUsername = socket.user.username;

      if (!receiverId || !content || !content.trim()) {
        if (ack) ack({ ok: false, error: 'Missing receiverId or content' });
        return;
      }

      // Save message to database
      const message = await messageRepo.sendMessage(
        senderId,
        parseInt(receiverId),
        content.trim()
      );

      // Create message payload for websocket
      const messagePayload = {
        id: message.id,
        content: message.content,
        senderId,
        senderUsername,
        receiverId: parseInt(receiverId),
        timestamp: message.createdAt.toISOString(),
        read: false,
      };

      // Send to receiver if they're connected (real-time delivery)
      io.to(`user:${receiverId}`).emit('message:received', messagePayload);

      // Send confirmation to sender
      if (ack) ack({ ok: true, message: messagePayload });

      console.log(`💬 Message sent from user ${senderId} to user ${receiverId}`);
    } catch (error) {
      console.error('❌ Send message error:', error);
      if (ack) ack({ ok: false, error: error.message });
    }
  });

  // When user connects, join their personal room for DM delivery
  const userId = socket.user.id;
  socket.join(`user:${userId}`);
  console.log(`👤 User ${userId} joined personal room for DM delivery`);

  // Mark messages as read
  socket.on('message:mark_read', async ({ senderId }, ack) => {
    try {
      const userId = socket.user.id;
      await messageRepo.markAsRead(userId, parseInt(senderId));

      // Notify sender that their message was read
      io.to(`user:${senderId}`).emit('message:read', {
        readBy: userId,
        readerId: senderId
      });

      if (ack) ack({ ok: true });
      console.log(`✓ Messages from ${senderId} marked as read by ${userId}`);
    } catch (error) {
      console.error('❌ Mark as read error:', error);
      if (ack) ack({ ok: false, error: error.message });
    }
  });

  // Delete a message
  socket.on('message:delete', async ({ messageId }, ack) => {
    try {
      const userId = socket.user.id;
      await messageRepo.deleteMessage(parseInt(messageId), userId);

      console.log(`🗑️  Message ${messageId} deleted by user ${userId}`);
      if (ack) ack({ ok: true });
    } catch (error) {
      console.error('❌ Delete message error:', error);
      if (ack) ack({ ok: false, error: error.message });
    }
  });

  // Clean up when user disconnects
  socket.on('disconnect', () => {
    console.log(`👤 User ${userId} left personal room`);
  });
}
