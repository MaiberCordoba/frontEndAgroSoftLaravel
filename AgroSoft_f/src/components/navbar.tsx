import { useNavigate } from "react-router-dom";
import { User, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/UseAuth";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (logout) {
      logout();
      navigate("/login");
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="flex items-center justify-between bg-green-700 p-2 text-white w-full">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-green-800"
          aria-label="Toggle Sidebar"
        >
          <Menu />
        </button>
        <div className="flex items-center gap-3">
          <img src="/logoAgrosofWB.png" alt="Agrosoft" className="h-9" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-medium ">{user.nombre || "Usuario"}</span>
              <User
                size={28}
                className="cursor-pointer"
                aria-label="Ver perfil de usuario"
              />
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 cursor-pointer hover:underline"
              aria-label="Cerrar sesión"
            >
              <LogOut size={28} className="mr-4" />
            </button>
          </div>
        )}
        {/* Mobile menu toggle */}
        <div className="md:hidden relative">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-green-800"
            aria-label="Abrir menú móvil"
          >
            <User />
          </button>
          {isMobileMenuOpen && (
            <div className="absolute right-0 top-12 bg-white text-black rounded-lg shadow-xl w-48 z-50">
              {user?.nombre && (
                <div className="px-3 py-2 font-medium border-b">
                  {user.nombre}
                </div>
              )}
              <div className="p-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 rounded text-red-600 text-left"
                >
                  <LogOut size={18} /> Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
