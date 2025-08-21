const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  linkUrl: {
    type: String,
    trim: true
  },
  linkText: {
    type: String,
    trim: true,
    default: 'Learn More'
  },
  backgroundColor: {
    type: String,
    default: '#f8fafc'
  },
  textColor: {
    type: String,
    default: '#1f2937'
  },
  buttonColor: {
    type: String,
    default: '#3b82f6'
  },
  position: {
    type: String,
    enum: ['hero', 'shop', 'category', 'footer'],
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient querying
bannerSchema.index({ position: 1, active: 1, order: 1 });

module.exports = mongoose.model('Banner', bannerSchema);
