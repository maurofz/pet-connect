import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function SearchPets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [filteredPets, setFilteredPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    age: "",
    size: "",
    gender: "",
    vaccines: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadPets();
  }, []);

  useEffect(() => {
    filterPets();
  }, [searchTerm, activeTab, filters, allPets]);

  const loadPets = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await apiService.pets.getAll();
      setAllPets(response.data.pets);
    } catch (error) {
      console.error("Error loading pets:", error);
      setError("Error al cargar las mascotas");
    } finally {
      setIsLoading(false);
    }
  };

  const filterPets = () => {
    let filtered = allPets;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by pet type
    if (activeTab !== "Todos") {
      const typeMap = {
        "Perro": "dog",
        "Gato": "cat"
      };
      filtered = filtered.filter(pet => pet.type === typeMap[activeTab]);
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(pet =>
        pet.location?.city?.toLowerCase().includes(filters.location.toLowerCase()) ||
        pet.location?.state?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by age
    if (filters.age) {
      filtered = filtered.filter(pet => {
        const petAge = pet.age?.value || 0;
        switch (filters.age) {
          case "Cachorro":
            return petAge <= 1;
          case "Joven":
            return petAge > 1 && petAge <= 3;
          case "Adulto":
            return petAge > 3 && petAge <= 7;
          case "Senior":
            return petAge > 7;
          default:
            return true;
        }
      });
    }

    // Filter by size
    if (filters.size) {
      const sizeMap = {
        "Pequeño": "small",
        "Mediano": "medium",
        "Grande": "large"
      };
      filtered = filtered.filter(pet => pet.size === sizeMap[filters.size]);
    }

    // Filter by gender
    if (filters.gender) {
      const genderMap = {
        "Macho": "male",
        "Hembra": "female"
      };
      filtered = filtered.filter(pet => pet.gender === genderMap[filters.gender]);
    }

    // Filter by vaccines
    if (filters.vaccines) {
      filtered = filtered.filter(pet => pet.health?.isVaccinated);
    }

    setFilteredPets(filtered);
  };

  const handleSearch = () => {
    filterPets();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePetClick = (petId) => {
    navigate(`/pet/${petId}`);
  };

  const handleClearFilters = () => {
    setFilters({
      location: "",
      age: "",
      size: "",
      gender: "",
      vaccines: false
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
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

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return { background: "#e8f5e8", color: "#4caf50" };
      case "adopted":
        return { background: "#ffebee", color: "#f44336" };
      case "pending":
        return { background: "#fff3e0", color: "#ff9800" };
      default:
        return { background: "#f0f2f5", color: "#666" };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Disponible";
      case "adopted":
        return "Adoptado";
      case "pending":
        return "En proceso";
      default:
        return "No disponible";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "dog": return "Perro";
      case "cat": return "Gato";
      case "bird": return "Ave";
      case "fish": return "Pez";
      case "rabbit": return "Conejo";
      case "hamster": return "Hamster";
      case "other": return "Otro";
      default: return type;
    }
  };

  const getGenderLabel = (gender) => {
    switch (gender) {
      case "male": return "Macho";
      case "female": return "Hembra";
      default: return gender;
    }
  };

  const getSizeLabel = (size) => {
    switch (size) {
      case "small": return "Pequeño";
      case "medium": return "Mediano";
      case "large": return "Grande";
      case "extra-large": return "Extra Grande";
      default: return size;
    }
  };

  if (isLoading) {
    return (
      <div className="phone">
        <div className="header">
          <div className="back-btn" onClick={() => navigate(-1)}>‹</div>
          Cargando...
          <div className="header-icons">
            <div className="icon" onClick={navigateToFeed}>🏠</div>
            <div className="icon" onClick={toggleUserMenu}>👤</div>
          </div>
        </div>
        <div className="content">
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <p>Cargando mascotas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="header">
        <div className="back-btn" onClick={() => navigate(-1)}>‹</div>
        Buscar Mascotas
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

        <div className="feed-actions">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar mascotas disponibles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
            style={{ background: showFilters ? "#f39c12" : "#667eea" }}
          >
            🔍
          </button>
        </div>

        {showFilters && (
          <div className="profile-card" style={{ marginBottom: 20 }}>
            <h4 style={{ marginBottom: 15 }}>Filtros</h4>

            <div className="form-group">
              <label>Ubicación</label>
              <input
                type="text"
                placeholder="Ej: Quito, Pichincha"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Edad</label>
              <select
                value={filters.age}
                onChange={(e) => handleFilterChange("age", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px"
                }}
              >
                <option value="">Todas las edades</option>
                <option value="Cachorro">Cachorro (0-1 año)</option>
                <option value="Joven">Joven (1-3 años)</option>
                <option value="Adulto">Adulto (3-7 años)</option>
                <option value="Senior">Senior (7+ años)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Tamaño</label>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange("size", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px"
                }}
              >
                <option value="">Todos los tamaños</option>
                <option value="Pequeño">Pequeño</option>
                <option value="Mediano">Mediano</option>
                <option value="Grande">Grande</option>
              </select>
            </div>

            <div className="form-group">
              <label>Género</label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "2px solid #e0e0e0",
                  borderRadius: "8px",
                  fontSize: "14px"
                }}
              >
                <option value="">Cualquier género</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="vaccines"
                checked={filters.vaccines}
                onChange={(e) => handleFilterChange("vaccines", e.target.checked)}
              />
              <label htmlFor="vaccines">Solo mascotas vacunadas</label>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 15 }}>
              <button
                className="btn-primary"
                onClick={handleSearch}
                style={{ flex: 1 }}
              >
                Aplicar Filtros
              </button>
              <button
                className="btn-secondary"
                onClick={handleClearFilters}
                style={{ flex: 1 }}
              >
                Limpiar
              </button>
            </div>
          </div>
        )}

        <div className="tabs">
          <button
            className={`tab ${activeTab === "Todos" ? "active" : ""}`}
            onClick={() => handleTabChange("Todos")}
          >
            Todos
          </button>
          <button
            className={`tab ${activeTab === "Perro" ? "active" : ""}`}
            onClick={() => handleTabChange("Perro")}
          >
            Perros
          </button>
          <button
            className={`tab ${activeTab === "Gato" ? "active" : ""}`}
            onClick={() => handleTabChange("Gato")}
          >
            Gatos
          </button>
        </div>

        <div className="search-results">
          <p style={{ color: "#666", fontSize: 14, marginBottom: 15 }}>
            {filteredPets.length} mascota{filteredPets.length !== 1 ? 's' : ''} encontrada{filteredPets.length !== 1 ? 's' : ''}
          </p>

          {filteredPets.length > 0 ? (
            filteredPets.map(pet => (
              <div
                key={pet._id}
                className="result-item"
                onClick={() => handlePetClick(pet._id)}
                style={{ cursor: "pointer" }}
              >
                <div className="result-avatar">
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
                <div className="result-info">
                  <h4>{pet.name}</h4>
                  <p>{pet.breed} • {getGenderLabel(pet.gender)} • {pet.age?.value || 0} {pet.age?.unit === 'years' ? 'años' : 'meses'}</p>
                  <p style={{ color: "#4caf50", fontSize: 11 }}>
                    📍 {pet.location?.city || 'Ubicación no especificada'}
                    {pet.location?.state && `, ${pet.location.state}`}
                  </p>
                  <p style={{ fontSize: 11, color: "#666", marginTop: 5 }}>
                    {pet.description}
                  </p>
                  <div style={{ marginTop: 5 }}>
                    <span className="preference-tag" style={{ fontSize: 10, marginRight: 5 }}>
                      {getSizeLabel(pet.size)}
                    </span>
                    {pet.health?.isVaccinated && (
                      <span className="preference-tag" style={{ fontSize: 10, background: "#e8f5e8", color: "#4caf50" }}>
                        Vacunado
                      </span>
                    )}
                    <span className="preference-tag" style={{ fontSize: 10, background: "#e3f2fd", color: "#1976d2" }}>
                      {getTypeLabel(pet.type)}
                    </span>
                  </div>
                </div>
                <div className="result-status" style={getStatusColor(pet.status)}>
                  {getStatusText(pet.status)}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
              <p style={{ fontSize: "16px", marginBottom: "8px" }}>No se encontraron mascotas</p>
              <p style={{ fontSize: "14px", marginBottom: "20px" }}>
                {searchTerm || Object.values(filters).some(f => f)
                  ? "con los filtros aplicados"
                  : "Aún no hay mascotas disponibles para adopción"
                }
              </p>
              {(searchTerm || Object.values(filters).some(f => f)) && (
                <button
                  className="btn-primary"
                  onClick={handleClearFilters}
                  style={{ marginTop: 10 }}
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          )}
        </div>

        {filteredPets.length > 0 && (
          <div style={{ textAlign: "center", marginTop: 20 }}>
            <p style={{ color: "#666", fontSize: 12 }}>
              Toca en una mascota para ver más detalles
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
