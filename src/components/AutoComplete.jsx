// src/components/AutoComplete.jsx
import React, { useState, useEffect, useRef, useId, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
    useFloating,
    useInteractions,
    useRole,
    useDismiss,
    useListNavigation,
    FloatingFocusManager,
    FloatingPortal,
    autoUpdate,
    offset,
    flip,
    shift,
    size,
} from '@floating-ui/react';
import { useDebounce } from 'use-debounce';
import FormInput from './FormInput';

// Asegúrate de que _AutoComplete.css esté importado vía index.css

const AutoComplete = ({
    label,
    name,
    value,
    onValueChange,
    onSelect,
    selectedOption, // No se usa activamente para controlar el input en esta versión, pero se recibe
    options = [],
    fetchSuggestions,
    optionToString = (opt) => opt?.label || '',
    filterOption = (option, inputValue) =>
        optionToString(option).toLowerCase().includes(inputValue.toLowerCase()),
    renderOption,
    placeholder = "Buscar...",
    debounceDelay = 300,
    noSuggestionsMessage = "No hay sugerencias",
    loadingMessage = "Cargando...",
    minCharsToSearch = 1,
    disabled = false,
    error,
    required,
    listboxClassName = '',
    optionClassName = '',
    activeOptionClassName = 'autocomplete__option--active',
    inputContainerClassName,
    inputClassName,
    wrapperClassName = '',
    ...inputProps
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const listRef = useRef([]);
    const listboxId = useId();
    const internalInputId = useId();
    const justSelectedRef = useRef(false); // Flag para controlar re-apertura por onFocus

    const [debouncedValue] = useDebounce(value, debounceDelay);

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen, // Floating UI puede controlar la apertura/cierre
        placement: 'bottom-start',
        whileElementsMounted: autoUpdate,
        middleware: [
            offset(5),
            flip(),
            shift({ padding: 5 }),
            size({
                apply({ rects, elements }) {
                    Object.assign(elements.floating.style, {
                        width: `${rects.reference.width}px`,
                    });
                },
            }),
        ],
    });

    const dismiss = useDismiss(context); // Para Esc y clic fuera
    const role = useRole(context, { role: 'listbox' });
    const listNavigation = useListNavigation(context, { // Para navegación por teclado en la lista
        listRef,
        activeIndex,
        onNavigate: setActiveIndex,
        virtual: false,
        loop: true,
    });

    const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
        dismiss,
        role,
        listNavigation,
    ]);

    // Efecto para obtener/filtrar sugerencias
    useEffect(() => {
        if (!isOpen) {
            setSuggestions([]);
            // No es estrictamente necesario resetear activeIndex aquí,
            // useListNavigation lo maneja al cambiar los items de la lista.
            return;
        }

        if (debouncedValue.length < minCharsToSearch) {
            setSuggestions([]);
            return;
        }

        let activeRequest = true;

        if (fetchSuggestions) {
            setIsLoading(true);
            fetchSuggestions(debouncedValue)
                .then(fetchedOptions => {
                    if (activeRequest) {
                        setSuggestions(fetchedOptions || []);
                        setActiveIndex(null); // Resetear índice con nuevas sugerencias
                    }
                })
                .catch(err => {
                    if (activeRequest) {
                        console.error("Error fetching suggestions:", err);
                        setSuggestions([]);
                    }
                })
                .finally(() => {
                    if (activeRequest) setIsLoading(false);
                });
        } else if (options.length > 0) {
            const filtered = options.filter(opt => filterOption(opt, debouncedValue));
            setSuggestions(filtered);
            setActiveIndex(null); // Resetear índice con nuevas sugerencias
        } else {
            setSuggestions([]);
        }

        return () => { activeRequest = false; };
    }, [debouncedValue, isOpen, options, fetchSuggestions, filterOption, minCharsToSearch]);


    // Manejador para cambios en el input
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        onValueChange(newValue);

        if (newValue.length >= minCharsToSearch) {
            if (!isOpen) setIsOpen(true);
        } else {
            if (isOpen) setIsOpen(false);
        }

        if (selectedOption && optionToString(selectedOption) !== newValue) {
            onSelect(null); // Limpiar selección si el texto cambia
        }
    };

    // Manejador para la selección de una opción
    const handleSelectOption = (option) => {
        if (!option || disabled) return;

        onValueChange(optionToString(option));
        onSelect(option);
        setIsOpen(false); // Cerrar el menú
        justSelectedRef.current = true; // Marcar que se acaba de seleccionar
        refs.domReference.current?.focus(); // Devolver foco al input
    };

    // Manejador para el foco en el input
    const handleInputFocus = () => {
        if (disabled) return;

        if (justSelectedRef.current) { // Si el foco vuelve justo después de una selección
            justSelectedRef.current = false; // Resetear el flag
            return; // No reabrir la lista
        }

        // Abrir si hay texto suficiente o si hay opciones locales (para mostrar al enfocar)
        if (value.length >= minCharsToSearch || (options.length > 0 && !fetchSuggestions)) {
            setIsOpen(true);
        }
    };

    // Props para el FormInput obtenidas de Floating UI y las nuestras
    const referenceProps = getReferenceProps({
        onChange: handleInputChange,
        onFocus: handleInputFocus,
        // onKeyDown es manejado por getReferenceProps para useListNavigation (flechas, Esc) y useDismiss.
        // Para Enter específico en el input cuando hay una opción activa:
        onKeyDown: (event) => {
            if (isOpen) {
                if (event.key === 'Enter') {
                    if (activeIndex !== null && suggestions[activeIndex]) {
                        event.preventDefault(); // Prevenir submit de formulario
                        handleSelectOption(suggestions[activeIndex]);
                    }
                }
            }
        },
    });

    return (
        <div className={`autocomplete-wrapper ${wrapperClassName}`} ref={refs.setReference}>
            <FormInput
                label={label}
                name={name}
                id={inputProps.id || internalInputId}
                value={value}
                placeholder={placeholder}
                error={error}
                disabled={disabled}
                required={required}
                containerClassName={inputContainerClassName}
                className={inputClassName}
                autoComplete="off"
                {...inputProps} // Otras props pasadas al FormInput
                {...referenceProps} // Props de Floating UI (incluye onChange, onFocus, onKeyDown, etc.)
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={isOpen}
                aria-controls={isOpen ? listboxId : undefined}
                aria-activedescendant={activeIndex !== null && isOpen ? `${listboxId}-option-${activeIndex}` : undefined}
            />

            <FloatingPortal>
                {isOpen && (
                    <FloatingFocusManager context={context} modal={false} initialFocus={-1} returnFocus={true}>
                        <div
                            ref={refs.setFloating}
                            style={floatingStyles}
                            className={`autocomplete__listbox ${listboxClassName}`}
                            id={listboxId}
                            {...getFloatingProps()} // Incluye role="listbox", tabIndex="-1"
                        >
                            {isLoading ? (
                                <div className="autocomplete__message">{loadingMessage}</div>
                            ) : suggestions.length > 0 ? (
                                suggestions.map((option, index) => (
                                    <div
                                        key={option.id || optionToString(option) + index}
                                        ref={(node) => { listRef.current[index] = node; }}
                                        className={`
                                            autocomplete__option ${optionClassName}
                                            ${index === activeIndex ? activeOptionClassName : ''}
                                        `}
                                        // getItemProps aplica role="option", id, aria-selected, tabIndex,
                                        // y listeners de teclado para seleccionar (Enter/Space) y navegar.
                                        {...getItemProps({
                                            onClick: () => handleSelectOption(option), // Selección con ratón
                                            // No pasar índice aquí si getItemProps lo maneja internamente
                                        })}
                                    >
                                        {renderOption
                                            ? renderOption(option, value)
                                            : optionToString(option)
                                        }
                                    </div>
                                ))
                            ) : (
                                value.length >= minCharsToSearch && !isLoading && (
                                    <div className="autocomplete__message">{noSuggestionsMessage}</div>
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
const OptionShape = PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.string,
    // Permitir cualquier otra propiedad si es necesario
});

AutoComplete.propTypes = {
    value: PropTypes.string.isRequired,
    onValueChange: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedOption: OptionShape,
    options: PropTypes.arrayOf(OptionShape),
    fetchSuggestions: PropTypes.func,
    optionToString: PropTypes.func,
    filterOption: PropTypes.func,
    renderOption: PropTypes.func,
    label: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    debounceDelay: PropTypes.number,
    noSuggestionsMessage: PropTypes.node,
    loadingMessage: PropTypes.node,
    minCharsToSearch: PropTypes.number,
    disabled: PropTypes.bool,
    error: PropTypes.string,
    required: PropTypes.bool,
    listboxClassName: PropTypes.string,
    optionClassName: PropTypes.string,
    activeOptionClassName: PropTypes.string,
    inputContainerClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    wrapperClassName: PropTypes.string,
};

export default AutoComplete;