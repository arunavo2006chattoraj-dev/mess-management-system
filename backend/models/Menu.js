const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  items: {
    type: String,
    required: true,
    default: ''
  },
  time: {
    type: String,
    required: true,
    default: ''
  }
});

const MenuSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    unique: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  Breakfast: {
    type: MealSchema,
    required: true
  },
  Lunch: {
    type: MealSchema,
    required: true
  },
  Snacks: {
    type: MealSchema,
    required: true
  },
  Dinner: {
    type: MealSchema,
    required: true
  }
});

module.exports = mongoose.model('Menu', MenuSchema);
