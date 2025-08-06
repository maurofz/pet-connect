const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Pet = require('../models/Pet');
const User = require('../models/User'); // Added missing import for User

// @desc    Get combined feed (posts + featured pets)
// @route   GET /api/feed
// @access  Public
const getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get posts
    const posts = await Post.find({ isPublic: true, status: 'active' })
      .populate('author', 'name avatar')
      .populate('pet', 'name images')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get featured pets
    const featuredPets = await Pet.findFeatured()
      .populate('owner', 'name avatar location')
      .limit(3);

    // Get trending posts
    const trendingPosts = await Post.findTrending()
      .populate('author', 'name avatar')
      .populate('pet', 'name images')
      .limit(5);

    res.json({
      success: true,
      data: {
        posts,
        featuredPets,
        trendingPosts,
        pagination: {
          page,
          limit,
          total: posts.length,
          hasMore: posts.length === limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// @desc    Get personalized feed for authenticated user
// @route   GET /api/feed/personalized
// @access  Private
const getPersonalizedFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get user preferences
    const user = await User.findById(req.user.id);
    const userPreferences = user.preferences?.petTypes || [];

    // Build query based on user preferences
    let postQuery = { isPublic: true, status: 'active' };
    let petQuery = { status: 'available' };

    // If user has pet preferences, filter by pet type
    if (userPreferences.length > 0) {
      postQuery['pet.type'] = { $in: userPreferences };
      petQuery.type = { $in: userPreferences };
    }

    // Get posts matching user preferences
    const posts = await Post.find(postQuery)
      .populate('author', 'name avatar')
      .populate('pet', 'name images')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get pets matching user preferences
    const pets = await Pet.find(petQuery)
      .populate('owner', 'name avatar location')
      .limit(5);

    res.json({
      success: true,
      data: {
        posts,
        recommendedPets: pets,
        pagination: {
          page,
          limit,
          total: posts.length,
          hasMore: posts.length === limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// @desc    Get feed statistics
// @route   GET /api/feed/stats
// @access  Public
const getFeedStats = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments({ isPublic: true, status: 'active' });
    const totalPets = await Pet.countDocuments({ status: 'available' });
    const totalUsers = await User.countDocuments({ isActive: true });

    // Get recent activity
    const recentPosts = await Post.countDocuments({
      isPublic: true,
      status: 'active',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    const recentPets = await Pet.countDocuments({
      status: 'available',
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    });

    res.json({
      success: true,
      data: {
        totalPosts,
        totalPets,
        totalUsers,
        recentActivity: {
          posts: recentPosts,
          pets: recentPets
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

router.get('/', getFeed);
router.get('/personalized', require('../middleware/auth').protect, getPersonalizedFeed);
router.get('/stats', getFeedStats);

module.exports = router; 