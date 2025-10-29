

const mongoose = require('mongoose');

const HappeningSchema = new mongoose.Schema({
  image: {
    type: String,
    default: 'https://via.placeholder.com/400',
  },
  caption: {
    type: String,
    required: [true, 'Please add caption'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Happening', HappeningSchema);