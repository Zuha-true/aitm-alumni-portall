const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please add company name'],
  },
  role: {
    type: String,
    required: [true, 'Please add role'],
  },
  location: {
    type: String,
    required: [true, 'Please add location'],
  },
  duration: {
    type: String,
    required: [true, 'Please add duration'],
  },
  stipend: {
    type: String,
    required: [true, 'Please add stipend'],
  },
  description: {
    type: String,
    required: [true, 'Please add description'],
    maxlength: 500,
  },
  contact: {
    type: String,
    required: [true, 'Please add contact'],
  },
  posted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Internship', InternshipSchema);