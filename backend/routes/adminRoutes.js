const express = require('express');
const {
  getAdminStats,
  updatePropertyStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllInquiries,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect & authorize admin to all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.put('/properties/:id/status', updatePropertyStatus);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/inquiries', getAllInquiries);

module.exports = router;
