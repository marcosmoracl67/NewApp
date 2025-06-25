// src/components/Pagination.jsx
import PropTypes from 'prop-types';
import { FaAngleDoubleLeft, FaAngleLeft, FaAngleRight, FaAngleDoubleRight } from 'react-icons/fa'; // Iconos para controles

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    maxPageNumbersDisplayed = 5,
    showFirstLastButtons = true,
    showPageInfo = true, // Añadido para controlar info
    totalItems, // Añadido para mostrar info de items
    itemsPerPage, // Añadido para mostrar info de items
    firstPageText = <FaAngleDoubleLeft />, // Usar iconos por defecto
    lastPageText = <FaAngleDoubleRight />,
    previousPageText = <FaAngleLeft />,
    nextPageText = <FaAngleRight />,
    className = '',
    ...rest
}) => {

    // --- Lógica para Generar Números de Página ---
    const generatePageNumbers = () => {
        const pages = [];
        const halfMax = Math.floor(maxPageNumbersDisplayed / 2);
        let startPage = Math.max(1, currentPage - halfMax);
        let endPage = Math.min(totalPages, currentPage + halfMax);

        // Ajustar el rango si estamos cerca de los extremos
        if (currentPage - halfMax <= 0) {
            endPage = Math.min(totalPages, maxPageNumbersDisplayed);
        }
        if (currentPage + halfMax >= totalPages) {
            startPage = Math.max(1, totalPages - maxPageNumbersDisplayed + 1);
        }
        // Ajuste final si totalPages es menor que maxPageNumbersDisplayed
        if (totalPages <= maxPageNumbersDisplayed) {
            startPage = 1;
            endPage = totalPages;
        }

        // Añadir primer número y elipsis si es necesario
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // Añadir números del rango calculado
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Añadir último número y elipsis si es necesario
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbersToDisplay = generatePageNumbers();

    // --- Lógica para Información de Items ---
    const firstItemIndex = totalItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const lastItemIndex = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : 0;

    // --- Renderizado ---
    if (totalPages <= 1) {
        return null; // No mostrar paginación si solo hay una página o ninguna
    }

    return (
        <nav className={`pagination ${className}`} aria-label="Navegación de páginas" {...rest}>
            {showPageInfo && totalItems && itemsPerPage && (
                <div className="pagination__info">
                    Mostrando {firstItemIndex}-{lastItemIndex} de {totalItems}
                </div>
            )}
             {showPageInfo && !totalItems && ( // Mostrar solo página si no hay info de items
                 <div className="pagination__info">
                     Página {currentPage} de {totalPages}
                 </div>
            )}

            <ul className="pagination__list">
                {/* Botón Primera Página */}
                {showFirstLastButtons && (
                    <li className="pagination__item pagination__item--control pagination__item--first">
                        <button
                            className="pagination__link"
                            onClick={() => onPageChange(1)}
                            disabled={currentPage === 1}
                            aria-label="Ir a primera página"
                            title="Primera Página" // Tooltip útil
                        >
                            {firstPageText}
                        </button>
                    </li>
                )}

                {/* Botón Página Anterior */}
                <li className="pagination__item pagination__item--control pagination__item--prev">
                    <button
                        className="pagination__link"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Ir a página anterior"
                        title="Página Anterior"
                    >
                        {previousPageText}
                    </button>
                </li>

                {/* Números de Página */}
                {pageNumbersToDisplay.map((page, index) => (
                    <li
                        key={`page-${page === '...' ? `ellipsis-${index}` : page}`}
                        className={`
                            pagination__item
                            ${page === '...' ? 'pagination__item--ellipsis' : 'pagination__item--number'}
                            ${page === currentPage ? 'pagination__item--active' : ''}
                        `}
                    >
                        {page === '...' ? (
                            <span className="pagination__link" aria-hidden="true">{page}</span> // Usar span para elipsis, no clickeable
                        ) : (
                            <button
                                className="pagination__link"
                                onClick={() => onPageChange(page)}
                                aria-label={`Ir a página ${page}`}
                                aria-current={page === currentPage ? 'page' : undefined}
                            >
                                {page}
                            </button>
                        )}
                    </li>
                ))}

                {/* Botón Página Siguiente */}
                <li className="pagination__item pagination__item--control pagination__item--next">
                    <button
                        className="pagination__link"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Ir a página siguiente"
                        title="Página Siguiente"
                    >
                        {nextPageText}
                    </button>
                </li>

                {/* Botón Última Página */}
                {showFirstLastButtons && (
                     <li className="pagination__item pagination__item--control pagination__item--last">
                        <button
                            className="pagination__link"
                            onClick={() => onPageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            aria-label="Ir a última página"
                            title="Última Página"
                        >
                           {lastPageText}
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
};

// Definir PropTypes para validación
Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    maxPageNumbersDisplayed: PropTypes.number,
    showFirstLastButtons: PropTypes.bool,
    showPageInfo: PropTypes.bool,
    totalItems: PropTypes.number,
    itemsPerPage: PropTypes.number,
    firstPageText: PropTypes.node,
    lastPageText: PropTypes.node,
    previousPageText: PropTypes.node,
    nextPageText: PropTypes.node,
    className: PropTypes.string,
};

export default Pagination;