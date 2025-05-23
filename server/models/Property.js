const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
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
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    }
  },
  images: [
    {
      type: String,
    },
  ],
  availableTimeSlots: [
    {
      date: {
        type: Date,
        required: true,
      },
      isBooked: {
        type: Boolean,
        default: false,
      },
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: String, // store subcategory name for simplicity
    required: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);