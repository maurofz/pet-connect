const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  searchUsers,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

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

module.exports = router; 