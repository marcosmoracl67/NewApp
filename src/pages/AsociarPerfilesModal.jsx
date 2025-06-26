import { useEffect, useState, useCallback } from 'react';
import Modal from '../components/Modal';
import FormCheckbox from '../components/FormCheckbox';
import FormButton from '../components/FormButton';
import PropTypes from 'prop-types';

const API_BASE_URL = 'http://localhost:3000/api';

const AsociarPerfilesModal = ({ isOpen, onClose, menuOpcionId }) => {
  const [perfiles, setPerfiles] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(async () => {
    if (!menuOpcionId) return;
    try {
      const [perfilesRes, asignadosRes] = await Promise.all([
        fetch(`${API_BASE_URL}/perfiles`, { credentials: 'include' }),
        fetch(`${API_BASE_URL}/perfiles-menu/${menuOpcionId}`, { credentials: 'include' })
      ]);
      if (perfilesRes.ok) {
        const perfilesData = await perfilesRes.json();
        setPerfiles(perfilesData);
      }
      if (asignadosRes.ok) {
        const asignados = await asignadosRes.json();
        const ids = asignados.map(p => p.perfil_id || p.id);
        setSeleccionados(ids);
      }
    } catch (err) {
      console.error('Error cargando perfiles', err);
    }
  }, [menuOpcionId]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  const togglePerfil = useCallback((id) => {
    setSeleccionados(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  }, []);

  const guardarCambios = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch(`${API_BASE_URL}/perfiles-menu/${menuOpcionId}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ perfiles: seleccionados })
      });
      onClose();
    } catch (err) {
      console.error('Error guardando perfiles', err);
    } finally {
      setIsLoading(false);
    }
  }, [menuOpcionId, seleccionados, onClose]);

  const footer = (
    <>
      <FormButton label="Cancelar" onClick={onClose} variant="outline" size="small" disabled={isLoading} />
      <FormButton label="Guardar" onClick={guardarCambios} size="small" isLoading={isLoading} />
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Perfiles Asociados" width={40} footerContent={footer}>
      {perfiles.map(perfil => (
        <FormCheckbox
          key={perfil.id || perfil.perfil_id}
          name={`perfil-${perfil.id}`}
          label={perfil.nombre}
          checked={seleccionados.includes(perfil.id || perfil.perfil_id)}
          onChange={() => togglePerfil(perfil.id || perfil.perfil_id)}
        />
      ))}
    </Modal>
  );
};

AsociarPerfilesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  menuOpcionId: PropTypes.number
};

export default AsociarPerfilesModal;