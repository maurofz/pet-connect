import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation
    if (!email || !password) {
      setError("Por favor, ingresa tu email y contraseña.");
      return;
    }
    // Simulate login success
    setError("");
    navigate("/feed");
  };

  return (
    <div className="phone">
      <div className="header">
        <div className="back-btn">‹</div>
        PetConnect
      </div>
      <div className="content">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="logo"></div>
          <h1 className="app-title">Red Social de Adopción</h1>
          <p className="subtitle">Conecta mascotas con familias</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button className="btn-primary" type="submit">
            Iniciar Sesión
          </button>

          <div style={{ marginTop: 20 }}>
            <p style={{ color: "#666", fontSize: 12 }}>¿No tienes cuenta?</p>
            <a href="#" style={{ color: "#667eea", fontSize: 12 }}>
              Regístrate aquí
            </a>
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ color: "#666", fontSize: 12 }}>
              ¿Olvidaste tu contraseña?
            </p>
            <p style={{ color: "#666", fontSize: 12 }}>
              ¿Otros problemas de acceso?
            </p>
            <p style={{ color: "#666", fontSize: 12 }}>
              ¿Preguntas frecuentes?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
