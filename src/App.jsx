import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AppRouter from './routes/AppRouter';

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <h1>Vite + React</h1>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App
