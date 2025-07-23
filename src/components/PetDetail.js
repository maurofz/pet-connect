import React from "react";

export default function PetDetail() {
  return (
    <div className="phone">
      <div className="header">
        <div className="back-btn">‹</div>
        Detalle de Mascota
      </div>
      <div className="content">
        <div className="pet-detail">
          <div className="pet-image">MAX</div>
          <div className="pet-info">
            <div className="pet-name">Max</div>
            <div className="pet-breed">Golden Retriever • Macho • 3 años</div>
            <div className="pet-stats">
              <div className="pet-stat">
                <div className="pet-stat-value">25 kg</div>
                <div className="pet-stat-label">Peso</div>
              </div>
              <div className="pet-stat">
                <div className="pet-stat-value">Grande</div>
                <div className="pet-stat-label">Tamaño</div>
              </div>
              <div className="pet-stat">
                <div className="pet-stat-value">Al día</div>
                <div className="pet-stat-label">Vacunas</div>
              </div>
            </div>
            <div className="section">
              <h3>Descripción</h3>
              <p>
                Max es un perro muy enérgico de 3 años que necesita mucho
                ejercicio. Le encanta jugar y buscar pelotas. Es muy sociable
                con otros perros y niños. Necesita una familia activa.
              </p>
            </div>
            <div className="section">
              <h3>Vacunas Aplicadas</h3>
              <div className="vaccines">
                <span className="vaccine-tag">Rabia</span>
                <span className="vaccine-tag">Parvovirus</span>
                <span className="vaccine-tag">Distemper</span>
                <span className="vaccine-tag">Hepatitis</span>
                <span className="vaccine-tag pending">
                  Leptospirosis (Pendiente)
                </span>
              </div>
            </div>
            <div className="section">
              <h3>Propietario</h3>
              <div className="profile-header">
                <div
                  className="avatar"
                  style={{ width: 40, height: 40, fontSize: 16 }}
                >
                  MG
                </div>
                <div className="profile-info">
                  <h3 style={{ fontSize: 14 }}>María González</h3>
                  <p>Disponible para adopción</p>
                </div>
              </div>
            </div>
            <button className="btn-primary">Aplicar para Adoptar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
