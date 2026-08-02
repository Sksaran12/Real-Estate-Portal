const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  sendOtp,
  resetPasswordWithOtp,
  loginWithOtp,
  getMe,
  updateProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validateMiddleware');

const router = express.Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['user', 'owner']).withMessage('Role must be user or owner'),
];

const loginValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const sendOtpValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const resetPasswordOtpValidation = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('otp').trim().notEmpty().withMessage('6-Digit OTP code is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

router.post('/register', validate(registerValidation), registerUser);
router.post('/login', validate(loginValidation), loginUser);
router.post('/send-otp', validate(sendOtpValidation), sendOtp);
router.post('/reset-password-otp', validate(resetPasswordOtpValidation), resetPasswordWithOtp);
router.post('/login-otp', loginWithOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;
