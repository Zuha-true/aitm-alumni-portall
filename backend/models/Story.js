const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    required: [true, 'Please add an image'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  },
});

// Index to auto-delete expired stories
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', StorySchema);