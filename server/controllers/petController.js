const Pet = require('../models/Pet');
const User = require('../models/User');

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
const getPets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const pets = await Pet.find({ status: 'available' })
      .populate('owner', 'name avatar location')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Pet.countDocuments({ status: 'available' });

    res.json({
      success: true,
      data: {
        pets,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
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

// @desc    Get pet by ID
// @route   GET /api/pets/:id
// @access  Public
const getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('owner', 'name avatar phone location')
      .populate('applications.user', 'name avatar');

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    // Add view if user is authenticated
    if (req.user) {
      await pet.addView();
    }

    res.json({
      success: true,
      data: { pet }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// @desc    Create pet
// @route   POST /api/pets
// @access  Private
const createPet = async (req, res) => {
  try {
    const {
      name,
      type,
      breed,
      age,
      gender,
      size,
      color,
      description,
      health,
      behavior,
      location,
      adoptionFee
    } = req.body;

    // Handle images from upload
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const pet = await Pet.create({
      name,
      type,
      breed,
      age,
      gender,
      size,
      color,
      description,
      images,
      owner: req.user.id,
      health,
      behavior,
      location,
      adoptionFee
    });

    await pet.populate('owner', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Mascota creada exitosamente',
      data: { pet }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
const updatePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    // Check if user owns the pet or is admin
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para actualizar esta mascota'
      });
    }

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      req.body.images = [...(pet.images || []), ...newImages];
    }

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name avatar');

    res.json({
      success: true,
      message: 'Mascota actualizada exitosamente',
      data: { pet: updatedPet }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
const deletePet = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    // Check if user owns the pet or is admin
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta mascota'
      });
    }

    await pet.remove();

    res.json({
      success: true,
      message: 'Mascota eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// @desc    Search pets
// @route   GET /api/pets/search
// @access  Public
const searchPets = async (req, res) => {
  try {
    const {
      q,
      type,
      breed,
      age,
      gender,
      size,
      city,
      minFee,
      maxFee,
      isVaccinated,
      isSpayed
    } = req.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let query = { status: 'available' };

    // Search by name or breed
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { breed: { $regex: q, $options: 'i' } }
      ];
    }

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by breed
    if (breed) {
      query.breed = { $regex: breed, $options: 'i' };
    }

    // Filter by age
    if (age) {
      const [minAge, maxAge] = age.split('-').map(Number);
      if (maxAge) {
        query['age.value'] = { $gte: minAge, $lte: maxAge };
      } else {
        query['age.value'] = { $lte: minAge };
      }
    }

    // Filter by gender
    if (gender) {
      query.gender = gender;
    }

    // Filter by size
    if (size) {
      query.size = size;
    }

    // Filter by city
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    // Filter by adoption fee
    if (minFee || maxFee) {
      query.adoptionFee = {};
      if (minFee) query.adoptionFee.$gte = Number(minFee);
      if (maxFee) query.adoptionFee.$lte = Number(maxFee);
    }

    // Filter by health status
    if (isVaccinated === 'true') {
      query['health.isVaccinated'] = true;
    }

    if (isSpayed === 'true') {
      query['health.isSpayed'] = true;
    }

    const pets = await Pet.find(query)
      .populate('owner', 'name avatar location')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Pet.countDocuments(query);

    res.json({
      success: true,
      data: {
        pets,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
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

// @desc    Get featured pets
// @route   GET /api/pets/featured
// @access  Public
const getFeaturedPets = async (req, res) => {
  try {
    const pets = await Pet.findFeatured()
      .populate('owner', 'name avatar location')
      .limit(6);

    res.json({
      success: true,
      data: { pets }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// @desc    Toggle favorite
// @route   POST /api/pets/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    await pet.toggleFavorite(req.user.id);

    res.json({
      success: true,
      message: pet.favorites.includes(req.user.id)
        ? 'Mascota agregada a favoritos'
        : 'Mascota removida de favoritos',
      data: {
        isFavorite: pet.favorites.includes(req.user.id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// @desc    Apply for adoption
// @route   POST /api/pets/:id/apply
// @access  Private
const applyForAdoption = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'El mensaje es requerido'
      });
    }

    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        message: 'Mascota no encontrada'
      });
    }

    if (pet.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: 'Esta mascota no está disponible para adopción'
      });
    }

    await pet.addApplication(req.user.id, message);

    res.json({
      success: true,
      message: 'Aplicación enviada exitosamente'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's pets
// @route   GET /api/pets/my-pets
// @access  Private
const getMyPets = async (req, res) => {
  try {
    const pets = await Pet.find({ owner: req.user.id })
      .populate('owner', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { pets }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

// @desc    Get user's favorites
// @route   GET /api/pets/favorites
// @access  Private
const getFavorites = async (req, res) => {
  try {
    const pets = await Pet.find({ favorites: req.user.id })
      .populate('owner', 'name avatar location')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: { pets }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

module.exports = {
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
}; 