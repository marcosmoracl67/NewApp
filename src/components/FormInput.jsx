// --- START OF FILE components/FormInput.jsx ---
import React, { forwardRef, useId } from "react";
import PropTypes from "prop-types";
// Asegúrate de que los estilos para .form-group, .form-label, .form-input,
// .is-invalid, .form-error-message estén disponibles (ej. en forms.css o index.css)
import '../styles/index.css'; 

const FormInput = forwardRef(
  (
    {
      type = "text",
      name,            // Requerido para el formulario
      label,           // El texto de la etiqueta
      value,
      onChange,
      placeholder = "",
      required = false,
      disabled = false,
      error = null,    //  Mensaje de error (string o null)
      className = "",  // Clases para el *input*
      containerClassName = "", //  Clases para el *div contenedor*
      style = {},      // Estilos para el *input*
      // Eliminado: maxLength (se puede pasar con ...rest si es necesario)
      // Eliminado: ya no se necesita un prop específico para required visual si el label lo indica
      ...rest        // Pasa otras props HTML nativas al input
    },
    ref // Ref se pasa al input
  ) => {
    // Generar un ID único y estable para la asociación label-input
    const uniqueId = useId();
    const inputId = `input-${name || uniqueId}`; // Usa name si existe, sino el id único

    return (
      // Contenedor principal
      <div className={`form-group ${containerClassName}`.trim()}>
        {/* Etiqueta visible */}
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
            {required && <span className="required-indicator">*</span>} {/* Indicador visual opcional */}
          </label>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={type}
          id={inputId} // Asociado con el label
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required} // Atributo HTML nativo
          disabled={disabled}
          style={style}
          // Aplica clase de error si existe
          className={`form-input ${error ? 'is-invalid' : ''} ${className}`.trim()}
          // Accesibilidad para errores
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest} // Pasa el resto de props (maxLength, pattern, etc.)
        />

        {/* Mensaje de Error */}
        {error && (
          <div id={`${inputId}-error`} className="form-error-message" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

// Definición de PropTypes (si usas JS)
FormInput.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  style: PropTypes.object,
};

export default FormInput;
// --- END OF FILE components/FormInput.jsx ---