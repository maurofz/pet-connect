import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ content: "", tags: [] });
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
    setPosts(samplePosts);
    setFilteredPosts(samplePosts);
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
    alert(`Compartiendo post ${postId} - Funcionalidad en desarrollo`);
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

  const navigateToProfile = () => navigate("/profile");
  const navigateToSearch = () => navigate("/search");

  return (
    <div className="phone">
      <div className="header">
        Feed Principal
        <div className="header-icons">
          <div className="icon" onClick={navigateToSearch}>🔍</div>
          <div className="icon" onClick={() => setShowNewPostForm(true)}>➕</div>
          <div className="icon">🔔</div>
        </div>
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
                  minHeight: "80px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  padding: "10px",
                  resize: "vertical"
                }}
              />
              <div className="post-tags">
                {newPost.tags.map(tag => (
                  <span key={tag} className="post-tag" onClick={() => removeTag(tag)} style={{ cursor: "pointer" }}>
                    {tag} ×
                  </span>
                ))}
              </div>
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => addTag("Adopción")}
                  style={{ marginRight: 5, padding: "4px 8px", fontSize: "12px", background: "#e8f5e8", border: "none", borderRadius: "12px", cursor: "pointer" }}
                >
                  + Adopción
                </button>
                <button
                  onClick={() => addTag("Consejos")}
                  style={{ marginRight: 5, padding: "4px 8px", fontSize: "12px", background: "#e8f5e8", border: "none", borderRadius: "12px", cursor: "pointer" }}
                >
                  + Consejos
                </button>
                <button
                  onClick={() => addTag("Encontrado")}
                  style={{ marginRight: 5, padding: "4px 8px", fontSize: "12px", background: "#e8f5e8", border: "none", borderRadius: "12px", cursor: "pointer" }}
                >
                  + Encontrado
                </button>
              </div>
            </div>
            <div className="post-actions">
              <button className="btn-primary" onClick={handleNewPost} style={{ marginRight: 10 }}>
                Publicar
              </button>
              <button className="btn-secondary" onClick={() => setShowNewPostForm(false)}>
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
              <p style={{ marginBottom: 10 }}>{post.content}</p>
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
            <p>No se encontraron publicaciones para "{searchTerm}"</p>
            <button
              className="btn-primary"
              onClick={() => setSearchTerm("")}
              style={{ marginTop: 10 }}
            >
              Ver todas las publicaciones
            </button>
          </div>
        )}

        <button className="floating-btn" onClick={() => setShowNewPostForm(true)}>➕</button>
      </div>
    </div>
  );
}
