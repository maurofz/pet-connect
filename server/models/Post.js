const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El autor es requerido']
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    maxlength: [2000, 'El contenido no puede tener más de 2000 caracteres']
  },
  images: [{
    type: String
  }],
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  },
  type: {
    type: String,
    enum: ['general', 'adoption', 'story', 'tip', 'event'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true
  }],
  location: {
    city: String,
    state: String,
    country: String
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'El contenido del comentario es requerido'],
      maxlength: [500, 'El comentario no puede tener más de 500 caracteres']
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    replies: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: [true, 'El contenido de la respuesta es requerido'],
        maxlength: [300, 'La respuesta no puede tener más de 300 caracteres']
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  shares: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    content: String,
    editedAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'hidden', 'deleted'],
    default: 'active'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for like count
postSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function () {
  return this.shares.length;
});

// Virtual for total engagement
postSchema.virtual('engagement').get(function () {
  return this.likeCount + this.commentCount + this.shareCount;
});

// Virtual for time ago
postSchema.virtual('timeAgo').get(function () {
  const now = new Date();
  const diffInSeconds = Math.floor((now - this.createdAt) / 1000);

  if (diffInSeconds < 60) return 'hace un momento';
  if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
  if (diffInSeconds < 31536000) return `hace ${Math.floor(diffInSeconds / 2592000)} meses`;
  return `hace ${Math.floor(diffInSeconds / 31536000)} años`;
});

// Indexes for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ 'location.city': 1 });
postSchema.index({ isPublic: 1, status: 1 });
postSchema.index({ isPinned: 1, createdAt: -1 });

// Pre-save middleware to handle edit history
postSchema.pre('save', function (next) {
  if (this.isModified('content') && !this.isNew) {
    this.isEdited = true;
    this.editHistory.push({
      content: this.content
    });
  }
  next();
});

// Instance method to add like
postSchema.methods.addLike = function (userId) {
  const existingLike = this.likes.find(like => like.user.toString() === userId.toString());
  if (existingLike) {
    // Remove like if already exists
    this.likes = this.likes.filter(like => like.user.toString() !== userId.toString());
  } else {
    // Add like
    this.likes.push({ user: userId });
  }
  return this.save();
};

// Instance method to add comment
postSchema.methods.addComment = function (userId, content) {
  this.comments.push({
    user: userId,
    content: content
  });
  return this.save();
};

// Instance method to add reply
postSchema.methods.addReply = function (commentId, userId, content) {
  const comment = this.comments.id(commentId);
  if (!comment) {
    throw new Error('Comentario no encontrado');
  }

  comment.replies.push({
    user: userId,
    content: content
  });
  return this.save();
};

// Instance method to add share
postSchema.methods.addShare = function (userId) {
  this.shares.push({ user: userId });
  return this.save();
};

// Instance method to add view
postSchema.methods.addView = function () {
  this.views += 1;
  return this.save();
};

// Static method to find posts by author
postSchema.statics.findByAuthor = function (authorId) {
  return this.find({
    author: authorId,
    isPublic: true,
    status: 'active'
  }).populate('author', 'name avatar').populate('pet', 'name images');
};

// Static method to find posts by type
postSchema.statics.findByType = function (type) {
  return this.find({
    type: type,
    isPublic: true,
    status: 'active'
  }).populate('author', 'name avatar').populate('pet', 'name images');
};

// Static method to find trending posts
postSchema.statics.findTrending = function () {
  return this.find({
    isPublic: true,
    status: 'active'
  })
    .populate('author', 'name avatar')
    .populate('pet', 'name images')
    .sort({ engagement: -1, createdAt: -1 });
};

// Static method to find posts by tags
postSchema.statics.findByTags = function (tags) {
  return this.find({
    tags: { $in: tags },
    isPublic: true,
    status: 'active'
  }).populate('author', 'name avatar').populate('pet', 'name images');
};

module.exports = mongoose.model('Post', postSchema); 