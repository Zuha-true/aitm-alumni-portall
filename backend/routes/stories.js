const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const { protect } = require('../middleware/auth');

// Get all active stories
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    })
    .populate('author', 'name profilePicture')
    .sort({ createdAt: -1 });
    
    res.json(stories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create story
router.post('/', protect, async (req, res) => {
  try {
    const { image } = req.body;
    
    const story = await Story.create({
      author: req.user.id,
      image: image || 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400',
    });

    const populatedStory = await Story.findById(story._id)
      .populate('author', 'name profilePicture');

    res.status(201).json(populatedStory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete story
router.delete('/:id', protect, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await story.deleteOne();
    res.json({ message: 'Story removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;