const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/internships
// @desc    Get all internships
// @access  Public
router.get('/', async (req, res) => {
  try {
    const internships = await Internship.find()
      .populate('posted_by', 'name')
      .sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/internships
// @desc    Create internship
// @access  Private (Alumni only)
router.post('/', protect, authorize('alumni'), async (req, res) => {
  try {
    const { company, role, location, duration, stipend, contact } = req.body;

    const internship = await Internship.create({
      company,
      role,
      location,
      duration,
      stipend,
      contact,
      posted_by: req.user.id,
    });

    const populatedInternship = await Internship.findById(internship._id)
      .populate('posted_by', 'name');

    res.status(201).json(populatedInternship);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/internships/:id/save
// @desc    Save internship
// @access  Private (Student only)
router.post('/:id/save', protect, authorize('student'), async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if already saved
    if (user.savedInternships.includes(req.params.id)) {
      return res.status(400).json({ message: 'Internship already saved' });
    }

    user.savedInternships.push(req.params.id);
    await user.save();

    res.json({ message: 'Internship saved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/internships/saved
// @desc    Get saved internships
// @access  Private (Student only)
router.get('/saved/me', protect, authorize('student'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'savedInternships',
        populate: { path: 'posted_by', select: 'name' }
      });

    res.json(user.savedInternships);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;