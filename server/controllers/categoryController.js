const Category = require('../models/Category');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  const { name, description } = req.body;
  const image = req.file?.path; // file uploaded via multer/cloudinary

  try {
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({ name, description, image });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const image = req.file?.path;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update fields
    category.name = name || category.name;
    category.description = description || category.description;
    if (image) category.image = image;

    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    await category.remove();
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a subcategory to a category
const addSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    category.subcategories.push({ name });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { id, subId } = req.params;
    const { name } = req.body;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const sub = category.subcategories.id(subId);
    if (!sub) return res.status(404).json({ message: 'Subcategory not found' });
    sub.name = name || sub.name;
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const { id, subId } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    category.subcategories.id(subId).remove();
    await category.save();
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Export all
module.exports = { getCategories, createCategory, updateCategory, deleteCategory, addSubcategory, updateSubcategory, deleteSubcategory };