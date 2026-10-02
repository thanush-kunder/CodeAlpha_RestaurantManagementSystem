const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['food', 'beverage', 'ingredient', 'supplies'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0,
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'g', 'l', 'ml', 'pieces', 'dozen', 'pack'],
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: 0,
  },
  costPerUnit: {
    type: Number,
    required: [true, 'Cost per unit is required'],
    min: 0,
  },
  supplier: {
    type: String,
    default: '',
  },
  lastRestocked: {
    type: Date,
    default: Date.now,
  },
  isLowStock: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if stock is low before saving
inventorySchema.pre('save', function (next) {
  this.isLowStock = this.quantity <= this.minimumStock;
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);
