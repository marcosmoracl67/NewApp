import { useEffect, useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FaAngleRight, FaAngleLeft, FaAngleDoubleRight, FaAngleDoubleLeft } from 'react-icons/fa';
import Modal from '../components/Modal';
import FormCheckbox from '../components/FormCheckbox';
import FormButton from '../components/FormButton';
import DataTable from '../components/DataTable';

import { API_BASE_URL } from '../config';

const AsociarPerfilesModal = ({ isOpen, onClose, menuOpcionId }) => {
  const [perfiles, setPerfiles] = useState([]);
  const [asociados, setAsociados] = useState([]); // ids asociados
  const [selectedDisponibles, setSelectedDisponibles] = useState([]);
  const [selectedAsociados, setSelectedAsociados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!menuOpcionId) return;
    try {
        const [perfilesRes, asignadosRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/perfiles`, { credentials: 'include' }),
          fetch(`${API_BASE_URL}/api/menu-opciones/${menuOpcionId}/perfiles`, { credentials: 'include' })
        ]);
      if (perfilesRes.ok) {
        const perfilesData = await perfilesRes.json();
        const normalizados = perfilesData.map(p => ({
          id: p.id || p.perfil_id,
          nombre: p.nombre
        }));
        setPerfiles(normalizados);
      }
      if (asignadosRes.ok) {
        const asignados = await asignadosRes.json();
        const ids = asignados.map(p => p.perfil_id || p.id);
        setAsociados(ids);
      }
    } catch (err) {
      console.error('Error cargando perfiles', err);
    }
  }, [menuOpcionId]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      setSelectedDisponibles([]);
      setSelectedAsociados([]);
    }
  }, [isOpen, fetchData]);

  const disponibles = useMemo(
    () => perfiles.filter(p => !asociados.includes(p.id)),
    [perfiles, asociados]
  );

  const asociadosData = useMemo(
    () => perfiles.filter(p => asociados.includes(p.id)),
    [perfiles, asociados]
  );

  const toggleDisponible = useCallback(id => {
    setSelectedDisponibles(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }, []);

  const toggleAsociado = useCallback(id => {
    setSelectedAsociados(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }, []);

  const moverSeleccionados = useCallback(() => {
    setAsociados(prev => Array.from(new Set([...prev, ...selectedDisponibles])));
    setSelectedDisponibles([]);
  }, [selectedDisponibles]);

  const moverTodos = useCallback(() => {
    const todos = disponibles.map(p => p.id);
    setAsociados(prev => Array.from(new Set([...prev, ...todos])));
    setSelectedDisponibles([]);
  }, [disponibles]);

  const retirarSeleccionados = useCallback(() => {
    setAsociados(prev => prev.filter(id => !selectedAsociados.includes(id)));
    setSelectedAsociados([]);
  }, [selectedAsociados]);

  const retirarTodos = useCallback(() => {
    setAsociados([]);
    setSelectedAsociados([]);
  }, []);


  const guardarCambios = useCallback(async () => {
    setIsLoading(true);
    //console.log('Menu Opción: ', menuOpcionId, 'Perfiles Asociados:', asociados);
    try {
      await fetch(`${API_BASE_URL}/api/menu-opciones/${menuOpcionId}/perfiles`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfiles: asociados })
      });
      onClose();
      
    } catch (err) {
      console.error('Error guardando perfiles', err);
    } finally {
      setIsLoading(false);
    }
  }, [menuOpcionId, asociados, onClose]);

  const columnsDisponibles = useMemo(() => [
    {
      key: 'select',
      label: '',
      className: 'col-10',
      render: row => (
        <FormCheckbox
          name={`disp-${row.id}`}
          checked={selectedDisponibles.includes(row.id)}
          onChange={() => toggleDisponible(row.id)}
        />
      )
    },
    { key: 'nombre', label: 'Perfiles Disponibles', className: 'col-90' }
  ], [selectedDisponibles, toggleDisponible]);

  const columnsAsociados = useMemo(() => [
    {
      key: 'select',
      label: '',
      className: 'col-10',
      render: row => (
        <FormCheckbox
          name={`aso-${row.id}`}
          checked={selectedAsociados.includes(row.id)}
          onChange={() => toggleAsociado(row.id)}
        />
      )
    },
    { key: 'nombre', label: 'Perfiles Asociados', className: 'col-90' }
  ], [selectedAsociados, toggleAsociado]);

  const footer = (
    <>
      <FormButton label="Cancelar" onClick={onClose} variant="outline" size="small" disabled={isLoading} />
      <FormButton label="Guardar" onClick={guardarCambios} size="small" isLoading={isLoading} />
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asociar Perfiles" width={60} footerContent={footer}>
      <div className="asociar-perfiles-container">
        <div className="asociar-perfiles-table">
          <DataTable rowIdKey="id" data={disponibles} columns={columnsDisponibles} />
        </div>
        <div className="asociar-perfiles-buttons">
          <FormButton icon={<FaAngleDoubleRight />} onClick={moverTodos} size="small" variant="subtle" />
          <FormButton icon={<FaAngleRight />} onClick={moverSeleccionados} size="small" variant="subtle" />
          <FormButton icon={<FaAngleLeft />} onClick={retirarSeleccionados} size="small" variant="subtle" />
          <FormButton icon={<FaAngleDoubleLeft />} onClick={retirarTodos} size="small" variant="subtle" />
        </div>
        <div className="asociar-perfiles-table">
          <DataTable rowIdKey="id" data={asociadosData} columns={columnsAsociados} />
        </div>
      </div>
    </Modal>
  );
};

AsociarPerfilesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menuOpcionId: PropTypes.number
};

export default AsociarPerfilesModal;