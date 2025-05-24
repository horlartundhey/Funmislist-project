const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    }
  },
  images: [
    {
      type: String,
    },
  ],
  availableTimeSlots: [
    {
      date: {
        type: Date,
        required: true,
      },
      isBooked: {
        type: Boolean,
        default: false,
      },
    },
  ],  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategory: {
    type: String,
    validate: {
      validator: async function(v) {
        if (!v) return true; // Subcategory is optional
        const category = await mongoose.model('Category').findById(this.category);
        return category && category.subcategories.some(sub => sub.name === v);
      },
      message: props => `${props.value} is not a valid subcategory for the selected category`
    },
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);