/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - The text to convert to a slug
 * @returns {string} - The generated slug
 */
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-')      // Replace multiple - with single -
    .replace(/^-+/, '')          // Trim - from start of text
    .replace(/-+$/, '');         // Trim - from end of text
};

/**
 * Generate a unique slug for a product
 * @param {string} name - The product name
 * @param {string} existingSlug - The existing slug (for updates)
 * @param {Object} Product - The Product model
 * @returns {string} - A unique slug
 */
const generateUniqueSlug = async (name, existingSlug = null, Product) => {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Check if this slug already exists (excluding the current product if updating)
    const query = { slug: slug };
    if (existingSlug) {
      query.slug = { $ne: existingSlug, $eq: slug };
    }
    
    const existingProduct = await Product.findOne(query);
    
    if (!existingProduct) {
      return slug;
    }
    
    // If slug exists, append a number
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

module.exports = {
  generateSlug,
  generateUniqueSlug
};
