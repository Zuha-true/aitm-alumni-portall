const mongoose = require('mongoose');

const ExploreSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    required: [true, 'Please add an image'],
  },
  caption: {
    type: String,
    required: [true, 'Please add a caption'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Explore', ExploreSchema);