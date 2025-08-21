const express = require('express');
const { getProducts, getProductsLean, searchProducts, createProduct, updateProduct, getProductById, deleteProduct, adjustStock, togglePublish } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

// Lean products endpoint for optimized listings
router.get('/lean', getProductsLean);

// Advanced search endpoint
router.get('/search', searchProducts);

// Get all products (full data)
router.get('/', getProducts);

// Get a product by ID
router.get('/:id', getProductById);

// Create a new product (admin only)
router.post('/', protect, admin, upload.array('images', 5), createProduct);

// Update a product
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct);

// Delete a product (admin only)
router.delete('/:id', protect, admin, deleteProduct);

// Adjust stock and toggle publish status
router.post('/:id/adjust-stock', protect, adjustStock);
router.put('/:id/publish', protect, admin, togglePublish);

module.exports = router;