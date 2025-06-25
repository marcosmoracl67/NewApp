import ReactDOM from "react-dom";
import FormButton from "./FormButton";

const ModalDialog = ({ isOpen, title, message, onClose, actions, children, msgbtnClose, maxWidth = "90%" }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-dialog" style={{ maxWidth }}>
        <div>
          <h2 className="modal-title">{title}</h2>
          <p className="modal-parraf">{message}</p>
       </div>
        <div className="modal-body">
          {children}
        </div>
  
        <div className="modal-actions">
          {actions || (
            <FormButton 
              label={msgbtnClose}
              size="large"
              variant="success"
              align="center"  
              onClick={onClose}>
            </FormButton>
          )}
        </div>
      </div>
    </>,
    document.body
  );
  
};

export default ModalDialog;
