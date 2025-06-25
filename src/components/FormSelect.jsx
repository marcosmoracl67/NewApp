// --- START OF FILE components/FormSelect.jsx ---
import React, { forwardRef, useId } from "react"; // <<< Añadir forwardRef, useId
import PropTypes from "prop-types";
import '../styles/index.css'; 

// Envolver con forwardRef
const FormSelect = forwardRef(
  (
    {
      name,
      label,
      value,
      onChange,
      options = [],
      placeholder = "Seleccione...",
      disabled = false,
      required = false,
      className = "",
      containerClassName = "",
      error = null,
      style = {},           // <<< NUEVO: Para estilos en el select
      ...rest               // <<< NUEVO: Para pasar otras props
    },
    ref // <<< Recibe el ref
  ) => {
    // Generar ID único
    const uniqueId = useId();
    const selectId = `select-${name || uniqueId}`; // <<< Cambiado a selectId

    return (
      <div className={`form-group ${containerClassName}`.trim()}>
        {label && (
          <label htmlFor={selectId} className="form-label"> {/* <<< Usar selectId */}
            {label}
            {required && <span className="required-indicator">*</span>}
          </label>
        )}
        <select
          ref={ref} // <<< Asignar el ref
          id={selectId} // <<< Usar selectId
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          style={style} // <<< Aplicar estilos
          // Cambiado a form-input para consistencia visual base, pero manteniendo form-select por si hay estilos específicos
          className={`form-input form-select ${error ? 'is-invalid' : ''} ${className}`.trim()}
          aria-label={label || name}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined} // <<< Usar selectId
          {...rest} // <<< Pasar el resto de props
        >
          {/* Opción Placeholder */}
          {placeholder && (
            <option value="" disabled={required} hidden={!required && value !== ""}>
              {placeholder}
            </option>
          )}

          {/* Mapeo de Opciones */}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Mensaje de Error */}
        {error && (
          <div id={`${selectId}-error`} className="form-error-message" role="alert"> {/* <<< Usar selectId */}
            {error}
          </div>
        )}
      </div>
    );
  }
); // <<< Cierre de forwardRef

// Actualizar PropTypes
FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  error: PropTypes.string,
  style: PropTypes.object, // <<< Añadir style a propTypes
};

// Añadir displayName para DevTools
FormSelect.displayName = 'FormSelect';

export default FormSelect;