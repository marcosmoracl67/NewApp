// src/components/FormButton.jsx
import { forwardRef } from 'react';
import Loader from './Loader'; // Asegúrate que Loader acepta aria-label
import PropTypes from 'prop-types'; // Opcional pero recomendado

const FormButton = forwardRef(
  (
    {
      label,
      icon,
      onClick,
      type = 'button',
      variant = 'default', // default, danger, outline, success, subtle, add
      size = 'medium', // small, medium, large
      align = 'center', // Nota: Afecta justifySelf, el contenedor padre es importante
      fullWidth = false,
      disabled = false,
      isLoading = false,
      loaderSize = 'small', // Tamaño del Loader interno
      loaderText = 'Cargando...', // Texto ARIA para el Loader
      className = '', // Clases adicionales
      children, // Mantener por si acaso, pero priorizar label/icon
      style, // Estilos inline
      ...rest // Pasar otros props (aria-*, data-*, title, etc.)
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    // --- Construcción de clases BEM ---
    const baseClass = 'button'; // <<< CLASE BASE CORRECTA
    const variantClass = `button--variant-${variant}`;
    const sizeClass = `button--size-${size}`;
    const fullWidthClass = fullWidth ? 'button--fullwidth' : '';
    const loadingClass = isLoading ? 'button--state-loading' : '';

    const combinedClassName = [
        baseClass,
        variantClass,
        sizeClass,
        fullWidthClass,
        loadingClass,
        className, // Añadir clases externas
    ].filter(Boolean).join(' ').trim();

    // Estilo para alineación horizontal del botón (usando justifySelf)
    // Nota: justifySelf funciona mejor dentro de un contenedor Grid.
    // Para Flexbox, la alineación la controla el contenedor padre.
    // Mantenemos la prop `align` por si se usa con Grid o un wrapper.
    const buttonStyle = { ...style };
    if (align === 'left') buttonStyle.justifySelf = 'start';
    else if (align === 'right') buttonStyle.justifySelf = 'end';
    // 'center' es el default de justify-content en el CSS base .button

    return (
      <button
        ref={ref}
        type={type}
        className={combinedClassName} // <<< Clases BEM combinadas
        onClick={onClick}
        disabled={isDisabled}
        style={buttonStyle} // Aplicar estilos inline
        {...rest} // Pasar atributos restantes
        aria-live={isLoading ? 'polite' : undefined}
        aria-busy={isLoading ? 'true' : undefined}
      >
        {/* Loader se muestra condicionalmente */}
        {isLoading && (
          // <<< Clase interna BEM
          <span className="button__loader" aria-hidden="true">
            <Loader size={loaderSize} aria-label={loaderText} />
          </span>
        )}

        {/* Contenido normal (icono y/o label/children) */}
        {/* Se oculta con CSS cuando isLoading es true */}
        {/* <<< Clase interna BEM */}
        <span className="button__content">
          {icon && (
             // <<< Clase interna BEM
             <span className="button__icon" aria-hidden="true">{icon}</span>
          )}
          {label || children ? (
             // <<< Clase interna BEM
            <span className="button__label">{label || children}</span>
          ) : null}
        </span>
      </button>
    );
  }
);

FormButton.displayName = 'FormButton'; // Ayuda en DevTools

// Definición de PropTypes (Opcional pero muy recomendado)
FormButton.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['default', 'danger', 'outline', 'success', 'subtle', 'add']), // Añadido 'add' si lo usas
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  align: PropTypes.oneOf(['left', 'center', 'right']),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  loaderSize: PropTypes.oneOf(['small', 'medium', 'large']),
  loaderText: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object,
};

// No necesitas defaultProps si usas los valores por defecto en la desestructuración

export default FormButton;