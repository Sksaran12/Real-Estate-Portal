const express = require('express');
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/', getProperties);
router.get('/my-listings', protect, authorize('owner', 'admin'), getMyListings);
router.get('/:id', getPropertyById);

router.post('/', protect, authorize('owner', 'admin'), upload.array('images', 5), createProperty);
router.put('/:id', protect, authorize('owner', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteProperty);

module.exports = router;
