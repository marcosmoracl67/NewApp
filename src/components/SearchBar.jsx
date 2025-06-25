// src/components/SearchBar.jsx
import React, { forwardRef } from 'react';
import { FaSearch } from "react-icons/fa";
import PropTypes from "prop-types";
// Los estilos son importados globalmente via index.css

const SearchBar = forwardRef(
  (
    {
      value,
      onChange,
      placeholder = "Buscar...",
      className = "", // Clases adicionales para el div .search-bar
      id,             // ID para el input (asociación con label si existe externamente)
      ...rest         // Pasar otras props (aria-label, disabled, required, etc.) al <input>
    },
    ref             // Ref se pasa al <input>
  ) => {

    const baseClass = 'search-bar';
    // Aplicar clase de estado si el input está deshabilitado
    const stateClass = rest.disabled ? `${baseClass}--state-disabled` : '';

    const combinedClassName = [
        baseClass,
        stateClass,
        className // Clases externas
    ].filter(Boolean).join(' ').trim();

    return (
      // Contenedor principal con clases BEM
      <div className={combinedClassName}>
        {/* Elemento Input */}
        <input
          ref={ref}
          type="search" // Semántico
          id={id}
          className="search-bar__input" // Clase BEM del elemento
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          {...rest} // Pasar disabled, required, aria-label, etc. aquí
        />
        {/* Elemento Icono */}
        <span className="search-bar__icon" aria-hidden="true"> {/* Ocultar icono de accesibilidad */}
          <FaSearch />
        </span>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string, // Clases para el div principal
  id: PropTypes.string,
  // width y align eliminados
};

export default SearchBar;