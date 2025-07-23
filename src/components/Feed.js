import React from "react";

export default function Feed() {
  return (
    <div className="phone">
      <div className="header">
        Feed Principal
        <div className="header-icons">
          <div className="icon">🔍</div>
          <div className="icon">➕</div>
          <div className="icon">🔔</div>
        </div>
      </div>
      <div className="content">
        <div className="feed-actions">
          <input
            type="text"
            className="search-bar"
            placeholder="Buscar mascotas para adoptar..."
          />
          <button className="filter-btn">🔍</button>
        </div>
        <div className="post-card">
          <div className="post-header">
            <div className="post-avatar">MG</div>
            <div className="post-info">
              <h4>María González</h4>
              <p>Hace 2 horas • Adopción</p>
            </div>
          </div>
          <div className="post-content">
            <div className="post-tags">
              <span className="post-tag">Adopción</span>
              <span className="post-tag">Educación</span>
              <span className="post-tag">Animal</span>
            </div>
          </div>
          <div className="post-actions">
            <button className="post-action">❤️ 5</button>
            <button className="post-action">💬 12</button>
            <button className="post-action">🔄 3</button>
          </div>
        </div>
        <div className="post-card">
          <div className="post-header">
            <div className="post-avatar">DV</div>
            <div className="post-info">
              <h4>Dr. Veterinario</h4>
              <p>Hace 5 horas • Consejos de Alimentación</p>
            </div>
          </div>
          <div className="post-content">
            <div className="post-tags">
              <span className="post-tag">Consejos</span>
              <span className="post-tag">Salud</span>
            </div>
          </div>
          <div className="post-actions">
            <button className="post-action">❤️ 8</button>
            <button className="post-action">💬 15</button>
            <button className="post-action">🔄 2</button>
          </div>
        </div>
        <button className="floating-btn">➕</button>
      </div>
    </div>
  );
}
