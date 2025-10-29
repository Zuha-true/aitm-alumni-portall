const express = require('express');
const router = express.Router();
const Gossip = require('../models/Gossip');
const { protect } = require('../middleware/auth');

// Get all gossip
router.get('/', async (req, res) => {
  try {
    const gossips = await Gossip.find().sort({ createdAt: -1 });
    res.json(gossips);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create gossip
router.post('/', protect, async (req, res) => {
  try {
    const gossip = await Gossip.create({ content: req.body.content });
    res.status(201).json(gossip);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete gossip
router.delete('/:id', protect, async (req, res) => {
  try {
    const gossip = await Gossip.findById(req.params.id);
    if (!gossip) {
      return res.status(404).json({ message: 'Gossip not found' });
    }
    await gossip.deleteOne();
    res.json({ message: 'Gossip removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like gossip
router.post('/:id/like', protect, async (req, res) => {
  try {
    const gossip = await Gossip.findById(req.params.id);
    if (!gossip) {
      return res.status(404).json({ message: 'Gossip not found' });
    }

    if (gossip.likes.includes(req.user.id)) {
      gossip.likes = gossip.likes.filter(like => like.toString() !== req.user.id);
    } else {
      gossip.likes.push(req.user.id);
    }

    await gossip.save();
    res.json(gossip);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;