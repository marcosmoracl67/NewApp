import PropTypes from "prop-types";
import { useState } from "react";
import "../styles/index.css";

const ChangePasswordModal = ({ usuario, onClose, onSuccess }) => {
  const [nuevaPassword, setNuevaPassword] = useState("");

  const guardarPassword = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/${usuario.usuario_id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ password: nuevaPassword })
      });

      const data = await response.json(); // 👈 leer el cuerpo de la respuesta
  
      if (!response.ok) {
        throw new Error(data.msg || "Error al actualizar la contraseña");
      }  
  
      onSuccess("Contraseña actualizada exitosamente ✅");
      setNuevaPassword("");
      onClose(); // 👈 ¡Eso es todo lo que necesitas!
    } catch (err) {
      alert(err.message,"Error al cambiar contraseña ❌");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <h3>Cambiar contraseña</h3>
        <p>Usuario: <strong>{usuario.username}</strong></p>

        <input
          type="password"
          className="form-input"
          placeholder="Nueva contraseña"
          value={nuevaPassword}
          onChange={(e) => setNuevaPassword(e.target.value)}
        />

        <div className="modal-actions">
          <button className="form-button" onClick={guardarPassword}>
            Guardar
          </button>
          <button className="form-button cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

ChangePasswordModal.propTypes = {
  usuario: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default ChangePasswordModal;