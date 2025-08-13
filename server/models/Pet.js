import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la mascota es requerido'],
    trim: true,
    maxlength: [30, 'El nombre no puede tener más de 30 caracteres']
  },
  type: {
    type: String,
    required: [true, 'El tipo de mascota es requerido'],
    enum: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'],
    default: 'dog'
  },
  breed: {
    type: String,
    required: [true, 'La raza es requerida'],
    trim: true
  },
  age: {
    value: {
      type: Number,
      required: [true, 'La edad es requerida'],
      min: [0, 'La edad no puede ser negativa']
    },
    unit: {
      type: String,
      enum: ['months', 'years'],
      default: 'years'
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: [true, 'El género es requerido']
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra-large'],
    required: [true, 'El tamaño es requerido']
  },
  color: {
    type: String,
    trim: true,
    required: [true, 'El color es requerido']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres']
  },
  images: [{
    type: String,
    required: [true, 'Al menos una imagen es requerida']
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El dueño es requerido']
  },
  status: {
    type: String,
    enum: ['available', 'adopted', 'pending', 'not_available'],
    default: 'available'
  },
  health: {
    isVaccinated: {
      type: Boolean,
      default: false
    },
    isSpayed: {
      type: Boolean,
      default: false
    },
    isHealthy: {
      type: Boolean,
      default: true
    },
    medicalHistory: [{
      condition: String,
      treatment: String,
      date: Date,
      veterinarian: String
    }],
    vaccines: [{
      name: String,
      date: Date,
      nextDue: Date,
      status: {
        type: String,
        enum: ['completed', 'pending', 'overdue'],
        default: 'pending'
      }
    }]
  },
  behavior: {
    temperament: {
      type: String,
      enum: ['calm', 'energetic', 'shy', 'friendly', 'aggressive', 'playful'],
      default: 'friendly'
    },
    goodWith: {
      children: { type: Boolean, default: true },
      dogs: { type: Boolean, default: true },
      cats: { type: Boolean, default: true },
      otherPets: { type: Boolean, default: true }
    },
    specialNeeds: {
      type: String,
      maxlength: [500, 'Las necesidades especiales no pueden tener más de 500 caracteres']
    }
  },
  characteristics: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  location: {
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  adoptionFee: {
    type: Number,
    min: [0, 'La tarifa de adopción no puede ser negativa'],
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  applications: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    message: {
      type: String,
      required: [true, 'El mensaje es requerido'],
      maxlength: [1000, 'El mensaje no puede tener más de 1000 caracteres']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'withdrawn'],
      default: 'pending'
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for pet's age in years
petSchema.virtual('ageInYears').get(function () {
  if (this.age.unit === 'years') {
    return this.age.value;
  }
  return Math.round(this.age.value / 12 * 10) / 10; // Convert months to years
});

// Virtual for pet's age display
petSchema.virtual('ageDisplay').get(function () {
  if (this.age.unit === 'years') {
    return `${this.age.value} ${this.age.value === 1 ? 'año' : 'años'}`;
  }
  return `${this.age.value} ${this.age.value === 1 ? 'mes' : 'meses'}`;
});

// Virtual for application count
petSchema.virtual('applicationCount').get(function () {
  return this.applications.length;
});

// Virtual for favorite count
petSchema.virtual('favoriteCount').get(function () {
  return this.favorites.length;
});

// Indexes for better query performance
petSchema.index({ type: 1, status: 1 });
petSchema.index({ owner: 1 });
petSchema.index({ 'location.city': 1 });
petSchema.index({ isFeatured: 1 });
petSchema.index({ createdAt: -1 });

// Pre-save middleware to update reviewedAt
petSchema.pre('save', function (next) {
  if (this.isModified('applications')) {
    this.applications.forEach(app => {
      if (app.isModified('status') && app.status !== 'pending') {
        app.reviewedAt = new Date();
      }
    });
  }
  next();
});

// Instance method to add view
petSchema.methods.addView = function () {
  this.views += 1;
  return this.save();
};

// Instance method to toggle favorite
petSchema.methods.toggleFavorite = function (userId) {
  const index = this.favorites.indexOf(userId);
  if (index > -1) {
    this.favorites.splice(index, 1);
  } else {
    this.favorites.push(userId);
  }
  return this.save();
};

// Instance method to add application
petSchema.methods.addApplication = function (userId, message) {
  // Check if user already applied
  const existingApplication = this.applications.find(app => app.user.toString() === userId.toString());
  if (existingApplication) {
    throw new Error('Ya has aplicado para esta mascota');
  }

  this.applications.push({
    user: userId,
    message: message
  });
  return this.save();
};

// Static method to find available pets
petSchema.statics.findAvailable = function () {
  return this.find({ status: 'available' }).populate('owner', 'name avatar');
};

// Static method to find pets by type
petSchema.statics.findByType = function (type) {
  return this.find({ type: type, status: 'available' }).populate('owner', 'name avatar');
};

// Static method to find featured pets
petSchema.statics.findFeatured = function () {
  return this.find({ isFeatured: true, status: 'available' }).populate('owner', 'name avatar');
};

export default mongoose.model('Pet', petSchema); 