const Table = require('../models/Table');
const { validationResult } = require('express-validator');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public
exports.getAllTables = async (req, res, next) => {
  try {
    const { isAvailable, location } = req.query;
    const query = {};

    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (location) query.location = location;

    const tables = await Table.find(query).sort({ tableNumber: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      data: tables,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Public
exports.getTableById = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create table
// @route   POST /api/tables
// @access  Private/Admin
exports.createTable = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const table = await Table.create(req.body);

    res.status(201).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private/Admin
exports.updateTable = async (req, res, next) => {
  try {
    let table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: table,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
exports.deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);

    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    await table.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Table deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
