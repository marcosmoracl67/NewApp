// src/components/Loader.jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente Loader reutilizable para indicar estados de carga.
 * Muestra un spinner animado con CSS puro.
 *
 * @param {object} props - Propiedades del componente.
 * @param {'small' | 'medium' | 'large'} [props.size='medium'] - Tamaño del spinner.
 * @param {string} [props.className=''] - Clases CSS adicionales para aplicar al contenedor del loader.
 * @param {string} [props.text=''] - Texto opcional para mostrar debajo o junto al spinner.
 * @param {object} [props.style={}] - Estilos en línea adicionales para el contenedor.
 * @param {boolean} [props.overlay=false] - Si es true, el loader actuará como una superposición
 *                                          sobre el elemento padre. El padre debe tener 'position: relative'.
 */
const Loader = ({ size = 'medium', className = '', text = '', style = {}, overlay = false }) => {
  // Aquí es donde cambia: si es un overlay, se añade una clase especial
  const containerClasses = `loader-container ${overlay ? 'loader-container--overlay' : ''} ${className}`.trim();
  const spinnerClasses = `loader loader-${size}`.trim();

  return (
    <div className={containerClasses} style={style} role="status" aria-live="polite" aria-label={text || "Cargando"}>
      <div className={spinnerClasses}>
        {/* Usamos aria-label en el contenedor principal para accesibilidad del estado de carga general */}
        {/* Este span se puede mantener como fallback si text es null/vacío para alguna razón */}
        {!text && <span className="visually-hidden">Cargando...</span>}
      </div>
      {text && <div className="loader-text">{text}</div>}
    </div>
  );
};

// Validación de Tipos de Propiedades
Loader.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string,
  text: PropTypes.string,
  style: PropTypes.object,
  overlay: PropTypes.bool, // ¡Nueva prop!
};

export default Loader;