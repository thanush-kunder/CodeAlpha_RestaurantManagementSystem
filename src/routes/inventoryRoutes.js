const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllInventory,
  getLowStockItems,
  getInventoryById,
  createInventoryItem,
  updateInventoryItem,
  restockInventory,
  deleteInventoryItem,
} = require('../controllers/inventoryController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const inventoryValidation = [
  body('name').notEmpty().withMessage('Item name is required'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isIn(['food', 'beverage', 'ingredient', 'supplies'])
    .withMessage('Invalid category'),
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),
  body('unit')
    .notEmpty()
    .withMessage('Unit is required')
    .isIn(['kg', 'g', 'l', 'ml', 'pieces', 'dozen', 'pack'])
    .withMessage('Invalid unit'),
  body('minimumStock')
    .notEmpty()
    .withMessage('Minimum stock is required')
    .isFloat({ min: 0 })
    .withMessage('Minimum stock must be a positive number'),
  body('costPerUnit')
    .notEmpty()
    .withMessage('Cost per unit is required')
    .isFloat({ min: 0 })
    .withMessage('Cost per unit must be a positive number'),
];

const restockValidation = [
  body('quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),
];

// Routes
router.get('/', protect, getAllInventory);
router.get('/low-stock', protect, getLowStockItems);
router.get('/:id', protect, getInventoryById);
router.post('/', protect, authorize('admin'), inventoryValidation, createInventoryItem);
router.put('/:id', protect, authorize('admin'), inventoryValidation, updateInventoryItem);
router.put('/:id/restock', protect, authorize('admin'), restockValidation, restockInventory);
router.delete('/:id', protect, authorize('admin'), deleteInventoryItem);

module.exports = router;
