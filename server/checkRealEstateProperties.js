// checkRealEstateProperties.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Category = require('./models/Category');
const Property = require('./models/Property');

const main = async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const realEstateCategory = await Category.findOne({ name: /real estate/i });
  if (!realEstateCategory) {
    console.log('No "real estate" category found.');
    process.exit(0);
  }

  const properties = await Property.find({ category: realEstateCategory._id });
  if (properties.length === 0) {
    console.log('No properties assigned to "real estate" category.');
  } else {
    console.log(`Properties in "real estate" category (${realEstateCategory._id}):`);
    properties.forEach((prop) => {
      console.log(`- ${prop.title} (ID: ${prop._id})`);
    });
  }

  mongoose.disconnect();
};

main();