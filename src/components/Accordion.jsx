// src/components/Accordion.jsx
import React, { useState, useEffect, useId, useRef } from 'react'; // Añadir useRef
import PropTypes from 'prop-types';
import { FaMinus, FaPlus } from 'react-icons/fa';

const Accordion = ({
  items = [],
  allowMultipleOpen = false,
  defaultOpenId = null,
  defaultOpenIds = [],
  // transitionDuration = 250, // Podríamos usarla para el JS
  className = '',
  itemClassName = '',
  headerClassName = '',
  panelClassName = '',
  ...rest
}) => {
  const [openItems, setOpenItems] = useState(() => { /* ... (sin cambios) ... */
    if (allowMultipleOpen) {
      return new Set(defaultOpenIds);
    }
    return defaultOpenId !== null ? new Set([defaultOpenId]) : new Set();
   });

  const basePanelId = useId();
  const baseHeaderId = useId();
  // Crear un objeto para almacenar refs a los contenidos de los paneles
  const panelContentRefs = useRef({});

  const toggleItem = (itemId) => { /* ... (sin cambios) ... */
    setOpenItems(prevOpenItems => {
      const newOpenItems = new Set(prevOpenItems);
      if (newOpenItems.has(itemId)) {
        newOpenItems.delete(itemId);
      } else {
        if (!allowMultipleOpen) {
          newOpenItems.clear();
        }
        newOpenItems.add(itemId);
      }
      return newOpenItems;
    });
  };

  return (
    <div className={`accordion ${className}`} {...rest}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const panelFullId = `${basePanelId}-panel-${item.id}`;
        const headerFullId = `${baseHeaderId}-header-${item.id}`;

        // Asignar o crear ref para el contenido de este panel
        if (!panelContentRefs.current[item.id]) {
          panelContentRefs.current[item.id] = React.createRef();
        }
        const currentContentRef = panelContentRefs.current[item.id];

        return (
          <div
            key={item.id}
            className={`accordion__item ${isOpen ? 'accordion__item--open' : ''} ${itemClassName}`}
          >
            <h3 className="accordion__header-container">
              <button
                type="button"
                className={`accordion__header ${headerClassName}`}
                onClick={() => !item.disabled && toggleItem(item.id)}
                disabled={item.disabled}
                aria-expanded={isOpen}
                aria-controls={panelFullId}
                id={headerFullId}
              >
                {item.icon && (
                  <span className="accordion__header-title-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <span className="accordion__header-title">{item.title}</span>
                <span className="accordion__header-expand-icon" aria-hidden="true">
                  {isOpen ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
            </h3>
            <div
              className={`accordion__panel ${panelClassName}`}
              id={panelFullId}
              role="region"
              aria-labelledby={headerFullId}
              // Ya no usamos 'hidden' aquí, controlamos con CSS
              style={{
                // Aplicar max-height dinámicamente
                maxHeight: isOpen && currentContentRef.current
                  ? `${currentContentRef.current.scrollHeight}px`
                  : '0',
                // Opacity y visibility se manejan con la clase .accordion__item--open
              }}
            >
              <div
                className="accordion__panel-content"
                ref={currentContentRef} // Asignar la ref al div que realmente tiene el contenido
              >
                {/* Renderizar contenido siempre para medirlo, pero se ocultará por CSS si no está isOpen */}
                {/* OJO: Si el contenido es muy pesado, renderizar solo si isOpen es mejor para el performance inicial.
                    Pero para medir scrollHeight, necesita estar en el DOM.
                    Si se renderiza condicionalmente con {isOpen && item.content}, la animación de altura
                    no funcionará en la primera apertura porque no se pudo medir.
                    Para esta versión, vamos a renderizar el contenido siempre y controlarlo con CSS.
                */}
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ... (PropTypes sin cambios) ...
Accordion.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    icon: PropTypes.node,
    disabled: PropTypes.bool,
  })).isRequired,
  allowMultipleOpen: PropTypes.bool,
  defaultOpenId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultOpenIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  panelClassName: PropTypes.string,
};


export default Accordion;