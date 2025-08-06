const mongoose = require('mongoose');
const User = require('./models/User');
const Pet = require('./models/Pet');
const Post = require('./models/Post');
const config = require('./config/config');

// Sample users data
const sampleUsers = [
  {
    name: 'María González',
    email: 'maria@petconnect.com',
    password: '123456',
    role: 'user',
    phone: '+34 600 123 456',
    location: {
      city: 'Madrid',
      state: 'Madrid',
      country: 'España'
    },
    bio: 'Amante de los animales y defensora de la adopción responsable.',
    preferences: {
      petTypes: ['dog', 'cat'],
      notifications: {
        email: true,
        push: true
      }
    },
    isVerified: true
  },
  {
    name: 'Carlos Mendoza',
    email: 'carlos@petconnect.com',
    password: '123456',
    role: 'user',
    phone: '+34 600 789 012',
    location: {
      city: 'Barcelona',
      state: 'Cataluña',
      country: 'España'
    },
    bio: 'Veterinario especializado en mascotas pequeñas.',
    preferences: {
      petTypes: ['dog', 'cat', 'rabbit'],
      notifications: {
        email: true,
        push: false
      }
    },
    isVerified: true
  },
  {
    name: 'Dr. Veterinario',
    email: 'dr.vet@petconnect.com',
    password: '123456',
    role: 'veterinarian',
    phone: '+34 600 345 678',
    location: {
      city: 'Valencia',
      state: 'Valencia',
      country: 'España'
    },
    bio: 'Veterinario con más de 15 años de experiencia en cuidado animal.',
    preferences: {
      petTypes: ['dog', 'cat', 'bird'],
      notifications: {
        email: true,
        push: true
      }
    },
    isVerified: true
  },
  {
    name: 'Ana López',
    email: 'ana@petconnect.com',
    password: '123456',
    role: 'user',
    phone: '+34 600 901 234',
    location: {
      city: 'Sevilla',
      state: 'Andalucía',
      country: 'España'
    },
    bio: 'Rescatista de animales y voluntaria en refugios.',
    preferences: {
      petTypes: ['dog', 'cat', 'hamster'],
      notifications: {
        email: true,
        push: true
      }
    },
    isVerified: true
  }
];

// Sample pets data
const samplePets = [
  {
    name: 'Luna',
    type: 'dog',
    breed: 'Golden Retriever',
    age: { value: 2, unit: 'years' },
    gender: 'female',
    size: 'large',
    color: 'Dorado',
    description: 'Luna es una perrita muy cariñosa y juguetona. Le encanta pasear y jugar con otros perros. Está completamente vacunada y esterilizada.',
    images: ['/uploads/dog-1.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: true,
      isHealthy: true,
      vaccines: [
        {
          name: 'Vacuna Triple',
          date: new Date('2024-01-15'),
          nextDue: new Date('2025-01-15'),
          status: 'completed'
        }
      ]
    },
    behavior: {
      temperament: 'friendly',
      goodWith: {
        children: true,
        dogs: true,
        cats: true,
        otherPets: true
      }
    },
    location: {
      city: 'Madrid',
      state: 'Madrid',
      country: 'España'
    },
    adoptionFee: 0,
    isFeatured: true
  },
  {
    name: 'Mittens',
    type: 'cat',
    breed: 'Siamés',
    age: { value: 1, unit: 'years' },
    gender: 'male',
    size: 'medium',
    color: 'Crema y marrón',
    description: 'Mittens es un gato muy inteligente y curioso. Le gusta explorar y jugar con juguetes. Es muy cariñoso con su familia.',
    images: ['/uploads/cat-1.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: false,
      isHealthy: true
    },
    behavior: {
      temperament: 'playful',
      goodWith: {
        children: true,
        dogs: false,
        cats: true,
        otherPets: false
      }
    },
    location: {
      city: 'Barcelona',
      state: 'Cataluña',
      country: 'España'
    },
    adoptionFee: 50,
    isFeatured: true
  },
  {
    name: 'Rocky',
    type: 'dog',
    breed: 'Bulldog Francés',
    age: { value: 3, unit: 'years' },
    gender: 'male',
    size: 'small',
    color: 'Negro',
    description: 'Rocky es un perrito muy tranquilo y leal. Perfecto para familias con niños pequeños. Le encanta dormir en el sofá.',
    images: ['/uploads/dog-2.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: true,
      isHealthy: true
    },
    behavior: {
      temperament: 'calm',
      goodWith: {
        children: true,
        dogs: true,
        cats: true,
        otherPets: true
      }
    },
    location: {
      city: 'Valencia',
      state: 'Valencia',
      country: 'España'
    },
    adoptionFee: 100
  }
];

// Sample posts data
const samplePosts = [
  {
    content: '¡Hola a todos! Soy nueva en PetConnect y estoy emocionada de ser parte de esta comunidad de amantes de mascotas. Mi nombre es María y tengo dos perritos rescatados. ¿Alguien más tiene experiencia con adopciones?',
    type: 'general',
    tags: ['adopción', 'bienvenida', 'comunidad'],
    location: {
      city: 'Madrid',
      state: 'Madrid',
      country: 'España'
    }
  },
  {
    content: 'Consejo del día: Siempre asegúrate de que tu mascota tenga agua fresca disponible, especialmente en días calurosos. La hidratación es fundamental para su salud. 🐕💧',
    type: 'tip',
    tags: ['consejos', 'salud', 'hidratación'],
    location: {
      city: 'Barcelona',
      state: 'Cataluña',
      country: 'España'
    }
  },
  {
    content: '¡Increíble noticia! Hoy se adoptó el perrito número 100 de nuestro refugio este año. Gracias a todos los que apoyan la adopción responsable. Cada mascota merece un hogar lleno de amor. 🏠❤️',
    type: 'story',
    tags: ['adopción', 'éxito', 'refugio'],
    location: {
      city: 'Sevilla',
      state: 'Andalucía',
      country: 'España'
    }
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing data
    await User.deleteMany({});
    await Pet.deleteMany({});
    await Post.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`👤 Created user: ${user.name}`);
    }

    // Create pets and assign owners
    const createdPets = [];
    for (let i = 0; i < samplePets.length; i++) {
      const petData = {
        ...samplePets[i],
        owner: createdUsers[i % createdUsers.length]._id
      };
      const pet = await Pet.create(petData);
      createdPets.push(pet);
      console.log(`🐾 Created pet: ${pet.name}`);
    }

    // Create posts and assign authors
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = {
        ...samplePosts[i],
        author: createdUsers[i % createdUsers.length]._id
      };
      const post = await Post.create(postData);
      console.log(`📝 Created post: ${post.content.substring(0, 50)}...`);
    }

    console.log('✅ Database seeded successfully!');
    console.log(`📊 Created ${createdUsers.length} users, ${createdPets.length} pets, and ${samplePosts.length} posts`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 