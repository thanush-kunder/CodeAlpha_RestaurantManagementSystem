const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Menu item name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'special'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
  image: {
    type: String,
    default: '',
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  preparationTime: {
    type: Number,
    default: 15,
  },
  ingredients: [
    {
      name: String,
      quantity: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
