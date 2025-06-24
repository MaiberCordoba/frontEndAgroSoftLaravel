import { createContext, useState, useEffect, useCallback } from "react";
import { getUser } from "@/api/Auth";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  exp?: number;
  identificacion: number;
  rol: string;
  tokenVersion?: number;
}

interface AuthContextType {
  user: any;
  token: string | null;
  rol: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  executeWithRole: (role: string, action: () => void) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const isTokenValid = useCallback((tokenString: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(tokenString);
      if (decoded.exp) {
        return decoded.exp > Date.now() / 1000;
      }
      console.warn("Token sin fecha de expiración");
      return true;
    } catch (error) {
      console.error("Token inválido:", error);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    console.log("Cerrando sesión...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
  }, []);

  const refreshUser = async () => {
    if (!token) return;
    try {
      console.log("Refrescando usuario con token:", token);
      let userData = await getUser(token);
      console.log("Usuario refrescado:", userData);
      // Normalizar si viene como { success: true, user: {...} }
      if (userData.success && userData.user) {
        userData = userData.user;
        console.log("Normalizando userData:", userData);
      }
      if (!userData.rol) {
        console.error("Error: userData no incluye rol:", userData);
        throw new Error("Respuesta inválida: falta rol");
      }
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error al refrescar usuario:", error.message, error.stack);
      logout();
    }
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        console.log("No hay token en localStorage");
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      if (token !== storedToken) {
        console.log("Token en localStorage cambió, actualizando estado");
        setToken(storedToken);
      }

      if (storedToken && isTokenValid(storedToken)) {
        try {
          console.log("Verificando usuario con token:", storedToken);
          let userData = await getUser(storedToken);
          console.log("Usuario verificado:", userData);
          // Normalizar si viene como { success: true, user: {...} }
          if (userData.success && userData.user) {
            userData = userData.user;
            console.log("Normalizando userData:", userData);
          }
          if (!userData.rol) {
            console.error("Error: userData no incluye rol:", userData);
            throw new Error("Respuesta inválida: falta rol");
          }
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error(
            "Error al verificar el token o cargar el usuario:",
            error.message,
            error.stack
          );
          logout();
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("Token inválido o expirado");
        logout();
      }
    };

    checkAuthStatus();
  }, [isTokenValid, logout]);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
        const newToken = event.newValue;
        if (!newToken) {
          console.log(
            "Token removido en localStorage por otra pestaña. Cerrando sesión..."
          );
          logout();
        } else {
          console.log("Token actualizado en localStorage:", newToken);
          setToken(newToken);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout]);

  const login = async (newToken: string) => {
    setIsLoading(true);
    console.log("Iniciando sesión con token:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      let userData = await getUser(newToken);
      console.log("Usuario cargado:", userData);
      // Normalizar si viene como { success: true, user: {...} }
      if (userData.success && userData.user) {
        userData = userData.user;
        console.log("Normalizando userData:", userData);
      }
      if (!userData.rol) {
        console.error("Error: userData no incluye rol:", userData);
        throw new Error("Respuesta inválida: falta rol");
      }
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(
        "Error al iniciar sesión y cargar usuario:",
        error.message,
        error.stack
      );
      logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = useCallback(
    (role: string) => {
      const hasRoleResult = user?.rol === role;
      console.log("Evaluando hasRole:", {
        role,
        userRol: user?.rol,
        user,
        result: hasRoleResult,
      });
      return hasRoleResult;
    },
    [user]
  );

  const hasAnyRole = (roles: string[]) => roles.includes(user?.rol || "");
  const executeWithRole = async (role: string, action: () => void) => {
    await refreshUser();
    if (user?.rol === role) {
      action();
    } else {
      console.error(`Acceso denegado: Se requiere rol ${role}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        rol: user?.rol || null,
        isLoading,
        isAuthenticated,
        login,
        logout,
        hasRole,
        hasAnyRole,
        executeWithRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
