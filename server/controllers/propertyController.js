const Property = require('../models/Property');
const mongoose = require('mongoose');

// Get all properties
const getProperties = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      console.log('Received category query:', req.query.category); // Debug log
      
      // Handle category filtering - try both ObjectId and string matching
      if (mongoose.isValidObjectId(req.query.category)) {
        filter.category = new mongoose.Types.ObjectId(req.query.category);
      } else {
        // If not a valid ObjectId, try as string
        filter.category = req.query.category;
      }
    }
    if (req.query.subcategory) {
      filter.subcategory = req.query.subcategory;
    }
    
    console.log('Querying properties with filter:', filter); // Debug log
    
    const properties = await Property.find(filter).lean();
    console.log('Found properties:', properties.length); // Debug log count instead of full objects
    
    if (properties.length === 0) {
      console.log('No properties found for filter:', filter); // Debug log
    }
    
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error); // Debug log
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new property
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      availableTimeSlots,
      category,
      subcategory
    } = req.body;

    const imageUrls = req.files.map((file) => file.path);
    const parsedSlots = JSON.parse(availableTimeSlots);
    // parse location JSON
    const parsedLocation = JSON.parse(location);

    // Convert category to ObjectId if valid
    let categoryId;
    if (mongoose.isValidObjectId(category)) {
      categoryId = new mongoose.Types.ObjectId(category);
    } else {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const property = await Property.create({
      title,
      description,
      price,
      location: parsedLocation,
      images: imageUrls,
      availableTimeSlots: parsedSlots,
      category: categoryId,
      subcategory,
      createdBy: req.user._id
    });

    res.status(201).json(property);
  } catch (error) {
    console.error('CREATE PROPERTY ERROR:', error);
    res.status(500).json({ message: error.message });
  }
};

// Book an appointment for property inspection
const bookAppointment = async (req, res) => {
  const { id } = req.params;
  const { date } = req.body;

  try {
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const timeSlot = property.availableTimeSlots.find(
      (slot) => slot.date.toISOString() === new Date(date).toISOString()
    );

    if (!timeSlot || timeSlot.isBooked) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    // Fixed the syntax error that was here (removed "borough: true,")
    timeSlot.isBooked = true;
    await property.save();

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, availableTimeSlots, subcategory } = req.body;

  try {
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update fields
    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    // parse and update location JSON
    property.location = location ? JSON.parse(location) : property.location;
    property.availableTimeSlots = availableTimeSlots ? JSON.parse(availableTimeSlots) : property.availableTimeSlots;
    if (subcategory) property.subcategory = subcategory;

    // Update images if provided
    if (req.files && req.files.length > 0) {
      property.images = req.files.map((file) => file.path);
    }

    const updatedProperty = await property.save();
    res.status(200).json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const property = await Property.findById(id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    await property.remove();
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific property by ID
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProperties, getPropertyById, createProperty, bookAppointment, updateProperty, deleteProperty };