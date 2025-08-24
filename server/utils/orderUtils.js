const mongoose = require('mongoose');

// Counter model for sequential order numbers
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

/**
 * Generate a human-readable order number
 * Format: ORD-YYYY-XXXXXX (e.g., ORD-2024-000001)
 */
const generateOrderNumber = async () => {
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
    return `ORD-${currentYear}-${orderNum}`;
  } catch (error) {
    console.error('Error generating order number:', error);
    throw error;
  }
};

/**
 * Format order number for display
 * @param {string} orderNumber - The order number to format
 * @returns {string} Formatted order number
 */
const formatOrderNumber = (orderNumber) => {
  if (!orderNumber) return '';
  
  // If it's already in the correct format, return as is
  if (orderNumber.startsWith('ORD-')) {
    return orderNumber;
  }
  
  // If it's a MongoDB ObjectId, return a fallback format
  if (orderNumber.length === 24) {
    return `ORD-${new Date().getFullYear()}-${orderNumber.substr(-6).toUpperCase()}`;
  }
  
  return orderNumber;
};

/**
 * Parse order number to extract year and sequence
 * @param {string} orderNumber - Order number in format ORD-YYYY-XXXXXX
 * @returns {object} Parsed components or null if invalid
 */
const parseOrderNumber = (orderNumber) => {
  if (!orderNumber || !orderNumber.startsWith('ORD-')) {
    return null;
  }
  
  const parts = orderNumber.split('-');
  if (parts.length !== 3) {
    return null;
  }
  
  const year = parseInt(parts[1]);
  const sequence = parseInt(parts[2]);
  
  if (isNaN(year) || isNaN(sequence)) {
    return null;
  }
  
  return {
    year,
    sequence,
    formatted: orderNumber
  };
};

module.exports = {
  generateOrderNumber,
  formatOrderNumber,
  parseOrderNumber,
  Counter
};
