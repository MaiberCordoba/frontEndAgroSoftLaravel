import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/UseAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading, hasRole, rol } = useAuth();

  if (isLoading) {
    return <div>Cargando autenticación...</div>;
  }

  if (!isAuthenticated) {
    console.log("No autenticado, redirigiendo a /login");
    return <Navigate to="/login" />;
  }

  if (window.location.pathname === "/usuarios") {
    console.log("Verificando rol para /usuarios:", {
      userRol: rol,
      hasAdminRole: hasRole("admin"),
    });
    if (!hasRole("admin")) {
      console.log("Usuario no es admin, redirigiendo a /home");
      return <Navigate to="/home" />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
