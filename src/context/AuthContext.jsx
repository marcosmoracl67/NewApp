import { createContext, useState, useEffect } from "react";
export { AuthContext }; // para que useAuth.js pueda acceder

// URL base de la API backend
const API_BASE_URL = "http://localhost:3000";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [menuItems, setMenuItems] = useState([]); // Estado para los ítems del menú
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser(); // Intenta cargar usuario y menú al inicio
  }, []);

  // Función principal para obtener datos del usuario autenticado Y su menú
const fetchUser = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/me`, {
      credentials: "include",
    });

    if (!res.ok) {
      if (res.status === 401) {
        console.warn("No autenticado aún.");
      } else {
        const text = await res.text();
        console.warn("Respuesta inesperada:", text);
      }
      setUser(null);
      setIsLoading(false);
      return;
    }

    let userData;
    try {
      userData = await res.json();
    } catch (jsonErr) {
      console.error("AuthContext: Error parsing JSON de /me:", jsonErr);
      setUser(null); // ← 🔐 evita el error de `user.username`
      setIsLoading(false);
      return;
    }

    setUser(userData);

    const acceso = await fetch(`${API_BASE_URL}/api/acceso/${userData.perfil_id}`, {
      credentials: "include",
    });
    const menu = await acceso.json();
    setMenuItems(menu);
  } catch (userFetchError) {
    console.error("AuthContext: Error recuperando usuario (paso 1):", userFetchError);
    setUser(null);
  } finally {
    setIsLoading(false);
  }
};


  const login = async (username, password) => {
    console.log(`AuthContext: Intentando login para ${username}...`);
    setIsLoading(true); // Podrías poner un loading específico para login si quieres
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const data = await res.json();
        console.warn(`AuthContext: Login fallido - ${data.msg}`);
        setIsLoading(false); // Detener loading si login falla
        return { success: false, message: data.msg || "Error al iniciar sesión" };
      }

      // Login OK -> El backend puso la cookie -> Llamar a fetchUser
      await fetchUser(); // fetchUser se encarga de setLoading, setUser y setMenuItems
      console.log("AuthContext: Login exitoso, fetchUser llamado.");
      // fetchUser ya puso isLoading a false en su finally
      return { success: true };

    } catch (error) {
      console.error("AuthContext: Error en la función login:", error);
      setIsLoading(false); // Detener loading en caso de error de red en login
      return { success: false, message: error.message || "Error inesperado durante el login" };
    }
  };

  // --- logout ---
  // Llama a la API de logout y limpia el estado local
  const logout = async () => {
    console.log("AuthContext: Ejecutando logout...");
    setIsLoading(true); // Mostrar loading durante el proceso de logout
    try {
        await fetch(`${API_BASE_URL}/api/users/logout`, {
            method: "POST",
            credentials: "include" // Necesario para enviar la cookie a borrar
        });

    } catch (error) {
        console.error("AuthContext: Error llamando a API /logout:", error);
        // Continuar con la limpieza local aunque falle la llamada a la API
    } finally {
        // Limpieza del estado local INDEPENDIENTEMENTE del éxito de la API
        setUser(null);
        setMenuItems([]); // <<<<--- Limpiar menú es crucial aquí
        sessionStorage.clear();
        console.log("AuthContext: Estado local (user, menuItems) y sessionStorage limpiados.");
        setIsLoading(false); // Terminar loading
    }
  };

  // Proveer el contexto con todos los valores necesarios
  return (
    <AuthContext.Provider value={{ user, login, logout, menuItems, isLoading, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};