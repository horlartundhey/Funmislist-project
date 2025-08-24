const Product = require('../models/Product');
const mongoose = require('mongoose');
const { upload } = require('../config/cloudinary');
const Category = require('../models/Category');
const { logDebug, findSimilarStrings } = require('../utils/debugHelper');
const { generateUniqueSlug } = require('../utils/slugify');

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

// Lean endpoint for product listings (optimized for shop/listing pages)
const getProductsLean = async (req, res) => {
  try {
    const { category, subcategory, condition, searchTerm, minPrice, maxPrice, location, page = 1, limit = 20 } = req.query;
    let query = { published: true }; // Only published products for public listings

    // Build search query with weighted scoring
    const searchOptions = [];
    if (searchTerm) {
      const searchRegex = { $regex: searchTerm, $options: 'i' };
      
      // Weighted search - exact name matches score higher
      searchOptions.push(
        { name: searchRegex },
        { description: searchRegex },
        { subcategory: searchRegex }
      );
      
      // Add text search if available
      query.$or = searchOptions;
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
          return res.status(200).json({ products: [], total: 0 });
        }
      }
    }

    // Subcategory filter
    if (subcategory) {
      const subcategoryPattern = subcategory.includes('-') 
        ? subcategory.replace(/-/g, ' ') 
        : subcategory;
      query.subcategory = { $regex: new RegExp(subcategoryPattern, 'i') };
    }

    // Condition filter
    if (condition) {
      query.condition = condition;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Location filter
    if (location) {
      query.$or = [
        ...(query.$or || []),
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Lean query - only essential fields for listing
    const products = await Product.find(query)
      .select('name slug price images condition location.city category subcategory stock createdAt')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Optimize images - only return first image for listings
    const optimizedProducts = products.map(product => ({
      ...product,
      images: product.images && product.images.length > 0 ? [product.images[0]] : []
    }));

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    res.status(200).json({
      products: optimizedProducts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Advanced search with relevance scoring
const searchProducts = async (req, res) => {
  try {
    const { q: searchTerm, category, minPrice, maxPrice, condition, location, page = 1, limit = 20 } = req.query;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }

    let pipeline = [];
    
    // Match stage - basic filtering
    const matchStage = { published: true };
    
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        matchStage.category = new mongoose.Types.ObjectId(category);
      }
    }
    
    if (condition) matchStage.condition = condition;
    if (minPrice || maxPrice) {
      matchStage.price = {};
      if (minPrice) matchStage.price.$gte = Number(minPrice);
      if (maxPrice) matchStage.price.$lte = Number(maxPrice);
    }
    
    if (location) {
      matchStage.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } }
      ];
    }

    pipeline.push({ $match: matchStage });

    // Add relevance scoring
    pipeline.push({
      $addFields: {
        relevanceScore: {
          $add: [
            // Name exact match gets highest score (10 points)
            { $cond: [{ $regexMatch: { input: "$name", regex: new RegExp(`^${searchTerm}$`, 'i') } }, 10, 0] },
            // Name contains search term (5 points)
            { $cond: [{ $regexMatch: { input: "$name", regex: new RegExp(searchTerm, 'i') } }, 5, 0] },
            // Subcategory match (3 points)
            { $cond: [{ $regexMatch: { input: "$subcategory", regex: new RegExp(searchTerm, 'i') } }, 3, 0] },
            // Description contains search term (1 point)
            { $cond: [{ $regexMatch: { input: "$description", regex: new RegExp(searchTerm, 'i') } }, 1, 0] }
          ]
        }
      }
    });

    // Filter out irrelevant results (score 0)
    pipeline.push({ $match: { relevanceScore: { $gt: 0 } } });

    // Sort by relevance score (highest first), then by creation date
    pipeline.push({ $sort: { relevanceScore: -1, createdAt: -1 } });

    // Populate category
    pipeline.push({
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'category'
      }
    });

    pipeline.push({
      $unwind: { path: '$category', preserveNullAndEmptyArrays: true }
    });

    // Project only needed fields
    pipeline.push({
      $project: {
        name: 1,
        slug: 1,
        price: 1,
        images: 1,
        condition: 1,
        'location.city': 1,
        'category.name': 1,
        subcategory: 1,
        stock: 1,
        relevanceScore: 1,
        createdAt: 1
      }
    });

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: parseInt(limit) });

    const products = await Product.aggregate(pipeline);

    // Optimize images - only return first image for listings
    const optimizedProducts = products.map(product => ({
      ...product,
      images: product.images && product.images.length > 0 ? [product.images[0]] : []
    }));

    // Get total count
    const countPipeline = pipeline.slice(0, -2); // Remove skip and limit
    countPipeline.push({ $count: "total" });
    const countResult = await Product.aggregate(countPipeline);
    const total = countResult[0]?.total || 0;

    res.status(200).json({
      products: optimizedProducts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      searchTerm
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a single product by ID or slug
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    let product;
    
    // Check if the parameter is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      // Try to find by ID first
      product = await Product.findById(id).populate('category');
    }
    
    // If not found by ID or not a valid ObjectId, try to find by slug
    if (!product) {
      product = await Product.findOne({ slug: id }).populate('category');
    }
    
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
    
    // Generate unique slug from product name
    const slug = await generateUniqueSlug(name, null, Product);
    
    // Upload images to Cloudinary
    const imageUrls = req.files.map((file) => {
      if (process.env.USE_LOCAL_STORAGE === 'true') {
        // file.filename set by multer.diskStorage
        return `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
      }
      return file.path;
    });    const product = await Product.create({
      name,
      slug,
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
    const oldName = product.name;
    product.name = name || product.name;
    
    // Regenerate slug if name changed
    if (name && name !== oldName) {
      product.slug = await generateUniqueSlug(name, product.slug, Product);
    }
    
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
  getProductsLean,
  searchProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  adjustStock,
  togglePublish
};