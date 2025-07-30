import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", tags: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  // Sample data for posts
  const samplePosts = [
    {
      id: 1,
      author: "María González",
      avatar: "MG",
      timeAgo: "2 horas",
      type: "Adopción",
      content: "¡Hola! Tengo un hermoso Golden Retriever de 3 años que necesita una familia amorosa. Max es muy enérgico y le encanta jugar. ¿Alguien interesado?",
      tags: ["Adopción", "Perros", "Golden Retriever"],
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
      tags: ["Consejos", "Salud", "Alimentación"],
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
      tags: ["Encontrado", "Gatos", "Perdido"],
      likes: 12,
      comments: 8,
      shares: 5,
      authorId: "carlos_mendoza"
    }
  ];

  useEffect(() => {
    // Simulate loading posts from API
    setTimeout(() => {
      setPosts(samplePosts);
      setFilteredPosts(samplePosts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filter posts based on search term
    if (searchTerm.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchTerm, posts]);

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

  const handleSearch = () => {
    // Search functionality is handled by useEffect
    console.log("Buscando:", searchTerm);
  };

  const handleNewPost = () => {
    if (newPost.content.trim()) {
      const post = {
        id: Date.now(),
        author: "María González",
        avatar: "MG",
        timeAgo: "Ahora",
        type: "Publicación",
        content: newPost.content,
        tags: newPost.tags,
        likes: 0,
        comments: 0,
        shares: 0,
        authorId: "maria_gonzalez"
      };

      setPosts(prev => [post, ...prev]);
      setNewPost({ content: "", tags: [] });
      setShowNewPostForm(false);
    }
  };

  const addTag = (tag) => {
    if (tag && !newPost.tags.includes(tag)) {
      setNewPost(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const removeTag = (tagToRemove) => {
    setNewPost(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.header-icons')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showUserMenu]);

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
            placeholder="Buscar mascotas para adoptar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="filter-btn" onClick={handleSearch}>🔍</button>
        </div>

        {showNewPostForm && (
          <div className="post-card" style={{ marginBottom: 20 }}>
            <div className="post-header">
              <div className="post-avatar">MG</div>
              <div className="post-info">
                <h4>María González</h4>
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
              <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: "8px" }}>
                <button
                  onClick={() => addTag("Adopción")}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    background: "#e8f5e8",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    color: "#4caf50",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                >
                  + Adopción
                </button>
                <button
                  onClick={() => addTag("Consejos")}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    background: "#e8f5e8",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    color: "#4caf50",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                >
                  + Consejos
                </button>
                <button
                  onClick={() => addTag("Encontrado")}
                  style={{
                    padding: "6px 12px",
                    fontSize: "12px",
                    background: "#e8f5e8",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    color: "#4caf50",
                    fontWeight: "500",
                    transition: "all 0.3s ease"
                  }}
                >
                  + Encontrado
                </button>
              </div>
            </div>
            <div className="post-actions" style={{ justifyContent: "space-between", padding: "16px 20px" }}>
              <button className="btn-primary" onClick={handleNewPost} style={{ margin: 0, width: "auto", padding: "12px 24px" }}>
                Publicar
              </button>
              <button className="btn-secondary" onClick={() => setShowNewPostForm(false)} style={{ margin: 0, width: "auto", padding: "12px 24px" }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {filteredPosts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">{post.avatar}</div>
              <div className="post-info">
                <h4>{post.author}</h4>
                <p>Hace {post.timeAgo} • {post.type}</p>
              </div>
            </div>
            <div className="post-content">
              <p>{post.content}</p>
              <div className="post-tags">
                {post.tags.map(tag => (
                  <span key={tag} className="post-tag">{tag}</span>
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

        {filteredPosts.length === 0 && searchTerm && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontSize: "16px", marginBottom: "8px" }}>No se encontraron publicaciones</p>
            <p style={{ fontSize: "14px", marginBottom: "20px" }}>para "{searchTerm}"</p>
            <button
              className="btn-primary"
              onClick={() => setSearchTerm("")}
              style={{ width: "auto", padding: "12px 24px" }}
            >
              Ver todas las publicaciones
            </button>
          </div>
        )}

        {filteredPosts.length === 0 && !searchTerm && (
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
