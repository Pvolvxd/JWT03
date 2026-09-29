import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isUser = user?.roles?.includes("ROLE_USER");
  const isModerator = user?.roles?.includes("ROLE_MODERATOR");
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        JWT Security
      </div>

      <div className="navbar-links">
        <Link to="/">Inicio</Link>

        {!user && (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registro</Link>
          </>
        )}

        {isUser && (
          <Link to="/user">Usuario</Link>
        )}

        {isModerator && (
          <Link to="/moderator">Moderador</Link>
        )}

        {isAdmin && (
          <Link to="/admin">Administrador</Link>
        )}
      </div>

      {user && (
        <div className="navbar-user">
          <div className="user-info">
            <span className="user-label">
              Sesión activa
            </span>

            <strong>
              {user.username}
            </strong>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;