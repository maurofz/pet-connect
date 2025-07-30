import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Sample pet data
  const petsData = {
    "1": {
      id: "1",
      name: "Max",
      breed: "Golden Retriever",
      gender: "Macho",
      age: 3,
      weight: "25 kg",
      size: "Grande",
      vaccines: "Al día",
      location: "Quito, Pichincha",
      description: "Max es un perro muy enérgico de 3 años que necesita mucho ejercicio. Le encanta jugar y buscar pelotas. Es muy sociable con otros perros y niños. Necesita una familia activa que pueda darle la atención y ejercicio que requiere.",
      vaccinesApplied: [
        { name: "Rabia", status: "completed" },
        { name: "Parvovirus", status: "completed" },
        { name: "Distemper", status: "completed" },
        { name: "Hepatitis", status: "completed" },
        { name: "Leptospirosis", status: "pending" }
      ],
      ownerId: "maria_gonzalez",
      status: "available",
      photos: ["MAX"],
      characteristics: ["Energético", "Sociable", "Juguetón", "Obediente"],
      requirements: ["Familia activa", "Espacio al aire libre", "Tiempo para ejercicio"]
    },
    "2": {
      id: "2",
      name: "Luna",
      breed: "Labrador Mix",
      gender: "Hembra",
      age: 2,
      weight: "20 kg",
      size: "Mediano",
      vaccines: "Al día",
      location: "Guayaquil, Guayas",
      description: "Luna es una perrita muy cariñosa y tranquila. Se adapta bien a diferentes ambientes y es perfecta para familias con niños pequeños. Está esterilizada y tiene todas sus vacunas al día.",
      vaccinesApplied: [
        { name: "Rabia", status: "completed" },
        { name: "Parvovirus", status: "completed" },
        { name: "Distemper", status: "completed" },
        { name: "Hepatitis", status: "completed" },
        { name: "Leptospirosis", status: "completed" }
      ],
      ownerId: "carlos_mendoza",
      status: "available",
      photos: ["LUNA"],
      characteristics: ["Cariñosa", "Tranquila", "Adaptable", "Inteligente"],
      requirements: ["Familia cariñosa", "Atención regular"]
    }
  };

  // Sample owner data
  const ownersData = {
    "maria_gonzalez": {
      id: "maria_gonzalez",
      name: "María González",
      avatar: "MG",
      profession: "Veterinaria",
      location: "Quito, Pichincha",
      phone: "+593 99 123 4567",
      email: "maria@petconnect.com",
      rating: 4.8,
      adoptions: 5,
      availableForAdoption: true
    },
    "carlos_mendoza": {
      id: "carlos_mendoza",
      name: "Carlos Mendoza",
      avatar: "CM",
      profession: "Ingeniero",
      location: "Guayaquil, Guayas",
      phone: "+593 98 765 4321",
      email: "carlos@petconnect.com",
      rating: 4.5,
      adoptions: 3,
      availableForAdoption: true
    }
  };

  useEffect(() => {
    // Load current user from localStorage
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }

    // Load pet data
    const petData = petsData[id];
    if (petData) {
      setPet(petData);
      setOwner(ownersData[petData.ownerId]);
    } else {
      // Pet not found
      alert("Mascota no encontrada");
      navigate("/search");
    }
  }, [id, navigate]);

  const handleApplyForAdoption = async () => {
    if (!currentUser) {
      alert("Debes iniciar sesión para aplicar a la adopción");
      navigate("/");
      return;
    }

    setIsApplying(true);

    // Simulate API call
    setTimeout(() => {
      setApplicationSent(true);
      setIsApplying(false);

      // Show success message
      setTimeout(() => {
        setApplicationSent(false);
      }, 3000);
    }, 2000);
  };

  const handleContactOwner = () => {
    if (!currentUser) {
      alert("Debes iniciar sesión para contactar al propietario");
      navigate("/");
      return;
    }
    setShowContactInfo(!showContactInfo);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Adopta a ${pet?.name}`,
        text: `¡Mira a ${pet?.name}! Está disponible para adopción en PetConnect.`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Enlace copiado al portapapeles");
    }
  };

  const navigateToProfile = () => {
    setShowUserMenu(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setShowUserMenu(false);
    navigate("/");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const navigateToFeed = () => {
    navigate("/feed");
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

  if (!pet || !owner) {
    return (
      <div className="phone">
        <div className="header">
          <div className="back-btn" onClick={handleBack}>‹</div>
          Cargando...
          <div className="header-icons">
            <div className="icon" onClick={navigateToFeed}>🏠</div>
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
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>Cargando información de la mascota...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="header">
        <div className="back-btn" onClick={handleBack}>‹</div>
        Detalle de Mascota
        <div className="header-icons">
          <div className="icon" onClick={handleShare}>📤</div>
          <div className="icon" onClick={navigateToFeed}>🏠</div>
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
        <div className="pet-detail">
          <div className="pet-image">{pet.photos[0]}</div>
          <div className="pet-info">
            <div className="pet-name">{pet.name}</div>
            <div className="pet-breed">{pet.breed} • {pet.gender} • {pet.age} años</div>
            <div className="pet-stats">
              <div className="pet-stat">
                <div className="pet-stat-value">{pet.weight}</div>
                <div className="pet-stat-label">Peso</div>
              </div>
              <div className="pet-stat">
                <div className="pet-stat-value">{pet.size}</div>
                <div className="pet-stat-label">Tamaño</div>
              </div>
              <div className="pet-stat">
                <div className="pet-stat-value">{pet.vaccines}</div>
                <div className="pet-stat-label">Vacunas</div>
              </div>
            </div>

            <div className="section">
              <h3>Descripción</h3>
              <p>{pet.description}</p>
            </div>

            <div className="section">
              <h3>Características</h3>
              <div className="preference-tags">
                {pet.characteristics.map(char => (
                  <span key={char} className="preference-tag">{char}</span>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Requisitos</h3>
              <div className="preference-tags">
                {pet.requirements.map(req => (
                  <span key={req} className="preference-tag" style={{ background: "#fff3e0", color: "#f57c00" }}>
                    {req}
                  </span>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Vacunas Aplicadas</h3>
              <div className="vaccines">
                {pet.vaccinesApplied.map(vaccine => (
                  <span
                    key={vaccine.name}
                    className={`vaccine-tag ${vaccine.status === "pending" ? "pending" : ""}`}
                  >
                    {vaccine.name} {vaccine.status === "pending" ? "(Pendiente)" : ""}
                  </span>
                ))}
              </div>
            </div>

            <div className="section">
              <h3>Propietario</h3>
              <div className="profile-header">
                <div className="avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                  {owner.avatar}
                </div>
                <div className="profile-info">
                  <h3 style={{ fontSize: 14 }}>{owner.name}</h3>
                  <p>{owner.profession} • ⭐ {owner.rating}</p>
                  <p style={{ color: "#4caf50", fontSize: 12 }}>
                    {owner.availableForAdoption ? "Disponible para adopción" : "No disponible"}
                  </p>
                </div>
              </div>

              {showContactInfo && (
                <div style={{ marginTop: 15, padding: 15, background: "#f8f9fa", borderRadius: 8 }}>
                  <p style={{ marginBottom: 5 }}><strong>Teléfono:</strong> {owner.phone}</p>
                  <p style={{ marginBottom: 5 }}><strong>Email:</strong> {owner.email}</p>
                  <p><strong>Ubicación:</strong> {owner.location}</p>
                </div>
              )}

              <button
                className="btn-secondary"
                onClick={handleContactOwner}
                style={{ marginTop: 10, width: "100%" }}
              >
                {showContactInfo ? "Ocultar Contacto" : "Ver Información de Contacto"}
              </button>
            </div>

            {applicationSent && (
              <div className="success-message">
                ¡Solicitud enviada! El propietario te contactará pronto.
              </div>
            )}

            <button
              className="btn-primary"
              onClick={handleApplyForAdoption}
              disabled={isApplying || !owner.availableForAdoption}
              style={{
                opacity: (isApplying || !owner.availableForAdoption) ? 0.7 : 1,
                marginTop: 10
              }}
            >
              {isApplying ? "Enviando solicitud..." : "Aplicar para Adoptar"}
            </button>

            {!owner.availableForAdoption && (
              <p style={{ textAlign: "center", color: "#f57c00", fontSize: 12, marginTop: 10 }}>
                Esta mascota ya no está disponible para adopción
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
