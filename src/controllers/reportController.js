const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Get daily sales report
// @route   GET /api/reports/daily-sales
// @access  Private/Admin
exports.getDailySales = async (req, res, next) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();

    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
      paymentStatus: 'paid',
    });

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;

    // Calculate sales by category
    const salesByCategory = {};
    for (const order of orders) {
      for (const item of order.items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (menuItem) {
          const category = menuItem.category;
          if (!salesByCategory[category]) {
            salesByCategory[category] = { count: 0, revenue: 0 };
          }
          salesByCategory[category].count += item.quantity;
          salesByCategory[category].revenue += item.price * item.quantity;
        }
      }
    }

    res.status(200).json({
      success: true,
      data: {
        date: startOfDay,
        totalSales,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
        salesByCategory,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sales report for date range
// @route   GET /api/reports/sales-range
// @access  Private/Admin
exports.getSalesRange = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      createdAt: { $gte: start, $lte: end },
      paymentStatus: 'paid',
    });

    const totalSales = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalOrders = orders.length;

    // Daily breakdown
    const dailyBreakdown = {};
    for (const order of orders) {
      const dateKey = order.createdAt.toISOString().split('T')[0];
      if (!dailyBreakdown[dateKey]) {
        dailyBreakdown[dateKey] = { orders: 0, revenue: 0 };
      }
      dailyBreakdown[dateKey].orders += 1;
      dailyBreakdown[dateKey].revenue += order.totalAmount;
    }

    res.status(200).json({
      success: true,
      data: {
        startDate: start,
        endDate: end,
        totalSales,
        totalOrders,
        averageOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
        dailyBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get popular items
// @route   GET /api/reports/popular-items
// @access  Private/Admin
exports.getPopularItems = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const orders = await Order.find({ paymentStatus: 'paid' });

    const itemStats = {};
    for (const order of orders) {
      for (const item of order.items) {
        if (!itemStats[item.name]) {
          itemStats[item.name] = {
            name: item.name,
            totalOrders: 0,
            totalQuantity: 0,
            totalRevenue: 0,
          };
        }
        itemStats[item.name].totalOrders += 1;
        itemStats[item.name].totalQuantity += item.quantity;
        itemStats[item.name].totalRevenue += item.price * item.quantity;
      }
    }

    const popularItems = Object.values(itemStats)
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, parseInt(limit));

    res.status(200).json({
      success: true,
      count: popularItems.length,
      data: popularItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order status summary
// @route   GET /api/reports/order-status
// @access  Private/Admin
exports.getOrderStatusSummary = async (req, res, next) => {
  try {
    const orders = await Order.find();

    const statusSummary = {
      pending: 0,
      preparing: 0,
      ready: 0,
      served: 0,
      cancelled: 0,
    };

    const paymentSummary = {
      pending: 0,
      paid: 0,
      refunded: 0,
    };

    for (const order of orders) {
      statusSummary[order.status]++;
      paymentSummary[order.paymentStatus]++;
    }

    res.status(200).json({
      success: true,
      data: {
        totalOrders: orders.length,
        statusSummary,
        paymentSummary,
      },
    });
  } catch (error) {
    next(error);
  }
};
