// src/components/LoginForm.jsx
import { useState, useEffect } from "react"; // Asegurar import de React
import { useAuth } from "../hooks/useAuth"; // Hook de autenticación
import useForm from "../hooks/useForm"; // Manejo de formulario
import { useNavigate, Link } from "react-router-dom"; // Usar Link para navegación interna
import Modal from './Modal';
import FormInput from "./FormInput"; // Refactorizado
import Loader from "./Loader"; // Refactorizado
import FormButton from "./FormButton"; // Refactorizado
import Container from "./Container"; // Usar Container
import Titulo from "./Titulo"; // Usar Titulo


const LoginForm = () => {
  const { login, user, isLoading: isAuthLoading } = useAuth(); // Obtener isLoading del contexto si aplica a la carga inicial del usuario
  const navigate = useNavigate();

  // Redirigir si ya está logueado
  useEffect(() => {
    if (user && !isAuthLoading) { // Solo redirigir si no estamos esperando la carga inicial del usuario
      console.log("Usuario activo:", user.username);
      navigate("/home");
    }
  }, [user, isAuthLoading, navigate]);

  // Manejar los campos del formulario de login
  const { values, handleChange } = useForm({
    username: "",
    password: "",
  });

  const [modal, setModal] = useState({ isOpen: false, title: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado específico para el envío del formulario

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Evitar doble submit

    setIsSubmitting(true);
    setModal({ isOpen: false, title: "", message: "" }); // Cerrar modal previo

    try {
      const result = await login(values.username, values.password);
      // login() debería manejar la redirección interna cambiando el estado 'user'
      // lo que activará el useEffect de arriba.
      if (!result.success) {
        sessionStorage.setItem("lastFailedUsernameForRecoveryStart", values.username);
        // Crear contenido del mensaje del modal
        const errorMessage = (
          <>
            {result.message || "Error desconocido al intentar iniciar sesión."}
            <br />
            <br />
            ¿Olvidaste tu contraseña?{' '}
            {/* Usar Link de react-router-dom */}
            <Link to="/recuperar/inicio" className="modal-link">
              Recupérala aquí
            </Link>
          </>
        );
        setModal({
            isOpen: true,
            title: "Error de inicio de sesión",
            message: errorMessage
        });
      }
      // No resetear formulario aquí si la navegación ocurre por cambio de 'user'
    } catch (error) {
      console.error("Error inesperado durante el login:", error);
      const errorContent = (
        <>
          Error inesperado al intentar iniciar sesión. Por favor, inténtalo de nuevo más tarde.
          <br />
          <br />
          ¿Olvidaste tu contraseña?{' '}
          <Link to="/recuperar/inicio" className="modal-link">
             Recupérala aquí
          </Link>
        </>
      );
      setModal({
          isOpen: true,
          title: "Error Inesperado",
          message: errorContent
      });
    } finally {
      setIsSubmitting(false); // Finalizar estado de envío
    }
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, title: "", message: "" }); // Resetear modal completo
  };

  // Si el usuario ya existe y no estamos cargando, no renderizar el form
   if (user && !isAuthLoading) {
       return <Loader text="Redirigiendo..." />; // O un mensaje simple
   }
   // Mostrar loader principal si el contexto está cargando el usuario inicial
    if (isAuthLoading) {
        return (
            <div className="page-loading-container"> {/* Crear esta clase para centrar */}
                <Loader size="large" text="Verificando sesión..." />
            </div>
        );
    }

  return (
    <>
      {/* Contenedor principal de la página de login */}
      <Container as="div" className="login-page-container" centered>
        {/* Tarjeta del formulario */}
        <Container as="form" className="login-form" onSubmit={handleSubmit} bordered centered>
            {/* Título del formulario */}
            <Titulo as="h2" align="center" className="login-form__title" margin="0.5rem 1rem"> 
                Inicio de Sesión
            </Titulo>

            {/* Campo Usuario */}
            <FormInput
                //label="Usuario" // Añadido label
                name="username"
                placeholder="Ingrese su usuario"
                value={values.username}
                onChange={handleChange}
                required
                disabled={isSubmitting} // Deshabilitar durante envío
                // className ya no es necesario aquí
                // containerClassName="login-form__group" // Opcional si necesitas estilo específico
            />

            {/* Campo Contraseña */}
            <FormInput
                //label="Contraseña" // Añadido label
                name="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={values.password}
                onChange={handleChange}
                required
                disabled={isSubmitting} // Deshabilitar durante envío
            />

            {/* Acciones del formulario (Botón) */}
            <div className="login-form__actions"> {/* Contenedor para el botón */}
                <FormButton
                    type="submit"
                    variant="default" // O la variante que desees
                    fullWidth // Hacer que ocupe el ancho del contenedor
                    disabled={isSubmitting}
                    isLoading={isSubmitting} // <<< Usar isLoading del botón
                    label="Ingresar"
                    loaderSize="small" // Ajustar tamaño del loader interno
                />
            </div>
        </Container> {/* Fin Container Tarjeta */}
      </Container> {/* Fin Container Página */}

      {/* --- Modal de Error (Usa el componente Modal base) --- */}
      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        onClose={handleCloseModal}
        showCloseButton={false} // No botón 'X'
        width={35}
        bodyCentered={true} // Centrar contenido del body
        footerClassName="login-error-modal__footer" 
        footerAlign="center" // Centrar acciones del footer
        // Pasar el botón "Cerrar" como contenido del footer
        footerContent={
          <FormButton
            label="Cerrar"
            onClick={handleCloseModal}
            variant="default" // Variante por defecto o 'outline'
          />
        }
      >
        {/* Contenido específico del modal de error */}
        <div className="login-error-modal__content"> {/* Usar clase BEM específica */}
          {modal.message}
        </div>
      </Modal>
    </>
  );
};

export default LoginForm;