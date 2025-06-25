// src/components/Avatar.jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaUser } from 'react-icons/fa'; // Icono de usuario por defecto
import Badge from './Badge'; // Reutilizamos nuestro componente Badge

// Asegúrate que _Avatar.css está importado vía index.css

const Avatar = ({
  src,
  alt = 'Avatar',
  name = '',
  initials: customInitials = null,
  size = 'md',
  shape = 'circle',
  fallbackIcon = <FaUser />,
  badgeContent = null,
  badgeVariant = 'danger', // Default variant para el badge
  badgePosition = 'top-right',
  className = '',
  onClick,
  ...rest
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Resetear error si cambia el src
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false); // Resetear estado de carga si src cambia
  }, [src]);

  const handleError = () => {
    setImageError(true);
    setImageLoaded(false); // Considerar que no cargó
  };

  const handleImageLoad = () => {
    setImageError(false); // Asegurarse que no hay error si cargó bien
    setImageLoaded(true);
  };

  // Calcular iniciales si no se proporcionan y hay un nombre
  const getInitials = () => {
    if (customInitials) {
      return customInitials.substring(0, 2).toUpperCase();
    }
    if (name && typeof name === 'string' && name.trim() !== '') {
      const nameParts = name.trim().split(' ');
      if (nameParts.length > 1) {
        return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
      }
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return '';
  };

  const initialsToDisplay = getInitials();
  const showImage = src && !imageError && imageLoaded; // Mostrar imagen solo si existe, no hay error y cargó
  const showInitials = !showImage && initialsToDisplay;
  const showFallbackIcon = !showImage && !showInitials;

  // Construir clases
  const avatarClasses = [
    'avatar',
    `avatar--shape-${shape}`,
    typeof size === 'string' ? `avatar--size-${size}` : '',
    onClick ? 'avatar--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  // Estilos inline para tamaño personalizado
  const avatarStyles = typeof size === 'number' ? {
    width: `${size}px`,
    height: `${size}px`,
    fontSize: `${Math.max(10, size / 2.25)}px`, // Asegurar un font-size mínimo
  } : {};

  // Props para el componente raíz
  const rootProps = {
    className: avatarClasses,
    style: { ...avatarStyles, ...rest.style }, // Combinar estilos
    ...rest,
  };

  if (onClick) {
    rootProps.role = "button";
    rootProps.tabIndex = 0;
    rootProps.onClick = onClick;
    rootProps.onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    };
  }

  return (
    <div {...rootProps}>
      {src && !imageError && ( // Intentar cargar la imagen
        <img
          src={src}
          alt={alt}
          className="avatar__image"
          onError={handleError}
          onLoad={handleImageLoad}
          style={{ display: imageLoaded ? 'block' : 'none' }} // Ocultar hasta que cargue
        />
      )}

      {/* Placeholder mientras carga la imagen (opcional, podría ser un spinner) */}
      {src && !imageLoaded && !imageError && (
         <span className="avatar__icon" aria-label="Cargando imagen">
            {/* Podrías poner un Loader aquí o un icono de placeholder diferente */}
            {/* <Loader size="small" /> */}
         </span>
      )}


      {showInitials && (
        <span className="avatar__initials" aria-label={name || alt}>
          {initialsToDisplay}
        </span>
      )}

      {showFallbackIcon && (
        <span className="avatar__icon" aria-label={alt}>
          {fallbackIcon}
        </span>
      )}

      {/* Renderizar el badge si hay contenido para él */}
      {badgeContent !== null && badgeContent !== undefined && (
        <div className={`avatar__badge avatar__badge--position-${badgePosition}`}>
          {typeof badgeContent === 'boolean' ? ( // Si es true, mostrar un punto (badge simple)
             <Badge variant={badgeVariant} isPill style={{ padding: '0.3em' }} /> // Badge muy pequeño
          ) : (
             <Badge variant={badgeVariant} isPill>
                {badgeContent}
             </Badge>
          )}
        </div>
      )}
    </div>
  );
};

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  initials: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    PropTypes.number,
  ]),
  shape: PropTypes.oneOf(['circle', 'square', 'rounded']),
  fallbackIcon: PropTypes.node,
  badgeContent: PropTypes.node, // Puede ser string, number, o boolean (para un punto)
  badgeVariant: PropTypes.string, // Usar las variantes de tu componente Badge
  badgePosition: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left']),
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Avatar;