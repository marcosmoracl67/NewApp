import { useAuth } from '../hooks/useAuth';
import defaultUserImage from "../assets/default-user.png";
import { useTheme } from "../context/ThemeContext";
import "../styles/index.css";

const UserCard = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const imageUrl = user?.imagen_id
    ? `http://localhost:3000/api/imagenes/${user.imagen_id}?v=${Date.now()}`
    : defaultUserImage;

  return (
    <div className="user-card">
      <img src={imageUrl} alt="Avatar" className="user-avatar" />
      <span className="user-name">{user?.nombre}</span>

      <div className="user-actions">
      <button className="user-action-button" onClick={toggleTheme}> 
        {theme === "dark" ? "☀️ Claro" : "🌙 Oscuro" } </button>
        <button className="user-action-button" onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default UserCard;

