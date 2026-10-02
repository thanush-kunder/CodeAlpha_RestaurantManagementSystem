const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  customerEmail: {
    type: String,
    required: [true, 'Customer email is required'],
    trim: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true,
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Reservation date is required'],
  },
  time: {
    type: String,
    required: [true, 'Reservation time is required'],
  },
  numberOfGuests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending',
  },
  specialRequests: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Reservation', reservationSchema);
