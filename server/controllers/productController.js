const Product = require('../models/Product');
const mongoose = require('mongoose');
const { upload } = require('../config/cloudinary');
const Category = require('../models/Category');

// Get all products with optional category filter
const getProducts = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    // Only filter by published for non-admin users
    let query = {};
    // Check if request is from admin or public
    if (!req.headers.authorization) {
      // Public request - only published products
      query.published = true;
    }
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = new mongoose.Types.ObjectId(category);
      } else {
        // treat category as name slug
        const catDoc = await Category.findOne({
          name: { $regex: new RegExp('^' + category.replace(/-/g, ' ') + '$', 'i') }
        });
        if (catDoc) {
          query.category = catDoc._id;
        } else {
          // no matching category slug, return empty result
          console.log('No matching category slug:', category);
          return res.status(200).json([]);
        }
      }
      console.log('Filtering by category param:', category); // Debug log
    }
    if (subcategory) {
      query.subcategory = subcategory;
    }
    console.log('Query:', query); // Debug log
    const products = await Product.find(query).populate('category');
    res.status(200).json(products);
  } catch (error) {
    console.error('Error in getProducts:', error); // Debug log
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

// Create a new product
const createProduct = async (req, res) => {
  const { name, description, price, category, subcategory, condition, stock, address, city, state, zipCode } = req.body;

  try {
    // Upload images to Cloudinary
    const imageUrls = req.files.map((file) => {
      if (process.env.USE_LOCAL_STORAGE === 'true') {
        // file.filename set by multer.diskStorage
        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      }
      return file.path;
    });

    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory,
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
  const { id } = req.params;
  const { name, description, price, category, subcategory, condition, stock, address, city, state, zipCode } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.subcategory = subcategory || product.subcategory;
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