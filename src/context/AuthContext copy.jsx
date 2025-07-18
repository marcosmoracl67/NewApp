import { createContext, useState, useEffect } from "react";
export { AuthContext }; // para que useAuth.js pueda acceder

// URL base de la API backend
import { API_BASE_URL } from "../config";
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

     // Recuperar el menú dinámico del backend
    try {
      const menuRes = await fetch(`${API_BASE_URL}/api/menu`, {
        credentials: "include",
      });
     if (menuRes.ok) {
        const rawMenu = await menuRes.json();
        const formatMenu = (items = []) =>
          items.map((it) => ({
            opcion_id: it.opcion_id ?? it.id ?? it.menu_opcion_id,
            text: it.text ?? it.nombre ?? it.label ?? it.titulo,
            path: it.path ?? it.ruta,
            icon: it.icon ?? it.icono,
            separator: Boolean(it.es_separador),            
            children: it.children
              ? formatMenu(it.children)
              : it.submenu
              ? formatMenu(it.submenu)
              : it.opciones
              ? formatMenu(it.opciones)
              : [],
          }));
        setMenuItems(formatMenu(rawMenu));
      } else {
        console.warn(
          "AuthContext: Respuesta inesperada al obtener el menú -",
          menuRes.status,
        );
      }
    } catch (menuErr) {
      console.error("AuthContext: Error recuperando menú:", menuErr);
    }
  } catch (userFetchError) {
    console.error("AuthContext: Error recuperando usuario (paso 1):", userFetchError);
    setUser(null);
  } finally {
    setIsLoading(false);
  }
};

  const login = async (username, password) => {
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