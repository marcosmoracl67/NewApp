// src/pages/hierarchy/ModoFalla.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

// Import Core Components
import FormButton from "../../components/FormButton";
import ConfirmDialog from "../../components/ConfirmDialog";
import SearchBar from "../../components/SearchBar";
import DataTable from "../../components/DataTable";
import Container from "../../components/Container";
import Titulo from "../../components/Titulo";
import Parrafo from "../../components/Parrafo";
import Pagination from "../../components/Pagination";
import Loader from "../../components/Loader";
import Alert from "../../components/Alert"; 
import ToggleSwitch from '../../components/ToggleSwitch';

import ModoFallaFormModal from "./ModoFallaFormModal";


const ITEMS_PER_PAGE = 10; // O un valor configurable

const ModoFalla = () => {
  // --- Estados ---
  const [modoFalla, setmodoFalla] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [sortColumn, setSortColumn] = useState('Descripcion'); // Default sort
  const [sortDirection, setSortDirection] = useState("asc");
  const [notificacion, setNotificacion] = useState(null);
  const [modoFallaAEliminar, setmodoFallaAEliminar] = useState(null); // Store object
  const [loadingStates, setLoadingStates] = useState({});
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: "", type: "info", title: "" });

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);

    // Estados para el Modal de Formulario
  const [ismodoFallaModalOpen, setIsmodoFallaModalOpen] = useState(false);
  const [modoFallaActualParaModal, setmodoFallaActualParaModal] = useState(null);
  const [modoModal, setModoModal] = useState("crear"); // 'crear' o 'editar'
  const [isSubmittingModal, setIsSubmittingModal] = useState(false); // Para el botón de guardar del modal

  const [isFetchingList, setIsFetchingList] = useState(true); 

  const mostrarNotificacion = useCallback((mensaje) => { setNotificacion(mensaje); setTimeout(() => setNotificacion(null), 3000); }, []);
  const setLoading = useCallback((id, action, isLoading) => { setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading })); }, []);

  const fetchModoFalla = useCallback(async () => {

    try {
      const res = await axios.get("http://localhost:3000/api/modos-falla", { withCredentials: true });
      const parsedData = res.data.map(tn => ({
          IdModoFalla: parseInt(tn.IdModoFalla), 
          Nombre: tn.Nombre,         
          Descripcion: tn.Descripcion || tn.descripcion || "",   
          Activo: tn.Activo || false 
        }));
      setmodoFalla(parsedData);
    } catch (error) {
      mostrarNotificacion("Error al cargar Modos de Falla ❌");
      console.error("Error al cargar Modos de Falla:", error.message);
    } finally {
      setIsFetchingList(false); 
    }
  }, [mostrarNotificacion]); 

  useEffect(() => {
    fetchModoFalla();
  }, [fetchModoFalla]);


  const handleFormSubmit = useCallback(async (datosDelModal) => { 
  setIsSubmittingModal(true);

  const idParaActualizar = (modoModal === 'editar' && modoFallaActualParaModal)
                            ? modoFallaActualParaModal.IdModoFalla
                            : null;

  const payload = {
  Nombre: datosDelModal.Nombre,
  Descripcion: datosDelModal.Descripcion || null, 
  Activo: Boolean(datosDelModal.Activo)
  };

  const url = modoModal === 'crear'
    ? "http://localhost:3000/api/modos-falla" // URL para crear
    : `http://localhost:3000/api/modos-falla/${idParaActualizar}`; // Usar idParaActualizar

  const method = modoModal === 'crear' ? 'post' : 'put';

  if (modoModal === 'editar' && !idParaActualizar) {
      mostrarNotificacion("Error: ID del Modo de Falla no encontrado para actualizar.", "error");
      setIsSubmittingModal(false);
      return;
  }

  try {
    await axios[method](url, payload, { withCredentials: true }); // Enviar 'payload'
    await fetchModoFalla();
    mostrarNotificacion(
      modoModal === 'crear' ? "Modo de Falla creado exitosamente ✅" : "Modo de Falla actualizado con éxito ✨",
    );
    setIsmodoFallaModalOpen(false);
  } catch (error) {

  } finally {
    setIsSubmittingModal(false);
  }
}, [modoModal, fetchModoFalla, mostrarNotificacion, modoFallaActualParaModal]); // Añadir tiponodoActualParaModal

  // --- Delete Function (Memoizada) ---
  const eliminarModofalla = useCallback(async (IdModoFalla) => {
    const numericId = parseInt(IdModoFalla);
    setLoading(numericId, 'delete', true);
    try {
      await axios.delete(`http://localhost:3000/api/modos-falla/${numericId}`, { withCredentials: true });
      await fetchModoFalla();
      mostrarNotificacion("Modo de Falla Eliminado 🗑️");
    } catch (error) {
      console.error("Error al eliminar el Modo de Falla", error);
      mostrarNotificacion(`Error al eliminar el Modo de Falla: ${error.response?.data?.message || error.message} ❌`);
    } finally {
      setmodoFallaAEliminar(null);
      setLoading(numericId, 'delete', false); // Asegurar que se limpie el loading
    }
  }, [fetchModoFalla, mostrarNotificacion, setLoading]);

   // --- Manejadores del Modal ---

const handleAbrirModalEditar = useCallback((ModoFalla) => {
  setModoModal('editar');
  setmodoFallaActualParaModal({
    IdModoFalla: ModoFalla.IdModoFalla,
    Nombre: ModoFalla.Nombre,
    Descripcion: ModoFalla.Descripcion,
    Activo: ModoFalla.Activo ?? false
  });
  setIsmodoFallaModalOpen(true);
}, []);



const handleAbrirModalCrear = useCallback(() => {
  setModoModal('crear');
  setmodoFallaActualParaModal({ Nombre: "", Descripción: "" }); 
  setIsmodoFallaModalOpen(true);
}, []);

const handleCerrarModal = useCallback(() => {
  setIsmodoFallaModalOpen(false);
  setmodoFallaActualParaModal(null); 
  setIsSubmittingModal(false);
}, []);


  // --- Sorting Handler (Memoizado) ---
  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === "asc") ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  // --- Filtering & Sorting (Memoizados) ---
  const ModoFallaFiltrados = useMemo(() => modoFalla.filter(tn =>
    tn.Nombre?.toLowerCase().includes(filtro.toLowerCase()) || 
    tn.Descripcion?.toLowerCase().includes(filtro.toLowerCase())      
  ), [modoFalla, filtro]);

  const sortedModoFalla = useMemo(() => [...ModoFallaFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  }), [ModoFallaFiltrados, sortColumn, sortDirection]);
 
  // --- Paginación ---
  const paginatedModoFalla = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return sortedModoFalla.slice(firstPageIndex, lastPageIndex);
  }, [sortedModoFalla, currentPage]);

  const totalPages = useMemo(() => Math.ceil(sortedModoFalla.length / ITEMS_PER_PAGE), [sortedModoFalla.length]);

// --- Column Definitions (Memoizadas y Refactorizadas) ---
const columns = useMemo(() => [
  { key: "Nombre", label: "Nombre del Modo de Falla", sortable: true, className: "col-20", },
  { key: "Descripcion", label: "Descripción del Modo de Falla", sortable: true, className: "col-60", },
  { key: "Activo", label: "Activo", className: "col-10", render: (item) => (
      <ToggleSwitch
        checked={item.Activo}
        onChange={() => {}}
        disabled
        size="small"
      />
    ) },
  {
    key: "acciones", label: "Acciones", className: "col-10",
    render: (item) => (
      <div className="table-actions">
        {/* <<< BOTÓN EDITAR NUEVO >>> */}
        <FormButton
          icon={<FaEdit />} 
          onClick={() => handleAbrirModalEditar(item)} 
          size="small"
          variant="subtle" // O 'default', 'outline'
          title="Editar Modo de Falla"
          aria-label={`Editar Modo de Falla ${item.Descripcion}`}
        />
        <FormButton
          icon={<FaTrashAlt />}
          onClick={() => setmodoFallaAEliminar(item)}
          size="small"
          variant="subtle" 
          title="Eliminar Modo de Falla"
          aria-label={`Eliminar Modo de Falla ${item.Descripcion}`}
          isLoading={loadingStates[`delete-${item.IdModoFalla}`]|| false} 
        />
      </div>
    )
  }
], [handleAbrirModalEditar, setmodoFallaAEliminar, loadingStates]); 
  // --- Render ---
  return (
    <Container as="main" className="page-container tipos-nodo-page" maxWidth="80rem" centered padding="1rem">
      <Alert
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        type={alertInfo.type}
        title={alertInfo.title}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
        // autoCloseDelay={3000} // Opcional
      />

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Administración de Modos de Falla
      </Titulo>

      {/* Toolbar: SearchBar y Botón Crear */}
      <Container className="page-toolbar-wrapper" margin="0 0 1rem 0" padding="0" background="transparent">
             <div className="toolbar-left"> {/* <<<< Contenedor para SearchBar */}
               <SearchBar
                 value={filtro}
                 onChange={(e) => setFiltro(e.target.value)}
                 placeholder="Buscar Modos de Falla..."
                 aria-label="Buscar Modos de Falla"
                 className=" .tipos-nodo__search-input"     
               />
             </div>
             <div className="toolbar-right"> {/* <<<< Contenedor para el botón */}
               <FormButton
                  icon={<FaPlus />}
                  label="Crear Modos de Falla"
                  onClick={handleAbrirModalCrear} 
                  size="small"
               />
             </div>
      </Container>

      {/* Tabla y Paginación --- */}
      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        {isFetchingList ? (
          <Loader text="Cargando Estados Operativos..." size="large" />
        ) : paginatedModoFalla.length > 0 ? (
          <>
            <DataTable
              rowIdKey="IdModoFalla" // Asegúrate de que este campo exista en tus datos
              data={paginatedModoFalla}
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              editable={false}
            />
            {totalPages > 1 && (
              <Container padding="1rem 0 0 0" background="transparent"> {/* Contenedor para paginación */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={sortedModoFalla.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  showPageInfo={true}
                />
              </Container>
            )}
          </>
        ) : (
          <Parrafo align="center" margin="2rem 0">
            {filtro ? "No se encontraron Modos de Fallas con los criterios de búsqueda." : "No hay Modos de Fallas registrados."}
          </Parrafo>
        )}
      </Container>

       {/* Modal de Formulario para Crear/Editar */}
      {ismodoFallaModalOpen && ( 
          <ModoFallaFormModal
            isOpen={ismodoFallaModalOpen}
            onClose={handleCerrarModal}
            onSubmit={handleFormSubmit}
            initialData={modoFallaActualParaModal}
            mode={modoModal}
            isLoading={isSubmittingModal}
          />
      )}

      {/* ConfirmDialog */}
      <ConfirmDialog
        isOpen={!!modoFallaAEliminar}
        title={`¿Eliminar Tipo de Nodo "${modoFallaAEliminar?.Nombre || ''}"?`}
        message="Esta acción eliminará permanentemente el Modo de Falla. Asegúrate de que no esté en uso."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => { if (modoFallaAEliminar) eliminarModofalla(modoFallaAEliminar.IdModoFalla); }}
        onCancel={() => setmodoFallaAEliminar(null)}
        confirmVariant="default"
      />
    </Container>
  );
};

export default ModoFalla;