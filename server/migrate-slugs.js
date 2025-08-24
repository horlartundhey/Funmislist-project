const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const { generateUniqueSlug } = require('./utils/slugify');

// Load environment variables
dotenv.config();

const addSlugsToExistingProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    // Find all products without slugs
    const products = await Product.find({ 
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    console.log(`Found ${products.length} products without slugs`);

    // Add slugs to each product
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`Processing product ${i + 1}/${products.length}: ${product.name}`);
      
      try {
        const slug = await generateUniqueSlug(product.name, null, Product);
        product.slug = slug;
        await product.save();
        console.log(`✓ Added slug "${slug}" to product "${product.name}"`);
      } catch (error) {
        console.error(`✗ Failed to add slug to product "${product.name}":`, error.message);
      }
    }

    console.log('Slug migration completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
addSlugsToExistingProducts();
