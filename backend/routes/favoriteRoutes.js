const express = require('express');
const { getFavorites, toggleFavorite, checkFavoriteStatus } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getFavorites);
router.post('/:propertyId', protect, toggleFavorite);
router.get('/check/:propertyId', protect, checkFavoriteStatus);

module.exports = router;
