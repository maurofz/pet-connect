import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMyPets, setShowMyPets] = useState(false);
  const [myPets, setMyPets] = useState([]);
  const [showMessages, setShowMessages] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Form data for editing profile
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bio: "",
    location: {
      city: "",
      state: "",
      country: "Ecuador"
    },
    preferences: {
      petTypes: [],
      notifications: {
        email: true,
        push: true
      }
    }
  });

  // Available pet types for preferences
  const availablePetTypes = [
    { value: 'dog', label: 'Perros' },
    { value: 'cat', label: 'Gatos' },
    { value: 'bird', label: 'Aves' },
    { value: 'fish', label: 'Peces' },
    { value: 'rabbit', label: 'Conejos' },
    { value: 'hamster', label: 'Hamsters' },
    { value: 'other', label: 'Otros' }
  ];

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.auth.getMe();
      const userData = response.data.user;

      setUser(userData);
      setFormData({
        name: userData.name || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
        location: {
          city: userData.location?.city || "",
          state: userData.location?.state || "",
          country: userData.location?.country || "Ecuador"
        },
        preferences: {
          petTypes: userData.preferences?.petTypes || [],
          notifications: {
            email: userData.preferences?.notifications?.email ?? true,
            push: userData.preferences?.notifications?.push ?? true
          }
        }
      });

      // Load user's pets
      try {
        const petsResponse = await apiService.pets.getMyPets();
        setMyPets(petsResponse.data.pets || []);
      } catch (error) {
        console.log("No pets found or error loading pets");
        setMyPets([]);
      }

    } catch (error) {
      console.error("Error loading profile:", error);
      if (error.message.includes("No autorizado")) {
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        navigate("/");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setGeneralError("");
    setSuccessMessage("");
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setGeneralError("");
      setSuccessMessage("");

      const updateData = {
        name: formData.name,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        preferences: formData.preferences
      };

      const response = await apiService.auth.updateProfile(updateData);

      setUser(response.data.user);
      setIsEditing(false);
      setSuccessMessage("Perfil actualizado exitosamente");

      // Update localStorage
      const currentUserData = localStorage.getItem("currentUser");
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        currentUser.name = response.data.user.name;
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
      }

      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Error updating profile:", error);
      setGeneralError("Error al actualizar el perfil. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setGeneralError("");
    setSuccessMessage("");
    // Reset form data to current user data
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        location: {
          city: user.location?.city || "",
          state: user.location?.state || "",
          country: user.location?.country || "Ecuador"
        },
        preferences: {
          petTypes: user.preferences?.petTypes || [],
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            push: user.preferences?.notifications?.push ?? true
          }
        }
      });
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setGeneralError("");
      setSuccessMessage("");

      const response = await apiService.auth.uploadAvatar(file);

      setUser(prev => ({
        ...prev,
        avatar: response.data.avatar
      }));

      setSuccessMessage("Avatar actualizado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Error uploading avatar:", error);
      setGeneralError("Error al subir la imagen. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate password fields
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = "Contraseña actual requerida";
    if (!passwordData.newPassword) errors.newPassword = "Nueva contraseña requerida";
    if (passwordData.newPassword.length < 6) errors.newPassword = "La contraseña debe tener al menos 6 caracteres";
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    try {
      setIsLoading(true);
      setGeneralError("");
      setSuccessMessage("");

      await apiService.auth.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordErrors({});
      setSuccessMessage("Contraseña actualizada exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Error changing password:", error);
      if (error.message.includes("incorrecta")) {
        setPasswordErrors({ currentPassword: "Contraseña actual incorrecta" });
      } else {
        setGeneralError("Error al cambiar la contraseña. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiService.auth.logout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      navigate("/");
    }
  };

  const handleAddPet = () => {
    navigate("/add-pet"); // Redirect to add pet page
  };

  const handleEditPet = (petId) => {
    navigate(`/pet/${petId}`);
  };

  const handleDeletePet = async (petId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta mascota?")) {
      try {
        await apiService.pets.delete(petId);
        setMyPets(prev => prev.filter(pet => pet._id !== petId));
        setSuccessMessage("Mascota eliminada exitosamente");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error deleting pet:", error);
        setGeneralError("Error al eliminar la mascota. Intenta nuevamente.");
      }
    }
  };

  const handleSearchAdopt = () => {
    navigate("/search");
  };

  const handlePreferenceChange = (petType, action) => {
    if (action === "add") {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          petTypes: [...prev.preferences.petTypes, petType]
        }
      }));
    } else if (action === "remove") {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          petTypes: prev.preferences.petTypes.filter(p => p !== petType)
        }
      }));
    }
  };

  const navigateToFeed = () => {
    navigate("/feed");
  };

  if (isLoading && !user) {
    return (
      <div className="phone">
        <div className="header">
          Cargando...
          <div className="header-icons">
            <div className="icon" onClick={navigateToFeed}>🏠</div>
            <div className="icon" onClick={handleLogout}>🚪</div>
          </div>
        </div>
        <div className="content">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="phone">
        <div className="header">
          Error
          <div className="header-icons">
            <div className="icon" onClick={() => navigate("/")}>🏠</div>
          </div>
        </div>
        <div className="content">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>No se pudo cargar el perfil</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Volver al Login
            </button>
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
          <div className="icon" onClick={navigateToFeed}>🏠</div>
          <div className="icon" onClick={handleEditProfile}>✏️</div>
          <div className="icon" onClick={handleLogout}>🚪</div>
        </div>
      </div>
      <div className="content">
        {successMessage && (
          <div style={{
            background: "#4caf50",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px 0",
            textAlign: "center"
          }}>
            {successMessage}
          </div>
        )}

        {generalError && (
          <div style={{
            background: "#f44336",
            color: "white",
            padding: "10px",
            borderRadius: "5px",
            margin: "10px 0",
            textAlign: "center"
          }}>
            {generalError}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar-container">
              {user.avatar ? (
                <img
                  src={`http://localhost:5000${user.avatar}`}
                  alt="Avatar"
                  className="avatar-image"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              ) : (
                <div className="avatar">{user.name ? user.name.substring(0, 2).toUpperCase() : "U"}</div>
              )}
              {isEditing && (
                <label style={{
                  position: "absolute",
                  bottom: "-5px",
                  right: "-5px",
                  background: "#667eea",
                  color: "white",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  📷
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            <div className="profile-info">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "8px",
                    marginBottom: "5px",
                    width: "100%"
                  }}
                  placeholder="Tu nombre"
                />
              ) : (
                <h3>{user.name}</h3>
              )}
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  style={{
                    fontSize: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "8px",
                    width: "100%",
                    minHeight: "60px",
                    resize: "vertical"
                  }}
                  placeholder="Cuéntanos sobre ti..."
                  maxLength={500}
                />
              ) : (
                <p>{user.bio || "No hay biografía disponible"}</p>
              )}
              <div style={{ marginTop: 5 }}>
                <span style={{ color: "#4caf50", fontSize: 12 }}>
                  ● En línea
                </span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div style={{ marginTop: 15 }}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: "12px", color: "#666" }}>Teléfono:</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    fontSize: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "8px",
                    width: "100%"
                  }}
                  placeholder="+593 98 9254 630"
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: "12px", color: "#666" }}>Ciudad:</label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, city: e.target.value }
                  }))}
                  style={{
                    fontSize: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "8px",
                    width: "100%"
                  }}
                  placeholder="Portoviejo"
                />
              </div>

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: "12px", color: "#666" }}>Provincia:</label>
                <input
                  type="text"
                  value={formData.location.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    location: { ...prev.location, state: e.target.value }
                  }))}
                  style={{
                    fontSize: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                    padding: "8px",
                    width: "100%"
                  }}
                  placeholder="Manabi"
                />
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
                <button
                  className="btn-primary"
                  onClick={handleSaveProfile}
                  style={{ flex: 1 }}
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </button>
                <button
                  className="btn-secondary"
                  onClick={handleCancelEdit}
                  style={{ flex: 1 }}
                  disabled={isLoading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="stats">
            <div className="stat">
              <div className="stat-number">{myPets.length}</div>
              <div className="stat-label">Mis Mascotas</div>
            </div>
            <div className="stat">
              <div className="stat-number">{user.isVerified ? "✓" : "○"}</div>
              <div className="stat-label">Verificado</div>
            </div>
            <div className="stat">
              <div className="stat-number">{user.role}</div>
              <div className="stat-label">Rol</div>
            </div>
          </div>

          <div className="preferences">
            <h4>Preferencias de Mascotas</h4>
            <div className="preference-tags">
              {formData.preferences.petTypes.map(petType => {
                const petTypeInfo = availablePetTypes.find(pt => pt.value === petType);
                return (
                  <span
                    key={petType}
                    className="preference-tag"
                    onClick={() => isEditing && handlePreferenceChange(petType, "remove")}
                    style={{ cursor: isEditing ? "pointer" : "default" }}
                  >
                    {petTypeInfo ? petTypeInfo.label : petType} {isEditing && "×"}
                  </span>
                );
              })}
              {isEditing && (
                <div style={{ marginTop: "10px" }}>
                  {availablePetTypes
                    .filter(pt => !formData.preferences.petTypes.includes(pt.value))
                    .map(petType => (
                      <button
                        key={petType.value}
                        onClick={() => handlePreferenceChange(petType.value, "add")}
                        style={{
                          background: "#e3f2fd",
                          color: "#1976d2",
                          padding: "4px 8px",
                          border: "none",
                          borderRadius: "12px",
                          fontSize: "12px",
                          cursor: "pointer",
                          margin: "2px"
                        }}
                      >
                        + {petType.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-action btn-adopt" onClick={handleSearchAdopt}>
              Buscar Adoptar
            </button>
            <button
              className="btn-action btn-message"
              onClick={() => navigate("/applications")}
            >
              Ver Aplicaciones
            </button>
            <button
              className="btn-action btn-message"
              onClick={() => setShowChangePassword(!showChangePassword)}
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {showChangePassword && (
          <div className="profile-card">
            <h3 style={{ marginBottom: 15 }}>Cambiar Contraseña</h3>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: "12px", color: "#666" }}>Contraseña Actual:</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                style={{
                  fontSize: "12px",
                  border: passwordErrors.currentPassword ? "1px solid #f44336" : "1px solid #e0e0e0",
                  borderRadius: "4px",
                  padding: "8px",
                  width: "100%"
                }}
                placeholder="••••••••"
              />
              {passwordErrors.currentPassword && (
                <div style={{ color: "#f44336", fontSize: "11px", marginTop: "2px" }}>
                  {passwordErrors.currentPassword}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: "12px", color: "#666" }}>Nueva Contraseña:</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                style={{
                  fontSize: "12px",
                  border: passwordErrors.newPassword ? "1px solid #f44336" : "1px solid #e0e0e0",
                  borderRadius: "4px",
                  padding: "8px",
                  width: "100%"
                }}
                placeholder="••••••••"
              />
              {passwordErrors.newPassword && (
                <div style={{ color: "#f44336", fontSize: "11px", marginTop: "2px" }}>
                  {passwordErrors.newPassword}
                </div>
              )}
            </div>

            <div style={{ marginBottom: 15 }}>
              <label style={{ fontSize: "12px", color: "#666" }}>Confirmar Nueva Contraseña:</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                style={{
                  fontSize: "12px",
                  border: passwordErrors.confirmPassword ? "1px solid #f44336" : "1px solid #e0e0e0",
                  borderRadius: "4px",
                  padding: "8px",
                  width: "100%"
                }}
                placeholder="••••••••"
              />
              {passwordErrors.confirmPassword && (
                <div style={{ color: "#f44336", fontSize: "11px", marginTop: "2px" }}>
                  {passwordErrors.confirmPassword}
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                className="btn-primary"
                onClick={handleChangePassword}
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                  setPasswordErrors({});
                }}
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
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
                <div key={pet._id} className="result-item" style={{ marginBottom: 10 }}>
                  <div className="result-avatar">
                    {pet.images && pet.images.length > 0 ? (
                      <img
                        src={`http://localhost:5000${pet.images[0]}`}
                        alt={pet.name}
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          objectFit: "cover"
                        }}
                      />
                    ) : (
                      pet.name.substring(0, 2).toUpperCase()
                    )}
                  </div>
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
                        onClick={() => handleEditPet(pet._id)}
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
                        onClick={() => handleDeletePet(pet._id)}
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
