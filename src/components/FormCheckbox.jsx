// --- START OF FILE components/FormCheckBox.jsx --- (NUEVO)
import React, { forwardRef, useId } from 'react';
import PropTypes from 'prop-types';
import { FaCheck } from 'react-icons/fa'; // Icono de checkmark
// Asegúrate de que los estilos necesarios estén en forms.css o components.css
import '../styles/index.css'; 

const FormCheckBox = forwardRef(
  (
    {
      name,                 // Name para formularios
      label,                // Texto visible asociado (¡muy importante!)
      checked,              // Estado actual (controlado)
      onChange,             // Función de cambio
      disabled = false,     // Estado deshabilitado
      error = null,         // Mensaje de error
      className = "",       // Clases para el wrapper visual del checkbox
      containerClassName = "",// Clases para el div.form-group contenedor
      required = false,     // Requerido (menos común, pero por consistencia)
      // id ya no es necesario como prop externa
      ...rest               // Otras props para el input (aria-label si no hay label visible)
    },
    ref // Ref para el input checkbox oculto
  ) => {
    // Generar ID único
    const uniqueId = useId();
    const inputId = `checkbox-${name || uniqueId}`;

    // Determinar si está deshabilitado
    const isDisabled = disabled;

    return (
      // Contenedor principal estandarizado
      // Aplicar clase 'form-group--checkbox' para posibles estilos específicos del grupo
      <div className={`form-group form-group--checkbox ${error ? 'form-group--error' : ''} ${isDisabled ? 'form-group--disabled' : ''} ${containerClassName}`.trim()}>
        {/* Contenedor interno para alinear checkbox y label */}
        <div className="form-checkbox-inner">
          {/* Input real oculto */}
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={isDisabled}
            required={required}
            className="form-checkbox__input--hidden" // Clase para ocultarlo visualmente
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...rest}
          />
          {/* Representación visual del checkbox (es un label para el input oculto) */}
          <label
            htmlFor={inputId} // Asociado al input oculto
            className={`form-checkbox__visual ${checked ? 'form-checkbox--checked' : ''} ${isDisabled ? 'form-checkbox--disabled' : ''} ${error ? 'form-checkbox--error' : ''} ${className}`.trim()}
            aria-hidden="true" // Ocultar de tecnologías asistivas (el input real ya lo anuncia)
          >
            {/* Icono checkmark (se muestra condicionalmente con CSS) */}
            <FaCheck className="form-checkbox__checkmark" />
          </label>

          {/* Etiqueta de texto visible (si se proporciona) */}
          {label && (
            <label htmlFor={inputId} className="form-label checkbox-label"> {/* Asociado al input oculto */}
              {label}
              {required && <span className="required-indicator">*</span>}
            </label>
          )}
        </div> {/* Fin form-checkbox-inner */}

        {/* Mensaje de Error */}
        {error && (
          <div id={`${inputId}-error`} className="form-error-message" role="alert">
            {error}
          </div>
        )}
      </div> // Fin form-group
    );
  }
);

// Definición de PropTypes
FormCheckBox.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string, // El label es muy recomendado para accesibilidad
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  className: PropTypes.string, // Clases para el label visual
  containerClassName: PropTypes.string, // Clases para el div.form-group
  required: PropTypes.bool,
};

// Valores por defecto
FormCheckBox.defaultProps = {
  disabled: false,
  error: null,
  className: '',
  containerClassName: '',
  required: false,
};

// Añadir displayName
FormCheckBox.displayName = 'FormCheckBox';

export default FormCheckBox;
