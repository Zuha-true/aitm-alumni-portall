const express = require('express');
const router = express.Router();
const DirectMessage = require('../models/DirectMessage');
const { protect } = require('../middleware/auth');

// Get or create conversation
router.post('/conversation', protect, async (req, res) => {
  try {
    const { recipientId } = req.body;
    
    // Find existing conversation
    let conversation = await DirectMessage.findOne({
      participants: { $all: [req.user.id, recipientId] }
    }).populate('participants', 'name role');

    // Create new conversation if doesn't exist
    if (!conversation) {
      conversation = await DirectMessage.create({
        participants: [req.user.id, recipientId]
      });
      conversation = await DirectMessage.findById(conversation._id)
        .populate('participants', 'name role');
    }

    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all conversations for user
router.get('/conversations', protect, async (req, res) => {
  try {
    const conversations = await DirectMessage.find({
      participants: req.user.id
    })
    .populate('participants', 'name role')
    .populate('messages.sender', 'name')
    .sort({ lastMessage: -1 });

    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for conversation
router.get('/:conversationId/messages', protect, async (req, res) => {
  try {
    const conversation = await DirectMessage.findById(req.params.conversationId)
      .populate('messages.sender', 'name');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(conversation.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/:conversationId/messages', protect, async (req, res) => {
  try {
    const conversation = await DirectMessage.findById(req.params.conversationId);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    conversation.messages.push({
      sender: req.user.id,
      content: req.body.content,
    });
    conversation.lastMessage = Date.now();

    await conversation.save();

    const populatedConversation = await DirectMessage.findById(conversation._id)
      .populate('messages.sender', 'name');

    res.json(populatedConversation.messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;