const Favorite = require('../models/Favorite');
const Property = require('../models/Property');

// @desc    Get all user saved favorites
// @route   GET /api/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email phone avatar' },
      })
      .sort({ createdAt: -1 });

    const properties = favorites.map((fav) => fav.property).filter(Boolean);

    res.json({
      success: true,
      count: properties.length,
      data: properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle save/unsave a property
// @route   POST /api/favorites/:propertyId
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const propertyExists = await Property.findById(propertyId);
    if (!propertyExists) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const existingFav = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    if (existingFav) {
      await Favorite.findByIdAndDelete(existingFav._id);
      return res.json({
        success: true,
        isFavorite: false,
        message: 'Property removed from favorites',
      });
    } else {
      await Favorite.create({
        user: req.user._id,
        property: propertyId,
      });
      return res.json({
        success: true,
        isFavorite: true,
        message: 'Property saved to favorites',
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check if property is in user's favorites
// @route   GET /api/favorites/check/:propertyId
// @access  Private
const checkFavoriteStatus = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const favorite = await Favorite.findOne({
      user: req.user._id,
      property: propertyId,
    });

    res.json({
      success: true,
      isFavorite: !!favorite,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getFavorites,
  toggleFavorite,
  checkFavoriteStatus,
};
