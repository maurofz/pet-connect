import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    state: "",
    country: "Ecuador"
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value) return "El nombre es requerido";
        if (value.length < 2) return "El nombre debe tener al menos 2 caracteres";
        if (value.length > 50) return "El nombre no puede tener más de 50 caracteres";
        return "";

      case "email":
        if (!value) return "El email es requerido";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return "Ingresa un email válido";
        return "";

      case "password":
        if (!value) return "La contraseña es requerida";
        if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres";
        return "";

      case "confirmPassword":
        if (!value) return "Confirma tu contraseña";
        if (value !== formData.password) return "Las contraseñas no coinciden";
        return "";

      case "phone":
        if (value && value.length < 9) return "El teléfono debe tener al menos 9 dígitos";
        return "";

      case "city":
        if (value && value.length < 2) return "La ciudad debe tener al menos 2 caracteres";
        return "";

      default:
        return "";
    }
  };

  // Real-time validation
  useEffect(() => {
    const newErrors = {};
    Object.keys(touched).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setGeneralError(""); // Clear general error when user types
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach(field => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      // Prepare data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        location: {
          city: formData.city || undefined,
          state: formData.state || undefined,
          country: formData.country
        }
      };

      // Remove undefined values
      Object.keys(userData).forEach(key => {
        if (userData[key] === undefined) {
          delete userData[key];
        }
      });

      if (userData.location) {
        Object.keys(userData.location).forEach(key => {
          if (userData.location[key] === undefined) {
            delete userData.location[key];
          }
        });
        if (Object.keys(userData.location).length === 0) {
          delete userData.location;
        }
      }

      // Call API
      const response = await apiService.auth.register(userData);

      // Show success message
      setShowSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);

    } catch (error) {
      console.error("Register error:", error);

      // Handle specific errors
      if (error.message.includes("ya existe")) {
        setErrors({ email: "Este email ya está registrado" });
      } else {
        setGeneralError("Error al registrar usuario. Intenta nuevamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/");
  };

  const getFieldClassName = (fieldName) => {
    if (!touched[fieldName]) return "form-group";
    return errors[fieldName] ? "form-group form-group-error" : "form-group form-group-success";
  };

  // Success modal
  if (showSuccess) {
    return (
      <div className="phone">
        <div className="header">
          PetConnect
        </div>
        <div className="content">
          <div className="login-form" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div className="logo"></div>
            <div style={{ fontSize: '60px', margin: '20px 0' }}>✅</div>
            <h1 className="app-title" style={{ color: '#4caf50' }}>¡Cuenta Creada Exitosamente!</h1>
            <p className="subtitle">Tu cuenta ha sido registrada correctamente</p>

            <div style={{
              background: '#f0f8ff',
              padding: '20px',
              borderRadius: '10px',
              margin: '20px 0',
              border: '1px solid #667eea'
            }}>
              <p style={{ margin: '10px 0', fontSize: '14px' }}>
                <strong>Email:</strong> {formData.email}
              </p>
              <p style={{ margin: '10px 0', fontSize: '14px' }}>
                <strong>Nombre:</strong> {formData.name}
              </p>
            </div>

            <p style={{ color: '#666', fontSize: '14px', margin: '20px 0' }}>
              Serás redirigido al login en unos segundos...
            </p>

            <button
              className="btn-primary"
              onClick={() => navigate("/")}
              style={{ marginTop: '20px' }}
            >
              Ir al Login Ahora
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone">
      <div className="header">
        <button
          onClick={handleBackToLogin}
          style={{
            background: "none",
            border: "none",
            color: "#667eea",
            fontSize: "14px",
            cursor: "pointer",
            padding: "5px 10px"
          }}
        >
          ← Volver al Login
        </button>
        PetConnect
      </div>
      <div className="content">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="logo"></div>
          <h1 className="app-title">Crear Cuenta</h1>
          <p className="subtitle">Únete a nuestra comunidad</p>

          {generalError && <div className="error-message">{generalError}</div>}

          <div className={getFieldClassName("name")}>
            <label>Nombre completo *</label>
            <input
              type="text"
              name="name"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={errors.name && touched.name ? "input-error" : ""}
            />
            {errors.name && touched.name && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {errors.name}
              </div>
            )}
          </div>

          <div className={getFieldClassName("email")}>
            <label>Email *</label>
            <input
              type="email"
              name="email"
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={errors.email && touched.email ? "input-error" : ""}
            />
            {errors.email && touched.email && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {errors.email}
              </div>
            )}
          </div>

          <div className={getFieldClassName("password")}>
            <label>Contraseña *</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={errors.password && touched.password ? "input-error" : ""}
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
            {errors.password && touched.password && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {errors.password}
              </div>
            )}
          </div>

          <div className={getFieldClassName("confirmPassword")}>
            <label>Confirmar contraseña *</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
                className={errors.confirmPassword && touched.confirmPassword ? "input-error" : ""}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <div className={getFieldClassName("phone")}>
            <label>Teléfono (opcional)</label>
            <input
              type="tel"
              name="phone"
              placeholder="+593 98 9254 630"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={errors.phone && touched.phone ? "input-error" : ""}
            />
            {errors.phone && touched.phone && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {errors.phone}
              </div>
            )}
          </div>

          <div className={getFieldClassName("city")}>
            <label>Ciudad (opcional)</label>
            <input
              type="text"
              name="city"
              placeholder="Portoviejo"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={errors.city && touched.city ? "input-error" : ""}
            />
            {errors.city && touched.city && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {errors.city}
              </div>
            )}
          </div>

          <div className={getFieldClassName("state")}>
            <label>Provincia (opcional)</label>
            <input
              type="text"
              name="state"
              placeholder="Manabi"
              value={formData.state}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading}
              className={errors.state && touched.state ? "input-error" : ""}
            />
            {errors.state && touched.state && (
              <div className="field-error">
                <span className="error-icon">⚠️</span>
                {errors.state}
              </div>
            )}
          </div>

          <button
            className="btn-primary"
            type="submit"
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p style={{ color: "#666", fontSize: 12 }}>¿Ya tienes cuenta?</p>
            <button
              type="button"
              onClick={handleBackToLogin}
              style={{
                color: "#667eea",
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline"
              }}
            >
              Inicia sesión aquí
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 