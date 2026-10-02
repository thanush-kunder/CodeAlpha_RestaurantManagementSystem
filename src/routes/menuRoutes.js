const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const menuItemValidation = [
  body('name').notEmpty().withMessage('Menu item name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['appetizer', 'main', 'dessert', 'beverage', 'special'])
    .withMessage('Invalid category'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
];

// Routes
router.get('/', getAllMenuItems);
router.get('/:id', getMenuItemById);
router.post('/', protect, authorize('admin'), menuItemValidation, createMenuItem);
router.put('/:id', protect, authorize('admin'), menuItemValidation, updateMenuItem);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

module.exports = router;
