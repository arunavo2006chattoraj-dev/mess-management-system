const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  hostelId: {
    type: String,
    required: true,
    trim: true
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  mealType: {
    type: String,
    required: true,
    enum: ['Breakfast', 'Lunch', 'Snacks', 'Dinner']
  },
  hadMeal: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  taste: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  hygiene: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  ratherHave: {
    type: String,
    trim: true,
    default: ''
  },
  howToImprove: {
    type: String,
    trim: true,
    default: ''
  },
  comments: {
    type: String,
    trim: true,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
