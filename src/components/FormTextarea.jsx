import { forwardRef, useId } from "react";
import PropTypes from "prop-types";
// Asegúrate de que los estilos estén disponibles (forms.css o index.css)
import '../styles/index.css'; 

const FormTextarea = forwardRef(
  (
    {
      name,                 // Requerido para el formulario
      label,                // El texto de la etiqueta
      value,
      onChange,
      placeholder = "",
      rows = 3,             // Cambiado valor por defecto a 3 (más común)
      required = false,
      disabled = false,
      error = null,         
      className = "",       // Clases para el *textarea*
      containerClassName = "",// NUEVO: Clases para el *div contenedor*
      style = {},           // Estilos para el *textarea*
            ...rest             // Pasa otras props HTML nativas al textarea
    },
    ref // Ref se pasa al textarea
  ) => {
    // Generar ID único
    const uniqueId = useId();
    const textareaId = `textarea-${name || uniqueId}`;

    return (
      // Contenedor principal - Estandarizado a form-group
      <div className={`form-group ${containerClassName}`.trim()}>
        {/* Etiqueta visible */}
        {label && (
          <label htmlFor={textareaId} className="form-label">
            {label}
            {required && <span className="required-indicator">*</span>}
          </label>
        )}

        {/* Textarea */}
        <textarea
          ref={ref}
          id={textareaId} // Asociado con label
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          required={required}
          disabled={disabled}
          style={style}
          // Aplica clase de error si existe y clase base 'form-input' para consistencia
          className={`form-input form-textarea ${error ? 'is-invalid' : ''} ${className}`.trim()}
          // Accesibilidad para errores
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : undefined}
          {...rest} // Pasa el resto de props (maxLength, etc.)
        />

        {/* Mensaje de Error */}
        {error && (
          <div id={`${textareaId}-error`} className="form-error-message" role="alert">
            {error}
          </div>
        )}
      </div>
    );
  }
);

// Definición de PropTypes (si usas JS)
FormTextarea.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  style: PropTypes.object,
};

// Valores por defecto si usas JS
FormTextarea.defaultProps = {
  rows: 3,
  required: false,
  disabled: false,
  error: null,
  className: '',
  containerClassName: '',
  style: {},
};

export default FormTextarea;