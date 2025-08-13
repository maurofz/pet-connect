import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState(null);
  const [petApplications, setPetApplications] = useState([]);
  const [showPetApplications, setShowPetApplications] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCurrentUser();
    loadMyPets();
  }, []);

  const loadCurrentUser = () => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
  };

  const loadMyPets = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.pets.getMyPets();
      setApplications(response.data.pets);
    } catch (error) {
      console.error("Error loading pets:", error);
      setError("Error al cargar las mascotas");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPetApplications = async (petId) => {
    try {
      const response = await apiService.pets.getPetApplications(petId);
      setPetApplications(response.data.applications);
      setSelectedPet(response.data.pet);
      setShowPetApplications(true);
    } catch (error) {
      console.error("Error loading applications:", error);
      setError("Error al cargar las aplicaciones");
    }
  };

  const updateApplicationStatus = async (petId, applicationId, status) => {
    try {
      await apiService.pets.updateApplicationStatus(petId, applicationId, status);

      // Update local state
      setPetApplications(prev =>
        prev.map(app =>
          app._id === applicationId
            ? { ...app, status, reviewedAt: new Date() }
            : app
        )
      );

      // Show success message
      const statusLabel = status === 'approved' ? 'aprobada' :
        status === 'rejected' ? 'rechazada' :
          status === 'withdrawn' ? 'retirada' : 'pendiente';

      alert(`Aplicación ${statusLabel} exitosamente`);
    } catch (error) {
      console.error("Error updating application:", error);
      setError("Error al actualizar el estado de la aplicación");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'withdrawn': return 'Retirada';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'approved': return '#4caf50';
      case 'rejected': return '#f44336';
      case 'withdrawn': return '#9e9e9e';
      default: return '#666';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleBack = () => {
    if (showPetApplications) {
      setShowPetApplications(false);
      setSelectedPet(null);
      setPetApplications([]);
    } else {
      navigate("/profile");
    }
  };

  const navigateToFeed = () => {
    navigate("/feed");
  };

  const navigateToProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="phone">
        <div className="header">
          <div className="back-btn" onClick={handleBack}>‹</div>
          Cargando...
          <div className="header-icons">
            <div className="icon" onClick={navigateToFeed}>🏠</div>
            <div className="icon" onClick={navigateToProfile}>👤</div>
            <div className="icon" onClick={handleLogout}>🚪</div>
          </div>
        </div>
        <div className="content">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>Cargando aplicaciones...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="header">
        <div className="back-btn" onClick={handleBack}>‹</div>
        {showPetApplications ? `Aplicaciones - ${selectedPet?.name}` : "Mis Aplicaciones"}
        <div className="header-icons">
          <div className="icon" onClick={navigateToFeed}>🏠</div>
          <div className="icon" onClick={navigateToProfile}>👤</div>
          <div className="icon" onClick={handleLogout}>🚪</div>
        </div>
      </div>
      <div className="content">
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

        {!showPetApplications ? (
          // List of pets with applications
          <div>
            <div style={{ padding: "16px" }}>
              <h3 style={{ marginBottom: "16px", color: "#333" }}>
                Selecciona una mascota para ver sus aplicaciones
              </h3>
            </div>

            {applications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>🐾</div>
                <p style={{ fontSize: "16px", marginBottom: "8px" }}>No tienes mascotas</p>
                <p style={{ fontSize: "14px", marginBottom: "20px" }}>Agrega una mascota para recibir aplicaciones</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/add-pet")}
                  style={{ width: "auto", padding: "12px 24px" }}
                >
                  Agregar Mascota
                </button>
              </div>
            ) : (
              applications.map(pet => (
                <div key={pet._id} className="profile-card" style={{ cursor: "pointer" }} onClick={() => loadPetApplications(pet._id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "bold"
                    }}>
                      {pet.images && pet.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000${pet.images[0]}`}
                          alt={pet.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        pet.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 4px 0", color: "#333" }}>{pet.name}</h4>
                      <p style={{ margin: "0 0 4px 0", color: "#666", fontSize: "14px" }}>
                        {pet.breed} • {pet.gender === 'male' ? 'Macho' : 'Hembra'}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{
                          background: getStatusColor(pet.status),
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "600"
                        }}>
                          {getStatusLabel(pet.status)}
                        </span>
                        {pet.applications && pet.applications.length > 0 && (
                          <span style={{
                            background: "#667eea",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "8px",
                            fontSize: "11px",
                            fontWeight: "600"
                          }}>
                            {pet.applications.length} aplicación{pet.applications.length !== 1 ? 'es' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: "20px", color: "#666" }}>›</div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          // Applications for selected pet
          <div>
            <div style={{ padding: "16px" }}>
              <h3 style={{ marginBottom: "16px", color: "#333" }}>
                Aplicaciones para {selectedPet?.name}
              </h3>
            </div>

            {petApplications.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
                <p style={{ fontSize: "16px", marginBottom: "8px" }}>No hay aplicaciones</p>
                <p style={{ fontSize: "14px", marginBottom: "20px" }}>
                  Aún no has recibido aplicaciones para {selectedPet?.name}
                </p>
              </div>
            ) : (
              petApplications.map(application => (
                <div key={application._id} className="profile-card">
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
                    <div style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "#f0f0f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: "bold",
                      overflow: "hidden"
                    }}>
                      {application.user.avatar ? (
                        <img
                          src={`http://localhost:5000${application.user.avatar}`}
                          alt={application.user.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover"
                          }}
                        />
                      ) : (
                        application.user.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 4px 0", color: "#333" }}>{application.user.name}</h4>
                      <p style={{ margin: "0 0 4px 0", color: "#666", fontSize: "14px" }}>
                        {application.user.email}
                      </p>
                      {application.user.phone && (
                        <p style={{ margin: "0 0 4px 0", color: "#666", fontSize: "14px" }}>
                          {application.user.phone}
                        </p>
                      )}
                      <p style={{ margin: "0", color: "#999", fontSize: "12px" }}>
                        Aplicó el {formatDate(application.submittedAt)}
                      </p>
                    </div>
                    <span style={{
                      background: getStatusColor(application.status),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "600"
                    }}>
                      {getStatusLabel(application.status)}
                    </span>
                  </div>

                  <div style={{
                    background: "#f8f9fa",
                    padding: "12px",
                    borderRadius: "8px",
                    marginBottom: "16px"
                  }}>
                    <p style={{ margin: "0", color: "#333", fontSize: "14px", lineHeight: "1.5" }}>
                      {application.message}
                    </p>
                  </div>

                  {application.status === 'pending' && (
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        onClick={() => updateApplicationStatus(selectedPet._id, application._id, 'approved')}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "#4caf50",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(selectedPet._id, application._id, 'rejected')}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Rechazar
                      </button>
                    </div>
                  )}

                  {application.status !== 'pending' && application.reviewedAt && (
                    <p style={{
                      margin: "8px 0 0 0",
                      color: "#999",
                      fontSize: "11px",
                      fontStyle: "italic"
                    }}>
                      Revisado el {formatDate(application.reviewedAt)}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 