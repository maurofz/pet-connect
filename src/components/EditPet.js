import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function EditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    type: "dog",
    breed: "",
    age: {
      value: 0,
      unit: "years"
    },
    gender: "male",
    size: "medium",
    color: "",
    description: "",
    location: {
      city: "",
      state: "",
      country: "Ecuador"
    },
    status: "available",
    adoptionFee: 0,
    health: {
      isVaccinated: false,
      isSpayed: false,
      isHealthy: true
    },
    behavior: {
      temperament: "friendly",
      goodWith: {
        children: true,
        dogs: true,
        cats: true,
        otherPets: true
      },
      specialNeeds: ""
    },
    characteristics: [],
    requirements: [],
    vaccinesApplied: []
  });

  // Image handling
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]); // Track images to delete

  // Available options
  const petTypes = [
    { value: "dog", label: "Perro" },
    { value: "cat", label: "Gato" },
    { value: "bird", label: "Ave" },
    { value: "fish", label: "Pez" },
    { value: "rabbit", label: "Conejo" },
    { value: "hamster", label: "Hamster" },
    { value: "other", label: "Otro" }
  ];

  const genders = [
    { value: "male", label: "Macho" },
    { value: "female", label: "Hembra" }
  ];

  const sizes = [
    { value: "small", label: "Pequeño" },
    { value: "medium", label: "Mediano" },
    { value: "large", label: "Grande" },
    { value: "extra-large", label: "Extra Grande" }
  ];

  const statuses = [
    { value: "available", label: "Disponible" },
    { value: "not_available", label: "No disponible" }
  ];

  const availableCharacteristics = [
    "Energético", "Tranquilo", "Sociable", "Independiente", "Juguetón",
    "Cariñoso", "Inteligente", "Obediente", "Protector", "Adaptable",
    "Curioso", "Valiente", "Tímido", "Gracioso", "Leal"
  ];

  const availableRequirements = [
    "Familia activa", "Espacio al aire libre", "Tiempo para ejercicio",
    "Experiencia con mascotas", "Hogar sin niños", "Hogar sin otras mascotas",
    "Atención veterinaria regular", "Alimentación especial", "Entrenamiento"
  ];

  const availableVaccines = [
    "Rabia", "Parvovirus", "Distemper", "Hepatitis", "Leptospirosis",
    "Triple Felina", "Leucemia Felina", "Panleucopenia", "Calicivirus"
  ];

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadPetData();
    }
  }, [currentUser, id]);

  const loadCurrentUser = () => {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
  };

  const loadPetData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await apiService.pets.getById(id);
      const pet = response.data.pet;

      // Check if user owns the pet
      if (pet.owner._id !== currentUser?._id) {
        setError("No tienes permisos para editar esta mascota");
        return;
      }

      // Set form data with existing pet data
      setFormData({
        name: pet.name || "",
        type: pet.type || "dog",
        breed: pet.breed || "",
        age: {
          value: pet.age?.value || 0,
          unit: pet.age?.unit || "years"
        },
        gender: pet.gender || "male",
        size: pet.size || "medium",
        color: pet.color || "",
        description: pet.description || "",
        location: {
          city: pet.location?.city || "",
          state: pet.location?.state || "",
          country: pet.location?.country || "Ecuador"
        },
        status: pet.status || "available",
        adoptionFee: pet.adoptionFee || 0,
        health: {
          isVaccinated: pet.health?.isVaccinated || false,
          isSpayed: pet.health?.isSpayed || false,
          isHealthy: pet.health?.isHealthy || true
        },
        behavior: {
          temperament: pet.behavior?.temperament || "friendly",
          goodWith: {
            children: pet.behavior?.goodWith?.children || true,
            dogs: pet.behavior?.goodWith?.dogs || true,
            cats: pet.behavior?.goodWith?.cats || true,
            otherPets: pet.behavior?.goodWith?.otherPets || true
          },
          specialNeeds: pet.behavior?.specialNeeds || ""
        },
        characteristics: pet.characteristics || [],
        requirements: pet.requirements || [],
        vaccinesApplied: pet.health?.vaccines?.map(v => v.name) || []
      });

      // Set existing images
      setExistingImages(pet.images || []);
      setPreviewImages(pet.images || []);

    } catch (error) {
      console.error("Error loading pet:", error);
      setError("Error al cargar los datos de la mascota");
    } finally {
      setIsLoading(false);
    }
  };

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

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setImagesToDelete(prev => [...prev, imageToRemove]);
    setExistingImages(prev => prev.filter((_, i) => i !== index));
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

  const toggleVaccine = (vaccine) => {
    setFormData(prev => ({
      ...prev,
      vaccinesApplied: prev.vaccinesApplied.includes(vaccine)
        ? prev.vaccinesApplied.filter(v => v !== vaccine)
        : [...prev.vaccinesApplied, vaccine]
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("El nombre es requerido");
      return false;
    }
    if (!formData.breed.trim()) {
      setError("La raza es requerida");
      return false;
    }
    if (formData.age.value <= 0) {
      setError("La edad debe ser mayor a 0");
      return false;
    }
    if (!formData.color.trim()) {
      setError("El color es requerido");
      return false;
    }
    if (!formData.description.trim()) {
      setError("La descripción es requerida");
      return false;
    }
    if (!formData.location.city.trim()) {
      setError("La ciudad es requerida");
      return false;
    }
    if (previewImages.length === 0) {
      setError("Al menos una imagen es requerida");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsUpdating(true);
      setError("");
      setSuccessMessage("");

      // Prepare pet data for API
      const petDataToUpdate = {
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        age: formData.age,
        gender: formData.gender,
        size: formData.size,
        color: formData.color,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        adoptionFee: formData.adoptionFee,
        health: {
          ...formData.health,
          vaccines: formData.vaccinesApplied.map(name => ({
            name,
            date: new Date(),
            nextDue: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
            status: 'completed'
          }))
        },
        behavior: formData.behavior,
        characteristics: formData.characteristics,
        requirements: formData.requirements
      };

      // Call API with pet data, new images, and images to delete
      const response = await apiService.pets.update(id, petDataToUpdate, selectedFiles, imagesToDelete);

      // Update local state with response data
      const updatedPet = response.data.pet;

      // Update form data with the response data to reflect changes
      setFormData({
        name: updatedPet.name || "",
        type: updatedPet.type || "dog",
        breed: updatedPet.breed || "",
        age: {
          value: updatedPet.age?.value || 0,
          unit: updatedPet.age?.unit || "years"
        },
        gender: updatedPet.gender || "male",
        size: updatedPet.size || "medium",
        color: updatedPet.color || "",
        description: updatedPet.description || "",
        location: {
          city: updatedPet.location?.city || "",
          state: updatedPet.location?.state || "",
          country: updatedPet.location?.country || "Ecuador"
        },
        status: updatedPet.status || "available",
        adoptionFee: updatedPet.adoptionFee || 0,
        health: {
          isVaccinated: updatedPet.health?.isVaccinated || false,
          isSpayed: updatedPet.health?.isSpayed || false,
          isHealthy: updatedPet.health?.isHealthy || true
        },
        behavior: {
          temperament: updatedPet.behavior?.temperament || "friendly",
          goodWith: {
            children: updatedPet.behavior?.goodWith?.children || true,
            dogs: updatedPet.behavior?.goodWith?.dogs || true,
            cats: updatedPet.behavior?.goodWith?.cats || true,
            otherPets: updatedPet.behavior?.goodWith?.otherPets || true
          },
          specialNeeds: updatedPet.behavior?.specialNeeds || ""
        },
        characteristics: updatedPet.characteristics || [],
        requirements: updatedPet.requirements || [],
        vaccinesApplied: updatedPet.health?.vaccines?.map(v => v.name) || []
      });

      // Update images
      setExistingImages(updatedPet.images || []);
      setPreviewImages(updatedPet.images || []);
      setSelectedFiles([]);
      setImagesToDelete([]);

      setSuccessMessage("Mascota actualizada exitosamente");

      // Navigate to profile after 2 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 2000);

    } catch (error) {
      console.error("Error updating pet:", error);
      setError(error.message || "Error al actualizar la mascota");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
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

  const handleViewPet = () => {
    navigate(`/pet/${id}`);
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
            <p>Cargando datos de la mascota...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="header">
        <div className="back-btn" onClick={handleBack}>‹</div>
        Editar Mascota
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

        <form onSubmit={handleSubmit}>
          <div className="section">
            <h3>Información Básica</h3>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Nombre de la mascota *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
                placeholder="Ej: Luna, Max, Bella"
                required
              />
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Tipo de mascota
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
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Raza *
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => handleInputChange("breed", e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                  placeholder="Ej: Golden Retriever"
                  required
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Edad *
                </label>
                <input
                  type="number"
                  value={formData.age.value}
                  onChange={(e) => handleInputChange("age", { ...formData.age, value: parseInt(e.target.value) || 0 })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                  min="0"
                  required
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Unidad
                </label>
                <select
                  value={formData.age.unit}
                  onChange={(e) => handleInputChange("age", { ...formData.age, unit: e.target.value })}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                >
                  <option value="years">Años</option>
                  <option value="months">Meses</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Género
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
                    <option key={gender.value} value={gender.value}>
                      {gender.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Tamaño
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
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Color *
              </label>
              <input
                type="text"
                value={formData.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px"
                }}
                placeholder="Ej: Dorado, Negro, Blanco"
                required
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                Descripción *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "16px",
                  minHeight: "100px",
                  resize: "vertical"
                }}
                placeholder="Describe a tu mascota, su personalidad, necesidades especiales..."
                required
              />
            </div>
          </div>

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
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                  placeholder="Ej: Quito"
                  required
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
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                  placeholder="Ej: Pichincha"
                />
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Estado y Tarifa</h3>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Estado
                </label>
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
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                  Tarifa de Adopción ($)
                </label>
                <input
                  type="number"
                  value={formData.adoptionFee}
                  onChange={(e) => handleInputChange("adoptionFee", parseInt(e.target.value) || 0)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    fontSize: "16px"
                  }}
                  min="0"
                  placeholder="0 para adopción gratuita"
                />
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Fotos de la Mascota *</h3>
            <p style={{ color: "#666", fontSize: "14px", marginBottom: "16px" }}>
              Sube fotos de tu mascota. Máximo 5 imágenes, 5MB cada una.
            </p>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ marginBottom: "8px" }}>Imágenes actuales (haz clic en × para eliminar):</h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "8px"
                }}>
                  {existingImages.map((image, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={`http://localhost:5000${image}`}
                        alt={`Imagen ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "2px solid #e0e0e0"
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
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
                        title="Eliminar imagen"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {previewImages.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ marginBottom: "8px" }}>Imágenes seleccionadas ({previewImages.length}/5):</h4>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: "8px"
                }}>
                  {previewImages.map((image, index) => (
                    <div key={index} style={{ position: "relative" }}>
                      <img
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100px",
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
              </div>
            )}

            {/* File Input */}
            {previewImages.length < 5 && (
              <div style={{ marginBottom: "16px" }}>
                <label
                  style={{
                    display: "block",
                    padding: "20px",
                    border: "2px dashed #ddd",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "#f9f9f9",
                    color: "#666"
                  }}
                >
                  📷 Seleccionar Imágenes ({previewImages.length}/5)
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            )}
          </div>

          <div className="section">
            <h3>Características</h3>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                Selecciona las características que describen a tu mascota:
              </p>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px"
              }}>
                {availableCharacteristics.map(characteristic => (
                  <button
                    key={characteristic}
                    type="button"
                    onClick={() => toggleCharacteristic(characteristic)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      background: formData.characteristics.includes(characteristic) ? "#4caf50" : "white",
                      color: formData.characteristics.includes(characteristic) ? "white" : "#333",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {characteristic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Requisitos</h3>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                Selecciona los requisitos que necesita el adoptante:
              </p>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px"
              }}>
                {availableRequirements.map(requirement => (
                  <button
                    key={requirement}
                    type="button"
                    onClick={() => toggleRequirement(requirement)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      background: formData.requirements.includes(requirement) ? "#ff9800" : "white",
                      color: formData.requirements.includes(requirement) ? "white" : "#333",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {requirement}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Vacunas Aplicadas</h3>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                Selecciona las vacunas que tiene tu mascota:
              </p>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px"
              }}>
                {availableVaccines.map(vaccine => (
                  <button
                    key={vaccine}
                    type="button"
                    onClick={() => toggleVaccine(vaccine)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ddd",
                      borderRadius: "20px",
                      background: formData.vaccinesApplied.includes(vaccine) ? "#2196f3" : "white",
                      color: formData.vaccinesApplied.includes(vaccine) ? "white" : "#333",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    {vaccine}
                  </button>
                ))}
              </div>
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
              type="submit"
              disabled={isUpdating}
              style={{
                flex: 1,
                padding: "16px",
                background: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isUpdating ? "not-allowed" : "pointer",
                opacity: isUpdating ? 0.7 : 1
              }}
            >
              {isUpdating ? "Actualizando..." : "Actualizar Mascota"}
            </button>
            <button
              type="button"
              onClick={handleBack}
              disabled={isUpdating}
              style={{
                flex: 1,
                padding: "16px",
                background: "#666",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: isUpdating ? "not-allowed" : "pointer"
              }}
            >
              Cancelar
            </button>
          </div>


        </form>
      </div>
    </div>
  );
} 