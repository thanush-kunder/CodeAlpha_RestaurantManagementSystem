const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  cancelReservation,
} = require('../controllers/reservationController');
const { protect, authorize } = require('../middleware/auth');

// Validation middleware
const reservationValidation = [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail')
    .notEmpty()
    .withMessage('Customer email is required')
    .isEmail()
    .withMessage('Please provide a valid email'),
  body('customerPhone').notEmpty().withMessage('Customer phone is required'),
  body('table')
    .notEmpty()
    .withMessage('Table is required')
    .isMongoId()
    .withMessage('Invalid table ID'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Invalid date format'),
  body('time').notEmpty().withMessage('Time is required'),
  body('numberOfGuests')
    .notEmpty()
    .withMessage('Number of guests is required')
    .isInt({ min: 1 })
    .withMessage('Number of guests must be at least 1'),
];

// Routes
router.get('/', protect, authorize('admin'), getAllReservations);
router.get('/:id', protect, getReservationById);
router.post('/', reservationValidation, createReservation);
router.put('/:id', protect, reservationValidation, updateReservation);
router.delete('/:id', protect, cancelReservation);

module.exports = router;
