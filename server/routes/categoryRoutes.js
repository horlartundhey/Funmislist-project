const express = require('express');
const { getCategories, createCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory } = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Create a new category (admin only) with image upload
router.post('/', protect, admin, upload.single('image'), createCategory);

// Update a category with optional image upload
router.put('/:id', protect, admin, upload.single('image'), updateCategory);
// Delete a category
router.delete('/:id', protect, admin, deleteCategory);

// Subcategory routes
router.post('/:id/subcategories', protect, admin, addSubcategory);
router.put('/:id/subcategories/:subId', protect, admin, updateSubcategory);
router.delete('/:id/subcategories/:subId', protect, admin, deleteSubcategory);

module.exports = router;