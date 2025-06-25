import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginForm from '../components/LoginForm';
import Loader from '../components/Loader';
import AppLayout from '../components/layout/AppLayout';
import Home from '../pages/Home';
import ModoFalla from '../pages/ModoFalla';
import Usuario from '../pages/Usuarios';
import Perfil from '../pages/Perfiles';
import Menu from '../pages/MenuOpciones';
import MenuOpciones from '../pages/MenuOpciones';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader text="Verificando acceso..." />;

  return user ? children : <Navigate to="/login" />;
};

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <AppLayout>
                <Home />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/modofalla"
          element={
            <PrivateRoute>
              <AppLayout>
                <ModoFalla />
              </AppLayout>
            </PrivateRoute>
          }
        />

         <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <AppLayout>
                <Usuario />
              </AppLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <AppLayout>
                <Perfil />
              </AppLayout>
            </PrivateRoute>
          }
        /> 

        <Route
          path="/menus"
          element={
            <PrivateRoute>
              <AppLayout>
                <Menu />
              </AppLayout>
            </PrivateRoute>
          }
        /> 

        <Route
          path="/menuopciones"
          element={
            <PrivateRoute>
              <AppLayout>
                <MenuOpciones />
              </AppLayout>
            </PrivateRoute>
          }
        />


        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
