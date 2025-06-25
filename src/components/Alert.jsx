// Alert.jsx
import React, { useEffect, useMemo } from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'; // Iconos de ejemplo
import '../styles/index.css'; 

const Alert = ({
  isOpen,
  onClose,
  type = 'info',
  title,
  message,
  showIcon = true,
  showCloseButton = true,
  autoCloseDelay = null,
  className = '',
  style = {},
  role: customRole, // Renombrar para evitar conflicto con variable local
  ...rest
}) => {

  // Efecto para auto-cierre
  useEffect(() => {
    if (isOpen && autoCloseDelay && onClose) {
      const timerId = setTimeout(onClose, autoCloseDelay);
      return () => clearTimeout(timerId);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  // Determinar icono y rol por defecto
  const { IconComponent, defaultRole } = useMemo(() => {
    switch (type) {
      case 'success': return { IconComponent: FaCheckCircle, defaultRole: 'status' };
      case 'error': return { IconComponent: FaTimesCircle, defaultRole: 'alert' };
      case 'warning': return { IconComponent: FaExclamationTriangle, defaultRole: 'alert' };
      case 'info':
      default:
        return { IconComponent: FaInfoCircle, defaultRole: 'status' };
    }
  }, [type]);

  const alertRole = customRole || defaultRole;
  const ariaLive = (alertRole === 'alert') ? 'assertive' : 'polite';

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`alert alert--type-${type} ${className}`}
      style={style}
      role={alertRole}
      aria-live={ariaLive}
      aria-atomic="true"
      {...rest}
    >
      {showIcon && IconComponent && (
        <div className="alert__icon">
          <IconComponent />
        </div>
      )}
      <div className="alert__content">
        {title && <h3 className="alert__title">{title}</h3>}
        <div className="alert__message">{message}</div>
      </div>
      {showCloseButton && onClose && (
        <button
          type="button" // Evitar submit en formularios
          className="alert__close-button"
          onClick={onClose}
          aria-label="Cerrar alerta"
          title="Cerrar"
        >
          <FaTimes /> {/* O un icono de 'x' más estilizado */}
        </button>
      )}
    </div>
  );
};

export default Alert;