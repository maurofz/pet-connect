# PetConnect - Red Social de Adopción de Mascotas 🐾

Una aplicación web moderna y responsive para conectar mascotas con familias amorosas.

## ✨ Características Principales

### 🎨 **Diseño Responsive**

- **Mobile First**: Optimizado para dispositivos móviles
- **Tablet**: Adaptado para pantallas medianas (768px+)
- **Desktop**: Experiencia completa en pantallas grandes (1024px+)
- **Landscape Mode**: Soporte para orientación horizontal
- **Dark Mode**: Soporte automático para modo oscuro del sistema

### 🔧 **Funcionalidades Implementadas**

#### **Feed Social** 📱

- ✅ Publicaciones dinámicas con likes, comentarios y compartir
- ✅ Búsqueda en tiempo real por contenido, tags y autores
- ✅ Creación de nuevas publicaciones con tags
- ✅ Estados de carga y mensajes informativos
- ✅ Animaciones suaves y transiciones

#### **Sistema de Autenticación** 🔐

- ✅ Login con validación de formularios
- ✅ Múltiples cuentas de demostración
- ✅ Estados de carga y manejo de errores
- ✅ Persistencia de sesión con localStorage
- ✅ Toggle de visibilidad de contraseña

#### **Búsqueda de Mascotas** 🔍

- ✅ Filtros avanzados (tipo, ubicación, edad, tamaño, género)
- ✅ Búsqueda por texto en tiempo real
- ✅ Navegación por pestañas (Todos, Perros, Gatos)
- ✅ Resultados con información detallada
- ✅ Estados de disponibilidad

#### **Perfil de Usuario** 👤

- ✅ Información editable del perfil
- ✅ Estadísticas dinámicas
- ✅ Gestión de preferencias de mascotas
- ✅ Sistema de mensajes con indicadores de no leídos
- ✅ Gestión de mascotas propias
- ✅ Funcionalidad de logout

#### **Detalle de Mascota** 🐕

- ✅ Información completa con características
- ✅ Estado de vacunas con indicadores visuales
- ✅ Información del propietario
- ✅ Solicitud de adopción
- ✅ Compartir en redes sociales
- ✅ Contacto con el propietario

## 🎨 **Paleta de Colores**

- **Primario**: `#667eea` (Azul principal)
- **Secundario**: `#764ba2` (Púrpura)
- **Éxito**: `#4caf50` (Verde)
- **Advertencia**: `#f39c12` (Naranja)
- **Error**: `#f44336` (Rojo)
- **Info**: `#2196f3` (Azul claro)

## 📱 **Responsive Breakpoints**

```css
/* Mobile First */
.phone {
  width: 100%;
  max-width: 400px;
  height: 100vh;
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .phone {
    width: 450px;
    height: 750px;
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .phone {
    width: 500px;
    height: 800px;
  }
}

/* Large Desktop (1440px+) */
@media (min-width: 1440px) {
  .phone {
    width: 550px;
    height: 850px;
  }
}
```

## 🚀 **Credenciales de Demo**

```
maria@petconnect.com / 123456
carlos@petconnect.com / 123456
dr.vet@petconnect.com / 123456
```

## 🛠️ **Tecnologías Utilizadas**

- **React 19.1.0** - Framework principal
- **React Router 6.23.1** - Navegación
- **CSS3** - Estilos y animaciones
- **LocalStorage** - Persistencia de datos
- **Web Share API** - Compartir contenido

## 🎯 **Mejoras Implementadas**

### **Diseño y UX**

- ✅ Gradientes modernos y sombras suaves
- ✅ Animaciones CSS para transiciones
- ✅ Estados hover y focus mejorados
- ✅ Iconografía consistente
- ✅ Tipografía optimizada

### **Funcionalidad**

- ✅ Estados de carga con spinners
- ✅ Manejo de errores con mensajes informativos
- ✅ Validación de formularios en tiempo real
- ✅ Navegación intuitiva con botones de regreso
- ✅ Búsqueda y filtrado avanzado

### **Responsive**

- ✅ Diseño adaptativo para todos los dispositivos
- ✅ Optimización para diferentes orientaciones
- ✅ Soporte para pantallas de alta densidad
- ✅ Modo oscuro automático
- ✅ Estilos de impresión

## 📦 **Instalación y Uso**

1. **Clonar el repositorio**

   ```bash
   git clone <repository-url>
   cd pet-connect
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**

   ```bash
   npm start
   ```

4. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🎨 **Componentes Principales**

- **Login**: Autenticación de usuarios
- **Feed**: Feed social con publicaciones
- **SearchPets**: Búsqueda y filtrado de mascotas
- **PetDetail**: Detalle completo de mascota
- **Profile**: Perfil de usuario y gestión

## 🔮 **Próximas Funcionalidades**

- [ ] Chat en tiempo real entre usuarios
- [ ] Notificaciones push
- [ ] Subida de imágenes de mascotas
- [ ] Geolocalización para búsquedas cercanas
- [ ] Sistema de calificaciones y reseñas
- [ ] Integración con redes sociales

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

**Desarrollado con ❤️ para conectar mascotas con familias amorosas**
