const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  searchPets,
  getFeaturedPets,
  toggleFavorite,
  applyForAdoption,
  getMyPets,
  getFavorites
} = require('../controllers/petController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadMultipleMiddleware } = require('../middleware/upload');

// Public routes
router.get('/', getPets);
router.get('/featured', getFeaturedPets);
router.get('/search', searchPets);
router.get('/:id', optionalAuth, getPetById);

// Protected routes
router.use(protect);

router.post('/', uploadMultipleMiddleware, createPet);
router.put('/:id', uploadMultipleMiddleware, updatePet);
router.delete('/:id', deletePet);
router.post('/:id/favorite', toggleFavorite);
router.post('/:id/apply', applyForAdoption);
router.get('/my-pets/list', getMyPets);
router.get('/favorites/list', getFavorites);

module.exports = router; 