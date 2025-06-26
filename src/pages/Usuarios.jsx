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
import ToggleSwitch from '../components/ToggleSwitch';
import Alert from '../components/Alert';

import UsuarioFormModal from './UsuarioFormModal';
import { API_BASE_URL } from '../config';

const ITEMS_PER_PAGE = 10;

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [perfilesOptions, setPerfilesOptions] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [sortColumn, setSortColumn] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');
  const [notificacion, setNotificacion] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: '', type: 'info', title: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [usuarioActualParaModal, setUsuarioActualParaModal] = useState(null);
  const [modoModal, setModoModal] = useState('crear');
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [isFetchingList, setIsFetchingList] = useState(true);

  const mostrarNotificacion = useCallback((mensaje) => { setNotificacion(mensaje); setTimeout(() => setNotificacion(null), 3000); }, []);
  const setLoading = useCallback((id, action, isLoading) => { setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading })); }, []);

  const fetchUsuarios = useCallback(async () => {
    try {
    //   const res = await axios.get('http://localhost:3000/api/users', { withCredentials: true });
      const res = await axios.get(`${API_BASE_URL}/api/users`, { withCredentials: true });
      setUsuarios(res.data);
    } catch (error) {
      mostrarNotificacion('Error al cargar Usuarios ❌');
      console.error('Error al cargar Usuarios:', error.message);
    } finally {
      setIsFetchingList(false);
    }
  }, [mostrarNotificacion]);

  const fetchPerfiles = useCallback(async () => {
    try {
      // const res = await axios.get('http://localhost:3000/api/perfiles', { withCredentials: true });
      const res = await axios.get(`${API_BASE_URL}/api/perfiles`, { withCredentials: true });
      setPerfilesOptions(res.data.map(p => ({ value: String(p.id), label: p.nombre })));
    } catch (error) {
      console.error('Error al cargar Perfiles:', error.message);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
    fetchPerfiles();
  }, [fetchUsuarios, fetchPerfiles]);

  const handleFormSubmit = useCallback(async (datosDelModal) => {
    setIsSubmittingModal(true);
    const idParaActualizar = (modoModal === 'editar' && usuarioActualParaModal)
      ? usuarioActualParaModal.usuario_id
      : null;

    const payload = {
      username: datosDelModal.username,
      nombre: datosDelModal.nombre,
      rut: datosDelModal.rut,
      password: datosDelModal.password,
      email: datosDelModal.email,
      celular: datosDelModal.celular,
      activo: Boolean(datosDelModal.activo),
      perfil_id: parseInt(datosDelModal.perfil_id, 10),
    };

    const url = modoModal === 'crear'
      // ? 'http://localhost:3000/api/users'
      // : `http://localhost:3000/api/users/${idParaActualizar}`;
      ? `${API_BASE_URL}/api/users`
      : `${API_BASE_URL}/api/users/${idParaActualizar}`;

    const method = modoModal === 'crear' ? 'post' : 'put';

    if (modoModal === 'editar' && !idParaActualizar) {
      mostrarNotificacion('Error: ID del usuario no encontrado para actualizar.');
      setIsSubmittingModal(false);
      return;
    }

    try {
      await axios[method](url, payload, { withCredentials: true });
      await fetchUsuarios();
      mostrarNotificacion(modoModal === 'crear' ? 'Usuario creado exitosamente ✅' : 'Usuario actualizado con éxito ✨');
      setIsUsuarioModalOpen(false);
    } catch (error) {
      console.error('Error guardando usuario', error);
      setAlertInfo({ isOpen: true, message: error.response?.data?.error || error.message, type: 'error', title: 'Error' });
    } finally {
      setIsSubmittingModal(false);
    }
  }, [modoModal, fetchUsuarios, mostrarNotificacion, usuarioActualParaModal]);

  const eliminarUsuario = useCallback(async (id) => {
    const numericId = parseInt(id, 10);
    setLoading(numericId, 'delete', true);
    try {
      // await axios.delete(`http://localhost:3000/api/users/${numericId}`, { withCredentials: true });
      await axios.delete(`${API_BASE_URL}/api/users/${numericId}`, { withCredentials: true });
      await fetchUsuarios();
      mostrarNotificacion('Usuario eliminado 🗑️');
    } catch (error) {
      console.error('Error al eliminar usuario', error);
      mostrarNotificacion(`Error al eliminar el usuario: ${error.response?.data?.message || error.message} ❌`);
    } finally {
      setUsuarioAEliminar(null);
      setLoading(numericId, 'delete', false);
    }
  }, [fetchUsuarios, mostrarNotificacion, setLoading]);

  const handleAbrirModalEditar = useCallback((usuario) => {
    setModoModal('editar');
    setUsuarioActualParaModal(usuario);
    setIsUsuarioModalOpen(true);
  }, []);

  const handleAbrirModalCrear = useCallback(() => {
    setModoModal('crear');
    setUsuarioActualParaModal({});
    setIsUsuarioModalOpen(true);
  }, []);

  const handleCerrarModal = useCallback(() => {
    setIsUsuarioModalOpen(false);
    setUsuarioActualParaModal(null);
    setIsSubmittingModal(false);
  }, []);

  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  const UsuariosFiltrados = useMemo(() => usuarios.filter(u =>
    u.username.toLowerCase().includes(filtro.toLowerCase()) ||
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(filtro.toLowerCase())
  ), [usuarios, filtro]);

  const sortedUsuarios = useMemo(() => [...UsuariosFiltrados].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }), [UsuariosFiltrados, sortColumn, sortDirection]);

  const paginatedUsuarios = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
    return sortedUsuarios.slice(firstPageIndex, lastPageIndex);
  }, [sortedUsuarios, currentPage]);

  const totalPages = useMemo(() => Math.ceil(sortedUsuarios.length / ITEMS_PER_PAGE), [sortedUsuarios.length]);

  const columns = useMemo(() => [
    { key: 'username', label: 'Usuario', sortable: true, className: 'col-15' },
    { key: 'nombre', label: 'Nombre', sortable: true, className: 'col-20' },
    { key: 'email', label: 'Email', sortable: true, className: 'col-25' },
    { key: 'rut', label: 'RUT', sortable: true, className: 'col-15' },
    { key: 'activo', label: 'Activo', className: 'col-10', render: (item) => (
        <ToggleSwitch checked={item.activo} onChange={() => {}} disabled size="small" />
      ) },
    { key: 'acciones', label: 'Acciones', className: 'col-15', render: (item) => (
        <div className="table-actions">
          <FormButton
            icon={<FaEdit />}
            onClick={() => handleAbrirModalEditar(item)}
            size="small"
            variant="subtle"
            title="Editar Usuario"
            aria-label={`Editar Usuario ${item.username}`}
          />
          <FormButton
            icon={<FaTrashAlt />}
            onClick={() => setUsuarioAEliminar(item)}
            size="small"
            variant="subtle"
            title="Eliminar Usuario"
            aria-label={`Eliminar Usuario ${item.username}`}
            isLoading={loadingStates[`delete-${item.usuario_id}`] || false}
          />
        </div>
      ) },
  ], [handleAbrirModalEditar, setUsuarioAEliminar, loadingStates]);

  return (
    <Container as="main" className="page-container usuarios-page" maxWidth="80rem" centered padding="1rem">
      <Alert
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        type={alertInfo.type}
        title={alertInfo.title}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
      />

      <Titulo as="h2" align="center" margin="0 0 1.5rem 0">
        Administración de Usuarios
      </Titulo>

      <Container className="page-toolbar-wrapper" margin="0 0 1rem 0" padding="0" background="transparent">
        <div className="toolbar-left">
          <SearchBar
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar Usuarios..."
            aria-label="Buscar Usuarios"
            className="usuarios-search-input"
          />
        </div>
        <div className="toolbar-right">
          <FormButton
            icon={<FaPlus />}
            label="Crear Usuario"
            onClick={handleAbrirModalCrear}
            size="small"
          />
        </div>
      </Container>

      <Container className="table-container-wrapper" background="var(--background1)" bordered padding="1rem" margin="0 auto">
        {isFetchingList ? (
          <Loader text="Cargando Usuarios..." size="large" />
        ) : paginatedUsuarios.length > 0 ? (
          <>
            <DataTable
              rowIdKey="usuario_id"
              data={paginatedUsuarios}
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
                  totalItems={sortedUsuarios.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  showPageInfo={true}
                />
              </Container>
            )}
          </>
        ) : (
          <Parrafo align="center" margin="2rem 0">
            {filtro ? 'No se encontraron Usuarios con los criterios de búsqueda.' : 'No hay Usuarios registrados.'}
          </Parrafo>
        )}
      </Container>

      {isUsuarioModalOpen && (
        <UsuarioFormModal
          isOpen={isUsuarioModalOpen}
          onClose={handleCerrarModal}
          onSubmit={handleFormSubmit}
          initialData={usuarioActualParaModal}
          mode={modoModal}
          isLoading={isSubmittingModal}
          perfilesOptions={perfilesOptions}
        />
      )}

      <ConfirmDialog
        isOpen={!!usuarioAEliminar}
        title={`¿Eliminar Usuario "${usuarioAEliminar?.username || ''}"?`}
        message="Esta acción eliminará permanentemente el Usuario."
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={() => { if (usuarioAEliminar) eliminarUsuario(usuarioAEliminar.usuario_id); }}
        onCancel={() => setUsuarioAEliminar(null)}
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

export default Usuarios;