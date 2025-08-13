import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    if (!email) return "El email es requerido";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Ingresa un email válido";
    return "";
  };

  const validatePassword = (password) => {
    if (!password) return "La contraseña es requerida";
    if (password.length < 6) return "La contraseña debe tener al menos 6 caracteres";
    return "";
  };

  // Real-time validation for email
  useEffect(() => {
    if (emailTouched) {
      setEmailError(validateEmail(email));
    }
  }, [email, emailTouched]);

  // Real-time validation for password
  useEffect(() => {
    if (passwordTouched) {
      setPasswordError(validatePassword(password));
    }
  }, [password, passwordTouched]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setGeneralError(""); // Clear general error when user starts typing
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setGeneralError(""); // Clear general error when user starts typing
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    setPasswordError(validatePassword(password));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marcar ambos campos como tocados para mostrar errores
    setEmailTouched(true);
    setPasswordTouched(true);

    // Limpiar errores previos
    setGeneralError("");

    // Validar ambos campos
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    // Si hay errores de validación, no continuar
    if (emailValidation || passwordValidation) {
      return;
    }

    setIsLoading(true);

    // Simular llamada a API
    setTimeout(() => {
      const user = users.find(u => u.email === email);

      if (!user) {
        setEmailError("El email no está registrado");
        setPasswordError("");
        setIsLoading(false);
        return;
      }

      if (user.password !== password) {
        setPasswordError("La contraseña es incorrecta");
        setEmailError("");
        setPassword(""); // Limpiar campo por seguridad
        // setPasswordTouched(false);
        setIsLoading(false);
        return;
      }

      // Si todo está bien, loguear
      localStorage.setItem("currentUser", JSON.stringify({
        email: user.email,
        name: user.name,
        isLoggedIn: true
      }));

      // Navegar al feed
      navigate("/feed");
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("maria@petconnect.com");
    setPassword("123456");
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    setEmailTouched(false);
    setPasswordTouched(false);
  };

  const handleForgotPassword = () => {
    alert("Funcionalidad de recuperación de contraseña en desarrollo. Contacta al administrador.");
  };

  const handleRegister = () => {
    alert("Funcionalidad de registro en desarrollo. Usa las credenciales de demo.");
  };

  const getFieldClassName = (fieldError, isTouched) => {
    if (!isTouched) return "form-group";
    return fieldError ? "form-group form-group-error" : "form-group form-group-success";
  };

  return (
    <div className="phone">
      <div className="header">
        PetConnect
      </div>
      <div className="content">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="logo"></div>
          <h1 className="app-title">Red Social de Adopción</h1>
          <p className="subtitle">Conecta mascotas con familias</p>

          {generalError && <div className="error-message">{generalError}</div>}

          <div className={getFieldClassName(emailError, emailTouched)}>
            <label>Email</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              autoComplete="username"
              disabled={isLoading}
              className={emailError && emailTouched ? "input-error" : ""}
            />
            {emailError && emailTouched && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {emailError}
              </div>
            )}
          </div>

          <div className={getFieldClassName(passwordError, passwordTouched)}>
            <label>Contraseña</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                autoComplete="current-password"
                disabled={isLoading}
                className={passwordError && passwordTouched ? "input-error" : ""}
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
            {passwordError && passwordTouched && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {passwordError}
              </div>
            )}
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
