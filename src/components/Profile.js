import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [showMyPets, setShowMyPets] = useState(false);
  const [myPets, setMyPets] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  // Sample user data
  const userData = {
    "maria@petconnect.com": {
      id: "maria_gonzalez",
      name: "María González",
      avatar: "MG",
      profession: "Veterinaria",
      location: "Quito, Pichincha",
      bio: "Amante de los animales. Veterinaria en Quito con más de 5 años de experiencia ayudando a mascotas a encontrar hogares amorosos.",
      email: "maria@petconnect.com",
      phone: "+593 99 123 4567",
      isOnline: true,
      stats: {
        adoptions: 5,
        posts: 12,
        followers: 89,
        following: 45
      },
      preferences: ["Perros pequeños", "Gatos", "Cachorros", "Mascotas tranquilas"],
      myPets: [
        {
          id: "1",
          name: "Luna",
          type: "Perro",
          breed: "Labrador Mix",
          status: "available",
          description: "Luna es una perrita muy cariñosa de 2 años"
        },
        {
          id: "2",
          name: "Rocky",
          type: "Perro",
          breed: "Golden Retriever",
          status: "adoption",
          description: "Rocky es un perro muy enérgico de 3 años"
        }
      ]
    },
    "carlos@petconnect.com": {
      id: "carlos_mendoza",
      name: "Carlos Mendoza",
      avatar: "CM",
      profession: "Ingeniero",
      location: "Guayaquil, Guayas",
      bio: "Ingeniero apasionado por los animales. Buscando dar hogar a mascotas que necesiten amor y cuidado.",
      email: "carlos@petconnect.com",
      phone: "+593 98 765 4321",
      isOnline: false,
      stats: {
        adoptions: 2,
        posts: 8,
        followers: 34,
        following: 67
      },
      preferences: ["Perros medianos", "Gatos adultos", "Mascotas independientes"],
      myPets: []
    }
  };

  // Sample messages
  const sampleMessages = [
    {
      id: 1,
      from: "Dr. Veterinario",
      avatar: "DV",
      subject: "Consulta sobre Max",
      preview: "Hola María, me interesa adoptar a Max...",
      time: "2 horas",
      unread: true
    },
    {
      id: 2,
      from: "Ana López",
      avatar: "AL",
      subject: "Información sobre Luna",
      preview: "¿Luna sigue disponible para adopción?",
      time: "1 día",
      unread: false
    }
  ];

  useEffect(() => {
    // Load current user from localStorage
    const currentUserData = localStorage.getItem("currentUser");
    if (currentUserData) {
      const currentUser = JSON.parse(currentUserData);
      const userProfile = userData[currentUser.email];
      if (userProfile) {
        setUser(userProfile);
        setEditedProfile(userProfile);
        setMyPets(userProfile.myPets);
        setMessages(sampleMessages);
      }
    } else {
      // Not logged in, redirect to login
      navigate("/");
    }
  }, [navigate]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setUser(editedProfile);
    setIsEditing(false);

    // Update localStorage
    const currentUserData = localStorage.getItem("currentUser");
    if (currentUserData) {
      const currentUser = JSON.parse(currentUserData);
      currentUser.name = editedProfile.name;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }

    alert("Perfil actualizado exitosamente");
  };

  const handleCancelEdit = () => {
    setEditedProfile(user);
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleAddPet = () => {
    alert("Funcionalidad para agregar mascota en desarrollo");
  };

  const handleEditPet = (petId) => {
    alert(`Editar mascota ${petId} - Funcionalidad en desarrollo`);
  };

  const handleDeletePet = (petId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      setMyPets(prev => prev.filter(pet => pet.id !== petId));
    }
  };

  const handleMessageClick = (messageId) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, unread: false } : msg
      )
    );
    alert(`Abriendo mensaje ${messageId} - Funcionalidad en desarrollo`);
  };

  const handleSearchAdopt = () => {
    navigate("/search");
  };

  const handlePreferenceChange = (preference, action) => {
    if (action === "add") {
      const newPreference = prompt("Ingresa tu nueva preferencia:");
      if (newPreference && !editedProfile.preferences.includes(newPreference)) {
        setEditedProfile(prev => ({
          ...prev,
          preferences: [...prev.preferences, newPreference]
        }));
      }
    } else if (action === "remove") {
      setEditedProfile(prev => ({
        ...prev,
        preferences: prev.preferences.filter(p => p !== preference)
      }));
    }
  };

  if (!user) {
    return (
      <div className="phone">
        <div className="header">
          Cargando...
        </div>
        <div className="content">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="header">
        Mi Perfil
        <div className="header-icons">
          <div className="icon" onClick={handleEditProfile}>✏️</div>
          <div className="icon" onClick={handleLogout}>🚪</div>
        </div>
      </div>
      <div className="content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">{user.avatar}</div>
            <div className="profile-info">
              {isEditing ? (
                <input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    marginBottom: "5px"
                  }}
                />
              ) : (
                <h3>{user.name}</h3>
              )}
              {isEditing ? (
                <textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
                  style={{
                    fontSize: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "4px",
                    width: "100%",
                    minHeight: "40px",
                    resize: "vertical"
                  }}
                />
              ) : (
                <p>{user.bio}</p>
              )}
              <div style={{ marginTop: 5 }}>
                <span style={{ color: user.isOnline ? "#4caf50" : "#666", fontSize: 12 }}>
                  ● {user.isOnline ? "En línea" : "Desconectado"}
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div style={{ marginTop: 15, display: "flex", gap: 10 }}>
              <button className="btn-primary" onClick={handleSaveProfile} style={{ flex: 1 }}>
                Guardar
              </button>
              <button className="btn-secondary" onClick={handleCancelEdit} style={{ flex: 1 }}>
                Cancelar
              </button>
            </div>
          )}

          <div className="stats">
            <div className="stat">
              <div className="stat-number">{user.stats.adoptions}</div>
              <div className="stat-label">Adopciones</div>
            </div>
            <div className="stat">
              <div className="stat-number">{user.stats.posts}</div>
              <div className="stat-label">Publicaciones</div>
            </div>
            <div className="stat">
              <div className="stat-number">{user.stats.followers}</div>
              <div className="stat-label">Seguidores</div>
            </div>
          </div>

          <div className="preferences">
            <h4>Preferencias de Mascotas</h4>
            <div className="preference-tags">
              {editedProfile.preferences.map(preference => (
                <span
                  key={preference}
                  className="preference-tag"
                  onClick={() => isEditing && handlePreferenceChange(preference, "remove")}
                  style={{ cursor: isEditing ? "pointer" : "default" }}
                >
                  {preference} {isEditing && "×"}
                </span>
              ))}
              {isEditing && (
                <button
                  onClick={() => handlePreferenceChange(null, "add")}
                  style={{
                    background: "#e3f2fd",
                    color: "#1976d2",
                    padding: "4px 8px",
                    border: "none",
                    borderRadius: "12px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  + Agregar
                </button>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-action btn-adopt" onClick={handleSearchAdopt}>
              Buscar Adoptar
            </button>
            <button
              className="btn-action btn-message"
              onClick={() => setShowMessages(!showMessages)}
            >
              Mis Mensajes ({messages.filter(m => m.unread).length})
            </button>
          </div>
        </div>

        {showMessages && (
          <div className="profile-card">
            <h3 style={{ marginBottom: 15 }}>Mensajes Recientes</h3>
            {messages.map(message => (
              <div
                key={message.id}
                className="result-item"
                onClick={() => handleMessageClick(message.id)}
                style={{ cursor: "pointer", marginBottom: 10 }}
              >
                <div className="result-avatar">{message.avatar}</div>
                <div className="result-info">
                  <h4>{message.from}</h4>
                  <p style={{ fontWeight: message.unread ? "bold" : "normal" }}>
                    {message.subject}
                  </p>
                  <p style={{ fontSize: "11px", color: "#666" }}>
                    {message.preview}
                  </p>
                </div>
                <div style={{ marginLeft: "auto", textAlign: "right" }}>
                  <p style={{ fontSize: "11px", color: "#666" }}>{message.time}</p>
                  {message.unread && (
                    <div style={{
                      width: "8px",
                      height: "8px",
                      background: "#e74c3c",
                      borderRadius: "50%",
                      marginTop: "5px"
                    }}></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="profile-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
            <h3>Mis Mascotas</h3>
            <button
              onClick={handleAddPet}
              style={{
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                fontSize: "12px",
                cursor: "pointer"
              }}
            >
              + Agregar
            </button>
          </div>

          {myPets.length > 0 ? (
            <div>
              {myPets.map(pet => (
                <div key={pet.id} className="result-item" style={{ marginBottom: 10 }}>
                  <div className="result-avatar">{pet.name.substring(0, 2).toUpperCase()}</div>
                  <div className="result-info">
                    <h4>{pet.name}</h4>
                    <p>{pet.breed} • {pet.type}</p>
                    <p style={{ fontSize: "11px" }}>{pet.description}</p>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span
                      className="preference-tag"
                      style={{
                        background: pet.status === "available" ? "#e8f5e8" : "#f3e5f5",
                        color: pet.status === "available" ? "#4caf50" : "#9c27b0",
                        fontSize: "10px"
                      }}
                    >
                      {pet.status === "available" ? "Disponible" : "En adopción"}
                    </span>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <button
                        onClick={() => handleEditPet(pet.id)}
                        style={{
                          background: "#2196f3",
                          color: "white",
                          border: "none",
                          borderRadius: "2px",
                          padding: "2px 4px",
                          fontSize: "10px",
                          cursor: "pointer"
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeletePet(pet.id)}
                        style={{
                          background: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "2px",
                          padding: "2px 4px",
                          fontSize: "10px",
                          cursor: "pointer"
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "#666", fontSize: "14px", textAlign: "center" }}>
              No tienes mascotas registradas
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
