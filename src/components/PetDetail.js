import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [owner, setOwner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [applicationSent, setApplicationSent] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [userHasApplied, setUserHasApplied] = useState(false);
  const [userApplication, setUserApplication] = useState(null);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadPetDetails();
    }
  }, [id, currentUser]);

  const loadCurrentUser = () => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  };

  const loadPetDetails = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await apiService.pets.getById(id);
      const petData = response.data.pet;
      const userHasApplied = response.data.userHasApplied || false;
      const userApplication = response.data.userApplication || null;

      // Ensure all required fields are present with defaults
      const normalizedPetData = {
        ...petData,
        age: petData.age || { value: 0, unit: 'years' },
        health: petData.health || { isVaccinated: false, isSpayed: false, isHealthy: true, vaccines: [] },
        behavior: petData.behavior || { temperament: 'friendly', goodWith: { children: true, dogs: true, cats: true, otherPets: true }, specialNeeds: '' },
        location: petData.location || { city: '', state: '', country: 'Ecuador' },
        characteristics: petData.characteristics || [],
        requirements: petData.requirements || [],
        images: petData.images || []
      };

      setPet(normalizedPetData);
      setOwner(normalizedPetData.owner);
      setUserHasApplied(userHasApplied);
      setUserApplication(userApplication);

      // Check if current user is the owner
      if (currentUser && normalizedPetData.owner) {
        setIsOwner(currentUser._id === normalizedPetData.owner._id);
      }
    } catch (error) {
      console.error("Error loading pet:", error);
      setError("Error al cargar los detalles de la mascota");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyForAdoption = async () => {
    if (!currentUser) {
      alert("Debes iniciar sesión para aplicar a la adopción");
      navigate("/");
      return;
    }

    if (!applicationMessage.trim()) {
      setError("Por favor, escribe un mensaje explicando por qué quieres adoptar esta mascota");
      return;
    }

    setIsApplying(true);
    setError("");

    try {
      await apiService.pets.applyForAdoption(id, applicationMessage);

      setApplicationSent(true);
      setShowApplicationForm(false);
      setApplicationMessage("");
      setUserHasApplied(true);

      // Show success message
      setTimeout(() => {
        setApplicationSent(false);
      }, 3000);
    } catch (error) {
      console.error("Error applying for adoption:", error);
      if (error.message.includes("Ya has aplicado")) {
        setUserHasApplied(true);
        setError("Ya has aplicado para esta mascota anteriormente");
      } else {
        setError(error.message || "Error al enviar la aplicación");
      }
    } finally {
      setIsApplying(false);
    }
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

  // Function to refresh pet data
  const refreshPetData = () => {
    loadPetDetails();
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'available': return 'Disponible para adopción';
      case 'pending': return 'En proceso de adopción';
      case 'adopted': return 'Ya adoptado';
      case 'not_available': return 'No disponible';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#4caf50';
      case 'pending': return '#ff9800';
      case 'adopted': return '#9c27b0';
      case 'not_available': return '#f44336';
      default: return '#666';
    }
  };

  if (isLoading) {
    return (
      <div className="phone">
        <div className="header">
          <div className="back-btn" onClick={handleBack}>‹</div>
          Cargando...
          <div className="header-icons">
            <div className="icon" onClick={refreshPetData} title="Refrescar datos">🔄</div>
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

  if (!pet || !owner) {
    return (
      <div className="phone">
        <div className="header">
          <div className="back-btn" onClick={handleBack}>‹</div>
          Error
          <div className="header-icons">
            <div className="icon" onClick={refreshPetData} title="Refrescar datos">🔄</div>
            <div className="icon" onClick={navigateToFeed}>🏠</div>
            <div className="icon" onClick={toggleUserMenu}>👤</div>
          </div>
        </div>
        <div className="content">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>{error || "Mascota no encontrada"}</p>
            <button className="btn-primary" onClick={() => navigate("/search")}>
              Buscar otras mascotas
            </button>
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
          <div className="icon" onClick={refreshPetData} title="Refrescar datos">🔄</div>
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
        {applicationSent && (
          <div style={{
            background: "#4caf50",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            ¡Solicitud enviada! El propietario te contactará pronto.
          </div>
        )}

        {error && (
          <div style={{
            background: "#f44336",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            {error}
          </div>
        )}

        <div className="pet-detail">
          {/* Pet Images */}
          <div className="pet-image">
            {pet.images && pet.images.length > 0 ? (
              <img
                src={`http://localhost:5000${pet.images[0]}`}
                alt={pet.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            ) : (
              <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "64px"
              }}>
                🐕
              </div>
            )}
          </div>

          <div className="pet-info">
            {/* Status Badge */}
            <div style={{
              background: getStatusColor(pet.status),
              color: "white",
              padding: "4px 12px",
              borderRadius: "12px",
              fontSize: "12px",
              fontWeight: "600",
              display: "inline-block",
              marginBottom: "16px"
            }}>
              {getStatusLabel(pet.status)}
            </div>

            <div className="pet-name">{pet.name}</div>
            <div className="pet-breed">
              {pet.breed} • {pet.gender === 'male' ? 'Macho' : 'Hembra'} • {pet.age?.value || 0} {pet.age?.unit === 'years' ? 'años' : 'meses'}
            </div>

            {/* Basic Stats */}
            <div className="pet-stats">
              <div className="pet-stat">
                <div className="pet-stat-value">{pet.size === 'small' ? 'Pequeño' : pet.size === 'medium' ? 'Mediano' : pet.size === 'large' ? 'Grande' : 'Extra Grande'}</div>
                <div className="pet-stat-label">Tamaño</div>
              </div>
              <div className="pet-stat">
                <div className="pet-stat-value">{pet.color || 'N/A'}</div>
                <div className="pet-stat-label">Color</div>
              </div>
              <div className="pet-stat">
                <div className="pet-stat-value">{pet.health?.isVaccinated ? 'Sí' : 'No'}</div>
                <div className="pet-stat-label">Vacunado</div>
              </div>
            </div>

            {/* Description */}
            <div className="section">
              <h3>Descripción</h3>
              <p>{pet.description}</p>
            </div>

            {/* Characteristics */}
            {(pet.behavior?.temperament || (pet.characteristics && pet.characteristics.length > 0)) && (
              <div className="section">
                <h3>Características</h3>
                <div className="preference-tags">
                  {pet.behavior?.temperament && (
                    <span className="preference-tag">
                      {pet.behavior.temperament === 'calm' ? 'Tranquilo' :
                        pet.behavior.temperament === 'energetic' ? 'Energético' :
                          pet.behavior.temperament === 'shy' ? 'Tímido' :
                            pet.behavior.temperament === 'friendly' ? 'Amigable' :
                              pet.behavior.temperament === 'aggressive' ? 'Agresivo' :
                                pet.behavior.temperament === 'playful' ? 'Juguetón' : pet.behavior.temperament}
                    </span>
                  )}
                  {pet.characteristics && pet.characteristics.map((characteristic, index) => (
                    <span key={index} className="preference-tag">
                      {characteristic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Good With */}
            {pet.behavior?.goodWith && (
              <div className="section">
                <h3>Se lleva bien con</h3>
                <div className="preference-tags">
                  {pet.behavior.goodWith.children && <span className="preference-tag">Niños</span>}
                  {pet.behavior.goodWith.dogs && <span className="preference-tag">Perros</span>}
                  {pet.behavior.goodWith.cats && <span className="preference-tag">Gatos</span>}
                  {pet.behavior.goodWith.otherPets && <span className="preference-tag">Otras mascotas</span>}
                </div>
              </div>
            )}

            {/* Special Needs */}
            {pet.behavior?.specialNeeds && (
              <div className="section">
                <h3>Necesidades Especiales</h3>
                <p>{pet.behavior.specialNeeds}</p>
              </div>
            )}

            {/* Requirements */}
            {pet.requirements && pet.requirements.length > 0 && (
              <div className="section">
                <h3>Requisitos para Adopción</h3>
                <div className="preference-tags">
                  {pet.requirements.map((requirement, index) => (
                    <span key={index} className="preference-tag" style={{ background: "#ff9800", color: "white" }}>
                      {requirement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Vaccines */}
            {pet.health?.vaccines && pet.health.vaccines.length > 0 && (
              <div className="section">
                <h3>Vacunas Aplicadas</h3>
                <div className="vaccines">
                  {pet.health.vaccines.map((vaccine, index) => (
                    <span
                      key={index}
                      className={`vaccine-tag ${vaccine.status === "pending" ? "pending" : ""}`}
                    >
                      {vaccine.name} {vaccine.status === "pending" ? "(Pendiente)" : ""}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {pet.location && (
              <div className="section">
                <h3>Ubicación</h3>
                <p>
                  {pet.location.city}
                  {pet.location.state && `, ${pet.location.state}`}
                  {pet.location.country && `, ${pet.location.country}`}
                </p>
              </div>
            )}



            {/* Owner Information */}
            <div className="section">
              <h3>Propietario</h3>
              <div className="profile-header">
                <div className="avatar" style={{ width: 40, height: 40, fontSize: 16 }}>
                  {owner.avatar && owner.avatar.startsWith('/uploads/') ? (
                    <img
                      src={`http://localhost:5000${owner.avatar}`}
                      alt={owner.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                        objectFit: "cover"
                      }}
                    />
                  ) : (
                    owner.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="profile-info">
                  <h3 style={{ fontSize: 14 }}>{owner.name}</h3>
                  <p>{owner.location?.city || 'Ubicación no especificada'}</p>
                </div>
              </div>

              {!isOwner && (
                <>
                  {showContactInfo && (
                    <div style={{ marginTop: 15, padding: 15, background: "#f8f9fa", borderRadius: 8 }}>
                      {owner.phone && <p style={{ marginBottom: 5 }}><strong>Teléfono:</strong> {owner.phone}</p>}
                      {owner.email && <p style={{ marginBottom: 5 }}><strong>Email:</strong> {owner.email}</p>}
                      {owner.location && (
                        <p><strong>Ubicación:</strong> {owner.location.city}{owner.location.state && `, ${owner.location.state}`}</p>
                      )}
                    </div>
                  )}

                  <button
                    className="btn-secondary"
                    onClick={handleContactOwner}
                    style={{ marginTop: 10, width: "100%" }}
                  >
                    {showContactInfo ? "Ocultar Contacto" : "Ver Información de Contacto"}
                  </button>
                </>
              )}

              {isOwner && (
                <div style={{ marginTop: 15, padding: 15, background: "#e8f5e8", borderRadius: 8, textAlign: "center" }}>
                  <p style={{ color: "#4caf50", fontSize: "14px", margin: 0 }}>
                    Esta es tu mascota. Puedes editarla desde tu perfil.
                  </p>
                </div>
              )}
            </div>

            {/* Application Form */}
            {showApplicationForm && (
              <div className="section">
                <h3>Formulario de Aplicación</h3>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
                  Cuéntanos por qué quieres adoptar a {pet.name} y cómo planeas cuidarlo.
                </p>

                <textarea
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  placeholder="Explica tu experiencia con mascotas, tu estilo de vida, y por qué serías un buen hogar para esta mascota..."
                  rows="6"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    resize: "vertical",
                    marginBottom: "16px"
                  }}
                />

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    className="btn-primary"
                    onClick={handleApplyForAdoption}
                    disabled={isApplying}
                    style={{ flex: 1 }}
                  >
                    {isApplying ? "Enviando..." : "Enviar Aplicación"}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setShowApplicationForm(false);
                      setApplicationMessage("");
                      setError("");
                    }}
                    style={{ flex: 1 }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!isOwner && pet.status === 'available' && !userHasApplied && (
              <button
                className="btn-primary"
                onClick={() => setShowApplicationForm(true)}
                style={{ width: "100%", marginTop: 10 }}
              >
                Aplicar para Adoptar
              </button>
            )}

            {!isOwner && pet.status === 'available' && userHasApplied && (
              <div style={{
                marginTop: 10,
                padding: 15,
                background: "#e3f2fd",
                borderRadius: 8,
                textAlign: "center",
                border: "1px solid #2196f3"
              }}>
                <p style={{ color: "#1976d2", fontSize: "14px", margin: 0, fontWeight: "600" }}>
                  ✅ Usted ya ha aplicado para adoptar esta mascota
                </p>
                {userApplication && (
                  <p style={{ color: "#666", fontSize: "12px", margin: "5px 0 0 0" }}>
                    Estado: {userApplication.status === 'pending' ? 'Pendiente de revisión' :
                      userApplication.status === 'approved' ? 'Aprobada' :
                        userApplication.status === 'rejected' ? 'Rechazada' : 'Retirada'}
                  </p>
                )}
              </div>
            )}

            {!isOwner && pet.status !== 'available' && (
              <p style={{ textAlign: "center", color: "#f57c00", fontSize: 12, marginTop: 10 }}>
                Esta mascota no está disponible para adopción
              </p>
            )}

            {isOwner && (
              <div style={{ marginTop: 15, textAlign: "center" }}>
                <button
                  className="btn-secondary"
                  onClick={() => navigate("/profile")}
                  style={{ width: "100%", marginBottom: 10 }}
                >
                  Editar Mascota en Mi Perfil
                </button>
                <p style={{ color: "#666", fontSize: 12 }}>
                  Ve a tu perfil para editar la información de esta mascota
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
