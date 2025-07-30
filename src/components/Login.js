import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Simulated user database
  const users = [
    { email: "maria@petconnect.com", password: "123456", name: "María González" },
    { email: "carlos@petconnect.com", password: "123456", name: "Carlos Mendoza" },
    { email: "dr.vet@petconnect.com", password: "123456", name: "Dr. Veterinario" }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Por favor, ingresa tu email y contraseña.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor, ingresa un email válido.");
      return;
    }

    if (!validatePassword(password)) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        // Store user data in localStorage (in a real app, you'd use JWT tokens)
        localStorage.setItem("currentUser", JSON.stringify({
          email: user.email,
          name: user.name,
          isLoggedIn: true
        }));

        // Navigate to feed
        navigate("/feed");
      } else {
        setError("Email o contraseña incorrectos. Intenta con maria@petconnect.com / 123456");
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleDemoLogin = () => {
    setEmail("maria@petconnect.com");
    setPassword("123456");
  };

  const handleForgotPassword = () => {
    alert("Funcionalidad de recuperación de contraseña en desarrollo. Contacta al administrador.");
  };

  const handleRegister = () => {
    alert("Funcionalidad de registro en desarrollo. Usa las credenciales de demo.");
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
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px"
                }}
                disabled={isLoading}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleDemoLogin}
            disabled={isLoading}
            style={{ marginTop: 10 }}
          >
            Usar Credenciales Demo
          </button>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p style={{ color: "#666", fontSize: 12, marginBottom: 5 }}>
              Credenciales de prueba:
            </p>
            <p style={{ color: "#667eea", fontSize: 11, marginBottom: 5 }}>
              maria@petconnect.com / 123456
            </p>
            <p style={{ color: "#667eea", fontSize: 11, marginBottom: 5 }}>
              carlos@petconnect.com / 123456
            </p>
            <p style={{ color: "#667eea", fontSize: 11 }}>
              dr.vet@petconnect.com / 123456
            </p>
          </div>

          <div style={{ marginTop: 20 }}>
            <p style={{ color: "#666", fontSize: 12 }}>¿No tienes cuenta?</p>
            <button
              type="button"
              onClick={handleRegister}
              style={{
                color: "#667eea",
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Regístrate aquí
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                color: "#666",
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                display: "block",
                marginBottom: 5
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
            <button
              type="button"
              onClick={() => alert("Contacta al soporte técnico")}
              style={{
                color: "#666",
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                display: "block",
                marginBottom: 5
              }}
            >
              ¿Otros problemas de acceso?
            </button>
            <button
              type="button"
              onClick={() => alert("Consulta la documentación de la aplicación")}
              style={{
                color: "#666",
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                display: "block"
              }}
            >
              ¿Preguntas frecuentes?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
