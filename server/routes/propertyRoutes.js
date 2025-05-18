// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const mongoose = require('mongoose');
const { bookAppointment, updateProperty, createProperty, getProperties, deleteProperty, getPropertyById } = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Get all properties with optional category filter
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    // Debug the incoming request
    console.log('GET /api/properties - Query:', req.query);
    console.log('Category filter:', category);
    
    let query = {};
    
    // Only add category filter if it exists and is valid
    if (category) {
      try {
        // Validate if the category is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(category)) {
          query.category = category;
        } else {
          console.log('Invalid category ID format:', category);
        }
      } catch (err) {
        console.error('Error processing category:', err);
      }
    }
    
    console.log('Final query:', query);
    
    const properties = await Property.find(query)
      .populate('category', 'name')
      .populate('createdBy', 'name email');
    
    console.log(`Found ${properties.length} properties`);
    
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get a specific property by ID
router.get('/:id', getPropertyById);

// Book an appointment for property inspection
router.post('/:id/appointment', protect, bookAppointment);

// Update a property
router.put('/:id', protect, admin, upload.array('images', 5), updateProperty);

// Delete a property (admin only)
router.delete('/:id', protect, admin, deleteProperty);

// Property POST route (MISSING):
// Add this route to enable property creation with image upload and authentication
router.post('/', protect, admin, upload.array('images', 5), createProperty);

module.exports = router;