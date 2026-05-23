const mongoose = require('mongoose');

const PollOptionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  }
});

const PollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [PollOptionSchema],
    required: true
  },
  voters: {
    type: [String],
    default: []
  },
  closed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Poll', PollSchema);
