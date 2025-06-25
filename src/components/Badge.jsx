// src/components/Badge.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTimes } from 'react-icons/fa'; // Icono para cierre

// Asegúrate que _Badge.css está importado vía index.css

const Badge = ({
  children,
  variant = 'gray',
  icon = null,
  isPill = false,
  closable = false,
  onClose,
  closeLabel = 'Cerrar',
  className = '',
  as: Component = 'span', // Renderizar como span por defecto
  ...rest
}) => {

  // Prevenir renderizado de botón de cierre si no hay callback
  const showCloseButton = closable && typeof onClose === 'function';

  // Construir clases dinámicamente
  const badgeClasses = [
    'badge',
    `badge--variant-${variant}`,
    isPill ? 'badge--pill' : '',
    showCloseButton ? 'badge--closable' : '',
    className, // Clases personalizadas
  ].filter(Boolean).join(' '); // Filtrar vacíos y unir

  const handleCloseClick = (event) => {
     // Prevenir eventos no deseados si el badge está dentro de un enlace, etc.
     event.preventDefault();
     event.stopPropagation();
     onClose(); // Llamar al callback del padre
  };


  return (
    <Component className={badgeClasses} {...rest}>
      {icon && (
        <span className="badge__icon" aria-hidden="true">
          {icon}
        </span>
      )}
      <span className="badge__content">
        {children}
      </span>
      {showCloseButton && (
        <button
          type="button"
          className="badge__close"
          aria-label={closeLabel}
          title={closeLabel}
          onClick={handleCloseClick}
        >
           {/* Usar un icono es visualmente mejor que '×' */}
           <FaTimes size="0.8em" />
        </button>
      )}
    </Component>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'success', 'danger', 'warning', 'info', 'gray']),
  icon: PropTypes.node,
  isPill: PropTypes.bool,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  closeLabel: PropTypes.string,
  className: PropTypes.string,
  as: PropTypes.elementType,
};

export default Badge;