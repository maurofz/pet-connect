import React from "react";

export default function SearchPets() {
  return (
    <div className="phone">
      <div className="header">
        <div className="back-btn">‹</div>
        Buscar Mascotas
      </div>
      <div className="content">
        <div className="feed-actions">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar mascotas disponibles..."
            value="perros"
          />
          <button className="filter-btn">🔍</button>
        </div>
        <div className="tabs">
          <button className="tab active">Todos</button>
          <button className="tab">Perros</button>
          <button className="tab">Gatos</button>
        </div>
        <div className="search-results">
          <p style={{ color: "#666", fontSize: 14, marginBottom: 15 }}>
            25 mascotas encontradas
          </p>
          <div className="result-item">
            <div className="result-avatar">MAX</div>
            <div className="result-info">
              <h4>Max</h4>
              <p>Golden Retriever • Macho • 3 años</p>
              <p style={{ color: "#4caf50", fontSize: 11 }}>
                📍 Quito, Pichincha
              </p>
            </div>
            <div className="result-status status-available">Disponible</div>
          </div>
          <div className="result-item">
            <div className="result-avatar">LUNA</div>
            <div className="result-info">
              <h4>Luna</h4>
              <p>Labrador Mix • Hembra • 2 años</p>
              <p style={{ color: "#4caf50" }}></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
