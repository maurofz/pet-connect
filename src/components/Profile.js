import React from "react";

export default function Profile() {
  return (
    <div className="phone">
      <div className="header">
        Mi Perfil
        <div className="header-icons">
          <div className="icon">✏️</div>
        </div>
      </div>
      <div className="content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">MG</div>
            <div className="profile-info">
              <h3>María González</h3>
              <p>
                Amante de los animales
                <br />
                Veterinaria en Quito
              </p>
              <div style={{ marginTop: 5 }}>
                <span style={{ color: "#4caf50", fontSize: 12 }}>
                  ● En línea
                </span>
              </div>
            </div>
          </div>
          <div className="stats">
            <div className="stat">
              <div className="stat-number">5</div>
              <div className="stat-label">Adopciones</div>
            </div>
            <div className="stat">
              <div className="stat-number">12</div>
              <div className="stat-label">Publicaciones</div>
            </div>
            <div className="stat">
              <div className="stat-number">89</div>
              <div className="stat-label">Seguidores</div>
            </div>
          </div>
          <div className="preferences">
            <h4>Preferencias de Mascotas</h4>
            <div className="preference-tags">
              <span className="preference-tag">Perros pequeños</span>
              <span className="preference-tag">Gatos</span>
              <span className="preference-tag">Cachorros</span>
              <span className="preference-tag">Mascotas tranquilas</span>
            </div>
          </div>
          <div className="action-buttons">
            <button className="btn-action btn-adopt">Buscar Adoptar</button>
            <button className="btn-action btn-message">Mis Mensajes</button>
          </div>
        </div>
        <div className="profile-card">
          <h3 style={{ marginBottom: 15 }}>Mis Mascotas</h3>
          <div className="preference-tags">
            <span
              className="preference-tag"
              style={{ background: "#e8f5e8", color: "#4caf50" }}
            >
              Luna - Disponible
            </span>
            <span
              className="preference-tag"
              style={{ background: "#f3e5f5", color: "#9c27b0" }}
            >
              Rocky - En adopción
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
