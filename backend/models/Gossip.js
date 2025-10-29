const mongoose = require('mongoose');

const GossipSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add content'],
    maxlength: 200,
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

module.exports = mongoose.model('Gossip', GossipSchema);