import express from 'express';
const router = express.Router();
import {
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
} from '../controllers/postController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { uploadMultipleMiddleware } from '../middleware/upload.js';

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

export default router; 