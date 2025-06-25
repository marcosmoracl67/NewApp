// src/components/FormDatePicker.jsx
import { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parse, isValid as isValidDate } from 'date-fns';
import { es } from 'date-fns/locale';
import FormInput from './FormInput';

const FormDatePicker = ({
    label,
    name,
    selectedDate,
    onDateChange,
    placeholder = 'dd-MM-yyyy',
    dateFormat = 'dd-MM-yyyy',
    error,
    disabled,
    required,
    containerClassName,
    inputClassName,
    inputId,
    locale = es,
    minDate,
    maxDate,
    readOnly = false,
    ...inputProps
}) => {

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
    const containerRef = useRef(null);

   

    // --- CALCULAR RANGO DE AÑOS ---
    const currentYear = new Date().getFullYear();
    // Año inicial: El mayor entre (año actual - 9) y el año de minDate (si existe)
    const startYear = Math.max(
        minDate?.getFullYear() || currentYear - 100, // Límite inferior por si minDate es muy antiguo
        currentYear - 9 // Queremos los últimos 10 años (actual + 9 anteriores)
    );
    // Año final: El menor entre (año actual) y el año de maxDate (si existe)
    const endYear = Math.min(
        maxDate?.getFullYear() || currentYear + 10, // Límite superior por si maxDate es muy futuro
        currentYear // El año actual es el límite superior para "últimos 10 años"
    );
    // Formatear fecha seleccionada para el input
    useEffect(() => {
        // --- INICIO CONSOLE LOG ---
        // --- FIN CONSOLE LOG ---
        if (selectedDate && isValidDate(selectedDate)) {
            try {
                const formatted = format(selectedDate, dateFormat, { locale });
                // --- INICIO CONSOLE LOG ---
               // --- FIN CONSOLE LOG ---
                setInputValue(formatted);
            } catch (e) {
                console.error(`[FormDatePicker ${name}] Error formateando fecha:`, e);
                setInputValue('');
            }
        } else {
              setInputValue('');
        }
    }, [selectedDate, dateFormat, locale, name]); // Añadir name para claridad en logs

    // Actualizar mes visible si la fecha seleccionada cambia
     useEffect(() => {
       if (selectedDate && isValidDate(selectedDate)) {
            setCurrentMonth(selectedDate);
        }
     }, [selectedDate, name]); // Añadir name

    const handleDaySelect = (day, modifiers) => {
         if (!day) {
            if (!readOnly) onDateChange(null);
            if (!readOnly) setInputValue('');
        } else if (!modifiers.disabled) {
            onDateChange(day);
            try {
                setInputValue(format(day, dateFormat, { locale }));
            } catch (e) { console.error("Error formateando fecha seleccionada:", e); }
        }
        setIsPickerOpen(false);
    };

    // ... (resto de handlers: handleInputChange, handleInputBlur, handleInputFocus, handleInputClick, validateAndSetDate sin console.log por ahora para no saturar) ...
    const handleInputChange = (e) => {
        if (readOnly) return;
        setInputValue(e.target.value);
    };

    const handleInputBlur = (e) => {
        if (readOnly) return;
        validateAndSetDate(e.target.value);
    };

    const handleInputFocus = () => {
        if (!disabled && !readOnly) {
             setIsPickerOpen(true);
             setCurrentMonth(selectedDate && isValidDate(selectedDate) ? selectedDate : new Date());
        } else if (!disabled && readOnly) {}
    }

    const handleInputClick = () => {
         if (!disabled) {
             setIsPickerOpen(true);
             setCurrentMonth(selectedDate && isValidDate(selectedDate) ? selectedDate : new Date());
         }
    }

    const validateAndSetDate = (value) => {
        if (value === '') {
            if (selectedDate !== null) onDateChange(null);
            return;
        }
        try {
            const parsed = parse(value, dateFormat, new Date(), { locale });
            if (isValidDate(parsed)) {
                if ((!minDate || parsed >= minDate) && (!maxDate || parsed <= maxDate)) {
                   if (selectedDate?.getTime() !== parsed.getTime()) {
                     onDateChange(parsed);
                   }
                   setInputValue(format(parsed, dateFormat, { locale }));
                } else {
                    if (selectedDate && isValidDate(selectedDate)) {
                       setInputValue(format(selectedDate, dateFormat, { locale }));
                    } else {
                       setInputValue('');
                       if (selectedDate !== null) onDateChange(null);
                    }
                    console.warn("Fecha introducida fuera de rango");
                }
            } else {
                if (selectedDate && isValidDate(selectedDate)) {
                   setInputValue(format(selectedDate, dateFormat, { locale }));
                } else {
                   setInputValue('');
                    if (selectedDate !== null) onDateChange(null);
                }
                console.warn("Formato de fecha inválido introducido");
            }
        } catch (error) {
             if (selectedDate && isValidDate(selectedDate)) {
               setInputValue(format(selectedDate, dateFormat, { locale }));
            } else {
               setInputValue('');
                if (selectedDate !== null) onDateChange(null);
            }
            console.warn("Error al parsear fecha introducida");
        }
    }

    const handleMonthChange = (newMonth) => {
        setCurrentMonth(newMonth); // Llama al setter real
    };

    // Efecto para clic fuera
    useEffect(() => {
        if (!isPickerOpen) return;
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsPickerOpen(false);
                 if (!readOnly) {
                     validateAndSetDate(inputValue);
                 }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isPickerOpen, readOnly, inputValue, dateFormat, locale, minDate, maxDate, selectedDate, onDateChange, name, validateAndSetDate]); // validateAndSetDate ahora es dependencia si se define con useCallback, si no, puede omitirse pero ESLint se quejará. Es más seguro incluirla o envolverla en useCallback.

    return (
      <div ref={containerRef} className="form-datepicker-container" style={{ position: 'relative' }}>
             <FormInput
              label={label}
              name={name}
              id={inputId}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onFocus={handleInputFocus}
              onClick={handleInputClick}
              placeholder={placeholder}
              error={error}
              disabled={disabled}
              required={required}
              containerClassName={containerClassName}
              className={inputClassName}
              readOnly={readOnly}
              autoComplete="off"
              {...inputProps}
          />

          {isPickerOpen && console.log(`[FormDatePicker ${name}] Rendering Popover with DayPicker`)}
          {isPickerOpen && (
              <div
                  className="datepicker-popover"
                  onMouseDown={(e) => e.stopPropagation()}
                   style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      zIndex: 10,
                  }}
              >
                  <DayPicker
                      // ... props sin cambios ...
                       mode="single"
                      selected={selectedDate}
                      onSelect={handleDaySelect}
                      locale={locale}
                      month={currentMonth}
                      onMonthChange={handleMonthChange}
                      fromDate={minDate}
                      toDate={maxDate}
                      disabled={disabled ? { before: new Date(0) } : undefined}
                      modifiersClassNames={{
                          selected: 'rdp-day_selected',
                          today: 'rdp-day_today',
                          disabled: 'rdp-day_disabled',
                          outside: 'rdp-day_outside',
                      }}
                      showOutsideDays
                      captionLayout="dropdown"
                      fromYear={startYear}
                      toYear={endYear}
                  />
              </div>
          )}
         
      </div>
  );
};

export default FormDatePicker;