import { useId } from 'react';
import PropTypes from 'prop-types';
// Asegúrate de que los estilos necesarios estén en forms.css o components.css
import '../styles/index.css'; 

const FormRadioGroup = ({
  name,                 // Name compartido para el grupo (requerido)
  legend,               // Texto para la leyenda del fieldset (muy recomendado)
  options = [],         // Array de { value: string|number, label: string }
  selectedValue,        // Valor actualmente seleccionado (controlado)
  onChange,             // Función de cambio (requerido)
  disabled = false,     // Deshabilitar todo el grupo
  error = null,         // Mensaje de error
  inline = false,       // Layout horizontal si es true
  required = false,     // Requerido (para la leyenda)
  containerClassName = "",// Clases para el fieldset/div contenedor
  radioClassName = "",  // Clases para el div de cada radio item
  // No se usa forwardRef aquí ya que apunta a un grupo, no un input único
  ...rest               // Props para el fieldset/div contenedor
}) => {
  // Generar ID base para el grupo (para aria-describedby)
  const uniqueGroupId = useId();
  const errorId = error ? `radiogroup-error-${uniqueGroupId}` : undefined;

  // Componente contenedor: fieldset si hay leyenda, div si no
  const ContainerTag = legend ? 'fieldset' : 'div';

  return (
    <ContainerTag
      className={`form-group form-radio-group ${inline ? 'form-radio-group--inline' : ''} ${error ? 'form-group--error' : ''} ${disabled ? 'form-group--disabled' : ''} ${containerClassName}`.trim()}
      aria-invalid={!!error}
      aria-describedby={errorId}
      disabled={disabled} // Deshabilita el fieldset (afecta inputs dentro)
      {...rest}
    >
      {/* Leyenda del grupo (si se proporciona) */}
      {legend && (
        <legend className="form-label">
          {legend}
          {required && <span className="required-indicator">*</span>}
        </legend>
      )}

      {/* Contenedor para las opciones de radio */}
      <div className="form-radio-options-wrapper">
        {options.map((option, index) => {
          // ID único para cada radio input/label
          const radioId = `radio-${uniqueGroupId}-${index}`;
          return (
            // Wrapper para cada opción (radio + label)
            <div key={option.value} className={`form-radio-item ${radioClassName}`.trim()}>
              <input
                type="radio"
                id={radioId}
                name={name} // Nombre compartido
                value={option.value}
                checked={selectedValue === option.value} // Comprobar si está seleccionado
                onChange={onChange} // Manejador de cambio
                disabled={disabled} // Hereda disabled del grupo
                required={required && index === 0} // Marcar solo el primero como req. si el grupo lo es
                className="form-radio__input" // Clase para posible estilo futuro
                // aria-describedby se maneja en el fieldset
              />
              <label htmlFor={radioId} className="form-radio-label">
                {option.label}
              </label>
            </div>
          );
        })}
      </div>

      {/* Mensaje de Error */}
      {error && (
        <div id={errorId} className="form-error-message" role="alert">
          {error}
        </div>
      )}
    </ContainerTag>
  );
};

// Definición de PropTypes
FormRadioGroup.propTypes = {
  name: PropTypes.string.isRequired,
  legend: PropTypes.string, // Texto para la leyenda <legend>
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Puede ser null/undefined si no hay selección inicial
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  inline: PropTypes.bool, // Para layout horizontal
  required: PropTypes.bool,
  containerClassName: PropTypes.string,
  radioClassName: PropTypes.string, // Clase para cada item radio+label
};

// Valores por defecto
FormRadioGroup.defaultProps = {
  disabled: false,
  error: null,
  inline: false,
  required: false,
  containerClassName: '',
  radioClassName: '',
};

export default FormRadioGroup;