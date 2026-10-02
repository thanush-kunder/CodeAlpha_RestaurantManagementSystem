const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const { validationResult } = require('express-validator');

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
exports.getAllReservations = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const query = {};

    if (status) query.status = status;
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const reservations = await Reservation.find(query)
      .populate('table', 'tableNumber capacity location')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single reservation
// @route   GET /api/reservations/:id
// @access  Private
exports.getReservationById = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate(
      'table',
      'tableNumber capacity location'
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create reservation
// @route   POST /api/reservations
// @access  Public
exports.createReservation = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { table, date, time, numberOfGuests } = req.body;

    // Check if table exists and has enough capacity
    const tableDoc = await Table.findById(table);
    if (!tableDoc) {
      return res.status(404).json({
        success: false,
        message: 'Table not found',
      });
    }

    if (tableDoc.capacity < numberOfGuests) {
      return res.status(400).json({
        success: false,
        message: 'Table capacity is insufficient',
      });
    }

    // Check for conflicting reservations
    const conflictingReservation = await Reservation.findOne({
      table,
      date: new Date(date),
      time,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (conflictingReservation) {
      return res.status(400).json({
        success: false,
        message: 'Table is already reserved for this time slot',
      });
    }

    const reservation = await Reservation.create(req.body);

    res.status(201).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reservation
// @route   PUT /api/reservations/:id
// @access  Private
exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel reservation
// @route   DELETE /api/reservations/:id
// @access  Private
exports.cancelReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: reservation,
    });
  } catch (error) {
    next(error);
  }
};
