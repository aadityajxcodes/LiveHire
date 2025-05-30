const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  interview: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer'],
    required: true
  },
  transactionId: {
    type: String
  },
  paidAt: {
    type: Date
  },
  invoiceNumber: {
    type: String,
    unique: true
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Generate unique invoice number before saving
paymentSchema.pre('save', function(next) {
  if (!this.invoiceNumber) {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.invoiceNumber = `INV-${datePart}-${randomPart}`;
  }
  next();
});

module.exports = mongoose.model('Payment', paymentSchema); 