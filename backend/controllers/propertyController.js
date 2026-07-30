const Property = require('../models/Property');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

// @desc    Get all properties with filtering, search, sorting & pagination
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const {
      search,
      location,
      city,
      minPrice,
      maxPrice,
      propertyType,
      category,
      bedrooms,
      bathrooms,
      minArea,
      maxArea,
      amenities,
      status,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = {};

    // Filter by status (Default to approved for public queries unless explicitly requested by admin/owner)
    if (status) {
      query.status = status;
    } else {
      query.status = 'approved';
    }

    // Text / Location search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
      ];
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (location) {
      query['$or'] = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.address': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
      ];
    }

    // Price filtering
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Property Type (sale / rent)
    if (propertyType && propertyType !== 'all') {
      query.propertyType = propertyType;
    }

    // Category (apartment, house, commercial, villa, studio)
    if (category && category !== 'all') {
      query.category = category;
    }

    // Bedrooms
    if (bedrooms && bedrooms !== 'all') {
      if (bedrooms === '4+') {
        query.bedrooms = { $gte: 4 };
      } else {
        query.bedrooms = Number(bedrooms);
      }
    }

    // Bathrooms
    if (bathrooms && bathrooms !== 'all') {
      query.bathrooms = Number(bathrooms);
    }

    // Area filtering
    if (minArea || maxArea) {
      query.areaSqFt = {};
      if (minArea) query.areaSqFt.$gte = Number(minArea);
      if (maxArea) query.areaSqFt.$lte = Number(maxArea);
    }

    // Amenities
    if (amenities) {
      const amenitiesList = Array.isArray(amenities) ? amenities : amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'views') sortOption = { views: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: properties.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'name email phone avatar createdAt');

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Increment views
    property.views = (property.views || 0) + 1;
    await property.save({ validateBeforeSave: false });

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Owner/Admin)
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      propertyType,
      category,
      address,
      city,
      state,
      zipcode,
      bedrooms,
      bathrooms,
      areaSqFt,
      amenities,
      images,
      featured,
    } = req.body;

    let imageUrls = [];

    // Handle files if uploaded via multipart/form-data
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }
    } else if (images && Array.isArray(images) && images.length > 0) {
      imageUrls = images;
    } else if (images && typeof images === 'string') {
      imageUrls = [images];
    } else {
      // Default high quality real estate photo fallback
      imageUrls = [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      ];
    }

    // Admins auto-approve, owners/users default to pending
    const status = req.user.role === 'admin' ? 'approved' : 'pending';

    const parsedAmenities = typeof amenities === 'string' ? amenities.split(',').map((a) => a.trim()) : amenities || [];

    const property = await Property.create({
      title,
      description,
      price: Number(price),
      propertyType,
      category,
      location: {
        address,
        city,
        state,
        zipcode: zipcode || '',
      },
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      amenities: parsedAmenities,
      images: imageUrls,
      status,
      owner: req.user._id,
      featured: req.user.role === 'admin' ? Boolean(featured) : false,
    });

    const populatedProperty = await Property.findById(property._id).populate('owner', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message: status === 'approved' ? 'Property created successfully' : 'Property submitted for admin approval',
      data: populatedProperty,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private (Owner of listing or Admin)
const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Authorization check: Must be owner or admin
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const { location, ...updateFields } = req.body;

    if (location) {
      property.location = { ...property.location, ...location };
    }

    Object.assign(property, updateFields);

    const updatedProperty = await property.save();
    const populated = await Property.findById(updatedProperty._id).populate('owner', 'name email phone avatar');

    res.json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private (Owner of listing or Admin)
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get listings owned by logged in user
// @route   GET /api/properties/my-listings
// @access  Private (Owner/Admin)
const getMyListings = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
};
