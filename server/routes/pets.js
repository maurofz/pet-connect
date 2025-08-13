import express from 'express';
const router = express.Router();
import {
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
  getFavorites,
  getPetApplications,
  updateApplicationStatus,
  getMyApplications
} from '../controllers/petController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { uploadMultipleMiddleware } from '../middleware/upload.js';

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
router.get('/:id/applications', getPetApplications);
router.put('/:id/applications/:applicationId', updateApplicationStatus);
router.get('/applications/my-applications', getMyApplications);

export default router; 