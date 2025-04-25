const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  description: String,
  submissionDate: {
    type: Date,
    default: Date.now
  },
  documents: [{
    type: String // URLs des documents
  }],
  comments: [{
    userId: String,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Request', requestSchema);
