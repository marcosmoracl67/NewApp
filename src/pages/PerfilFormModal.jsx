import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { FaSave, FaPlus } from 'react-icons/fa';

const PerfilFormModal = ({ isOpen, onClose, onSubmit, initialData, mode, isLoading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === 'editar' && initialData) {
        setFormData({
          id: initialData.id,
          nombre: initialData.nombre || '',
          descripcion: initialData.descripcion || ''
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: ''
        });
      }
    }
  }, [isOpen, mode, initialData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    ? 'Crear Nuevo Perfil'
    : `Editar Perfil: ${initialData?.nombre || ''}`;

  const submitButtonText = mode === 'crear' ? 'Crear Perfil' : 'Guardar Cambios';
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
          label="Nombre del Perfil"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
          placeholder="Ej: Administrador"
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          error={errors.descripcion}
          placeholder="Ej: Perfil con permisos completos"
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

export default PerfilFormModal;