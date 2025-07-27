// routes/propertyRoutes.js
const express = require('express');
const router = express.Router();
const Property = require('../models/Property');
const mongoose = require('mongoose');
const { bookAppointment, updateProperty, createProperty, getProperties, deleteProperty, getPropertyById } = require('../controllers/propertyController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Get all properties with advanced filters
router.get('/', getProperties);

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