const Property = require('../models/Property');
const User = require('../models/User');
const Inquiry = require('../models/Inquiry');

// @desc    Get Admin Dashboard aggregate analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getAdminStats = async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    const pendingProperties = await Property.countDocuments({ status: 'pending' });
    const approvedProperties = await Property.countDocuments({ status: 'approved' });
    const rejectedProperties = await Property.countDocuments({ status: 'rejected' });
    const totalUsers = await User.countDocuments();
    const totalOwners = await User.countDocuments({ role: 'owner' });
    const totalInquiries = await Inquiry.countDocuments();

    res.json({
      success: true,
      data: {
        totalProperties,
        pendingProperties,
        approvedProperties,
        rejectedProperties,
        totalUsers,
        totalOwners,
        totalInquiries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject property listing
// @route   PUT /api/admin/properties/:id/status
// @access  Private (Admin)
const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    property.status = status;
    await property.save();

    const populated = await Property.findById(property._id).populate('owner', 'name email phone avatar');

    res.json({
      success: true,
      message: `Property listing status set to ${status}`,
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'owner', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Admin cannot delete their own account' });
    }

    await User.findByIdAndDelete(req.params.id);
    await Property.deleteMany({ owner: req.params.id });

    res.json({
      success: true,
      message: 'User and their listings removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all inquiries platform-wide
// @route   GET /api/admin/inquiries
// @access  Private (Admin)
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('property', 'title location price images propertyType')
      .populate('sender', 'name email phone avatar')
      .populate('owner', 'name email phone avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminStats,
  updatePropertyStatus,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllInquiries,
};
