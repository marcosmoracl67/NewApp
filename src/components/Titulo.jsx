import PropTypes from 'prop-types';
// Importar estilos si las variantes usan clases CSS
// import "../styles/typography.css"; // O donde definas las clases de variantes

const Titulo = ({
  children,
  variant = null,     // <<< NUEVO: Variante predefinida (ej: 'h1', 'h2', 'pageTitle')
  as: Tag = 'h1',    // <<< Prop 'as' renombrada a 'Tag' internamente, default 'h1'
  className = '',     // <<< NUEVO: Clases CSS adicionales
  // Props de estilo individuales (pueden sobrescribir la variante)
  size,
  color = 'var(--txt-color)', // <<< Default a la variable estándar de texto
  margin,
  padding,
  align,
  weight,
  uppercase,
  italic,
  underline,
  lineHeight,
  fontFamily = 'var(--font-family)', // Default a variable estándar
  style = {},         // <<< NUEVO: Para estilos inline adicionales
  ...rest             // <<< NUEVO: Pasar otras props
}) => {

  // --- Lógica de Variantes (Ejemplo) ---
  // Define los estilos base para cada variante. Puedes hacerlo con objetos
  // o con clases CSS predefinidas en un archivo .css
  const variantStyles = {
    // Variante por defecto si no se especifica (o usa los props individuales)
    default: {
      // Podrías basar los defaults en 'Tag' si quieres
      fontSize: size || '1.5rem', // Usa prop size o default
      fontWeight: weight || 'bold',
      lineHeight: lineHeight || '1.2',
      marginBottom: margin || '1em', // Margen inferior por defecto para títulos
    },
    h1: {
      as: 'h1', // Define la etiqueta por defecto para esta variante
      fontSize: '2.3rem',
      fontWeight: 'bold', // o 700
      lineHeight: '1.2',
      marginBottom: '0.8em',
      // otros estilos...
    },
    h2: {
      as: 'h2',
      fontSize: '1.8rem',
      fontWeight: 'bold', // o 600
      lineHeight: '1.3',
      marginTop: '1.5em', // Añadir margen superior común a h2
      marginBottom: '0.6em',
    },
    h3: {
      as: 'h3',
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.4',
      marginTop: '1.3em',
      marginBottom: '0.5em',
    },
    pageTitle: { // Ejemplo de variante semántica
       as: 'h1',
       fontSize: '2rem',
       fontWeight: 'bold',
       marginBottom: '1.5rem',
       textAlign: 'center', // Ejemplo de estilo específico
       // color: 'var(--primary)' // Ejemplo de color específico
    }
    // ... añade más variantes según necesites (h4, h5, h6, subheading, etc.)
  };

  // Determina los estilos finales combinando variante y props individuales
  const baseVariantStyle = variantStyles[variant] || variantStyles.default;

  // Determina la etiqueta final: usa la de la variante si existe, si no usa la prop 'as' (Tag)
  const FinalTag = baseVariantStyle.as || Tag;

  const finalStyles = {
    // Estilos de la variante como base
    fontSize: baseVariantStyle.fontSize,
    fontWeight: baseVariantStyle.fontWeight,
    lineHeight: baseVariantStyle.lineHeight,
    marginTop: baseVariantStyle.marginTop, // Usar marginTop/Bottom de la variante
    marginBottom: baseVariantStyle.marginBottom,
    textAlign: baseVariantStyle.textAlign,
    // Sobrescribir con props individuales si se proporcionan
    fontFamily: fontFamily, // Siempre usa la prop (con su default)
    color: color,         // Siempre usa la prop (con su default)
    ...(padding && { padding }), // Aplicar solo si existen
    ...(align && { textAlign: align }), // 'align' sobrescribe textAlign de la variante
    ...(uppercase && { textTransform: 'uppercase' }),
    ...(italic && { fontStyle: 'italic' }),
    ...(underline && { textDecoration: 'underline' }),
    ...(size && { fontSize: size }), // 'size' sobrescribe fontSize de la variante
    ...(weight && { fontWeight: weight }), // 'weight' sobrescribe fontWeight de la variante
    ...(lineHeight && { lineHeight: lineHeight }), // 'lineHeight' sobrescribe el de la variante
    ...(margin && { margin }), // 'margin' sobrescribe marginTop/Bottom de la variante
    ...style, // Fusionar estilos inline al final
  };

  // Limpiar estilos undefined para no aplicarlos
  Object.keys(finalStyles).forEach(key => finalStyles[key] === undefined && delete finalStyles[key]);

  return (
    <FinalTag
      className={`titulo-component ${variant ? `titulo--${variant}` : ''} ${className}`.trim()} // Añade clases base y de variante
      style={finalStyles}
      {...rest} // Pasa el resto de props
    >
      {children}
    </FinalTag>
  );
};

// Definición de PropTypes
Titulo.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string, // O un oneOf con las variantes válidas
  as: PropTypes.oneOf(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div']), // Etiqueta HTML a usar si no la define la variante
  className: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  margin: PropTypes.string,
  padding: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  uppercase: PropTypes.bool,
  italic: PropTypes.bool,
  underline: PropTypes.bool,
  lineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontFamily: PropTypes.string,
  style: PropTypes.object,
};

export default Titulo;