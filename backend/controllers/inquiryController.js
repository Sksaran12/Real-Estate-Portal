const Inquiry = require('../models/Inquiry');
const Property = require('../models/Property');

// @desc    Send an inquiry to property owner
// @route   POST /api/inquiries
// @access  Private
const createInquiry = async (req, res) => {
  try {
    const { propertyId, name, email, phone, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const inquiry = await Inquiry.create({
      property: propertyId,
      sender: req.user._id,
      owner: property.owner,
      name: name || req.user.name,
      email: email || req.user.email,
      phone: phone || req.user.phone,
      message,
    });

    const populated = await Inquiry.findById(inquiry._id)
      .populate('property', 'title location price images')
      .populate('sender', 'name email phone avatar');

    res.status(201).json({
      success: true,
      message: 'Inquiry sent successfully to property owner!',
      data: populated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inquiries sent by logged-in user
// @route   GET /api/inquiries/my-inquiries
// @access  Private
const getMySentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user._id })
      .populate('property', 'title location price images propertyType category')
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

// @desc    Get inquiries received for owner's properties
// @route   GET /api/inquiries/owner-inquiries
// @access  Private (Owner/Admin)
const getOwnerReceivedInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ owner: req.user._id })
      .populate('property', 'title location price images propertyType category')
      .populate('sender', 'name email phone avatar')
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

// @desc    Update inquiry status (e.g., mark contacted)
// @route   PUT /api/inquiries/:id/status
// @access  Private (Owner/Admin)
const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }

    if (inquiry.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this inquiry' });
    }

    inquiry.status = status || inquiry.status;
    await inquiry.save();

    res.json({
      success: true,
      data: inquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createInquiry,
  getMySentInquiries,
  getOwnerReceivedInquiries,
  updateInquiryStatus,
};
