const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Get user profile
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update profile
router.put('/', protect, async (req, res) => {
  try {
    const { name, bio, phone, website, company, location, profilePicture, batch, branch } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (bio) updateFields.bio = bio;
    if (phone) updateFields.phone = phone;
    if (website) updateFields.website = website;
    if (company) updateFields.company = company;
    if (location) updateFields.location = location;
    if (profilePicture) updateFields.profilePicture = profilePicture;
    if (batch) updateFields.batch = batch;
    if (branch) updateFields.branch = branch;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;