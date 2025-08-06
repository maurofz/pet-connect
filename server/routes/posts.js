const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  addReply,
  sharePost,
  getUserPosts,
  getTrendingPosts,
  searchPosts
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadMultipleMiddleware } = require('../middleware/upload');

// Public routes
router.get('/', getPosts);
router.get('/trending', getTrendingPosts);
router.get('/search', searchPosts);
router.get('/user/:userId', getUserPosts);
router.get('/:id', optionalAuth, getPostById);

// Protected routes
router.use(protect);

router.post('/', uploadMultipleMiddleware, createPost);
router.put('/:id', uploadMultipleMiddleware, updatePost);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);
router.post('/:id/share', sharePost);
router.post('/:id/comments', addComment);
router.post('/:id/comments/:commentId/replies', addReply);

module.exports = router; 