# PetConnect Backend API

Backend API para la aplicación PetConnect, una red social de adopción de mascotas.

## 🚀 Características

- **Autenticación JWT** con bcrypt para seguridad
- **MongoDB** con Mongoose para base de datos
- **Subida de archivos** con Multer
- **Validación de datos** con Mongoose
- **Middleware de autorización** por roles
- **API RESTful** completa
- **Manejo de errores** centralizado

## 📋 Requisitos

- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio**

```bash
cd server
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**
   Crear un archivo `.env` en la raíz del servidor:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/petconnect
JWT_SECRET=tu_secreto_jwt_super_seguro
JWT_EXPIRE=7d
```

4. **Iniciar MongoDB**
   Asegúrate de que MongoDB esté corriendo en tu máquina local:

```bash
mongod
```

5. **Poblar la base de datos con datos de ejemplo**

```bash
npm run seed
```

6. **Iniciar el servidor**

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

## 📚 Estructura del Proyecto

```
server/
├── config/
│   └── config.js          # Configuración de la aplicación
├── controllers/
│   ├── authController.js  # Controlador de autenticación
│   ├── userController.js  # Controlador de usuarios
│   ├── petController.js   # Controlador de mascotas
│   └── postController.js  # Controlador de posts
├── middleware/
│   ├── auth.js           # Middleware de autenticación
│   ├── errorHandler.js   # Manejo de errores
│   └── upload.js         # Subida de archivos
├── models/
│   ├── User.js           # Modelo de usuario
│   ├── Pet.js            # Modelo de mascota
│   └── Post.js           # Modelo de post
├── routes/
│   ├── auth.js           # Rutas de autenticación
│   ├── users.js          # Rutas de usuarios
│   ├── pets.js           # Rutas de mascotas
│   ├── posts.js          # Rutas de posts
│   └── feed.js           # Rutas del feed
├── uploads/              # Archivos subidos
├── server.js             # Archivo principal del servidor
├── seedData.js           # Datos de ejemplo
└── package.json
```

## 🔐 Autenticación

La API usa JWT (JSON Web Tokens) para autenticación.

### Headers requeridos para rutas protegidas:

```
Authorization: Bearer <token>
```

## 📡 Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener perfil actual
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/password` - Cambiar contraseña
- `POST /api/auth/avatar` - Subir avatar
- `POST /api/auth/logout` - Cerrar sesión

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `GET /api/users/search` - Buscar usuarios
- `PUT /api/users/:id` - Actualizar usuario (admin)
- `DELETE /api/users/:id` - Eliminar usuario (admin)
- `GET /api/users/stats/overview` - Estadísticas (admin)

### Mascotas

- `GET /api/pets` - Obtener todas las mascotas
- `GET /api/pets/:id` - Obtener mascota por ID
- `POST /api/pets` - Crear mascota
- `PUT /api/pets/:id` - Actualizar mascota
- `DELETE /api/pets/:id` - Eliminar mascota
- `GET /api/pets/search` - Buscar mascotas
- `GET /api/pets/featured` - Mascotas destacadas
- `POST /api/pets/:id/favorite` - Agregar/quitar favorito
- `POST /api/pets/:id/apply` - Aplicar para adopción
- `GET /api/pets/my-pets/list` - Mis mascotas
- `GET /api/pets/favorites/list` - Mis favoritos

### Posts

- `GET /api/posts` - Obtener todos los posts
- `GET /api/posts/:id` - Obtener post por ID
- `POST /api/posts` - Crear post
- `PUT /api/posts/:id` - Actualizar post
- `DELETE /api/posts/:id` - Eliminar post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/share` - Compartir post
- `POST /api/posts/:id/comments` - Agregar comentario
- `POST /api/posts/:id/comments/:commentId/replies` - Responder comentario
- `GET /api/posts/user/:userId` - Posts de usuario
- `GET /api/posts/trending` - Posts trending
- `GET /api/posts/search` - Buscar posts

### Feed

- `GET /api/feed` - Feed general
- `GET /api/feed/personalized` - Feed personalizado
- `GET /api/feed/stats` - Estadísticas del feed

### Utilidades

- `GET /api/health` - Estado del servidor

## 🗄️ Modelos de Datos

### Usuario

```javascript
{
  name: String,
  email: String (único),
  password: String (hasheado),
  avatar: String,
  role: ['user', 'admin', 'veterinarian'],
  phone: String,
  location: {
    city: String,
    state: String,
    country: String
  },
  bio: String,
  preferences: {
    petTypes: [String],
    notifications: {
      email: Boolean,
      push: Boolean
    }
  },
  isVerified: Boolean,
  isActive: Boolean,
  lastLogin: Date
}
```

### Mascota

```javascript
{
  name: String,
  type: ['dog', 'cat', 'bird', 'fish', 'rabbit', 'hamster', 'other'],
  breed: String,
  age: {
    value: Number,
    unit: ['months', 'years']
  },
  gender: ['male', 'female', 'unknown'],
  size: ['small', 'medium', 'large', 'extra-large'],
  color: String,
  description: String,
  images: [String],
  owner: ObjectId (ref: User),
  status: ['available', 'adopted', 'pending', 'not_available'],
  health: {
    isVaccinated: Boolean,
    isSpayed: Boolean,
    isHealthy: Boolean,
    medicalHistory: [Object],
    vaccines: [Object]
  },
  behavior: {
    temperament: String,
    goodWith: {
      children: Boolean,
      dogs: Boolean,
      cats: Boolean,
      otherPets: Boolean
    },
    specialNeeds: String
  },
  location: Object,
  adoptionFee: Number,
  isFeatured: Boolean,
  views: Number,
  favorites: [ObjectId],
  applications: [Object]
}
```

### Post

```javascript
{
  author: ObjectId (ref: User),
  content: String,
  images: [String],
  pet: ObjectId (ref: Pet),
  type: ['general', 'adoption', 'story', 'tip', 'event'],
  tags: [String],
  location: Object,
  likes: [Object],
  comments: [Object],
  shares: [Object],
  isPublic: Boolean,
  isPinned: Boolean,
  isEdited: Boolean,
  editHistory: [Object],
  views: Number,
  status: ['active', 'hidden', 'deleted']
}
```

## 🔧 Scripts Disponibles

- `npm start` - Iniciar servidor en producción
- `npm run dev` - Iniciar servidor en desarrollo con nodemon
- `npm run seed` - Poblar base de datos con datos de ejemplo

## 🚨 Manejo de Errores

La API devuelve errores en formato JSON:

```javascript
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles del error (solo en desarrollo)"
}
```

### Códigos de Estado HTTP

- `200` - Éxito
- `201` - Creado
- `400` - Error de validación
- `401` - No autorizado
- `403` - Prohibido
- `404` - No encontrado
- `500` - Error del servidor

## 📁 Subida de Archivos

La API soporta subida de imágenes con las siguientes características:

- **Tipos permitidos**: JPEG, PNG, GIF, WebP
- **Tamaño máximo**: 5MB por archivo
- **Máximo archivos**: 10 por petición
- **Directorio**: `/uploads/`

### Ejemplo de subida:

```javascript
const formData = new FormData();
formData.append("image", file);
formData.append("name", "Mi mascota");

fetch("/api/auth/avatar", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- JWT para autenticación
- Validación de entrada con Mongoose
- CORS configurado
- Headers de seguridad
- Rate limiting (recomendado para producción)

## 🧪 Datos de Prueba

El comando `npm run seed` crea:

- **4 usuarios** con diferentes roles
- **3 mascotas** de ejemplo
- **3 posts** de ejemplo

### Credenciales de prueba:

- `maria@petconnect.com` / `123456`
- `carlos@petconnect.com` / `123456`
- `dr.vet@petconnect.com` / `123456`
- `ana@petconnect.com` / `123456`

## 📝 Notas de Desarrollo

- La API está diseñada para ser escalable
- Usa patrones MVC (Model-View-Controller)
- Implementa soft delete para usuarios y posts
- Soporta paginación en todas las listas
- Incluye búsqueda y filtros avanzados
- Optimizada para consultas con índices de MongoDB

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
