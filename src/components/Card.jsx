// src/components/Card.jsx
import PropTypes from 'prop-types';

// Asegúrate que _Card.css está importado vía index.css

const Card = ({
  children,
  header,
  footer,
  imageSrc,
  imageAlt = '',
  imagePosition = 'top',
  variant = 'bordered', // 'bordered', 'elevated', 'flat'
  className = '',
  as: Component = 'div',
  onClick,
  ...rest
}) => {

  const cardClasses = [
    'card',
    `card--variant-${variant}`,
    imageSrc ? `card--image-position-${imagePosition}` : '',
    onClick ? 'card--clickable' : '',
    className,
  ].filter(Boolean).join(' ');

  const cardProps = {
    className: cardClasses,
    ...rest,
  };

  if (onClick) {
    cardProps.onClick = onClick;
    // Si es clickeable, semánticamente podría ser un botón si no hay otros elementos interactivos dentro
    // o un div con role="button" y tabIndex="0"
    if (Component === 'div') {
      cardProps.role = "button";
      cardProps.tabIndex = 0;
      cardProps.onKeyDown = (e) => { // Permitir activación con Enter/Espacio
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      };
    }
  }

  const ImageComponent = imageSrc && (
    <div className="card__image-wrapper">
      <img src={imageSrc} alt={imageAlt} className="card__image" />
    </div>
  );

  const HeaderComponent = header && (
    <div className="card__header">
      {header}
    </div>
  );

  const BodyComponent = children && (
    <div className="card__body">
      {children}
    </div>
  );

  const FooterComponent = footer && (
    <div className="card__footer">
      {footer}
    </div>
  );

  // Layout para imagen arriba
  if (imagePosition === 'top' || !imageSrc) {
    return (
      <Component {...cardProps}>
        {ImageComponent}
        {/* Si no hay imagen lateral, no necesitamos card__content-wrapper explícito */}
        {HeaderComponent}
        {BodyComponent}
        {FooterComponent}
      </Component>
    );
  }

  // Layout para imagen lateral (izquierda o derecha)
  return (
    <Component {...cardProps}>
      {ImageComponent}
      <div className="card__content-wrapper">
        {HeaderComponent}
        {BodyComponent}
        {FooterComponent}
      </div>
    </Component>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  header: PropTypes.node,
  footer: PropTypes.node,
  imageSrc: PropTypes.string,
  imageAlt: PropTypes.string,
  imagePosition: PropTypes.oneOf(['top', 'left', 'right']),
  variant: PropTypes.oneOf(['bordered', 'elevated', 'flat']),
  className: PropTypes.string,
  as: PropTypes.elementType,
  onClick: PropTypes.func,
};

export default Card;