const express = require('express');
const { generateDescription, aiChatAssistant } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate-description', protect, generateDescription);
router.post('/chat', aiChatAssistant);

module.exports = router;
