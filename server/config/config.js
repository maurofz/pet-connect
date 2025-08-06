module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/pet',
  JWT_SECRET: process.env.JWT_SECRET || 'pet_super_secret_key_2024',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  UPLOAD_PATH: 'uploads/',
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}; 