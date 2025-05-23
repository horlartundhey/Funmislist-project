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
  let subcategories = [];
  
  try {
    // Parse subcategories if provided
    if (req.body.subcategories) {
      subcategories = JSON.parse(req.body.subcategories);
    }

    // Check if image was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      description,
      image: req.file.path,
      subcategories,
    });
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message || 'Something went wrong while creating the category' 
    });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const image = req.file?.path;

  try {
    console.log('Updating category:', id);
    console.log('Request body:', req.body);

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Update basic fields
    category.name = name || category.name;
    category.description = description || category.description;
    if (image) category.image = image;

    // Handle subcategories update
    if (req.body.subcategories) {
      try {
        let parsedSubcategories;
        if (typeof req.body.subcategories === 'string') {
          parsedSubcategories = JSON.parse(req.body.subcategories);
        } else {
          parsedSubcategories = req.body.subcategories;
        }

        // Validate subcategories structure
        if (!Array.isArray(parsedSubcategories)) {
          throw new Error('Subcategories must be an array');
        }

        // Ensure each subcategory has required fields
        parsedSubcategories = parsedSubcategories.map(sub => ({
          name: sub.name || '',
          description: sub.description || ''
        }));

        category.subcategories = parsedSubcategories;
      } catch (error) {
        console.error('Error processing subcategories:', error);
        return res.status(400).json({ 
          message: 'Invalid subcategories format',
          error: error.message
        });
      }
    }

    console.log('Saving category with data:', category);
    const updatedCategory = await category.save();
    console.log('Category updated successfully');
    res.status(200).json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message || 'Something went wrong while updating the category'
    });
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

// Export all
module.exports = { getCategories, createCategory, updateCategory, deleteCategory };