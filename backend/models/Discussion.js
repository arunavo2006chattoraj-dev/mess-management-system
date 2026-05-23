const mongoose = require('mongoose');

const ReplySchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'caterer'],
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const DiscussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['student', 'caterer'],
    required: true
  },
  tag: {
    type: String,
    required: true,
    default: 'General'
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: {
    type: [String],
    default: []
  },
  commentsCount: {
    type: Number,
    default: 0
  },
  replies: {
    type: [ReplySchema],
    default: []
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Discussion', DiscussionSchema);
