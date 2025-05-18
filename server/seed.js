const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Property = require('./models/Property');

// Load environment variables
dotenv.config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection failed', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Property.deleteMany();

    console.log('Database cleared');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin user created:', adminUser.email);

    // Create categories with single image
    const categories = await Category.insertMany([
      {
        name: 'Electronics',
        description: 'Devices and gadgets',
        image: 'https://img.freepik.com/free-photo/modern-stationary-collection-arrangement_23-2149309643.jpg?semt=ais_hybrid&w=740'
      },
      {
        name: 'Furniture',
        description: 'Home and office furniture',
        image: 'https://media.furniturevillage.co.uk/i/fv/PRODADENCDSKGO-001_aden_corner-desk-storage-unit__lifestyle?$medium$&fmt=auto&fmt=auto&w=579'
      },
      {
        name: 'Apparel',
        description: 'Men and women clothing',
        image: 'https://img.freepik.com/premium-photo/clothing-accessories-men-women-ready-travel-life-style_11304-1404.jpg'
      },
      {
        name: 'Books',
        description: 'Books across various genres',
        image: 'https://basecamplive.com/wp-content/uploads/2023/02/books.jpeg'
      },
      {
        name: 'Real Estate',
        description: 'Properties and land',
        image: 'https://www.investopedia.com/thmb/bfHtdFUQrl7jJ_z-utfh8w1TMNA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/houses_and_land-5bfc3326c9e77c0051812eb3.jpg'
      },
    ]);

    console.log('Categories created:', categories.map((cat) => cat.name));
    console.log('Real Estate Category ID:', categories[4]._id.toString());

    // Create products with multiple images
    const products = await Product.insertMany([
      {
        name: 'Smartphone X',
        description: 'Latest smartphone with advanced camera and display',
        price: 999,
        category: categories[0]._id,
        condition: 'new',
        stock: 30,
        published: true,
        location: { address: '123 Tech Ave', city: 'Silicon Valley', state: 'CA', zipCode: '94043' },
        images: [
          'https://images.unsplash.com/photo-1598965402089-897ce52e8355?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1618228123700-a1c948bb2bd1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',          
        ],
        createdBy: adminUser._id,
      },
      {
        name: 'Gaming Laptop',  
        description: 'High performance laptop for gaming and streaming',
        price: 1499,
        category: categories[0]._id,
        condition: 'new',
        stock: 15,
        published: true,
        location: { address: '456 Gamer Rd', city: 'Austin', state: 'TX', zipCode: '73301' },
        images: [
          'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1627560270549-5c77fcde0ed3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1556438064-2d7646166914?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',          
        ],
        createdBy: adminUser._id,
      },
      {
        name: 'Ergonomic Office Chair',
        description: 'Comfortable chair with lumbar support',
        price: 250,
        category: categories[1]._id,
        condition: 'new',
        stock: 40,
        published: true,
        location: { address: '789 Office Pkwy', city: 'New York', state: 'NY', zipCode: '10001' },
        images: [
          'https://images.unsplash.com/photo-1572521165329-b197f9ea3da6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1558788833-5189550e2f16?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1688578735972-b61ec274df7b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',          
        ],
        createdBy: adminUser._id,
      },
      {
        name: 'Wooden Dining Table',
        description: 'Solid oak dining table seating six',
        price: 799,
        category: categories[1]._id,
        condition: 'new',
        stock: 10,
        published: true,
        location: { address: '321 Furniture Ln', city: 'Chicago', state: 'IL', zipCode: '60601' },
        images: [
          'https://images.unsplash.com/photo-1706380469091-3bd9b7865b71?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1706017965564-36d9450803e0?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',          
        ],
        createdBy: adminUser._id,
      },
      {
        name: 'Graphic T-Shirt',
        description: 'Cotton t-shirt with modern print',
        price: 29,
        category: categories[2]._id,
        condition: 'new',
        stock: 100,
        published: true,
        location: { address: '111 Fashion St', city: 'Los Angeles', state: 'CA', zipCode: '90001' },
        images: [
          'https://images.unsplash.com/photo-1621446510984-2c854aafd6c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',          
        ],
        createdBy: adminUser._id,
      },
      {
        name: 'Denim Jeans',
        description: 'Classic slim-fit jeans',
        price: 49,
        category: categories[2]._id,
        condition: 'new',
        stock: 80,
        published: true,
        location: { address: '222 Denim Blvd', city: 'San Francisco', state: 'CA', zipCode: '94102' },
        images: [
          'https://images.unsplash.com/photo-1713880442898-0f151fba5e16?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1589226849736-8d0e0c78e869?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',          
        ],
        createdBy: adminUser._id,
      },
      {
        name: 'Bestselling Novel',
        description: 'Gripping fiction novel by popular author',
        price: 19,
        category: categories[3]._id,
        condition: 'new',
        stock: 200,
        published: true,
        location: { address: '333 Book Rd', city: 'Boston', state: 'MA', zipCode: '02108' },
        images: [
          'https://images.unsplash.com/photo-1593430980369-68efc5a5eb34?q=80&w=2085&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1734171740737-cabeb3417a92?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',          
        ],
        createdBy: adminUser._id,
      },
    ]);

    console.log('Products created:', products.map((prod) => prod.name));

    // Create properties with multiple images
    const properties = await Property.insertMany([
      {
        title: 'Urban Loft',
        description: 'Modern loft in the city center with open floorplan',
        price: 650000,
        location: {
          address: '789 Market St',
          city: 'Metropolis',
          state: 'NY',
          zipCode: '10002'
        },
        images: [
          'https://img.freepik.com/premium-photo/modern-urban-loft-with-industrial-design_679964-15895.jpg',
          'https://images.unsplash.com/photo-1649429710616-dad56ce9a076?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',          
        ],
        availableTimeSlots: [
          { date: new Date('2025-05-12T09:00:00.000Z'), isBooked: false },
          { date: new Date('2025-05-14T13:00:00.000Z'), isBooked: false },
        ],
        category: categories[4]._id, // Real Estate
        createdBy: adminUser._id,
      },      
      {
        title: 'Mountain Cabin',
        description: 'Rustic cabin with stunning mountain views',
        price: 420000,
        location: {
          address: '456 Hill Rd',
          city: 'Highland',
          state: 'CO',
          zipCode: '80439'
        },
        images: [
          'https://i.lmpm.com/img/lmpm-company-store-prod/64760d663a928/properties/02f9810b-827d-4b72-9abc-e4e269727dac/mountainsideretreat(74).jpg?w=2048&h=1152&q=60',
          'https://symphony.cdn.tambourine.com/mountain-lodge-at-telluride/media/mountainlodgeattelluride-telluride-colorado-accommodations-6-bedroomcabin-livingareawithviewofmountains-64fb490456445.jpg',          
        ],
        availableTimeSlots: [
          { date: new Date('2025-05-17T09:30:00.000Z'), isBooked: false },
        ],
        category: categories[4]._id,
        createdBy: adminUser._id,
      },
    ]);

    console.log('Properties created:', properties.map((prop) => prop.title));
    console.log('First property category:', properties[0].category.toString());

    // Verify data
    const realEstateCategoryId = categories[4]._id;
    const propertiesInRealEstate = await Property.find({ category: realEstateCategoryId });
    console.log(`Found ${propertiesInRealEstate.length} properties in Real Estate category`);

    console.log('Database seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed', error.message);
    if (error.errors) {
      // Display validation errors in detail
      Object.keys(error.errors).forEach(key => {
        console.error(`- ${key}: ${error.errors[key].message}`);
      });
    }
    process.exit(1);
  }
};

// Run seeder
(async () => {
  await connectDB();
  await seedData();
})();