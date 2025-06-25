import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';

import FormButton from '../components/FormButton';
import ConfirmDialog from '../components/ConfirmDialog';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Container from '../components/Container';
import Titulo from '../components/Titulo';
import Parrafo from '../components/Parrafo';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

import PerfilFormModal from './PerfilFormModal';

const ITEMS_PER_PAGE = 10;

const Perfiles = () => {
  const [perfiles, setPerfiles] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [notificacion, setNotificacion] = useState(null);
  const [perfilAEliminar, setPerfilAEliminar] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: '', type: 'info', title: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [isPerfilModalOpen, setIsPerfilModalOpen] = useState(false);
  const [perfilActualParaModal, setPerfilActualParaModal] = useState(null);
  const [modoModal, setModoModal] = useState('crear');
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [isFetchingList, setIsFetchingList] = useState(true);

  const mostrarNotificacion = useCallback((mensaje) => { setNotificacion(mensaje); setTimeout(() => setNotificacion(null), 3000); }, []);
  const setLoading = useCallback((id, action, isLoading) => { setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading })); }, []);

  const fetchPerfiles = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/perfiles', { withCredentials: true });
      setPerfiles(res.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar Perfiles ❌');
      console.error('Error al cargar Perfiles:', error.message);
    } finally {
      setIsFetchingList(false);
    }
  }, [mostrarNotificacion]);

  useEffect(() => {
    fetchPerfiles();
  }, [fetchPerfiles]);

  const handleFormSubmit = useCallback(async (datosDelModal) => {
    setIsSubmittingModal(true);
    const idParaActualizar = (modoModal === 'editar' && perfilActualParaModal)
      ? perfilActualParaModal.id
      : null;

    const payload = {
      nombre: datosDelModal.nombre,
      descripcion: datosDelModal.descripcion
    };

    const url = modoModal === 'crear'
      ? 'http://localhost:3000/api/perfiles'
      : `http://localhost:3000/api/perfiles/${idParaActualizar}`;

    const method = modoModal === 'crear' ? 'post' : 'put';

    if (modoModal === 'editar' && !idParaActualizar) {
      mostrarNotificacion('Error: ID del perfil no encontrado para actualizar.');
      setIsSubmittingModal(false);
      return;
    }

    try {
      await axios[method](url, payload, { withCredentials: true });
      await fetchPerfiles();
      mostrarNotificacion(modoModal === 'crear' ? 'Perfil creado exitosamente ✅' : 'Perfil actualizado con éxito ✨');
      setIsPerfilModalOpen(false);
    } catch (error) {
      console.error('Error guardando perfil', error);
      setAlertInfo({ isOpen: true, message: error.response?.data?.error || error.message, type: 'error', title: 'Error' });
    } finally {
      setIsSubmittingModal(false);
    }
  }, [modoModal, fetchPerfiles, mostrarNotificacion, perfilActualParaModal]);

  const eliminarPerfil = useCallback(async (id) => {
    const numericId = parseInt(id, 10);
    setLoading(numericId, 'delete', true);
    try {
      await axios.delete(`http://localhost:3000/api/perfiles/${numericId}`, { withCredentials: true });
      await fetchPerfiles();
      mostrarNotificacion('Perfil eliminado 🗑️');
    } catch (error) {
      console.error('Error al eliminar perfil', error);
      mostrarNotificacion(`Error al eliminar el perfil: ${error.response?.data?.message || error.message} ❌`);
    } finally {
      setPerfilAEliminar(null);
      setLoading(numericId, 'delete', false);
    }
  }, [fetchPerfiles, mostrarNotificacion, setLoading]);

  const handleAbrirModalEditar = useCallback((perfil) => {
    setModoModal('editar');
    setPerfilActualParaModal(perfil);
    setIsPerfilModalOpen(true);
  }, []);

  const handleAbrirModalCrear = useCallback(() => {
    setModoModal('crear');
    setPerfilActualParaModal({});
    setIsPerfilModalOpen(true);
  }, []);

  const handleCerrarModal = useCallback(() => {
    setIsPerfilModalOpen(false);
    setPerfilActualParaModal(null);
    setIsSubmittingModal(false);
  }, []);

  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  const PerfilesFiltrados = useMemo(() => perfiles.filter(p =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (p.descripcion || '').toLowerCase().includes(filtro.toLowerCase())
  ), [perfiles, filtro]);

  const sortedPerfiles = useMemo(() => [...PerfilesFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }), [PerfilesFiltrados, sortColumn, sortDirection]);

  const paginatedPerfiles = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return sortedPerfiles.slice(firstPageIndex, lastPageIndex);
  }, [sortedPerfiles, currentPage]);

  const totalPages = useMemo(() => Math.ceil(sortedPerfiles.length / ITEMS_PER_PAGE), [sortedPerfiles.length]);

  const columns = useMemo(() => [
    { key: 'nombre', label: 'Nombre', sortable: true, className: 'col-30' },
    { key: 'descripcion', label: 'Descripción', sortable: true, className: 'col-50' },
    { key: 'acciones', label: 'Acciones', className: 'col-20', render: (item) => (
        <div className="table-actions">
          <FormButton
            icon={<FaEdit />}
            onClick={() => handleAbrirModalEditar(item)}
            size="small"
            variant="subtle"
            title="Editar Perfil"
            aria-label={`Editar Perfil ${item.nombre}`}
          />
          <FormButton
            icon={<FaTrashAlt />}
            onClick={() => setPerfilAEliminar(item)}
            size="small"
            variant="subtle"
            title="Eliminar Perfil"
            aria-label={`Eliminar Perfil ${item.nombre}`}
            isLoading={loadingStates[`delete-${item.id}`] || false}
          />
        </div>
      ) },
  ], [handleAbrirModalEditar, setPerfilAEliminar, loadingStates]);

  return (
    <Container as="main" className="page-container perfiles-page" maxWidth="80rem" centered padding="1rem">
      <Alert
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        type={alertInfo.type}
        title={alertInfo.title}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
      />

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Administración de Perfiles
      </Titulo>

      <Container className="page-toolbar-wrapper" margin="0 0 1rem 0" padding="0" background="transparent">
        <div className="toolbar-left">
          <SearchBar
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar Perfiles..."
            aria-label="Buscar Perfiles"
            className="perfiles-search-input"
          />
        </div>
        <div className="toolbar-right">
          <FormButton
            icon={<FaPlus />}
            label="Crear Perfil"
            onClick={handleAbrirModalCrear}
            size="small"
          />
        </div>
      </Container>

      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        {isFetchingList ? (
          <Loader text="Cargando Perfiles..." size="large" />
        ) : paginatedPerfiles.length > 0 ? (
          <>
            <DataTable
              rowIdKey="id"
              data={paginatedPerfiles}
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              editable={false}
            />
            {totalPages > 1 && (
              <Container padding="1rem 0 0 0" background="transparent">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={sortedPerfiles.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  showPageInfo={true}
                />
              </Container>
            )}
          </>
        ) : (
          <Parrafo align="center" margin="2rem 0">
            {filtro ? 'No se encontraron Perfiles con los criterios de búsqueda.' : 'No hay Perfiles registrados.'}
          </Parrafo>
        )}
      </Container>

      {isPerfilModalOpen && (
        <PerfilFormModal
          isOpen={isPerfilModalOpen}
          onClose={handleCerrarModal}
          onSubmit={handleFormSubmit}
          initialData={perfilActualParaModal}
          mode={modoModal}
          isLoading={isSubmittingModal}
        />
      )}

      <ConfirmDialog
        isOpen={!!perfilAEliminar}
        title={`¿Eliminar Perfil "${perfilAEliminar?.nombre || ''}"?`}
        message="Esta acción eliminará permanentemente el Perfil."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => { if (perfilAEliminar) eliminarPerfil(perfilAEliminar.id); }}
        onCancel={() => setPerfilAEliminar(null)}
        confirmVariant="default"
      />

      {notificacion && (
        <div className="toast-notification" role="alert" aria-live="polite">
          {notificacion}
        </div>
      )}
    </Container>
  );
};

export default Perfiles;