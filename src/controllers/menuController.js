const MenuItem = require('../models/MenuItem');
const { validationResult } = require('express-validator');

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
exports.getAllMenuItems = async (req, res, next) => {
  try {
    const { category, isAvailable } = req.query;
    const query = {};

    if (category) query.category = category;
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
// @access  Public
exports.getMenuItemById = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create menu item
// @route   POST /api/menu
// @access  Private/Admin
exports.createMenuItem = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const menuItem = await MenuItem.create(req.body);

    res.status(201).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private/Admin
exports.updateMenuItem = async (req, res, next) => {
  try {
    let menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    menuItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private/Admin
exports.deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found',
      });
    }

    await menuItem.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
