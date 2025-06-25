// src/pages/hierarchy/ModoFallaFormModal.jsx
import { useState, useEffect, useCallback } from 'react';
import Modal from '../../components/Modal';
import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import ToggleSwitch from '../../components/ToggleSwitch';
import { FaSave, FaPlus } from 'react-icons/fa';

const ModoFallaFormModal = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }) => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Descripcion: '',
    Activo: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === 'editar' && initialData) {
        setFormData({
          IdModoFalla: initialData.IdModoFalla || undefined,
          Nombre: initialData.Nombre || '',
          Descripcion: initialData.Descripcion || '',
          Activo: initialData.Activo ?? false
        });
      } else {
        setFormData({
          Nombre: '',
          Descripcion: '',
          Activo: false
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

  const validataForm = useCallback(() => {
    const newErrors = {};
    if (!formData.Nombre.trim()) {
      newErrors.Nombre = 'El Nombre es obligatorio';
    }
    if (!formData.Descripcion.trim()) {
      newErrors.Descripcion = 'La Descripción es obligatoria';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (validataForm()) {
      onSubmit(formData);
    }
  }, [validataForm, onSubmit, formData]);

  const modalTitle = mode === 'crear'
    ? 'Crear Nuevo Modo de Falla'
    : `Editar Modo de Falla: ${initialData?.Descripcion || ''}`;

  const submitButtonText = mode === 'crear'
    ? 'Crear Modo de Falla'
    : 'Guardar Cambios';

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
          label="Nombre Modo de Falla"
          name="Nombre"
          value={formData.Nombre}
          onChange={handleChange}
          error={errors.Nombre}
          required
          placeholder="Ej: Nombre Modo de Falla"
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="Descripción"
          name="Descripcion"
          value={formData.Descripcion}
          onChange={handleChange}
          error={errors.Descripcion}
          required
          placeholder="Ej: Descripción para el Modo de Falla"
          containerClassName="u-margin-bottom-sm"
        />
        <ToggleSwitch
          label="Activo"
          name="Activo"
          checked={formData.Activo}
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

export default ModoFallaFormModal;
