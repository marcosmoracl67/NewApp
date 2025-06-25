import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';

function App() {

  return (
    <AuthProvider>
      <h1>Vite + React</h1>
      <AppRouter />
    </AuthProvider>
  );

}

export default App
