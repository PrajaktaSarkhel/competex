const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: [true, 'Competition ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userPhone: {
      type: String,
      trim: true,
    },
    payment: {
      status: {
        type: String,
        enum: ['SUCCESS', 'PENDING', 'FAILED', 'REFUNDED'],
        default: 'SUCCESS',
      },
      orderId: { type: String },
      paymentId: { type: String },
      amount: { type: Number, required: true },
      currency: { type: String, default: 'INR' },
      method: { type: String, default: 'UPI/Razorpay' },
      paidAt: { type: Date, default: Date.now },
    },
    hasSubmitted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['CONFIRMED', 'CANCELLED'],
      default: 'CONFIRMED',
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Indexes to strictly prevent duplicate registrations per user per competition
registrationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });
registrationSchema.index({ competitionId: 1, userEmail: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
