import { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt, FaPlus, FaUsers } from 'react-icons/fa';

import FormButton from '../components/FormButton';
import SearchBar from '../components/SearchBar';
import DataTable from '../components/DataTable';
import Container from '../components/Container';
import Titulo from '../components/Titulo';
import Pagination from '../components/Pagination';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import ToggleSwitch from '../components/ToggleSwitch';
import ConfirmDialog from '../components/ConfirmDialog';
import AsociarPerfilesModal from './AsociarPerfilesModal';
import MenuOpcionFormModal from './MenuOpcionFormModal';
import { API_BASE_URL } from '../config';

const ITEMS_PER_PAGE = 10;

const MenuOpciones = () => {
  const [opciones, setOpciones] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [sortColumn, setSortColumn] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [opcionAEliminar, setOpcionAEliminar] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [alertInfo, setAlertInfo] = useState({ isOpen: false, message: '', type: 'info', title: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingList, setIsFetchingList] = useState(true);
  const [isPerfilesModalOpen, setIsPerfilesModalOpen] = useState(false);
  const [opcionParaPerfiles, setOpcionParaPerfiles] = useState(null);
  const [isOpcionModalOpen, setIsOpcionModalOpen] = useState(false);
  const [opcionActualParaModal, setOpcionActualParaModal] = useState(null);
  const [modoModal, setModoModal] = useState('crear');
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);

  const setLoading = useCallback((id, action, isLoading) => {
    setLoadingStates(prev => ({ ...prev, [`${action}-${id}`]: isLoading }));
  }, []);

  const fetchOpciones = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/menu-opciones`, { withCredentials: true });
      const data = res.data.map(op => ({
        id: parseInt(op.id),
        nombre: op.nombre,
        ruta: op.ruta || '',
        icono: op.icono || '',
        orden: op.orden || 0,
        separador: op.es_separador !== false,
        visible: op.visible !== false
      }));
      setOpciones(data);
    } catch (err) {
      console.error('Error cargando opciones de menú', err);
      setAlertInfo({ isOpen: true, message: 'Error al cargar opciones', type: 'error', title: 'Error' });
    } finally {
      setIsFetchingList(false);
    }
  }, []);

  useEffect(() => {
    fetchOpciones();
  }, [fetchOpciones]);

  const eliminarOpcion = useCallback(async (id) => {
    setLoading(id, 'delete', true);
    try {
      await axios.delete(`${API_BASE_URL}/api/menu-opciones/${id}`, { withCredentials: true });
      await fetchOpciones();
    } catch (err) {
      console.error('Error eliminando opción', err);
    } finally {
      setLoading(id, 'delete', false);
      setOpcionAEliminar(null);
    }
  }, [fetchOpciones, setLoading]);

   const handleFormSubmit = useCallback(async (datosDelModal) => {
    setIsSubmittingModal(true);
    const idParaActualizar = (modoModal === 'editar' && opcionActualParaModal)
      ? opcionActualParaModal.id
      : null;

    const payload = {
      nombre: datosDelModal.nombre,
      ruta: datosDelModal.ruta || null,
      icono: datosDelModal.icono || null,
      orden: datosDelModal.orden ?? 0,
      es_separador: Boolean(datosDelModal.es_separador),
      visible: Boolean(datosDelModal.visible),
      padre_id: datosDelModal.padre_id ? parseInt(datosDelModal.padre_id, 10) : null
    };

    const url = modoModal === 'crear'
      ? `${API_BASE_URL}/api/menu-opciones`
      : `${API_BASE_URL}/api/menu-opciones/${idParaActualizar}`;

    const method = modoModal === 'crear' ? 'post' : 'put';

    if (modoModal === 'editar' && !idParaActualizar) {
      setIsSubmittingModal(false);
      return;
    }

    try {
      await axios[method](url, payload, { withCredentials: true });
      await fetchOpciones();
      setIsOpcionModalOpen(false);
    } catch (error) {
      console.error('Error guardando opción de menú', error);
      setAlertInfo({ isOpen: true, message: error.response?.data?.error || error.message, type: 'error', title: 'Error' });
    } finally {
      setIsSubmittingModal(false);
    }
  }, [modoModal, fetchOpciones, opcionActualParaModal]);

  const handleAbrirModalCrear = useCallback(() => {
    setModoModal('crear');
    setOpcionActualParaModal(null);
    setIsOpcionModalOpen(true);
  }, []);

  const handleAbrirModalEditar = useCallback((opcion) => {
    setModoModal('editar');
    setOpcionActualParaModal(opcion);
    setIsOpcionModalOpen(true);
  }, []);

  const handleCerrarModal = useCallback(() => {
    setIsOpcionModalOpen(false);
    setOpcionActualParaModal(null);
    setIsSubmittingModal(false);
  }, []);


  const handleSort = useCallback((column) => {
    const direction = (sortColumn === column && sortDirection === 'asc') ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(direction);
  }, [sortColumn, sortDirection]);

  const opcionesFiltradas = useMemo(() => opciones.filter(op =>
    op.nombre.toLowerCase().includes(filtro.toLowerCase())
  ), [opciones, filtro]);

  const sortedOpciones = useMemo(() => [...opcionesFiltradas].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = String(a[sortColumn] ?? '').toLowerCase();
    const bVal = String(b[sortColumn] ?? '').toLowerCase();
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  }), [opcionesFiltradas, sortColumn, sortDirection]);

  const paginatedOpciones = useMemo(() => {
    const first = (currentPage - 1) * ITEMS_PER_PAGE;
    const last = first + ITEMS_PER_PAGE;
    return sortedOpciones.slice(first, last);
  }, [sortedOpciones, currentPage]);

  const totalPages = useMemo(() => Math.ceil(sortedOpciones.length / ITEMS_PER_PAGE), [sortedOpciones.length]);

  const columns = useMemo(() => [
    { key: 'nombre', label: 'Nombre', sortable: true, className: 'col-20' },
    { key: 'ruta', label: 'Ruta', sortable: true, className: 'col-20' },
    { key: 'orden', label: 'Orden', sortable: true, className: 'col-20' },
    { key: 'visible', label: 'Visible', className: 'col-10', render: (item) => (
      <ToggleSwitch checked={item.visible} onChange={() => {}} disabled size='small' /> ) },
    { key: 'es_separador', label: 'Separador', className: 'col-10', render: (item) => (
      <ToggleSwitch checked={item.es_separador} onChange={() => {}} disabled size='small' /> ) },
    { key: 'acciones', label: 'Acciones', className: 'col-20', render: (item) => (
      <div className='table-actions'>
        <FormButton
          icon={<FaEdit />}
          onClick={() => handleAbrirModalEditar(item)}
          size='small'
          variant='subtle'
          title='Editar'
        />
        <FormButton icon={<FaUsers />} size='small' variant='subtle' title='Perfiles'
          onClick={() => { setOpcionParaPerfiles(item); setIsPerfilesModalOpen(true); }} />
        <FormButton icon={<FaTrashAlt />} size='small' variant='subtle' title='Eliminar'
          onClick={() => setOpcionAEliminar(item)}
          isLoading={loadingStates[`delete-${item.id}`] || false} />
      </div>
    )}
    ], [loadingStates, handleAbrirModalEditar]);

  const opcionesPadre = useMemo(
    () =>
      opciones
        .filter(op => !opcionActualParaModal || op.id !== opcionActualParaModal.id)
        .map(op => ({ value: String(op.id), label: op.nombre })),
    [opciones, opcionActualParaModal]
  );

  return (
    <Container as='main' className='page-container' maxWidth='80rem' centered padding='1rem'>
      <Alert
        isOpen={alertInfo.isOpen}
        message={alertInfo.message}
        type={alertInfo.type}
        title={alertInfo.title}
        onClose={() => setAlertInfo(prev => ({ ...prev, isOpen: false }))}
      />

      <Titulo as='h2' align='center' margin='0 0 1.5rem 0'>Menús de la App</Titulo>

      <Container className='menu-opciones__toolbar' padding='0' background='transparent'>
       <div className='toolbar-left'>
          <SearchBar
            value={filtro}
            onChange={e => setFiltro(e.target.value)}
            placeholder='Buscar opción...'
            aria-label='Buscar opción'
            className='search-bar'
          />
        </div>
        <div className='toolbar-right'>
          <FormButton
            icon={<FaPlus />}
            label='Crear Menú'
            onClick={handleAbrirModalCrear}
            size='small'
          />
        </div>
      </Container>

      <Container className='table-container-wrapper' background='var(--background1)' bordered padding='1rem' margin='0 auto'>
        {isFetchingList ? (
          <Loader text='Cargando opciones...' size='large' />
        ) : paginatedOpciones.length > 0 ? (
          <>
            <DataTable
              rowIdKey='id'
              data={paginatedOpciones}
              columns={columns}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
            {totalPages > 1 && (
              <Container padding='1rem 0 0 0' background='transparent'>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={sortedOpciones.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  showPageInfo
                />
              </Container>
            )}
          </>
        ) : (
          <p style={{ textAlign: 'center', margin: '2rem 0' }}>
            {filtro ? 'No se encontraron opciones.' : 'No hay opciones registradas.'}
          </p>
        )}
      </Container>

      {isOpcionModalOpen && (
        <MenuOpcionFormModal
          isOpen={isOpcionModalOpen}
          onClose={handleCerrarModal}
          onSubmit={handleFormSubmit}
          initialData={opcionActualParaModal}
          mode={modoModal}
          opcionesPadre={opcionesPadre}
          isLoading={isSubmittingModal}
        />
      )}


      <ConfirmDialog
        isOpen={!!opcionAEliminar}
        title={`¿Eliminar opción "${opcionAEliminar?.nombre || ''}"?`}
        message='Esta acción eliminará la opción de menú.'
        confirmText='Eliminar'
        cancelText='Cancelar'
        onConfirm={() => { if (opcionAEliminar) eliminarOpcion(opcionAEliminar.id); }}
        onCancel={() => setOpcionAEliminar(null)}
        confirmVariant='default'
      />

      {isPerfilesModalOpen && opcionParaPerfiles && (
        <AsociarPerfilesModal
          isOpen={isPerfilesModalOpen}
          onClose={() => { setIsPerfilesModalOpen(false); setOpcionParaPerfiles(null); }}
          menuOpcionId={opcionParaPerfiles.id}
        />
      )}
    </Container>
  );
};

export default MenuOpciones;