import { useState } from "react";
import api from "../services/api";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!username.trim()) {
      setError("El nombre de usuario es obligatorio.");
      return;
    }

    if (!email.trim()) {
      setError("El correo electrónico es obligatorio.");
      return;
    }

    if (!email.includes("@")) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }

    if (!password) {
      setError("La contraseña es obligatoria.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      const response = await api.post("/auth/signup", {
        username,
        email,
        password,
      });

      setMensaje(
        response.data.message ||
          "Usuario registrado correctamente."
      );

      setUsername("");
      setEmail("");
      setPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Ocurrió un error al registrar el usuario."
      );
    }
  };

  return (
    <div className="page-container">

      <div className="card">

        <h1>Crear cuenta</h1>

        <p>
          Registra tus datos para acceder al sistema
        </p>

        <form onSubmit={handleSubmit}>

          <div>
            <label>Usuario</label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              placeholder="Ingrese su usuario"
            />
          </div>

          <div>
            <label>Correo electrónico</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <button type="submit">
            Registrarse
          </button>

        </form>

        {error && (
          <p
            style={{
              color: "#dc2626",
              marginTop: "18px",
            }}
          >
            {error}
          </p>
        )}

        {mensaje && (
          <p
            style={{
              color: "#059669",
              marginTop: "18px",
            }}
          >
            {mensaje}
          </p>
        )}

      </div>

    </div>
  );
}

export default Register;