// --- START OF FILE components/Parrafo.jsx --- (REFACTORIZADO)
import React from 'react';
import PropTypes from 'prop-types';
// Importar estilos si las variantes usan clases CSS
// import "../styles/typography.css";

const Parrafo = ({
  children,
  variant = 'body',   // <<< NUEVO: Variante predefinida
  className = '',     // <<< NUEVO: Clases CSS adicionales
  // Props de estilo individuales (pueden sobrescribir la variante)
  size,
  color = 'var(--txt-color)', // <<< Default a la variable estándar
  margin = null,      // <<< Quitado default '0', dejar que la variante o CSS externo maneje márgenes comunes
  padding,
  align,
  weight,
  lineHeight,
  fontFamily = 'var(--font-family)',
  maxWidth = null,    // <<< Quitado default '600px'
  textIndent,
  letterSpacing,
  wordSpacing,
  whiteSpace,
  italic,
  style = {},         // <<< NUEVO: Para estilos inline adicionales
  ...rest             // <<< NUEVO: Pasar otras props HTML
}) => {

  // --- Lógica de Variantes (Ejemplo) ---
  const variantStyles = {
    body: { // Estilo por defecto para párrafos normales
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.6', // Ligeramente más alto para mejor legibilidad
      marginBottom: '1rem', // Margen inferior común para párrafos
      color: 'var(--txt-color)', // Color estándar
    },
    lead: { // Párrafo introductorio, más grande
      fontSize: '1.15rem',
      fontWeight: '400',
      lineHeight: '1.7',
      marginBottom: '1.2rem',
      color: 'var(--txt-color)',
    },
    caption: { // Texto pequeño, como leyendas de imágenes
      fontSize: '0.85rem',
      fontWeight: '400',
      lineHeight: '1.4',
      marginBottom: '0.5rem',
      color: 'var(--txt-disabled)', // Color más tenue
    },
    error: { // Mensajes de error
        fontSize: '0.9rem',
        fontWeight: '500',
        lineHeight: '1.4',
        color: 'var(--danger)', // Color de error
        marginTop: '0.5rem', // Espacio superior
        marginBottom: '0.5rem',
    },
    success: { // Mensajes de éxito
        fontSize: '0.9rem',
        fontWeight: '500',
        lineHeight: '1.4',
        color: 'var(--success)', // Necesitarás definir --success en themes.css
        marginTop: '0.5rem',
        marginBottom: '0.5rem',
    }
    // ... añade más variantes según necesites (footnote, etc.)
  };

  // Determina los estilos finales
  const baseVariantStyle = variantStyles[variant] || variantStyles.body; // Usa 'body' como fallback

  const finalStyles = {
    // Estilos de la variante como base
    fontSize: baseVariantStyle.fontSize,
    fontWeight: baseVariantStyle.fontWeight,
    lineHeight: baseVariantStyle.lineHeight,
    color: baseVariantStyle.color,
    marginTop: baseVariantStyle.marginTop,
    marginBottom: baseVariantStyle.marginBottom,
    textAlign: baseVariantStyle.textAlign,
    // Sobrescribir con props individuales si se proporcionan
    fontFamily: fontFamily,
    ...(padding && { padding }),
    ...(align && { textAlign: align }),
    ...(textIndent && { textIndent }),
    ...(letterSpacing && { letterSpacing }),
    ...(wordSpacing && { wordSpacing }),
    ...(whiteSpace && { whiteSpace }),
    ...(italic && { fontStyle: 'italic' }),
    ...(size && { fontSize: size }),
    ...(weight && { fontWeight: weight }),
    ...(lineHeight && { lineHeight: lineHeight }),
    ...(color && { color: color }), // 'color' sobrescribe el de la variante
    ...(margin !== null && { margin: margin }), // 'margin' sobrescribe marginTop/Bottom
    ...(maxWidth !== null && { maxWidth: maxWidth }), // Aplicar si se pasa explícitamente
    ...style,
  };

  // Limpiar estilos undefined/null
  Object.keys(finalStyles).forEach(key => (finalStyles[key] === undefined || finalStyles[key] === null) && delete finalStyles[key]);

  return (
    <p
      className={`parrafo-component ${variant ? `parrafo--${variant}` : ''} ${className}`.trim()}
      style={finalStyles}
      {...rest} // Pasa el resto de props
    >
      {children}
    </p>
  );
};

// Definición de PropTypes
Parrafo.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string, // O un oneOf con las variantes válidas
  className: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  margin: PropTypes.string,
  padding: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontFamily: PropTypes.string,
  maxWidth: PropTypes.string,
  textIndent: PropTypes.string,
  letterSpacing: PropTypes.string,
  wordSpacing: PropTypes.string,
  whiteSpace: PropTypes.string,
  italic: PropTypes.bool,
  style: PropTypes.object,
};

// Valores por defecto (la mayoría ahora controlados por variantes)
Parrafo.defaultProps = {
    variant: 'body',
    className: '',
    color: 'var(--txt-color)', // Default explícito por si no hay variante
    fontFamily: 'var(--font-family)',
    style: {},
};


export default Parrafo;