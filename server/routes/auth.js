import express from 'express';
const router = express.Router();
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  uploadAvatar,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadSingleMiddleware } from '../middleware/upload.js';

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/avatar', protect, uploadSingleMiddleware, uploadAvatar);
router.post('/logout', protect, logout);

export default router; 