import * as messageRepo from '../repositories/messageRepo.js';

export async function sendMessageHandler(req, res) {
  try {
    const userId = req.user.id;
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({ message: 'receiverId and content are required' });
    }

    const message = await messageRepo.sendMessage(userId, parseInt(receiverId), content);
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Failed to send message' });
  }
}

export async function getConversationHandler(req, res) {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await messageRepo.getConversation(userId, parseInt(partnerId), parseInt(limit));
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
}

export async function getConversationsHandler(req, res) {
  try {
    const userId = req.user.id;

    const conversations = await messageRepo.getConversations(userId);
    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
}

export async function markAsReadHandler(req, res) {
  try {
    const userId = req.user.id;
    const { senderId } = req.params;

    await messageRepo.markAsRead(userId, parseInt(senderId));
    res.status(200).json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
}

export async function deleteMessageHandler(req, res) {
  try {
    const userId = req.user.id;
    const { messageId } = req.params;

    await messageRepo.deleteMessage(parseInt(messageId), userId);
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    console.error(error);
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    res.status(500).json({ message: 'Failed to delete message' });
  }
}
