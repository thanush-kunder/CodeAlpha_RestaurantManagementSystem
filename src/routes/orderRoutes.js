const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const orderValidation = [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('items')
    .notEmpty()
    .withMessage('Items are required')
    .isArray()
    .withMessage('Items must be an array'),
  body('items.*.menuItem')
    .notEmpty()
    .withMessage('Menu item ID is required')
    .isMongoId()
    .withMessage('Invalid menu item ID'),
  body('items.*.quantity')
    .notEmpty()
    .withMessage('Quantity is required')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('table').optional().isMongoId().withMessage('Invalid table ID'),
  body('paymentMethod')
    .optional()
    .isIn(['cash', 'card', 'online'])
    .withMessage('Invalid payment method'),
];

const statusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['pending', 'preparing', 'ready', 'served', 'cancelled'])
    .withMessage('Invalid status'),
];

const paymentValidation = [
  body('paymentStatus')
    .notEmpty()
    .withMessage('Payment status is required')
    .isIn(['pending', 'paid', 'refunded'])
    .withMessage('Invalid payment status'),
];

// Routes
router.get('/', protect, getAllOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, orderValidation, createOrder);
router.put('/:id/status', protect, statusValidation, updateOrderStatus);
router.put('/:id/payment', protect, paymentValidation, updatePaymentStatus);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

module.exports = router;
