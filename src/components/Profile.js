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

      await apiService.auth.updateProfile(formData);

      // Update local user data
      setUser(prev => ({
        ...prev,
        ...formData
      }));

      setSuccessMessage("Perfil actualizado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);
      setIsEditing(false);

    } catch (error) {
      console.error("Error updating profile:", error);
      setGeneralError(error.message || "Error al actualizar el perfil");
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

    if (file.size > 5 * 1024 * 1024) {
      setGeneralError("La imagen debe ser menor a 5MB");
      return;
    }

    try {
      setIsLoading(true);
      setGeneralError("");

      const response = await apiService.auth.uploadAvatar(file);

      // Update local user data
      setUser(prev => ({
        ...prev,
        avatar: response.data.avatar
      }));

      setSuccessMessage("Avatar actualizado exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);

    } catch (error) {
      console.error("Error uploading avatar:", error);
      setGeneralError(error.message || "Error al subir el avatar");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Contraseña actual es requerida";
    }
    if (!passwordData.newPassword) {
      errors.newPassword = "Nueva contraseña es requerida";
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = "La contraseña debe tener al menos 6 caracteres";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    setPasswordErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsLoading(true);
      setGeneralError("");

      await apiService.auth.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setSuccessMessage("Contraseña cambiada exitosamente");
      setTimeout(() => setSuccessMessage(""), 3000);

      setShowChangePassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setPasswordErrors({});

    } catch (error) {
      console.error("Error changing password:", error);
      setGeneralError(error.message || "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPet = () => {
    navigate("/add-pet");
  };

  const handleEditPet = (pet) => {
    navigate(`/edit-pet/${pet._id}`);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    navigate("/");
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
        {generalError && (
          <div style={{
            background: "#f44336",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            {generalError}
          </div>
        )}

        {successMessage && (
          <div style={{
            background: "#4caf50",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            {successMessage}
          </div>
        )}

        {/* Profile Section */}
        <div className="section">
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div className="avatar-container">
              <img
                src={user.avatar ? `http://localhost:5000${user.avatar}` : "/default-avatar.png"}
                alt="Avatar"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid #4caf50"
                }}
              />
              {isEditing && (
                <label style={{
                  position: "absolute",
                  bottom: "0",
                  right: "0",
                  background: "#4caf50",
                  color: "white",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  fontSize: "16px"
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
            <h2>{user.name}</h2>
            <p style={{ color: "#666", margin: "5px 0" }}>{user.email}</p>
          </div>

          {isEditing ? (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Biografía
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px",
                    minHeight: "100px",
                    resize: "vertical"
                  }}
                  placeholder="Cuéntanos sobre ti..."
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, city: e.target.value }
                    }))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px"
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                    Provincia
                  </label>
                  <input
                    type="text"
                    value={formData.location.state}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      location: { ...prev.location, state: e.target.value }
                    }))}
                    style={{
                      width: "100%",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "16px"
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Tipos de mascotas preferidas
                </label>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  {availablePetTypes.map(petType => (
                    <button
                      key={petType.value}
                      type="button"
                      onClick={() => handlePreferenceChange(
                        petType.value,
                        formData.preferences.petTypes.includes(petType.value) ? "remove" : "add"
                      )}
                      style={{
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "20px",
                        background: formData.preferences.petTypes.includes(petType.value) ? "#4caf50" : "white",
                        color: formData.preferences.petTypes.includes(petType.value) ? "white" : "#333",
                        cursor: "pointer",
                        fontSize: "14px"
                      }}
                    >
                      {petType.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <button
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: isLoading ? "not-allowed" : "pointer"
                  }}
                >
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#666",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: isLoading ? "not-allowed" : "pointer"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <strong>Teléfono:</strong> {user.phone || "No especificado"}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <strong>Biografía:</strong> {user.bio || "No especificada"}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <strong>Ubicación:</strong> {user.location?.city && user.location?.state
                  ? `${user.location.city}, ${user.location.state}`
                  : "No especificada"}
              </div>
              <div style={{ marginBottom: "16px" }}>
                <strong>Preferencias:</strong> {user.preferences?.petTypes?.length > 0
                  ? user.preferences.petTypes.map(type => {
                    const petType = availablePetTypes.find(pt => pt.value === type);
                    return petType ? petType.label : type;
                  }).join(", ")
                  : "No especificadas"}
              </div>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="section">
          <h3>Cambiar Contraseña</h3>
          {!showChangePassword ? (
            <button
              onClick={() => setShowChangePassword(true)}
              style={{
                padding: "12px 20px",
                background: "#2196f3",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              Cambiar Contraseña
            </button>
          ) : (
            <div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: passwordErrors.currentPassword ? "1px solid #f44336" : "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                />
                {passwordErrors.currentPassword && (
                  <div style={{ color: "#f44336", fontSize: "12px", marginTop: "5px" }}>
                    {passwordErrors.currentPassword}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: passwordErrors.newPassword ? "1px solid #f44336" : "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                />
                {passwordErrors.newPassword && (
                  <div style={{ color: "#f44336", fontSize: "12px", marginTop: "5px" }}>
                    {passwordErrors.newPassword}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: passwordErrors.confirmPassword ? "1px solid #f44336" : "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                />
                {passwordErrors.confirmPassword && (
                  <div style={{ color: "#f44336", fontSize: "12px", marginTop: "5px" }}>
                    {passwordErrors.confirmPassword}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#4caf50",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: isLoading ? "not-allowed" : "pointer"
                  }}
                >
                  {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
                </button>
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: ""
                    });
                    setPasswordErrors({});
                  }}
                  disabled={isLoading}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "#666",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: isLoading ? "not-allowed" : "pointer"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* My Pets Section */}
        <div className="section">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <h3>Mis Mascotas ({myPets.length})</h3>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleAddPet}
                style={{
                  padding: "8px 12px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Agregar
              </button>
              <button
                onClick={() => navigate("/applications")}
                style={{
                  padding: "8px 12px",
                  background: "#ff9800",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Ver Aplicaciones
              </button>
            </div>
          </div>

          {myPets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              <p>No tienes mascotas registradas</p>
              <button
                onClick={handleAddPet}
                style={{
                  padding: "10px 20px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginTop: "10px"
                }}
              >
                Agregar mi primera mascota
              </button>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "12px"
            }}>
              {myPets.map(pet => (
                <div
                  key={pet._id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/pet/${pet._id}`)}
                >
                  <img
                    src={pet.images && pet.images.length > 0
                      ? `http://localhost:5000${pet.images[0]}`
                      : "/default-pet.png"}
                    alt={pet.name}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover"
                    }}
                  />
                  <div style={{ padding: "12px" }}>
                    <h4 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{pet.name}</h4>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#666" }}>
                      {pet.breed}
                    </p>
                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#999" }}>
                      {pet.age?.value} {pet.age?.unit === "years" ? "años" : "meses"}
                    </p>
                    <div style={{ display: "flex", gap: "4px" }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPet(pet);
                        }}
                        style={{
                          flex: 1,
                          padding: "6px",
                          background: "#2196f3",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/pet/${pet._id}`);
                        }}
                        style={{
                          flex: 1,
                          padding: "6px",
                          background: "#4caf50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        👁️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h3>Acciones Rápidas</h3>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleSearchAdopt}
              style={{
                flex: 1,
                padding: "16px",
                background: "#ff9800",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              🐾 Buscar para Adoptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
