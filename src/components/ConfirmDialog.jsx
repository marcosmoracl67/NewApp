// src/components/ConfirmDialog.jsx
import Modal from './Modal'; // Importa el Modal base refactorizado
import FormButton from './FormButton'; // Importa el FormButton refactorizado
import PropTypes from 'prop-types';

const ConfirmDialog = ({
  isOpen,
  title = "¿Estás seguro?", // Título por defecto
  message,                 // Mensaje principal (string o JSX)
  onConfirm,
  onCancel,
  confirmText = "Confirmar", // Texto del botón de confirmación
  cancelText = "Cancelar",   // Texto del botón de cancelar
  confirmVariant = "success", // Variante del botón de confirmación (ej: 'danger', 'success', 'default')
  cancelVariant = "success",  // Variante del botón de cancelar
  width = 30,                // Ancho del modal en 'rem'
  isLoadingConfirm = false, // Opcional: para mostrar spinner en botón confirmar
  // isLoadingCancel = false, // Opcional: para mostrar spinner en botón cancelar
}) => {
  // No renderizar nada si no está abierto
  if (!isOpen) return null;

  // Construir el contenido del footer con los botones
  const dialogFooterContent = (
    <> {/* Usar Fragment para agrupar los botones */}
      <FormButton
        label={cancelText}
        onClick={onCancel}
        variant={cancelVariant}
        size="medium"
        // isLoading={isLoadingCancel} // Descomentar si se añade prop isLoading
      />
      <FormButton
        label={confirmText}
        onClick={onConfirm}
        variant={confirmVariant}
        size="medium"
        // isLoading={isLoadingConfirm} // Descomentar si se añade prop isLoading
      />
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      onClose={onCancel} // El cierre (overlay o Esc) equivale a cancelar
      width={width}
      showCloseButton={false} // Los diálogos de confirmación no suelen tener 'X'
      className="modal--dialog confirm-dialog-modal-custom" // Añadir clase específica para más control si es necesario
      titleCentered={true}   // Centrar el título
      bodyCentered={true}    // Centrar el contenido del cuerpo
      footerContent={dialogFooterContent} // <<< Pasar los botones al footer
      footerAlign="center"   // <<< Centrar los botones en el footer
    >
      {/* El mensaje se pasa como children y se estiliza con CSS */}
      {message && <p className="confirm-dialog__message">{message}</p>}
    </Modal>
  );
};

ConfirmDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  title: PropTypes.string,
  message: PropTypes.node, // Puede ser string o JSX
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmVariant: PropTypes.string, // Validar con oneOf si es posible
  cancelVariant: PropTypes.string,  // Validar con oneOf si es posible
  width: PropTypes.number,
};

export default ConfirmDialog;