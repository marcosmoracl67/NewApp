// --- START OF FILE components/Container.jsx --- (REFACTORIZADO)
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/index.css'; 

const Container = ({
  children,
  as: Tag = 'div',      // <<< NUEVO: Permitir cambiar la etiqueta (div, section, article...)
  background = 'var(--background2)', // <<< Default a variable CSS
  width = "100%",
  padding = "1rem",
  maxWidth = null,       // <<< Default explícito a null
  margin = null,         // <<< NUEVO: Prop para margen explícito
  centered = false,      // <<< NUEVO: Prop para centrado fácil
  bordered = false,
  animated = false,      // Asumiendo animación 'fadeIn'
  textAlign = null,      // <<< Default explícito a null
  className = '',        // <<< NUEVO: Clases adicionales
  style = {},
  ...rest                // <<< NUEVO: Pasar otras props HTML
}) => {

  // Construir clases dinámicamente
  const baseClass = "container";
  const classes = [
    baseClass,
    bordered ? `${baseClass}--bordered` : "", // Usar BEM para modificadores
    animated ? `${baseClass}--animated` : "", // Usar BEM
    className, // Añadir clases pasadas por prop
  ].filter(Boolean).join(" ").trim(); // Filtra vacíos y une

  // Construir estilos dinámicamente
  const finalStyles = {
    backgroundColor: background,
    width,
    // Aplicar maxWidth solo si tiene valor
    ...(maxWidth && { maxWidth }),
    padding,
    // Aplicar textAlign solo si tiene valor
    ...(textAlign && { textAlign }),
    // Aplicar margen: Prioridad a prop 'margin', luego a 'centered', luego a 'style.margin'
    margin: margin ? margin : (centered ? '0 auto' : style.margin), // Aplica '0 auto' si centered=true y no hay margin prop
    ...style, // Fusionar estilos inline (sobrescribirá margin si está en style)
  };

  // Limpiar estilos undefined/null/default-margin si no se aplica centrado/margen explícito
  if (!margin && !centered && finalStyles.margin === undefined) {
      delete finalStyles.margin; // Evita aplicar 'margin: undefined'
  }
   if (finalStyles.maxWidth === null) {
       delete finalStyles.maxWidth;
   }
    if (finalStyles.textAlign === null) {
       delete finalStyles.textAlign;
   }


  return (
    <Tag // Usa la etiqueta dinámica
      className={classes}
      style={finalStyles}
      {...rest} // Pasa el resto de props
    >
      {children}
    </Tag>
  );
};

// Definición de PropTypes
Container.propTypes = {
  children: PropTypes.node,
  as: PropTypes.elementType, // Permite cualquier tipo de elemento React
  background: PropTypes.string,
  width: PropTypes.string,
  padding: PropTypes.string,
  maxWidth: PropTypes.string,
  margin: PropTypes.string,   // Nueva prop
  centered: PropTypes.bool,   // Nueva prop
  bordered: PropTypes.bool,
  animated: PropTypes.bool,
  textAlign: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  className: PropTypes.string,
  style: PropTypes.object,
};

// Valores por defecto
Container.defaultProps = {
  as: 'div',
  background: 'var(--background2)',
  width: '100%',
  padding: '1rem',
  maxWidth: null,
  margin: null,
  centered: false,
  bordered: false,
  animated: false,
  textAlign: null,
  className: '',
  style: {},
};

export default Container;