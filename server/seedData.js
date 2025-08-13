import mongoose from 'mongoose';
import User from './models/User.js';
import Pet from './models/Pet.js';
import Post from './models/Post.js';
import config from './config/config.js';

// Sample users data
const sampleUsers = [
  {
    name: 'María González',
    email: 'maria@petconnect.com',
    password: '123456',
    role: 'user',
    phone: '+593 99 123 4567',
    location: {
      city: 'Quito',
      state: 'Pichincha',
      country: 'Ecuador'
    },
    bio: 'Amante de los animales y defensora de la adopción responsable. Veterinaria con 5 años de experiencia ayudando a mascotas a encontrar hogares amorosos.',
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
    phone: '+593 98 765 4321',
    location: {
      city: 'Guayaquil',
      state: 'Guayas',
      country: 'Ecuador'
    },
    bio: 'Ingeniero apasionado por los animales. Buscando dar hogar a mascotas que necesiten amor y cuidado. Experiencia con perros y gatos.',
    preferences: {
      petTypes: ['dog', 'cat', 'rabbit'],
      notifications: {
        email: true,
        push: false
      }
    },
    isVerified: true
  }
];

// Sample pets data
const samplePets = [
  // Mascotas de María González
  {
    name: 'Luna',
    type: 'dog',
    breed: 'Golden Retriever',
    age: { value: 2, unit: 'years' },
    gender: 'female',
    size: 'large',
    color: 'Dorado',
    description: 'Luna es una perrita muy cariñosa y juguetona. Le encanta pasear y jugar con otros perros. Está completamente vacunada y esterilizada. Es perfecta para familias activas que puedan darle el ejercicio que necesita.',
    images: ['/uploads/luna-1.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: true,
      isHealthy: true,
      vaccines: [
        {
          name: 'Rabia',
          date: new Date('2024-01-15'),
          nextDue: new Date('2025-01-15'),
          status: 'completed'
        },
        {
          name: 'Parvovirus',
          date: new Date('2024-01-15'),
          nextDue: new Date('2025-01-15'),
          status: 'completed'
        },
        {
          name: 'Distemper',
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
      },
      specialNeeds: 'Necesita ejercicio diario y espacio al aire libre'
    },
    location: {
      city: 'Quito',
      state: 'Pichincha',
      country: 'Ecuador'
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
    description: 'Mittens es un gato muy inteligente y curioso. Le gusta explorar y jugar con juguetes. Es muy cariñoso con su familia y se adapta bien a apartamentos.',
    images: ['/uploads/mittens-1.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: false,
      isHealthy: true,
      vaccines: [
        {
          name: 'Triple Felina',
          date: new Date('2024-02-20'),
          nextDue: new Date('2025-02-20'),
          status: 'completed'
        },
        {
          name: 'Leucemia Felina',
          date: new Date('2024-02-20'),
          nextDue: new Date('2025-02-20'),
          status: 'completed'
        }
      ]
    },
    behavior: {
      temperament: 'playful',
      goodWith: {
        children: true,
        dogs: false,
        cats: true,
        otherPets: false
      },
      specialNeeds: 'Necesita rascadores y juguetes para gatos'
    },
    location: {
      city: 'Quito',
      state: 'Pichincha',
      country: 'Ecuador'
    },
    adoptionFee: 50,
    isFeatured: true
  },
  {
    name: 'Thor',
    type: 'dog',
    breed: 'Husky Siberiano',
    age: { value: 3, unit: 'years' },
    gender: 'male',
    size: 'large',
    color: 'Gris y blanco',
    description: 'Thor es un perro muy activo y sociable. Le encanta correr y necesita mucho ejercicio. Es muy inteligente y leal. Ideal para familias deportistas.',
    images: ['/uploads/thor-1.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: true,
      isHealthy: true,
      vaccines: [
        {
          name: 'Rabia',
          date: new Date('2024-03-10'),
          nextDue: new Date('2025-03-10'),
          status: 'completed'
        },
        {
          name: 'Parvovirus',
          date: new Date('2024-03-10'),
          nextDue: new Date('2025-03-10'),
          status: 'completed'
        }
      ]
    },
    behavior: {
      temperament: 'energetic',
      goodWith: {
        children: true,
        dogs: true,
        cats: false,
        otherPets: false
      },
      specialNeeds: 'Requiere mucho ejercicio y entrenamiento'
    },
    location: {
      city: 'Quito',
      state: 'Pichincha',
      country: 'Ecuador'
    },
    adoptionFee: 100
  },
  // Mascotas de Carlos Mendoza
  {
    name: 'Rocky',
    type: 'dog',
    breed: 'Bulldog Francés',
    age: { value: 2, unit: 'years' },
    gender: 'male',
    size: 'small',
    color: 'Negro',
    description: 'Rocky es un perrito muy tranquilo y leal. Perfecto para familias con niños pequeños. Le encanta dormir en el sofá y recibir caricias.',
    images: ['/uploads/rocky-1.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: true,
      isHealthy: true,
      vaccines: [
        {
          name: 'Rabia',
          date: new Date('2024-01-30'),
          nextDue: new Date('2025-01-30'),
          status: 'completed'
        },
        {
          name: 'Parvovirus',
          date: new Date('2024-01-30'),
          nextDue: new Date('2025-01-30'),
          status: 'completed'
        }
      ]
    },
    behavior: {
      temperament: 'calm',
      goodWith: {
        children: true,
        dogs: true,
        cats: true,
        otherPets: true
      },
      specialNeeds: 'Necesita control de temperatura en días calurosos'
    },
    location: {
      city: 'Guayaquil',
      state: 'Guayas',
      country: 'Ecuador'
    },
    adoptionFee: 150
  },
  {
    name: 'Bella',
    type: 'cat',
    breed: 'Persa',
    age: { value: 4, unit: 'years' },
    gender: 'female',
    size: 'medium',
    color: 'Blanco',
    description: 'Bella es una gata elegante y tranquila. Le gusta estar en lugares tranquilos y recibir atención. Es perfecta para hogares sin mucho ruido.',
    images: ['/uploads/bella-1.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: true,
      isHealthy: true,
      vaccines: [
        {
          name: 'Triple Felina',
          date: new Date('2024-02-15'),
          nextDue: new Date('2025-02-15'),
          status: 'completed'
        }
      ]
    },
    behavior: {
      temperament: 'calm',
      goodWith: {
        children: false,
        dogs: false,
        cats: true,
        otherPets: false
      },
      specialNeeds: 'Necesita cepillado regular del pelo'
    },
    location: {
      city: 'Guayaquil',
      state: 'Guayas',
      country: 'Ecuador'
    },
    adoptionFee: 80
  },
  {
    name: 'Max',
    type: 'dog',
    breed: 'Labrador Mix',
    age: { value: 1, unit: 'years' },
    gender: 'male',
    size: 'large',
    color: 'Negro',
    description: 'Max es un cachorro muy enérgico y juguetón. Le encanta jugar con pelotas y nadar. Es muy inteligente y aprende rápido. Ideal para familias activas.',
    images: ['/uploads/max-1.jpg'],
    status: 'available',
    health: {
      isVaccinated: true,
      isSpayed: false,
      isHealthy: true,
      vaccines: [
        {
          name: 'Rabia',
          date: new Date('2024-04-05'),
          nextDue: new Date('2025-04-05'),
          status: 'completed'
        },
        {
          name: 'Parvovirus',
          date: new Date('2024-04-05'),
          nextDue: new Date('2025-04-05'),
          status: 'completed'
        }
      ]
    },
    behavior: {
      temperament: 'playful',
      goodWith: {
        children: true,
        dogs: true,
        cats: true,
        otherPets: true
      },
      specialNeeds: 'Necesita entrenamiento básico y socialización'
    },
    location: {
      city: 'Guayaquil',
      state: 'Guayas',
      country: 'Ecuador'
    },
    adoptionFee: 0
  }
];

// Sample posts data
const samplePosts = [
  {
    content: '¡Hola a todos! Soy María y estoy emocionada de ser parte de esta comunidad de amantes de mascotas. Tengo experiencia como veterinaria y me encanta ayudar a mascotas a encontrar hogares amorosos. ¡Espero poder contribuir con consejos y experiencias!',
    type: 'general',
    tags: ['adopción', 'bienvenida', 'veterinaria', 'comunidad'],
    location: {
      city: 'Quito',
      state: 'Pichincha',
      country: 'Ecuador'
    }
  },
  {
    content: 'Consejo del día: Siempre asegúrate de que tu mascota tenga agua fresca disponible, especialmente en días calurosos. En Ecuador, el clima puede ser muy variable, así que es fundamental mantener a nuestras mascotas hidratadas. 🐕💧',
    type: 'tip',
    tags: ['consejos', 'salud', 'hidratación', 'clima'],
    location: {
      city: 'Guayaquil',
      state: 'Guayas',
      country: 'Ecuador'
    }
  },
  {
    content: '¡Increíble noticia! Hoy se adoptó el perrito número 50 de nuestro refugio este año. Gracias a todos los que apoyan la adopción responsable en Ecuador. Cada mascota merece un hogar lleno de amor. 🏠❤️',
    type: 'story',
    tags: ['adopción', 'éxito', 'refugio', 'ecuador'],
    location: {
      city: 'Quito',
      state: 'Pichincha',
      country: 'Ecuador'
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
      console.log(`👤 Created user: ${user.name} (${user.email})`);
    }

    // Create pets and assign owners
    const createdPets = [];
    for (let i = 0; i < samplePets.length; i++) {
      const petData = {
        ...samplePets[i],
        owner: createdUsers[i < 3 ? 0 : 1]._id // First 3 pets to María, last 3 to Carlos
      };
      const pet = await Pet.create(petData);
      createdPets.push(pet);
      console.log(`🐾 Created pet: ${pet.name} (${pet.breed}) - Owner: ${createdUsers[i < 3 ? 0 : 1].name}`);
    }

    // Create posts and assign authors
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = {
        ...samplePosts[i],
        author: createdUsers[i % createdUsers.length]._id
      };
      const post = await Post.create(postData);
      console.log(`📝 Created post by ${createdUsers[i % createdUsers.length].name}: ${post.content.substring(0, 50)}...`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`📊 Summary:`);
    console.log(`   👤 Users: ${createdUsers.length}`);
    console.log(`   🐾 Pets: ${createdPets.length}`);
    console.log(`   📝 Posts: ${samplePosts.length}`);
    console.log('\n🔑 Credentials for testing:');
    console.log(`   María: maria@petconnect.com / 123456`);
    console.log(`   Carlos: carlos@petconnect.com / 123456`);

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase }; 