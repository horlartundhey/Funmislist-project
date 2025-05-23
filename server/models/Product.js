const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: String, // store subcategory name for simplicity
    required: false,
  },
  condition: {
    type: String,
    enum: ['new', 'used'],
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  published: {
    type: Boolean,
    default: true,
  },
  images: [
    {
      type: String,
    },
  ],
  location: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);