const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Inventory = require('../models/Inventory');
const { validationResult } = require('express-validator');

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.query;
    const query = {};

    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('table', 'tableNumber')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('table', 'tableNumber')
      .populate('items.menuItem', 'name price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, table } = req.body;

    // Validate items and calculate total
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: `Menu item not found: ${item.menuItem}`,
        });
      }

      if (!menuItem.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `Menu item is not available: ${menuItem.name}`,
        });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      validatedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        quantity: item.quantity,
        price: menuItem.price,
      });

      // Update inventory
      if (menuItem.ingredients && menuItem.ingredients.length > 0) {
        for (const ingredient of menuItem.ingredients) {
          const inventoryItem = await Inventory.findOne({ name: ingredient.name });
          if (inventoryItem) {
            const requiredQuantity = ingredient.quantity * item.quantity;
            if (inventoryItem.quantity < requiredQuantity) {
              return res.status(400).json({
                success: false,
                message: `Insufficient inventory for: ${ingredient.name}`,
              });
            }
            inventoryItem.quantity -= requiredQuantity;
            await inventoryItem.save();
          }
        }
      }
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerName: req.body.customerName,
      table,
      items: validatedItems,
      totalAmount,
      paymentMethod: req.body.paymentMethod || 'cash',
      specialInstructions: req.body.specialInstructions || '',
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
exports.updatePaymentStatus = async (req, res, next) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Restore inventory if order is cancelled
    if (order.status !== 'served' && order.status !== 'cancelled') {
      for (const item of order.items) {
        const menuItem = await MenuItem.findById(item.menuItem);
        if (menuItem && menuItem.ingredients) {
          for (const ingredient of menuItem.ingredients) {
            const inventoryItem = await Inventory.findOne({ name: ingredient.name });
            if (inventoryItem) {
              inventoryItem.quantity += ingredient.quantity * item.quantity;
              await inventoryItem.save();
            }
          }
        }
      }
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
