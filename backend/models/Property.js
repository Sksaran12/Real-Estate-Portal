const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Property title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Property description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    propertyType: {
      type: String,
      required: [true, 'Property type is required'],
      enum: ['sale', 'rent'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['apartment', 'house', 'commercial', 'villa', 'studio'],
    },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipcode: { type: String, default: '' },
    },
    bedrooms: {
      type: Number,
      required: true,
      default: 1,
    },
    bathrooms: {
      type: Number,
      required: true,
      default: 1,
    },
    areaSqFt: {
      type: Number,
      required: true,
    },
    amenities: [
      {
        type: String,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Search index for fast text searches
propertySchema.index({ title: 'text', description: 'text', 'location.city': 'text', 'location.address': 'text' });

module.exports = mongoose.model('Property', propertySchema);
