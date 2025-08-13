import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", tags: [] });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTagInput, setShowTagInput] = useState(false);
  const [showPostMenu, setShowPostMenu] = useState(null);
  const [customTag, setCustomTag] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState("");
  const navigate = useNavigate();

  // Available tags for posts
  const availableTags = [
    // Categorías principales
    { value: "Adopción", label: "Adopción", category: "main" },
    { value: "Consejos", label: "Consejos", category: "main" },
    { value: "Encontrado", label: "Encontrado", category: "main" },
    { value: "Perdido", label: "Perdido", category: "main" },
    { value: "Eventos", label: "Eventos", category: "main" },
    { value: "Historia", label: "Historia", category: "main" },

    // Tipos de mascotas
    { value: "Perros", label: "Perros", category: "pets" },
    { value: "Gatos", label: "Gatos", category: "pets" },
    { value: "Aves", label: "Aves", category: "pets" },
    { value: "Peces", label: "Peces", category: "pets" },
    { value: "Conejos", label: "Conejos", category: "pets" },
    { value: "Hamsters", label: "Hamsters", category: "pets" },
    { value: "Otros", label: "Otros", category: "pets" },

    // Razas populares
    { value: "Golden Retriever", label: "Golden Retriever", category: "breeds" },
    { value: "Labrador", label: "Labrador", category: "breeds" },
    { value: "Bulldog", label: "Bulldog", category: "breeds" },
    { value: "Pastor Alemán", label: "Pastor Alemán", category: "breeds" },
    { value: "Poodle", label: "Poodle", category: "breeds" },
    { value: "Siamés", label: "Siamés", category: "breeds" },
    { value: "Persa", label: "Persa", category: "breeds" },
    { value: "Mestizo", label: "Mestizo", category: "breeds" },

    // Temas de salud y cuidado
    { value: "Salud", label: "Salud", category: "care" },
    { value: "Alimentación", label: "Alimentación", category: "care" },
    { value: "Vacunas", label: "Vacunas", category: "care" },
    { value: "Esterilización", label: "Esterilización", category: "care" },
    { value: "Entrenamiento", label: "Entrenamiento", category: "care" },
    { value: "Ejercicio", label: "Ejercicio", category: "care" },
    { value: "Grooming", label: "Grooming", category: "care" },

    // Ubicaciones
    { value: "Quito", label: "Quito", category: "location" },
    { value: "Guayaquil", label: "Guayaquil", category: "location" },
    { value: "Cuenca", label: "Cuenca", category: "location" },
    { value: "Portoviejo", label: "Portoviejo", category: "location" },
    { value: "Manta", label: "Manta", category: "location" },
    { value: "Ambato", label: "Ambato", category: "location" },
    { value: "Loja", label: "Loja", category: "location" },

    // Estados y edades
    { value: "Cachorro", label: "Cachorro", category: "status" },
    { value: "Adulto", label: "Adulto", category: "status" },
    { value: "Senior", label: "Senior", category: "status" },
    { value: "Urgente", label: "Urgente", category: "status" },
    { value: "Disponible", label: "Disponible", category: "status" },
    { value: "Adoptado", label: "Adoptado", category: "status" },

    // Emociones y sentimientos
    { value: "Feliz", label: "Feliz", category: "emotions" },
    { value: "Triste", label: "Triste", category: "emotions" },
    { value: "Gracioso", label: "Gracioso", category: "emotions" },
    { value: "Heroico", label: "Heroico", category: "emotions" },
    { value: "Inspirador", label: "Inspirador", category: "emotions" },
    { value: "Conmovedor", label: "Conmovedor", category: "emotions" }
  ];

  // Sample data for posts
  const samplePosts = [
    {
      id: 1,
      author: "María González",
      avatar: "MG",
      timeAgo: "2 horas",
      type: "Adopción",
      content: "¡Hola! Tengo un hermoso Golden Retriever de 3 años que necesita una familia amorosa. Max es muy enérgico y le encanta jugar. ¿Alguien interesado?",
      tags: ["Adopción", "Perros", "Golden Retriever", "Adulto", "Disponible"],
      likes: 5,
      comments: 12,
      shares: 3,
      authorId: "maria_gonzalez"
    },
    {
      id: 2,
      author: "Dr. Veterinario",
      avatar: "DV",
      timeAgo: "5 horas",
      type: "Consejos de Alimentación",
      content: "Consejo del día: La alimentación es fundamental para la salud de tu mascota. Asegúrate de darle comida de calidad y en las porciones correctas según su edad y peso.",
      tags: ["Consejos", "Salud", "Alimentación", "Perros", "Gatos"],
      likes: 8,
      comments: 15,
      shares: 2,
      authorId: "dr_veterinario"
    },
    {
      id: 3,
      author: "Carlos Mendoza",
      avatar: "CM",
      timeAgo: "1 día",
      type: "Encontrado",
      content: "Encontré este gatito en el parque central. Parece perdido y tiene un collar azul. Si es tuyo, contáctame urgentemente.",
      tags: ["Encontrado", "Gatos", "Perdido", "Urgente", "Quito"],
      likes: 12,
      comments: 8,
      shares: 5,
      authorId: "carlos_mendoza"
    }
  ];

  useEffect(() => {
    loadCurrentUser();
    loadPosts();
  }, []);

  const loadCurrentUser = () => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  };

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.posts.getAll();
      const apiPosts = response.data.posts.map(post => ({
        id: post._id,
        author: post.author.name,
        avatar: post.author.avatar || post.author.name.substring(0, 2).toUpperCase(),
        timeAgo: post.timeAgo || "hace un momento",
        type: post.type || "Publicación",
        content: post.content,
        tags: post.tags || [],
        images: post.images || [],
        likes: post.likeCount || 0,
        comments: post.commentCount || 0,
        shares: post.shareCount || 0,
        authorId: post.author._id
      }));

      setPosts(apiPosts);
      setFilteredPosts(apiPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      // Fallback to sample data if API fails
      setPosts(samplePosts);
      setFilteredPosts(samplePosts);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Filter posts based on search term and selected tag
    let filtered = posts;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected tag
    if (selectedTagFilter) {
      filtered = filtered.filter(post =>
        post.tags.includes(selectedTagFilter)
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedTagFilter, posts]);

  const handleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );

    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const handleComment = (postId) => {
    // Navigate to a comment section or open comment modal
    alert(`Comentarios para el post ${postId} - Funcionalidad en desarrollo`);
  };

  const handleShare = (postId) => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: 'PetConnect Post',
        text: 'Mira este post interesante en PetConnect',
        url: window.location.href
      });
    } else {
      alert(`Compartiendo post ${postId} - Funcionalidad en desarrollo`);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.")) {
      return;
    }

    try {
      await apiService.posts.delete(postId);

      // Remove the post from the local state
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      setFilteredPosts(prevPosts => prevPosts.filter(post => post.id !== postId));

      alert("Publicación eliminada exitosamente");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Error al eliminar la publicación: " + (error.message || "Error desconocido"));
    }
  };

  const handleSearch = () => {
    // Search functionality is handled by useEffect
    console.log("Buscando:", searchTerm);
  };

  const handleNewPost = async () => {
    if (!newPost.content.trim()) {
      alert("Por favor escribe algo para publicar");
      return;
    }

    try {
      const postData = {
        content: newPost.content,
        tags: newPost.tags.join(','),
        type: 'general'
      };

      const response = await apiService.posts.create(postData, selectedFiles);
      const createdPost = response.data.post;

      // Add the new post to the list
      const postWithFormattedData = {
        id: createdPost._id,
        author: createdPost.author.name,
        avatar: createdPost.author.avatar || createdPost.author.name.substring(0, 2).toUpperCase(),
        timeAgo: "Ahora",
        type: "Publicación",
        content: createdPost.content,
        tags: createdPost.tags,
        images: createdPost.images,
        likes: createdPost.likeCount || 0,
        comments: createdPost.commentCount || 0,
        shares: createdPost.shareCount || 0,
        authorId: createdPost.author._id
      };

      setPosts(prev => [postWithFormattedData, ...prev]);
      setNewPost({ content: "", tags: [] });
      setSelectedFiles([]);
      setPreviewImages([]);
      setShowNewPostForm(false);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Error al crear la publicación: " + (error.message || "Error desconocido"));
    }
  };

  const addTag = (tag) => {
    if (tag && !newPost.tags.includes(tag)) {
      setNewPost(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !newPost.tags.includes(customTag.trim())) {
      addTag(customTag.trim());
      setCustomTag("");
      setShowTagInput(false);
    }
  };

  const removeTag = (tagToRemove) => {
    setNewPost(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length + previewImages.length > 5) {
      alert("Máximo 5 imágenes permitidas");
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);

    // Create previews for new images
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const selectTagFilter = (tag) => {
    setSelectedTagFilter(selectedTagFilter === tag ? "" : tag);
  };

  const clearTagFilter = () => {
    setSelectedTagFilter("");
  };

  const navigateToProfile = () => {
    setShowUserMenu(false);
    navigate("/profile");
  };

  const navigateToSearch = () => navigate("/search");

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setShowUserMenu(false);
    navigate("/");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const togglePostMenu = (postId) => {
    setShowPostMenu(showPostMenu === postId ? null : postId);
  };

  const closePostMenu = () => {
    setShowPostMenu(null);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.header-icons')) {
        setShowUserMenu(false);
      }
      if (showPostMenu && !event.target.closest('.post-menu-container')) {
        setShowPostMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu, showPostMenu]);

  // Group tags by category
  const groupedTags = availableTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {});

  const categoryLabels = {
    main: "Categorías",
    pets: "Tipos de Mascotas",
    breeds: "Razas",
    care: "Cuidado y Salud",
    location: "Ubicaciones",
    status: "Estados",
    emotions: "Emociones"
  };

  if (isLoading) {
    return (
      <div className="phone">
        <div className="header">
          Feed Principal
          <div className="header-icons">
            <div className="icon">🔍</div>
            <div className="icon">➕</div>
            <div className="icon" onClick={toggleUserMenu}>👤</div>
          </div>
          {showUserMenu && (
            <div className="user-menu">
              <div className="user-menu-item" onClick={navigateToProfile}>
                <span>👤</span>
                Mi Perfil
              </div>
              <div className="user-menu-item" onClick={handleLogout}>
                <span>🚪</span>
                Cerrar Sesión
              </div>
            </div>
          )}
        </div>
        <div className="content">
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            flexDirection: "column",
            gap: "16px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #667eea",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <p style={{ color: "#666", fontSize: "14px" }}>Cargando publicaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="header">
        Feed Principal
        <div className="header-icons">
          <div className="icon" onClick={navigateToSearch}>🔍</div>
          <div className="icon" onClick={() => setShowNewPostForm(true)}>➕</div>
          <div className="icon" onClick={toggleUserMenu}>👤</div>
        </div>
        {showUserMenu && (
          <div className="user-menu">
            <div className="user-menu-item" onClick={navigateToProfile}>
              <span>👤</span>
              Mi Perfil
            </div>
            <div className="user-menu-item" onClick={handleLogout}>
              <span>🚪</span>
              Cerrar Sesión
            </div>
          </div>
        )}
      </div>
      <div className="content">
        <div className="feed-actions">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar publicaciones, etiquetas, usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-btn" onClick={handleSearch}>🔍</button>
        </div>

        {/* Tag Filter Bar */}
        <div style={{
          marginBottom: "16px",
          padding: "12px",
          background: "#f8f9fa",
          borderRadius: "12px",
          border: "1px solid #e9ecef"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px"
          }}>
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>
              Filtrar por etiquetas:
            </span>
            {selectedTagFilter && (
              <button
                onClick={clearTagFilter}
                style={{
                  background: "#f44336",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  cursor: "pointer"
                }}
              >
                Limpiar filtro
              </button>
            )}
          </div>

          {selectedTagFilter && (
            <div style={{ marginBottom: "8px" }}>
              <span style={{
                background: "#667eea",
                color: "white",
                padding: "4px 8px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "500"
              }}>
                {selectedTagFilter}
              </span>
            </div>
          )}

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            maxHeight: "80px",
            overflowY: "auto"
          }}>
            {availableTags.slice(0, 10).map(tag => (
              <button
                key={tag.value}
                onClick={() => selectTagFilter(tag.value)}
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  background: selectedTagFilter === tag.value ? "#667eea" : "#e9ecef",
                  color: selectedTagFilter === tag.value ? "white" : "#495057",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {showNewPostForm && (
          <div className="post-card" style={{ marginBottom: 20 }}>
            <div className="post-header">
              <div className="post-avatar">
                {currentUser?.avatar && currentUser.avatar.startsWith('/uploads/') ? (
                  <img
                    src={`http://localhost:5000${currentUser.avatar}`}
                    alt={currentUser.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  currentUser?.name?.substring(0, 2).toUpperCase() || "MG"
                )}
              </div>
              <div className="post-info">
                <h4>{currentUser?.name || "María González"}</h4>
                <p>Nueva publicación</p>
              </div>
            </div>
            <div className="post-content">
              <textarea
                placeholder="¿Qué quieres compartir?"
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                style={{
                  width: "100%",
                  minHeight: "100px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "12px",
                  padding: "16px",
                  resize: "vertical",
                  fontSize: "15px",
                  fontFamily: "inherit",
                  transition: "all 0.3s ease"
                }}
              />

              {/* Image Upload Section */}
              <div style={{ marginTop: "16px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>
                    Imágenes ({previewImages.length}/5):
                  </span>
                  {previewImages.length < 5 && (
                    <label
                      style={{
                        padding: "6px 12px",
                        background: "#667eea",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      📷 Agregar Imágenes
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        style={{ display: "none" }}
                      />
                    </label>
                  )}
                </div>

                {/* Image Previews */}
                {previewImages.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                    gap: "8px",
                    marginBottom: "12px"
                  }}>
                    {previewImages.map((image, index) => (
                      <div key={index} style={{ position: "relative" }}>
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "80px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            border: "2px solid #e0e0e0"
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          style={{
                            position: "absolute",
                            top: "-5px",
                            right: "-5px",
                            background: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "20px",
                            height: "20px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Tags */}
              <div className="post-tags" style={{ marginTop: "12px" }}>
                {newPost.tags.map(tag => (
                  <span
                    key={tag}
                    className="post-tag"
                    onClick={() => removeTag(tag)}
                    style={{ cursor: "pointer" }}
                  >
                    {tag} ×
                  </span>
                ))}
              </div>

              {/* Custom Tag Input */}
              {showTagInput && (
                <div style={{
                  marginTop: "12px",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center"
                }}>
                  <input
                    type="text"
                    placeholder="Escribe tu etiqueta personalizada..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomTag()}
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "14px"
                    }}
                  />
                  <button
                    onClick={addCustomTag}
                    style={{
                      padding: "8px 12px",
                      background: "#4caf50",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Agregar
                  </button>
                  <button
                    onClick={() => {
                      setShowTagInput(false);
                      setCustomTag("");
                    }}
                    style={{
                      padding: "8px 12px",
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              )}

              {/* Available Tags by Category */}
              <div style={{ marginTop: "16px" }}>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px"
                }}>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#333" }}>
                    Etiquetas disponibles:
                  </span>
                  <button
                    onClick={() => setShowTagInput(true)}
                    style={{
                      padding: "4px 8px",
                      background: "#667eea",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "11px"
                    }}
                  >
                    + Personalizada
                  </button>
                </div>

                {Object.entries(groupedTags).map(([category, tags]) => (
                  <div key={category} style={{ marginBottom: "12px" }}>
                    <div style={{
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#666",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      {categoryLabels[category]}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {tags.slice(0, 6).map(tag => (
                        <button
                          key={tag.value}
                          onClick={() => addTag(tag.value)}
                          disabled={newPost.tags.includes(tag.value)}
                          style={{
                            padding: "4px 8px",
                            fontSize: "11px",
                            background: newPost.tags.includes(tag.value) ? "#e9ecef" : "#e8f5e8",
                            color: newPost.tags.includes(tag.value) ? "#999" : "#4caf50",
                            border: "none",
                            borderRadius: "12px",
                            cursor: newPost.tags.includes(tag.value) ? "not-allowed" : "pointer",
                            transition: "all 0.2s ease",
                            opacity: newPost.tags.includes(tag.value) ? 0.6 : 1
                          }}
                        >
                          + {tag.label}
                        </button>
                      ))}
                      {tags.length > 6 && (
                        <button
                          style={{
                            padding: "4px 8px",
                            fontSize: "11px",
                            background: "#f0f0f0",
                            color: "#666",
                            border: "none",
                            borderRadius: "12px",
                            cursor: "pointer"
                          }}
                        >
                          +{tags.length - 6} más
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="post-actions" style={{ justifyContent: "space-between", padding: "16px 20px" }}>
              <button className="btn-primary" onClick={handleNewPost} style={{ margin: 0, width: "auto", padding: "12px 24px" }}>
                Publicar
              </button>
              <button className="btn-secondary" onClick={() => {
                setShowNewPostForm(false);
                setNewPost({ content: "", tags: [] });
                setSelectedFiles([]);
                setPreviewImages([]);
              }} style={{ margin: 0, width: "auto", padding: "12px 24px" }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {filteredPosts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">
                {post.avatar && post.avatar.startsWith('/uploads/') ? (
                  <img
                    src={`http://localhost:5000${post.avatar}`}
                    alt={post.author}
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      objectFit: "cover"
                    }}
                  />
                ) : (
                  post.avatar
                )}
              </div>
              <div className="post-info">
                <h4>{post.author}</h4>
                <p>Hace {post.timeAgo} • {post.type}</p>
              </div>
              <div className="post-menu-container" style={{ position: "relative" }}>
                <button
                  onClick={() => togglePostMenu(post.id)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    color: "#666"
                  }}
                >
                  ⋯
                </button>
                {showPostMenu === post.id && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    right: "0",
                    background: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    zIndex: 1000,
                    minWidth: "120px"
                  }}>
                    {currentUser && post.authorId === currentUser._id && (
                      <button
                        onClick={() => {
                          closePostMenu();
                          handleDelete(post.id);
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "none",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          color: "#e74c3c",
                          fontSize: "14px",
                          borderBottom: "1px solid #f0f0f0"
                        }}
                        onMouseEnter={(e) => e.target.style.background = "#f8f9fa"}
                        onMouseLeave={(e) => e.target.style.background = "none"}
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                    <button
                      onClick={() => {
                        closePostMenu();
                        handleShare(post.id);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "none",
                        border: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        color: "#666",
                        fontSize: "14px"
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#f8f9fa"}
                      onMouseLeave={(e) => e.target.style.background = "none"}
                    >
                      🔄 Compartir
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="post-content">
              <p>{post.content}</p>

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: post.images.length === 1 ? "1fr" : "repeat(2, 1fr)",
                  gap: "8px",
                  marginTop: "12px"
                }}>
                  {post.images.map((image, index) => (
                    <img
                      key={index}
                      src={`http://localhost:5000${image}`}
                      alt={`Post image ${index + 1}`}
                      style={{
                        width: "100%",
                        height: post.images.length === 1 ? "200px" : "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0"
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="post-tags">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="post-tag"
                    onClick={() => selectTagFilter(tag)}
                    style={{ cursor: "pointer" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="post-actions">
              <button
                className="post-action"
                onClick={() => handleLike(post.id)}
                style={{ color: likedPosts.has(post.id) ? "#e74c3c" : "#666" }}
              >
                {likedPosts.has(post.id) ? "❤️" : "🤍"} {post.likes}
              </button>
              <button className="post-action" onClick={() => handleComment(post.id)}>
                💬 {post.comments}
              </button>
              <button className="post-action" onClick={() => handleShare(post.id)}>
                🔄 {post.shares}
              </button>
            </div>
          </div>
        ))}

        {filteredPosts.length === 0 && (searchTerm || selectedTagFilter) && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>No se encontraron publicaciones</p>
            <p style={{ fontSize: "14px", marginBottom: "20px" }}>
              {searchTerm && selectedTagFilter
                ? `para "${searchTerm}" con etiqueta "${selectedTagFilter}"`
                : searchTerm
                  ? `para "${searchTerm}"`
                  : `con etiqueta "${selectedTagFilter}"`
              }
            </p>
            <button
              className="btn-primary"
              onClick={() => {
                setSearchTerm("");
                setSelectedTagFilter("");
              }}
              style={{ width: "auto", padding: "12px 24px" }}
            >
              Ver todas las publicaciones
            </button>
          </div>
        )}

        {filteredPosts.length === 0 && !searchTerm && !selectedTagFilter && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>No hay publicaciones</p>
            <p style={{ fontSize: "14px", marginBottom: "20px" }}>¡Sé el primero en compartir algo!</p>
            <button
              className="btn-primary"
              onClick={() => setShowNewPostForm(true)}
              style={{ width: "auto", padding: "12px 24px" }}
            >
              Crear primera publicación
            </button>
          </div>
        )}

        <button className="floating-btn" onClick={() => setShowNewPostForm(true)}>➕</button>
      </div>
    </div>
  );
}
