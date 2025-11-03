const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const { protect } = require('../middleware/auth');

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await Group.find()
      .populate('creator', 'name')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create group
router.post('/', protect, async (req, res) => {
  try {
    const { name, type } = req.body;
    const group = await Group.create({
      name,
      type: type || 'interest',
      creator: req.user.id,
      members: [req.user.id],
    });
    
    const populatedGroup = await Group.findById(group._id)
      .populate('creator', 'name');
    
    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Join group
router.post('/:id/join', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if already a member
    if (group.members.includes(req.user.id)) {
      return res.status(400).json({ message: 'Already a member' });
    }

    group.members.push(req.user.id);
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('creator', 'name')
      .populate('members', 'name email');

    res.json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove member (creator only)
router.delete('/:id/member/:memberId', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is creator
    if (group.creator.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only creator can remove members' });
    }

    // Don't allow removing creator
    if (req.params.memberId === req.user.id) {
      return res.status(400).json({ message: 'Cannot remove yourself as creator' });
    }

    group.members = group.members.filter(
      member => member.toString() !== req.params.memberId
    );
    
    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('creator', 'name')
      .populate('members', 'name');

    res.json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group messages
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('messages.author', 'name');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is a member
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You must join the group to view messages' });
    }

    res.json(group.messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/:id/messages', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if user is a member
    if (!group.members.includes(req.user.id)) {
      return res.status(403).json({ message: 'You must join the group to send messages' });
    }

    group.messages.push({
      author: req.user.id,
      message: req.body.message,
    });

    await group.save();

    const populatedGroup = await Group.findById(group._id)
      .populate('messages.author', 'name');

    res.json(populatedGroup.messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get group details with members
router.get('/:id', protect, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name')
      .populate('members', 'name email');
    
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;