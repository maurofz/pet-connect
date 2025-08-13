import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function AddPet() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    type: "Perro",
    breed: "",
    gender: "Macho",
    age: "",
    weight: "",
    size: "Mediano",
    description: "",
    location: {
      city: "",
      state: "",
      country: "Ecuador"
    },
    status: "available",
    characteristics: [],
    requirements: [],
    vaccinesApplied: []
  });

  // Available options
  const petTypes = ["Perro", "Gato", "Ave", "Pez", "Conejo", "Hamster", "Otro"];
  const genders = ["Macho", "Hembra"];
  const sizes = ["Pequeño", "Mediano", "Grande"];
  const statuses = [
    { value: "available", label: "Disponible para adopción" },
    { value: "adoption", label: "En proceso de adopción" },
    { value: "adopted", label: "Ya adoptado" }
  ];

  const availableCharacteristics = [
    "Energético", "Tranquilo", "Sociable", "Independiente", "Juguetón",
    "Cariñoso", "Inteligente", "Obediente", "Protector", "Adaptable",
    "Curioso", "Valiente", "Tímido", "Gracioso", "Leal"
  ];

  const availableRequirements = [
    "Familia activa", "Espacio al aire libre", "Tiempo para ejercicio",
    "Familia cariñosa", "Atención regular", "Experiencia con mascotas",
    "Casa sin otros animales", "Casa con patio", "Familia con niños",
    "Entrenamiento básico", "Visitas veterinarias regulares"
  ];

  const availableVaccines = [
    { name: "Rabia", status: "pending" },
    { name: "Parvovirus", status: "pending" },
    { name: "Distemper", status: "pending" },
    { name: "Hepatitis", status: "pending" },
    { name: "Leptospirosis", status: "pending" },
    { name: "Triple Felina", status: "pending" },
    { name: "Leucemia Felina", status: "pending" }
  ];

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  useEffect(() => {
    // Load current user
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);

      // Set default location from user profile
      if (user.location) {
        setFormData(prev => ({
          ...prev,
          location: {
            city: user.location.city || "",
            state: user.location.state || "",
            country: user.location.country || "Ecuador"
          }
        }));
      }
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (validFiles.length + selectedFiles.length > 5) {
      setErrorMessage("Máximo 5 imágenes permitidas");
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setErrorMessage("");

    // Create preview URLs
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

  const toggleCharacteristic = (characteristic) => {
    setFormData(prev => ({
      ...prev,
      characteristics: prev.characteristics.includes(characteristic)
        ? prev.characteristics.filter(c => c !== characteristic)
        : [...prev.characteristics, characteristic]
    }));
  };

  const toggleRequirement = (requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.includes(requirement)
        ? prev.requirements.filter(r => r !== requirement)
        : [...prev.requirements, requirement]
    }));
  };

  const toggleVaccine = (vaccineName) => {
    setFormData(prev => ({
      ...prev,
      vaccinesApplied: prev.vaccinesApplied.some(v => v.name === vaccineName)
        ? prev.vaccinesApplied.filter(v => v.name !== vaccineName)
        : [...prev.vaccinesApplied, { name: vaccineName, status: "completed" }]
    }));
  };

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("El nombre es requerido");
    if (!formData.breed.trim()) errors.push("La raza es requerida");
    if (!formData.age || formData.age < 0) errors.push("La edad debe ser válida");
    if (!formData.weight.trim()) errors.push("El peso es requerido");
    if (!formData.description.trim()) errors.push("La descripción es requerida");
    if (!formData.location.city.trim()) errors.push("La ciudad es requerida");
    if (selectedFiles.length === 0) errors.push("Al menos una foto es requerida");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Create FormData for file upload
      const submitData = new FormData();

      // Add basic pet data
      submitData.append('name', formData.name);
      submitData.append('type', formData.type);
      submitData.append('breed', formData.breed);
      submitData.append('gender', formData.gender);
      submitData.append('age', formData.age);
      submitData.append('weight', formData.weight);
      submitData.append('size', formData.size);
      submitData.append('description', formData.description);
      submitData.append('status', formData.status);
      submitData.append('location', JSON.stringify(formData.location));
      submitData.append('characteristics', JSON.stringify(formData.characteristics));
      submitData.append('requirements', JSON.stringify(formData.requirements));
      submitData.append('vaccinesApplied', JSON.stringify(formData.vaccinesApplied));

      // Add images
      selectedFiles.forEach((file, index) => {
        submitData.append('images', file);
      });

      // Call API
      const response = await apiService.pets.create(submitData);

      setSuccessMessage("Mascota agregada exitosamente");

      // Redirect to pet detail after 2 seconds
      setTimeout(() => {
        navigate(`/pet/${response.data.pet._id}`);
      }, 2000);

    } catch (error) {
      console.error("Error adding pet:", error);
      setErrorMessage("Error al agregar la mascota. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/profile");
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

  if (!currentUser) {
    return (
      <div className="phone">
        <div className="header">
          <div className="back-btn" onClick={handleBack}>‹</div>
          Cargando...
        </div>
        <div className="content">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="header">
        <div className="back-btn" onClick={handleBack}>‹</div>
        Agregar Mascota
        <div className="header-icons">
          <div className="icon" onClick={navigateToFeed}>🏠</div>
          <div className="icon" onClick={navigateToProfile}>👤</div>
          <div className="icon" onClick={handleLogout}>🚪</div>
        </div>
      </div>
      <div className="content">
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

        {errorMessage && (
          <div style={{
            background: "#f44336",
            color: "white",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
            textAlign: "center"
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: "0 16px" }}>
          {/* Basic Information */}
          <div className="section">
            <h3>Información Básica</h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nombre de tu mascota"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Tipo *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange("type", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                >
                  {petTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Género *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                >
                  {genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Raza *
              </label>
              <input
                type="text"
                value={formData.breed}
                onChange={(e) => handleInputChange("breed", e.target.value)}
                placeholder="Ej: Golden Retriever, Mestizo, etc."
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Edad (años) *
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  placeholder="0"
                  min="0"
                  max="30"
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
                  Peso *
                </label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  placeholder="Ej: 25 kg"
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
                Tamaño *
              </label>
              <select
                value={formData.size}
                onChange={(e) => handleInputChange("size", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
              >
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Photos */}
          <div className="section">
            <h3>Fotos *</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
              Sube hasta 5 fotos de tu mascota (máximo 5MB cada una)
            </p>

            <div style={{ marginBottom: "16px" }}>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: "none" }}
                id="file-input"
              />
              <label
                htmlFor="file-input"
                style={{
                  display: "block",
                  padding: "16px",
                  border: "2px dashed #ddd",
                  borderRadius: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                  color: "#666",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => e.target.style.borderColor = "#667eea"}
                onMouseLeave={(e) => e.target.style.borderColor = "#ddd"}
              >
                📷 Seleccionar fotos
              </label>
            </div>

            {previewImages.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
                {previewImages.map((preview, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #ddd"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer",
                        fontSize: "12px"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="section">
            <h3>Descripción *</h3>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Cuéntanos sobre tu mascota: personalidad, comportamiento, necesidades especiales..."
              rows="4"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                resize: "vertical"
              }}
            />
          </div>

          {/* Location */}
          <div className="section">
            <h3>Ubicación</h3>
            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Ciudad *
                </label>
                <input
                  type="text"
                  value={formData.location.city}
                  onChange={(e) => handleInputChange("location.city", e.target.value)}
                  placeholder="Ej: Quito"
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
                  onChange={(e) => handleInputChange("location.state", e.target.value)}
                  placeholder="Ej: Pichincha"
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
          </div>

          {/* Status */}
          <div className="section">
            <h3>Estado</h3>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange("status", e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px"
              }}
            >
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Characteristics */}
          <div className="section">
            <h3>Características</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "12px" }}>
              Selecciona las características que describen a tu mascota
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {availableCharacteristics.map(char => (
                <button
                  key={char}
                  type="button"
                  onClick={() => toggleCharacteristic(char)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    background: formData.characteristics.includes(char) ? "#667eea" : "#e9ecef",
                    color: formData.characteristics.includes(char) ? "white" : "#495057",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {char}
                </button>
              ))}
            </div>
          </div>

          {/* Requirements */}
          <div className="section">
            <h3>Requisitos</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "12px" }}>
              Selecciona los requisitos que debe cumplir la familia adoptante
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {availableRequirements.map(req => (
                <button
                  key={req}
                  type="button"
                  onClick={() => toggleRequirement(req)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    background: formData.requirements.includes(req) ? "#f57c00" : "#fff3e0",
                    color: formData.requirements.includes(req) ? "white" : "#f57c00",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {req}
                </button>
              ))}
            </div>
          </div>

          {/* Vaccines */}
          <div className="section">
            <h3>Vacunas</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "12px" }}>
              Marca las vacunas que tiene aplicadas tu mascota
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {availableVaccines.map(vaccine => (
                <button
                  key={vaccine.name}
                  type="button"
                  onClick={() => toggleVaccine(vaccine.name)}
                  style={{
                    padding: "8px 12px",
                    fontSize: "12px",
                    background: formData.vaccinesApplied.some(v => v.name === vaccine.name) ? "#4caf50" : "#e8f5e8",
                    color: formData.vaccinesApplied.some(v => v.name === vaccine.name) ? "white" : "#4caf50",
                    border: "none",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  {vaccine.name}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{
            display: "flex",
            gap: "12px",
            marginTop: "24px",
            marginBottom: "24px"
          }}>
            <button
              type="button"
              onClick={handleBack}
              style={{
                flex: 1,
                padding: "16px",
                background: "#f5f5f5",
                color: "#333",
                border: "1px solid #ddd",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: "16px",
                background: isLoading ? "#ccc" : "#667eea",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: isLoading ? "not-allowed" : "pointer"
              }}
            >
              {isLoading ? "Agregando..." : "Agregar Mascota"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 