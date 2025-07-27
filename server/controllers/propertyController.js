const Property = require('../models/Property');
const User = require('../models/User');
const mongoose = require('mongoose');
const { sendAppointmentConfirmation } = require('../utils/emailService');

// Get all properties with advanced filters
const getProperties = async (req, res) => {
  try {
    const { category, subcategory, searchTerm, minPrice, maxPrice, location } = req.query;
    let filter = {};
    if (category) {
      if (mongoose.isValidObjectId(category)) {
        filter.category = new mongoose.Types.ObjectId(category);
      } else {
        filter.category = category;
      }
    }
    if (subcategory) {
      filter.subcategory = { $regex: new RegExp('^' + subcategory + '$', 'i') };
    }
    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { 'location.city': { $regex: searchTerm, $options: 'i' } },
        { 'location.state': { $regex: searchTerm, $options: 'i' } },
        { 'location.address': { $regex: searchTerm, $options: 'i' } }
      ];
    }
    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) };
    }
    if (location) {
      filter.$or = [
        ...(filter.$or || []),
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }
    console.log('Property search filter:', JSON.stringify(filter, null, 2));
    const properties = await Property.find(filter).lean();
    console.log('Properties found:', properties.length);
    res.status(200).json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new property
const createProperty = async (req, res) => {  try {
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
    const parsedLocation = JSON.parse(location);    // Validate category and subcategory
    if (!mongoose.isValidObjectId(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const categoryDoc = await mongoose.model('Category').findById(category);
    if (!categoryDoc) {
      return res.status(400).json({ message: 'Category not found' });
    }

    // Validate subcategory if provided
    if (subcategory) {
      const isValidSubcategory = categoryDoc.subcategories.some(sub => sub.name === subcategory);
      if (!isValidSubcategory) {
        return res.status(400).json({ message: 'Invalid subcategory for the selected category' });
      }
    }

    // Create the property with validated data
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

    timeSlot.isBooked = true;
    await property.save();

    // Fetch user info for email
    const userId = req.user?._id;
    let user = null;
    if (userId) {
      user = await User.findById(userId);
    }

    // Prepare appointment details for email
    if (user && user.email) {
      const appointmentDetails = {
        propertyTitle: property.title,
        date: new Date(date).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' }),
        time: new Date(date).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }),
        propertyAddress: property.location?.address || '',
      };
      try {
        await sendAppointmentConfirmation(user.email, user.name, appointmentDetails);
      } catch (emailErr) {
        console.error('Failed to send appointment confirmation email:', emailErr);
      }
    }

    res.status(200).json({ message: 'Appointment booked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a property
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, location, availableTimeSlots, category, subcategory } = req.body;

  try {
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Update basic fields
    property.title = title || property.title;
    property.description = description || property.description;
    property.price = price || property.price;
    
    // Update category and subcategory with validation
    if (category) {
      // Verify category exists
      if (!mongoose.isValidObjectId(category)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      const categoryExists = await mongoose.model('Category').findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: 'Category not found' });
      }
      property.category = category;
      
      // If subcategory is provided, validate it belongs to the category
      if (subcategory) {
        const isValidSubcategory = categoryExists.subcategories.some(sub => sub.name === subcategory);
        if (!isValidSubcategory) {
          return res.status(400).json({ message: 'Invalid subcategory for the selected category' });
        }
        property.subcategory = subcategory;
      } else {
        property.subcategory = ''; // Clear subcategory if not provided with new category
      }
    } else if (subcategory) {
      // If only subcategory is updated, validate it against existing category
      const existingCategory = await mongoose.model('Category').findById(property.category);
      const isValidSubcategory = existingCategory.subcategories.some(sub => sub.name === subcategory);
      if (!isValidSubcategory) {
        return res.status(400).json({ message: 'Invalid subcategory for the existing category' });
      }
      property.subcategory = subcategory;
    }

    // Update location and availableTimeSlots
    property.location = location ? JSON.parse(location) : property.location;
    property.availableTimeSlots = availableTimeSlots ? JSON.parse(availableTimeSlots) : property.availableTimeSlots;

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