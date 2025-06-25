// src/components/layout/ResizablePanel.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';

const ResizablePanel = ({
    children,
    initialWidth = 300,
    minWidth = 150, // Un mínimo razonable
    maxWidth = 800, // Un máximo razonable, o null para sin límite
    side = 'left',    // Por ahora 'left' es el principal
    className = '',
    panelId = 'resizable-panel', // Para identificadores únicos si hay varios
}) => {
    const [width, setWidth] = useState(initialWidth);
    const [isResizing, setIsResizing] = useState(false);

    const panelRef = useRef(null);      // Referencia al elemento <aside> del panel
    const startXRef = useRef(0);        // Posición X inicial del mouse al empezar a arrastrar
    const startWidthRef = useRef(0);    // Ancho inicial del panel al empezar a arrastrar

    // --- INICIO LÓGICA DE REDIMENSIONAMIENTO ---
    const handleMouseDown = useCallback((e) => {
        // Solo botón izquierdo del ratón
        if (e.button !== 0) return;

        e.preventDefault();
        setIsResizing(true);
        startXRef.current = e.clientX;
        startWidthRef.current = width; // Usar el estado 'width' actual

        // Cambiar cursor del body para feedback visual global
        document.body.style.cursor = 'col-resize';
        // Prevenir selección de texto mientras se arrastra
        document.body.style.userSelect = 'none';

    }, [width]); // 'width' es dependencia para que startWidthRef.current sea el actual

    const handleMouseMove = useCallback((e) => {
        // No es necesario verificar isResizing aquí porque el listener solo se añade cuando es true
        const currentX = e.clientX;
        const deltaX = currentX - startXRef.current;
        let newWidth;

        if (side === 'left') {
            newWidth = startWidthRef.current + deltaX;
        } else { // side === 'right' (hacia la izquierda)
            newWidth = startWidthRef.current - deltaX;
        }

        // Aplicar restricciones de min/max width
        if (newWidth < minWidth) {
            newWidth = minWidth;
        } else if (maxWidth !== null && newWidth > maxWidth) {
            newWidth = maxWidth;
        }
        setWidth(newWidth);
    }, [minWidth, maxWidth, side]); // No depende de isResizing, startXRef, startWidthRef directamente en el callback

    const handleMouseUp = useCallback(() => {
        // No es necesario verificar isResizing aquí porque el listener solo se añade cuando es true
        setIsResizing(false);
        document.body.style.cursor = 'default'; // Restaurar cursor
        document.body.style.userSelect = 'auto';  // Restaurar selección de texto
    }, []); // No tiene dependencias que cambien

    useEffect(() => {
        if (isResizing) {
            // Añadir listeners globales cuando comienza el redimensionamiento
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            // Para eventos touch (básico)
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
        }
        // La limpieza se hace en el return del useEffect
        return () => {
            // Siempre remover para evitar fugas si el componente se desmonta mientras está redimensionando
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            // Asegurar que el cursor del body se restaure si el componente se desmonta mientras se redimensiona
            if (document.body.style.cursor === 'col-resize') {
                 document.body.style.cursor = 'default';
            }
            if (document.body.style.userSelect === 'none') {
                document.body.style.userSelect = 'auto';
            }
        };
    }, [isResizing, handleMouseMove, handleMouseUp]); // Dependencias del efecto

    // --- Lógica para Touch (básica) ---
    const handleTouchStart = useCallback((e) => {
        // Similar a handleMouseDown pero para touch
        // e.preventDefault(); // Puede prevenir el scroll en touch, usar con cuidado
        if (e.touches.length !== 1) return; // Solo un dedo
        setIsResizing(true);
        startXRef.current = e.touches[0].clientX;
        startWidthRef.current = width;
        document.body.style.overflow = 'hidden'; // Prevenir scroll de la página
        document.body.style.userSelect = 'none';

    }, [width]);

    const handleTouchMove = useCallback((e) => {
        if (e.touches.length !== 1) return;
        const currentX = e.touches[0].clientX;
        const deltaX = currentX - startXRef.current;
        let newWidth;
        if (side === 'left') {
            newWidth = startWidthRef.current + deltaX;
        } else {
            newWidth = startWidthRef.current - deltaX;
        }
        if (newWidth < minWidth) newWidth = minWidth;
        else if (maxWidth !== null && newWidth > maxWidth) newWidth = maxWidth;
        setWidth(newWidth);
    }, [minWidth, maxWidth, side]);

    const handleTouchEnd = useCallback(() => {
        setIsResizing(false);
        document.body.style.overflow = 'auto';
        document.body.style.userSelect = 'auto';
    }, []);
    // --- FIN LÓGICA DE REDIMENSIONAMIENTO ---

    const panelStyle = {
        width: `${width}px`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // Para el resizer
        flexShrink: 0,     // No encogerse en un layout flex
        height: '100%',
    };

    const contentStyle = {
        flexGrow: 1,
        overflowY: 'auto',
        overflowX: 'auto', // Permitir scroll si la jerarquía es muy ancha
    };

    const resizerStyle = {
        width: '8px',
        cursor: 'col-resize',
        backgroundColor: isResizing ? 'var(--primary)' : 'var(--border-color-strong)', // Color cambia al arrastrar
        position: 'absolute',
        top: 0,
        bottom: 0,
        ...(side === 'left' ? { right: '-4px' } : { left: '-4px' }), // Centrado sobre el borde
        zIndex: 10,
    };

    return (
        <aside
            ref={panelRef}
            id={panelId}
            className={`resizable-panel resizable-panel--${side} ${className} ${isResizing ? 'resizable-panel--active-resizing' : ''}`}
            style={panelStyle}
            role="complementary"
            aria-label={`Panel lateral ${side === 'left' ? 'izquierdo' : 'derecho'} redimensionable`}
        >
            <div className="resizable-panel__content" style={contentStyle}>
                {children}
            </div>
            <div
                className="resizable-panel__resizer"
                style={resizerStyle}
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart} // Añadir para touch
                role="separator"
                aria-controls={panelId} // El resizer controla el panel
                aria-orientation="vertical"
                aria-label="Redimensionar panel"
                tabIndex={0} // Hacerlo enfocable para accesibilidad, aunque no se opera con teclado aquí
            />
        </aside>
    );
};

ResizablePanel.propTypes = {
    children: PropTypes.node.isRequired,
    initialWidth: PropTypes.number,
    minWidth: PropTypes.number,
    maxWidth: PropTypes.number,
    side: PropTypes.oneOf(['left', 'right']),
    className: PropTypes.string,
    panelId: PropTypes.string,
};

export default ResizablePanel;