// src/components/Modal.jsx
import React, { useEffect, useRef } from 'react'; // <<< Añadido useEffect y useRef
import ReactDOM from 'react-dom';
import { FaRegWindowClose } from 'react-icons/fa';
import PropTypes from 'prop-types';

const Modal = ({
  isOpen,
  title,
  width = 40,
  onClose,
  children,
  showCloseButton = true,
  className = '',
  titleCentered = false,
  bodyCentered = false,
  footerContent,
  footerAlign = 'right',
  closeOnEscape = true,        // <<< NUEVA PROP AÑADIDA
  closeOnOverlayClick = true   // <<< NUEVA PROP AÑADIDA
}) => {
  const modalContentRef = useRef(null); // Para ayudar a identificar clics dentro/fuera

  // Efecto para manejar la tecla Escape y el overflow del body
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        if (closeOnEscape) { // <<< Solo cierra si la prop lo permite
          onClose();
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose, closeOnEscape]); // <<< Dependencias actualizadas

  if (!isOpen) return null;

  // Manejador para el clic en el overlay
  const handleOverlayClick = (e) => {
    // Si el clic fue en el overlay (e.target) y no en el contenido del modal (modalContentRef.current)
    // Y si closeOnOverlayClick es true
    if (e.target === e.currentTarget && closeOnOverlayClick) { // e.currentTarget se refiere al div.modal__overlay
      onClose();
    }
  };

  // No necesitamos e.stopPropagation() en el contenido si el overlay maneja el clic correctamente.
  // El handleModalContentClick original con stopPropagation se vuelve innecesario si
  // el chequeo en handleOverlayClick es e.target === e.currentTarget.
  // Esto asegura que el clic debe ser *directamente* en el overlay.

  // Build modal classes
  const baseClass = 'modal';
  const combinedClassName = [
    baseClass,
    className
  ].filter(Boolean).join(' ').trim();

  // Build title classes
  const titleBaseClass = 'modal__title';
  const titleClassName = [
    titleBaseClass,
    titleCentered ? `${titleBaseClass}--centered` : ''
  ].filter(Boolean).join(' ').trim();

  // Build body classes
  const bodyBaseClass = 'modal__body';
  const bodyClassName = [
    bodyBaseClass,
    bodyCentered ? `${bodyBaseClass}--centered` : ''
  ].filter(Boolean).join(' ').trim();

  // Build footer classes
  const footerBaseClass = 'modal__footer';
  const footerClassName = [
    footerBaseClass,
    footerAlign === 'center' ? `${footerBaseClass}--centered` : '',
    footerAlign === 'spaced' ? `${footerBaseClass}--spaced` : '',
  ].filter(Boolean).join(' ').trim();

  return ReactDOM.createPortal(
    <div
      className="modal__overlay"
      onClick={handleOverlayClick} // <<< onClick ahora llama a handleOverlayClick
      role="presentation" // Opcional, algunos lo usan para el overlay
    >
      <div
        ref={modalContentRef} // Asignamos ref al contenido principal del modal
        className={combinedClassName}
        style={{ width: `${width}rem` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        // onClick={handleModalContentClick} // <<< Eliminamos stopPropagation de aquí
                                          // porque el chequeo en handleOverlayClick es más robusto.
      >
        {showCloseButton && (
          <button
            className="modal__close-button"
            onClick={onClose} // El botón X siempre debe cerrar
            aria-label="Cerrar modal"
          >
            <FaRegWindowClose />
          </button>
        )}

        {title && (
          <h2 id="modal-title" className={titleClassName}>
            {title}
          </h2>
        )}

        <div className={bodyClassName}>
          {children}
        </div>

        {footerContent && (
          <div className={footerClassName}>
            {footerContent}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

// Actualiza PropTypes para incluir las nuevas props
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
  titleCentered: PropTypes.bool,
  bodyCentered: PropTypes.bool,
  footerContent: PropTypes.node,
  footerAlign: PropTypes.oneOf(['right', 'center', 'spaced']),
  closeOnEscape: PropTypes.bool,        // <<< NUEVA PROP
  closeOnOverlayClick: PropTypes.bool   // <<< NUEVA PROP
};

// Valores por defecto para las nuevas props (si no se pasan, serán true por defecto)
Modal.defaultProps = {
  showCloseButton: true,
  className: '',
  titleCentered: false,
  bodyCentered: false,
  footerAlign: 'right',
  closeOnEscape: true,
  closeOnOverlayClick: true
};

export default Modal;