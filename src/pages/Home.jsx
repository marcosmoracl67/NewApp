import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '2rem' }}>
      
    </div>
  );
};

export default Home;
