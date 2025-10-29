const express = require('express');
const router = express.Router();
const Happening = require('../models/Happening');
const { protect, authorize } = require('../middleware/auth');

// Get all happenings
router.get('/', async (req, res) => {
  try {
    const happenings = await Happening.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });
    res.json(happenings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create happening
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { caption, image } = req.body;
    const happening = await Happening.create({
      caption,
      image: image || 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=400',
      author: req.user.id,
    });

    const populatedHappening = await Happening.findById(happening._id)
      .populate('author', 'name');

    res.status(201).json(populatedHappening);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete happening
router.delete('/:id', protect, async (req, res) => {
  try {
    const happening = await Happening.findById(req.params.id);
    if (!happening) {
      return res.status(404).json({ message: 'Happening not found' });
    }

    if (happening.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await happening.deleteOne();
    res.json({ message: 'Happening removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like happening
router.post('/:id/like', protect, async (req, res) => {
  try {
    const happening = await Happening.findById(req.params.id);
    if (!happening) {
      return res.status(404).json({ message: 'Happening not found' });
    }

    if (happening.likes.includes(req.user.id)) {
      happening.likes = happening.likes.filter(like => like.toString() !== req.user.id);
    } else {
      happening.likes.push(req.user.id);
    }

    await happening.save();
    res.json(happening);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;