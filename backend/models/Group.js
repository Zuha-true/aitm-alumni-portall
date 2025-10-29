const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add group name'],
  },
  type: {
    type: String,
    enum: ['batch', 'interest'],
    default: 'interest',
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  messages: [{
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    message: String,
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

module.exports = mongoose.model('Group', GroupSchema);