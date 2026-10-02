const express = require('express');
const router = express.Router();
const {
  getDailySales,
  getSalesRange,
  getPopularItems,
  getOrderStatusSummary,
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

// Routes
router.get('/daily-sales', protect, authorize('admin'), getDailySales);
router.get('/sales-range', protect, authorize('admin'), getSalesRange);
router.get('/popular-items', protect, authorize('admin'), getPopularItems);
router.get('/order-status', protect, authorize('admin'), getOrderStatusSummary);

module.exports = router;
