const Product = require('../models/Product');
const mongoose = require('mongoose');
const { upload } = require('../config/cloudinary');
const Category = require('../models/Category');
const { logDebug, findSimilarStrings } = require('../utils/debugHelper');

// Get all products with optional category filter
const getProducts = async (req, res) => {
  try {
    const { category, subcategory, condition, searchTerm, minPrice, maxPrice, location } = req.query;
    let query = {};
    // Only filter by published for non-admin users
    if (!req.headers.authorization) {
      query.published = true;
    }
    // Search term (name or description)
    if (searchTerm) {
      query.$or = [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    // Subcategory filter (existing logic)
    if (subcategory) {
      let subcategoryPattern;
      if (subcategory.includes('-')) {
        subcategoryPattern = subcategory.replace(/-/g, ' ');
      } else {
        subcategoryPattern = subcategory;
      }
      const allSubcategories = await Product.distinct('subcategory');
      const validSubcategories = allSubcategories.filter(Boolean);
      const exactMatches = validSubcategories.filter(
        sub => sub.toLowerCase() === subcategoryPattern.toLowerCase()
      );
      if (exactMatches.length > 0) {
        query.subcategory = exactMatches[0];
      } else {
        const pattern = subcategoryPattern.replace(/[-\s]+/g, '[-\\s]*').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query.subcategory = { $regex: new RegExp(pattern, 'i') };
      }
    }
    // Condition filter
    if (condition) {
      query.condition = condition;
    }
    // Category filter
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = new mongoose.Types.ObjectId(category);
      } else {
        const catDoc = await Category.findOne({
          name: { $regex: new RegExp('^' + category.replace(/-/g, ' ') + '$', 'i') }
        });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          return res.status(200).json({ products: [] });
        }
      }
    }
    // Price range filter
    if (minPrice) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }
    if (maxPrice) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }
    // Location filter (city or address)
    if (location) {
      query.$or = [
        ...(query.$or || []),
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }
    const products = await Product.find(query).populate('category');
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate('category');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Validate and normalize a subcategory value based on available categories
 */
const validateSubcategory = async (categoryId, subcategoryValue) => {
  if (!subcategoryValue) return null;
  
  try {
    // Find the category and its valid subcategories
    const category = await Category.findById(categoryId);
    if (!category || !category.subcategories || !category.subcategories.length) {
      logDebug(`No subcategories found for category ID: ${categoryId}`);
      return null;
    }
    
    const validSubcategories = category.subcategories.map(sub => sub.name);
    logDebug(`Valid subcategories for ${category.name}:`, validSubcategories);
    
    // Try exact match first
    const exactMatch = validSubcategories.find(
      sub => sub.toLowerCase() === subcategoryValue.toLowerCase()
    );
    
    if (exactMatch) {
      logDebug(`Found exact subcategory match: "${exactMatch}"`);
      return exactMatch; // Return with proper case from the category definition
    }
    
    // Try fuzzy matching if no exact match
    const similarMatches = findSimilarStrings(subcategoryValue, validSubcategories, 0.7);
    
    if (similarMatches.length > 0) {
      logDebug(`Found similar subcategory matches:`, similarMatches);
      return similarMatches[0].value; // Use the best match
    }
    
    logDebug(`No matching subcategory found for: "${subcategoryValue}"`);
    return subcategoryValue; // Return original value if no matches
  } catch (error) {
    logDebug(`Error validating subcategory: ${error.message}`);
    return subcategoryValue; // Return original on error
  }
};

// Create a new product
const createProduct = async (req, res) => {
  console.log('Create product request body:', req.body);
  const { name, description, price, category, subcategory, condition, stock, address, city, state, zipCode } = req.body;

  console.log('Creating product with subcategory:', subcategory);

  try {
    // Validate and normalize the subcategory value
    const normalizedSubcategory = await validateSubcategory(category, subcategory);
    logDebug(`Normalized subcategory: "${normalizedSubcategory}" (original: "${subcategory}")`);
    
    // Upload images to Cloudinary
    const imageUrls = req.files.map((file) => {
      if (process.env.USE_LOCAL_STORAGE === 'true') {
        // file.filename set by multer.diskStorage
        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      }
      return file.path;
    });    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory: normalizedSubcategory, // Use normalized subcategory value
      condition,
      stock,
      images: imageUrls,
      location: { address, city, state, zipCode },
      createdBy: req.user._id,
    });

    // Populate category before sending response
    await product.populate('category');
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  console.log('Update product request body:', req.body);
  const { id } = req.params;
  const { name, description, price, category, subcategory, condition, stock, address, city, state, zipCode } = req.body;

  console.log('Updating product with subcategory:', subcategory);

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    
    // Handle subcategory specifically to allow setting it to null/empty
    if (subcategory === '') {
      product.subcategory = null; // Clear the subcategory if empty string is provided
    } else if (subcategory !== undefined) {
      product.subcategory = subcategory;
    }
    
    product.condition = condition || product.condition;
    product.stock = (typeof stock !== 'undefined') ? stock : product.stock;
    // Update location
    product.location = {
      address: address || product.location.address,
      city: city || product.location.city,
      state: state || product.location.state,
      zipCode: zipCode || product.location.zipCode
    };

    // Update images if provided
    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => {
        if (process.env.USE_LOCAL_STORAGE === 'true') {
          return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        }
        return file.path;
      });
    }

    // Update published if provided
    if (req.body.published !== undefined) {
      product.published = req.body.published;
    }

    const updatedProduct = await product.save();
    // Populate category before sending response
    await updatedProduct.populate('category');
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; // end of updateProduct

// Delete a product
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.remove();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Adjust product stock (decrement by quantity) and unpublish if out of stock
const adjustStock = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.stock = product.stock - quantity;
    if (product.stock <= 0) {
      product.published = false;
      product.stock = Math.max(product.stock, 0);
    }
    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle publish status
const togglePublish = async (req, res) => {
  const { id } = req.params;
  const { published } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.published = published;
    await product.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  togglePublish
};