const express = require('express');
const {
  createInquiry,
  getMySentInquiries,
  getOwnerReceivedInquiries,
  updateInquiryStatus,
} = require('../controllers/inquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createInquiry);
router.get('/my-inquiries', protect, getMySentInquiries);
router.get('/owner-inquiries', protect, authorize('owner', 'admin'), getOwnerReceivedInquiries);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateInquiryStatus);

module.exports = router;
