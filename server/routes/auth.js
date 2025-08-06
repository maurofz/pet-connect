const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
  logout
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { uploadSingleMiddleware } = require('../middleware/upload');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/avatar', protect, uploadSingleMiddleware, uploadAvatar);
router.post('/logout', protect, logout);

module.exports = router; 