import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Bienvenido, {user?.nombre || user?.username}!</h1>
      <button onClick={logout}>Cerrar sesión</button>
    </div>
  );
};

export default Home;
