import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import ToggleSwitch from '../components/ToggleSwitch';
import FormButton from '../components/FormButton';
import { FaSave, FaPlus } from 'react-icons/fa';

const MenuOpcionFormModal = ({ isOpen, onClose, onSubmit, initialData, mode, opcionesPadre = [], isLoading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    ruta: '',
    icono: '',
    orden: 0,
    es_separador: false,
    visible: true,
    padre_id: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === 'editar' && initialData) {
        setFormData({
          id: initialData.id,
          nombre: initialData.nombre || '',
          ruta: initialData.ruta || '',
          icono: initialData.icono || '',
          orden: initialData.orden ?? 0,
          es_separador: initialData.es_separador ?? false,
          visible: initialData.visible ?? true,
          padre_id: initialData.padre_id ? String(initialData.padre_id) : ''
        });
      } else {
        setFormData({
          nombre: '',
          ruta: '',
          icono: '',
          orden: 0,
          es_separador: false,
          visible: true,
          padre_id: ''
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: newValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const validarForm = useCallback(() => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (validarForm()) {
      onSubmit(formData);
    }
  }, [validarForm, onSubmit, formData]);

  const modalTitle = mode === 'crear'
    ? 'Crear Nueva Opción de Menú'
    : `Editar Opción: ${initialData?.nombre || ''}`;

  const submitButtonText = mode === 'crear' ? 'Crear Opción' : 'Guardar Cambios';
  const submitButtonIcon = mode === 'crear' ? <FaPlus /> : <FaSave />;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width={60}
      title={modalTitle}
      showCloseButton={false}
      closeOnEscape={false}
      closeOnOverlayClick={false}
    >
      <form onSubmit={handleSubmitForm} noValidate>
        <FormInput
          label="Nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="Ruta"
          name="ruta"
          value={formData.ruta}
          onChange={handleChange}
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="Icono"
          name="icono"
          value={formData.icono}
          onChange={handleChange}
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="Orden"
          name="orden"
          type="number"
          value={formData.orden}
          onChange={handleChange}
          containerClassName="u-margin-bottom-sm"
        />
        <FormSelect
          label="Padre"
          name="padre_id"
          value={formData.padre_id}
          onChange={handleChange}
          options={[{ value: '', label: 'Sin padre' }, ...opcionesPadre]}
          containerClassName="u-margin-bottom-sm"
        />
        <ToggleSwitch
          label="Es Separador"
          name="es_separador"
          checked={formData.es_separador}
          onChange={handleChange}
          containerClassName="u-margin-bottom-sm"
        />
        <ToggleSwitch
          label="Visible"
          name="visible"
          checked={formData.visible}
          onChange={handleChange}
          containerClassName="u-margin-bottom-sm"
        />
        <div className="modal-form-footer" style={{ textAlign: 'right', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--input-stroke-idle)' }}>
          <FormButton
            label="Cancelar"
            onClick={onClose}
            variant="outline"
            type="button"
            size="small"
            disabled={isLoading}
            style={{ marginRight: '0.5rem' }}
          />
          <FormButton
            label={submitButtonText}
            icon={submitButtonIcon}
            type="submit"
            size="small"
            variant={mode === 'crear' ? 'success' : 'default'}
            isLoading={isLoading}
          />
        </div>
      </form>
    </Modal>
  );
};

export default MenuOpcionFormModal;