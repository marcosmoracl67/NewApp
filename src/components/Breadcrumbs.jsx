// src/components/Breadcrumbs.jsx
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
// Opcional: Importar Link de react-router-dom si se usa
// import { Link as RouterLink } from 'react-router-dom';

const Breadcrumbs = ({
  items = [],
  separator = '/',
  className = '',
  listClassName = '',
  itemClassName = '', // No usada directamente con display: contents
  linkClassName = '',
  currentClassName = '',
  ...rest
}) => {

  // No renderizar nada si no hay items
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="breadcrumb" className={`breadcrumbs ${className}`} {...rest}>
      <ol className={`breadcrumbs__list ${listClassName}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          // Determinar si es la página actual (última por defecto o si tiene isCurrent)
          const isCurrentPage = isLast || item.isCurrent;
          const key = `${item.label}-${index}`; // Clave simple

          return (
            // Usamos Fragment para agrupar el separador y el item sin añadir nodos extra innecesarios
            <Fragment key={key}>
              {/* Añadir separador ANTES de cada item EXCEPTO el primero */}
              {index > 0 && (
                <li className="breadcrumbs__separator" aria-hidden="true">
                  {separator}
                </li>
              )}
              {/* Renderizar el item de la miga */}
              <li className={`breadcrumbs__item ${itemClassName}`}>
                {isCurrentPage ? (
                  // Elemento actual (no clickeable)
                  <span className={`breadcrumbs__current ${currentClassName}`} aria-current="page">
                    {item.icon && <span className="breadcrumbs__icon">{item.icon}</span>}
                    <span className="breadcrumbs__label">{item.label}</span>
                  </span>
                ) : item.href ? (
                  // Enlace clickeable (usar RouterLink si se importó)
                  <a href={item.href} className={`breadcrumbs__link ${linkClassName}`}>
                    {item.icon && <span className="breadcrumbs__icon">{item.icon}</span>}
                    <span className="breadcrumbs__label">{item.label}</span>
                  </a>
                  /* Alternativa con React Router:
                  <RouterLink to={item.href} className={`breadcrumbs__link ${linkClassName}`}>
                    {item.icon && <span className="breadcrumbs__icon">{item.icon}</span>}
                    <span className="breadcrumbs__label">{item.label}</span>
                  </RouterLink>
                  */
                ) : (
                   // Elemento sin href y no es el actual (texto simple)
                   <span className={`breadcrumbs__label ${currentClassName}`}> {/* Usar currentClassName o uno nuevo? */}
                       {item.icon && <span className="breadcrumbs__icon">{item.icon}</span>}
                       {item.label}
                   </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

// Definir la estructura esperada para los items
const BreadcrumbItemType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  icon: PropTypes.node,
  isCurrent: PropTypes.bool,
});

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(BreadcrumbItemType).isRequired,
  separator: PropTypes.node,
  className: PropTypes.string,
  listClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  linkClassName: PropTypes.string,
  currentClassName: PropTypes.string,
};

export default Breadcrumbs;