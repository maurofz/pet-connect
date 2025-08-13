# PetConnect - Red Social de Adopción de Mascotas

PetConnect es una aplicación web completa que conecta mascotas con familias que buscan adoptar. La aplicación incluye un backend con Node.js/Express y un frontend con React.

## 🚀 Características

- **Autenticación completa**: Registro e inicio de sesión de usuarios
- **Gestión de mascotas**: Crear, editar, buscar y gestionar mascotas para adopción
- **Sistema de posts**: Compartir historias, consejos y eventos relacionados con mascotas
- **Feed personalizado**: Contenido adaptado a las preferencias del usuario
- **Sistema de favoritos**: Guardar mascotas favoritas
- **Aplicaciones de adopción**: Sistema para aplicar a la adopción de mascotas
- **Subida de imágenes**: Soporte para múltiples imágenes por mascota y post

## 🛠️ Tecnologías Utilizadas

### Backend

- **Node.js** con **ES Modules**
- **Express.js** - Framework web
- **MongoDB** con **Mongoose** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **multer** - Manejo de archivos
- **cors** - Cross-origin resource sharing

### Frontend

- **React** - Biblioteca de interfaz de usuario
- **React Router** - Navegación
- **CSS3** - Estilos personalizados
- **Fetch API** - Comunicación con el backend

## 📋 Requisitos Previos

- **Node.js** (versión 14 o superior)
- **MongoDB** (instalado y ejecutándose localmente)
- **npm** o **yarn**

## 🔧 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd pet-connect
```

### 2. Configurar el Backend

```bash
# Navegar al directorio del servidor
cd server

# Instalar dependencias
npm install

# Crear archivo .env (opcional, usa valores por defecto)
# NODE_ENV=development
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/pet
# JWT_SECRET=pet_super_secret_key_2024
# JWT_EXPIRE=7d

# Ejecutar el servidor
npm start

# O en modo desarrollo
npm run dev
```

### 3. Configurar el Frontend

```bash
# En una nueva terminal, desde el directorio raíz
# Instalar dependencias del frontend
npm install

# Ejecutar la aplicación React
npm start
```

### 4. Poblar la base de datos (opcional)

```bash
# Desde el directorio server
npm run seed
```

## 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📱 Funcionalidades Principales

### Autenticación

- **Registro**: Crear nueva cuenta con validaciones
- **Login**: Iniciar sesión con email y contraseña
- **Credenciales Demo**: Botón para usar credenciales de prueba

### Gestión de Mascotas

- Ver todas las mascotas disponibles
- Filtrar por tipo, raza, edad, ubicación
- Ver detalles completos de cada mascota
- Aplicar para adopción
- Marcar como favoritas

### Feed Social

- Ver posts de la comunidad
- Crear nuevos posts con imágenes
- Comentar y dar like
- Feed personalizado según preferencias

### Perfil de Usuario

- Ver y editar información personal
- Cambiar contraseña
- Subir avatar
- Ver mascotas propias y favoritas

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt
- Autenticación JWT
- Validación de datos en frontend y backend
- Middleware de autorización por roles
- Manejo seguro de archivos

## 📁 Estructura del Proyecto

```
pet-connect/
├── server/                 # Backend
│   ├── config/            # Configuración
│   ├── controllers/       # Controladores de la API
│   ├── middleware/        # Middleware personalizado
│   ├── models/           # Modelos de MongoDB
│   ├── routes/           # Rutas de la API
│   ├── uploads/          # Archivos subidos
│   ├── server.js         # Servidor principal
│   └── seedData.js       # Datos de prueba
├── src/                  # Frontend React
│   ├── components/       # Componentes React
│   ├── services/         # Servicios de API
│   └── App.js           # Componente principal
└── README.md
```

## 🧪 Pruebas

### Probar la API

```bash
# Health check
curl http://localhost:5000/api/health

# Registrar usuario
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

## 🚀 Despliegue

### Backend

El servidor está configurado para ejecutarse en el puerto 5000 por defecto. Para producción:

1. Configurar variables de entorno
2. Usar un proceso manager como PM2
3. Configurar MongoDB en la nube
4. Configurar CORS para el dominio de producción

### Frontend

La aplicación React está configurada para conectarse al backend en `http://localhost:5000/api`. Para producción:

1. Cambiar la URL de la API en `src/services/api.js`
2. Construir la aplicación: `npm run build`
3. Servir los archivos estáticos

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Verifica que MongoDB esté ejecutándose
3. Revisa los logs del servidor
4. Abre un issue en el repositorio

---

**¡Gracias por usar PetConnect! 🐾**
