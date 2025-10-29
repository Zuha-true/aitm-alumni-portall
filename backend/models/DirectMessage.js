const mongoose = require('mongoose');

const DirectMessageSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  lastMessage: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DirectMessage', DirectMessageSchema);