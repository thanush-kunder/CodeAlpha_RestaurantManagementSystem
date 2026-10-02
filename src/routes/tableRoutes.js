const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
} = require('../controllers/tableController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const tableValidation = [
  body('tableNumber')
    .notEmpty()
    .withMessage('Table number is required')
    .isInt({ min: 1 })
    .withMessage('Table number must be a positive integer'),
  body('capacity')
    .notEmpty()
    .withMessage('Capacity is required')
    .isInt({ min: 1 })
    .withMessage('Capacity must be at least 1'),
  body('location')
    .optional()
    .isIn(['indoor', 'outdoor', 'patio', 'vip'])
    .withMessage('Invalid location'),
];

// Routes
router.get('/', getAllTables);
router.get('/:id', getTableById);
router.post('/', protect, authorize('admin'), tableValidation, createTable);
router.put('/:id', protect, authorize('admin'), tableValidation, updateTable);
router.delete('/:id', protect, authorize('admin'), deleteTable);

module.exports = router;
