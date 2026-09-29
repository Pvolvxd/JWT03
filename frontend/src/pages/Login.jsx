import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const { login, user } = useAuth();

  useEffect(() => {
    if (!user) {
      setUsername("");
      setPassword("");
      setMensaje("");
      setError("");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMensaje("");
    setError("");

    if (!username.trim()) {
      setError("El usuario es obligatorio.");
      return;
    }

    if (!password) {
      setError("La contraseña es obligatoria.");
      return;
    }

    try {
      const response = await api.post("/auth/signin", {
        username,
        password,
      });

      login(response.data);

      setMensaje("Inicio de sesión correcto.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Usuario o contraseña incorrectos."
      );
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1>Iniciar sesión</h1>

        <p>
          Ingresa tus credenciales para acceder al sistema
        </p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Usuario</label>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
            />
          </div>

          <div>
            <label>Contraseña</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
            />
          </div>

          <button type="submit">
            Iniciar sesión
          </button>
        </form>

        {error && (
          <p style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}

        {mensaje && (
          <p style={{ color: "#059669" }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}

export default Login;