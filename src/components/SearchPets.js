import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchPets() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [filteredPets, setFilteredPets] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    age: "",
    size: "",
    gender: "",
    vaccines: false
  });
  const navigate = useNavigate();

  // Sample pets data
  const petsData = [
    {
      id: "1",
      name: "Max",
      breed: "Golden Retriever",
      type: "Perro",
      gender: "Macho",
      age: 3,
      size: "Grande",
      location: "Quito, Pichincha",
      status: "available",
      avatar: "MAX",
      description: "Perro muy enérgico que necesita ejercicio diario",
      vaccines: true,
      owner: "María González"
    },
    {
      id: "2",
      name: "Luna",
      breed: "Labrador Mix",
      type: "Perro",
      gender: "Hembra",
      age: 2,
      size: "Mediano",
      location: "Guayaquil, Guayas",
      status: "available",
      avatar: "LUNA",
      description: "Perrita cariñosa y tranquila, perfecta para familias",
      vaccines: true,
      owner: "Carlos Mendoza"
    },
    {
      id: "3",
      name: "Mittens",
      breed: "Siamés",
      type: "Gato",
      gender: "Macho",
      age: 1,
      size: "Pequeño",
      location: "Cuenca, Azuay",
      status: "available",
      avatar: "MI",
      description: "Gato juguetón y curioso, ideal para apartamentos",
      vaccines: true,
      owner: "Ana López"
    },
    {
      id: "4",
      name: "Rocky",
      breed: "Bulldog",
      type: "Perro",
      gender: "Macho",
      age: 4,
      size: "Mediano",
      location: "Quito, Pichincha",
      status: "adopted",
      avatar: "RO",
      description: "Perro tranquilo y leal, perfecto para familias con niños",
      vaccines: false,
      owner: "Dr. Veterinario"
    },
    {
      id: "5",
      name: "Bella",
      breed: "Persa",
      type: "Gato",
      gender: "Hembra",
      age: 2,
      size: "Pequeño",
      location: "Manta, Manabí",
      status: "available",
      avatar: "BE",
      description: "Gata elegante y tranquila, busca un hogar amoroso",
      vaccines: true,
      owner: "Patricia Ruiz"
    },
    {
      id: "6",
      name: "Thor",
      breed: "Husky Siberiano",
      type: "Perro",
      gender: "Macho",
      age: 2,
      size: "Grande",
      location: "Quito, Pichincha",
      status: "available",
      avatar: "TH",
      description: "Perro muy activo y sociable, necesita mucho ejercicio",
      vaccines: true,
      owner: "María González"
    }
  ];

  useEffect(() => {
    filterPets();
  }, [searchTerm, activeTab, filters]);

  const filterPets = () => {
    let filtered = petsData;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(pet =>
        pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pet.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by pet type
    if (activeTab !== "Todos") {
      filtered = filtered.filter(pet => pet.type === activeTab);
    }

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(pet =>
        pet.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by age
    if (filters.age) {
      filtered = filtered.filter(pet => {
        const petAge = pet.age;
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
      filtered = filtered.filter(pet => pet.size === filters.size);
    }

    // Filter by gender
    if (filters.gender) {
      filtered = filtered.filter(pet => pet.gender === filters.gender);
    }

    // Filter by vaccines
    if (filters.vaccines) {
      filtered = filtered.filter(pet => pet.vaccines);
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
      default:
        return "No disponible";
    }
  };

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
                key={pet.id}
                className="result-item"
                onClick={() => handlePetClick(pet.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="result-avatar">{pet.avatar}</div>
                <div className="result-info">
                  <h4>{pet.name}</h4>
                  <p>{pet.breed} • {pet.gender} • {pet.age} años</p>
                  <p style={{ color: "#4caf50", fontSize: 11 }}>
                    📍 {pet.location}
                  </p>
                  <p style={{ fontSize: 11, color: "#666", marginTop: 5 }}>
                    {pet.description}
                  </p>
                  <div style={{ marginTop: 5 }}>
                    <span className="preference-tag" style={{ fontSize: 10, marginRight: 5 }}>
                      {pet.size}
                    </span>
                    {pet.vaccines && (
                      <span className="preference-tag" style={{ fontSize: 10, background: "#e8f5e8", color: "#4caf50" }}>
                        Vacunado
                      </span>
                    )}
                  </div>
                </div>
                <div className="result-status" style={getStatusColor(pet.status)}>
                  {getStatusText(pet.status)}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
              <p>No se encontraron mascotas con los filtros aplicados</p>
              <button
                className="btn-primary"
                onClick={handleClearFilters}
                style={{ marginTop: 10 }}
              >
                Limpiar filtros
              </button>
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
