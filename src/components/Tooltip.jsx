// src/components/Tooltip.jsx
import React, {
  useState, useRef, useEffect, useId, cloneElement, Children
} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const Tooltip = ({
  children,
  content,
  position = 'top',
  showDelay = 150,
  hideDelay = 100,
  className = '',
  tooltipClassName = '',
  disabled = false,
  ...rest
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const tooltipId = useId();
  const showTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null); // <--- NUEVO: Referencia al div del tooltip

  const clearTimeouts = () => {
    clearTimeout(showTimeoutRef.current);
    clearTimeout(hideTimeoutRef.current);
  };

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return; // Asegúrate de que el tooltip también esté renderizado

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect(); // <--- Obtener dimensiones del tooltip
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const scrollX = window.scrollX || document.documentElement.scrollLeft;

    // Ajusta tooltipWidth si no tienes una width fija en CSS, o usa tooltipRect.width
    // Si tu CSS tiene un max-width, la width real podría variar
    // Puedes usar una variable CSS como --tooltip-fixed-width para consistencia si lo prefieres
    // Si el tooltip no tiene width fija, usa tooltipRect.width
    const tooltipActualWidth = tooltipRect.width; // Usa la width real del tooltip
    const tooltipActualHeight = tooltipRect.height; // Usa la height real del tooltip

    const offset = 4; // <--- AJUSTADO: Un offset más pequeño o negativo
    const arrowSize = 6; // Del CSS: --tooltip-arrow-size


    let top = 0, left = 0;
    switch (position) {
      case 'bottom':
        top = rect.bottom + scrollY + offset;
        left = rect.left + scrollX + rect.width / 2 - tooltipActualWidth / 2;
        break;
      case 'left':
        top = rect.top + scrollY + rect.height / 2 - tooltipActualHeight / 2;
        left = rect.left + scrollX - tooltipActualWidth - offset;
        break;
      case 'right':
        top = rect.top + scrollY + rect.height / 2 - tooltipActualHeight / 2;
        left = rect.right + scrollX + offset;
        break;
      case 'top':
      default:
        top = rect.top + scrollY - tooltipActualHeight - offset; // <--- CLAVE: Restar la altura del tooltip
        left = rect.left + scrollX + rect.width / 2 - tooltipActualWidth / 2;
        break;
    }

    setCoords({ top, left });
  };

  // Vuelve a calcular la posición cuando la visibilidad cambia (tooltip se muestra)
  // y cuando la ventana cambia de tamaño/scroll.
  useEffect(() => {
    if (isVisible) {
      calculatePosition(); // Recalcula cuando se hace visible
      const handleResize = () => calculatePosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize); // Para cuando el scroll cambie
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isVisible, position]); // Añadir position a deps para recalcular si cambia dinámicamente


  const handleShow = () => {
    if (disabled) return;
    clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true); // Primero hazlo visible para que tooltipRef.current tenga un valor
      // calculatePosition() se llamará en el useEffect inmediatamente después
    }, showDelay);
  };

  const handleHide = () => {
    if (disabled) return;
    clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  useEffect(() => () => clearTimeouts(), []);
  useEffect(() => {
    if (disabled) {
      clearTimeouts();
      setIsVisible(false);
    }
  }, [disabled]);

  let triggerElement;
  try {
    const child = Children.only(children);
    triggerElement = cloneElement(child, {
      ref: triggerRef,
      'aria-describedby': tooltipId,
      onMouseEnter: handleShow,
      onMouseLeave: handleHide,
      onFocus: handleShow,
      onBlur: handleHide,
    });
  } catch (error) {
    console.error("Tooltip children must be a single React element.", error);
    triggerElement = children; // Fallback para que la app no crashee
  }

  return (
    <>
      {triggerElement}
      {isVisible &&
        ReactDOM.createPortal(
          <div
            id={tooltipId}
            ref={tooltipRef} // <--- ASIGNA LA REFERENCIA AL TOOLTIP
            className={`tooltip tooltip--portal tooltip--position-${position} ${tooltipClassName}`}
            style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                position: 'absolute', // Asegura posicionamiento absoluto en document.body
                zIndex: 'var(--tooltip-z-index)' // Usa la variable CSS
            }}
            role="tooltip"
          >
            <div className="tooltip__content">{content}</div>
            <div className="tooltip__arrow" aria-hidden="true"></div>
          </div>,
          document.body
        )}
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
  position: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  showDelay: PropTypes.number,
  hideDelay: PropTypes.number,
  className: PropTypes.string,
  tooltipClassName: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Tooltip;