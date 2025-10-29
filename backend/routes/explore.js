const express = require('express');
const router = express.Router();
const Explore = require('../models/Explore');
const { protect } = require('../middleware/auth');

// Get all explore posts
router.get('/', async (req, res) => {
  try {
    const posts = await Explore.find()
      .populate('author', 'name role profilePicture')
      .populate('comments.author', 'name profilePicture')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create explore post
router.post('/', protect, async (req, res) => {
  try {
    const { image, caption } = req.body;
    
    const post = await Explore.create({
      author: req.user.id,
      image: image || 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=400',
      caption,
    });

    const populatedPost = await Explore.findById(post._id)
      .populate('author', 'name role profilePicture');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete explore post
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Explore.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Like explore post
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Explore.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add comment
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const post = await Explore.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      author: req.user.id,
      content: req.body.content,
    });

    await post.save();

    const populatedPost = await Explore.findById(post._id)
      .populate('author', 'name role profilePicture')
      .populate('comments.author', 'name profilePicture');

    res.json(populatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;