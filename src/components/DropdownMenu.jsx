// src/components/DropdownMenu.jsx
import React, { useState, cloneElement, Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import {
    useFloating,
    useClick,
    useDismiss,
    useRole,
    useInteractions,
    FloatingFocusManager, // Para manejar el foco dentro/fuera del menú
    FloatingPortal, // Para renderizar el menú en el body (evita problemas de z-index/overflow)
    autoUpdate, // Actualiza posición al hacer scroll/resize
    offset, // Añade espacio entre trigger y menú
    flip, // Cambia la posición si no cabe
    shift, // Evita que se salga de los bordes
} from '@floating-ui/react';

// Asegúrate que _DropdownMenu.css esté importado vía index.css

const DropdownMenu = ({
    trigger,
    items = [],
    placement = 'bottom-start',
    menuClassName = '',
    itemClassName = '',
    wrapperClassName = '',
    closeOnSelect = true,
    // ...rest se pasará al wrapper div
}) => {
    const [isOpen, setIsOpen] = useState(false);

    // Configuración de Floating UI
    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: placement,
        // Actualizar posición automáticamente
        whileElementsMounted: autoUpdate,
        // Middlewares para mejorar posicionamiento
        middleware: [
            offset(6), // Espacio de 6px entre trigger y menú
            flip(),    // Cambiar de lado si no cabe
            shift({ padding: 8 }), // Deslizar para evitar bordes (8px padding)
        ],
    });

    // Hooks de Interacción de Floating UI
    const click = useClick(context); // Abrir/cerrar con clic en trigger
    const dismiss = useDismiss(context); // Cerrar al hacer clic fuera o presionar Esc
    const role = useRole(context, { role: 'menu' }); // Asignar roles ARIA (menu, menuitem)

    // Combinar interacciones
    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        click,
        dismiss,
        role,
    ]);

     // Validar y clonar el trigger para añadirle las props de referencia
     let triggerElement = null;
     try {
        const child = Children.only(trigger);
        if (isValidElement(child)) {
           triggerElement = cloneElement(child, getReferenceProps({
               ref: refs.setReference, // Asignar la ref al trigger
               ...child.props, // Mantener props originales del trigger
           }));
        } else {
             console.error("DropdownMenu trigger must be a single valid React element.");
             triggerElement = trigger; // Renderizar como está si no es válido para clonar
        }
     } catch(e) {
         console.error("DropdownMenu trigger must be a single React element.", e);
         triggerElement = trigger;
     }


    const handleItemClick = (itemOnClick) => {
        if (typeof itemOnClick === 'function') {
            itemOnClick(); // Ejecutar acción del item
        }
        if (closeOnSelect) {
            setIsOpen(false); // Cerrar menú si está configurado
        }
    };

    return (
        // Wrapper para el trigger (Floating UI no necesita un wrapper específico,
        // pero podemos añadir uno si se necesita para estilos con wrapperClassName)
         <div className={`dropdown-wrapper ${wrapperClassName}`} style={{ display: 'inline-block' }}>
            {triggerElement}

            {/* FloatingPortal renderiza el menú fuera del flujo normal del DOM */}
            <FloatingPortal>
                {isOpen && (
                    // FloatingFocusManager maneja el foco (tab, shift+tab, flechas, esc)
                    <FloatingFocusManager context={context} modal={false}>
                        <div
                            ref={refs.setFloating} // Asignar ref al menú flotante
                            style={floatingStyles} // Aplicar estilos de posición calculados
                            className={`dropdown-menu ${menuClassName}`}
                            {...getFloatingProps()} // Props para accesibilidad y eventos
                        >
                            {items.map((item, index) =>
                                item === 'separator' ? (
                                    <hr key={`separator-${index}`} className="dropdown-menu__separator" role="separator" />
                                ) : (
                                    <button
                                        key={item.label || index}
                                        className={`dropdown-menu__item ${itemClassName} ${item.className || ''}`}
                                        role="menuitem"
                                        // getItemProps maneja onKeyDown, etc. para navegación y selección
                                        {...getItemProps({
                                            onClick: () => handleItemClick(item.onClick), // Ejecutar nuestra lógica + cerrar
                                            disabled: item.disabled,
                                             // Mover foco al hacer hover (opcional, puede ser molesto)
                                            // onMouseEnter(event) { event.currentTarget.focus(); },
                                        })}
                                         disabled={item.disabled}
                                    >
                                        {item.icon && (
                                            <span className="dropdown-menu__item-icon" aria-hidden="true">
                                                {item.icon}
                                            </span>
                                        )}
                                        <span className="dropdown-menu__item-label">{item.label}</span>
                                    </button>
                                )
                            )}
                        </div>
                    </FloatingFocusManager>
                )}
            </FloatingPortal>
        </div>
    );
};

// PropTypes
const MenuItemShape = PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
  });

DropdownMenu.propTypes = {
  trigger: PropTypes.node.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([MenuItemShape, PropTypes.oneOf(['separator'])])
  ).isRequired,
  placement: PropTypes.string, // Floating UI tiene sus propios tipos, string es seguro aquí
  menuClassName: PropTypes.string,
  itemClassName: PropTypes.string,
  wrapperClassName: PropTypes.string,
  closeOnSelect: PropTypes.bool,
};

export default DropdownMenu;