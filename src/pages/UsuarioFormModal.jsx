import { useState, useEffect, useCallback } from 'react';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import FormButton from '../components/FormButton';
import ToggleSwitch from '../components/ToggleSwitch';
import { FaSave, FaPlus } from 'react-icons/fa';

const UsuarioFormModal = ({ isOpen, onClose, onSubmit, initialData, mode, perfilesOptions = [], isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    nombre: '',
    rut: '',
    password: '',
    email: '',
    celular: '',
    activo: false,
    perfil_id: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      if (mode === 'editar' && initialData) {
        setFormData({
          usuario_id: initialData.usuario_id,
          username: initialData.username || '',
          nombre: initialData.nombre || '',
          rut: initialData.rut || '',
          password: '',
          email: initialData.email || '',
          celular: initialData.celular || '',
          activo: initialData.activo ?? false,
          perfil_id: initialData.perfil_id ? String(initialData.perfil_id) : ''
        });
      } else {
        setFormData({
          username: '',
          nombre: '',
          rut: '',
          password: '',
          email: '',
          celular: '',
          activo: false,
          perfil_id: ''
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
    if (!formData.username.trim()) newErrors.username = 'El usuario es obligatorio';
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.rut.trim()) newErrors.rut = 'El RUT es obligatorio';
    if (mode === 'crear' && !formData.password.trim()) newErrors.password = 'La contraseña es obligatoria';
    if (!formData.perfil_id) newErrors.perfil_id = 'Debe seleccionar un perfil';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, mode]);

  const handleSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (validarForm()) {
      onSubmit(formData);
    }
  }, [validarForm, onSubmit, formData]);

  const modalTitle = mode === 'crear'
    ? 'Crear Nuevo Usuario'
    : `Editar Usuario: ${initialData?.username || ''}`;

  const submitButtonText = mode === 'crear' ? 'Crear Usuario' : 'Guardar Cambios';
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
          label="Nombre de Usuario"
          name="username"
          value={formData.username}
          onChange={handleChange}
          error={errors.username}
          required
          placeholder="Ej: jdoe"
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="Nombre Completo"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          error={errors.nombre}
          required
          placeholder="Ej: Juan Pérez"
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="RUT"
          name="rut"
          value={formData.rut}
          onChange={handleChange}
          error={errors.rut}
          required
          containerClassName="u-margin-bottom-sm"
        />
        {mode === 'crear' && (
          <FormInput
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
            containerClassName="u-margin-bottom-sm"
          />
        )}
        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          containerClassName="u-margin-bottom-sm"
        />
        <FormInput
          label="Celular"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          error={errors.celular}
          containerClassName="u-margin-bottom-sm"
        />
        <FormSelect
          label="Perfil"
          name="perfil_id"
          value={formData.perfil_id}
          onChange={handleChange}
          options={perfilesOptions}
          error={errors.perfil_id}
          required
          containerClassName="u-margin-bottom-sm"
        />
        <ToggleSwitch
          label="Activo"
          name="activo"
          checked={formData.activo}
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

export default UsuarioFormModal;