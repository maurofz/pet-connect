import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUserById,
  searchUsers,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes are protected
router.use(protect);

// Public user routes (for authenticated users)
router.get('/', getUsers);
router.get('/search', searchUsers);
router.get('/:id', getUserById);

// Admin only routes
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.get('/stats/overview', authorize('admin'), getUserStats);

export default router; 