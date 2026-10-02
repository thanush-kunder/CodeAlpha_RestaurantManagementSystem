const Inventory = require('../models/Inventory');
const { validationResult } = require('express-validator');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private
exports.getAllInventory = async (req, res, next) => {
  try {
    const { category, isLowStock } = req.query;
    const query = {};

    if (category) query.category = category;
    if (isLowStock !== undefined) query.isLowStock = isLowStock === 'true';

    const inventory = await Inventory.find(query).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get low stock items
// @route   GET /api/inventory/low-stock
// @access  Private
exports.getLowStockItems = async (req, res, next) => {
  try {
    const inventory = await Inventory.find({ isLowStock: true }).sort({
      quantity: 1,
    });

    res.status(200).json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inventory item
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryById = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private/Admin
exports.createInventoryItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inventory = await Inventory.create(req.body);

    res.status(201).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private/Admin
exports.updateInventoryItem = async (req, res, next) => {
  try {
    let inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    inventory = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restock inventory
// @route   PUT /api/inventory/:id/restock
// @access  Private/Admin
exports.restockInventory = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    inventory.quantity += quantity;
    inventory.lastRestocked = Date.now();
    await inventory.save();

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:id
// @access  Private/Admin
exports.deleteInventoryItem = async (req, res, next) => {
  try {
    const inventory = await Inventory.findById(req.params.id);

    if (!inventory) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found',
      });
    }

    await inventory.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inventory item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
