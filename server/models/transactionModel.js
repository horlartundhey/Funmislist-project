const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      // Don't require it initially, let pre-save hook generate it
    },
    reference: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false,
    },
    paystackResponse: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// Create a counter schema for generating sequential order numbers
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Pre-save middleware to generate order number
transactionSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    try {
      const currentYear = new Date().getFullYear();
      const counterId = `orderNumber_${currentYear}`;
      
      // Find and increment the counter
      const counter = await Counter.findByIdAndUpdate(
        counterId,
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      
      // Generate order number: ORD-YYYY-XXXXXX (6 digits with leading zeros)
      const orderNum = counter.seq.toString().padStart(6, '0');
      this.orderNumber = `ORD-${currentYear}-${orderNum}`;
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
