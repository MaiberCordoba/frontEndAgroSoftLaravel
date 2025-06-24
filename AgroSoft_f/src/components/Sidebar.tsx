import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Home,
  Users,
  Monitor,
  Calendar,
  MapPin,
  Leaf,
  DollarSign,
  Wrench,
  ShieldCheck,
  ChevronDown,
  ClipboardList,
} from "lucide-react";
import { useAuth } from "@/hooks/UseAuth";
import { addToast } from "@heroui/react"; // Importa tu función addToast

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const location = useLocation();
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUserRole(user.rol);
    } else {
      setUserRole(null);
    }
  }, [user]);

  const toggleMenu = (menu: string) => {
    if (isOpen) {
      setOpenMenu(openMenu === menu ? null : menu);
    }
  };

  const getFilteredSubmenus = (title: string, submenus: string[]): string[] => {
    if (title === "Cultivos" && userRole === "visitante") {
      return submenus.filter((sub) => sub === "Informacion Cultivos Sembrados");
    }
    if (title === "Fitosanitario" && userRole === "visitante") {
      return submenus.filter(
        (sub) =>
          ![
            "Tipos de afectaciones",
            "Afectaciones",
            "tipos de control",
          ].includes(sub)
      );
    }
    if (
      title === "Inventario" &&
      ["aprendiz", "visitante"].includes(userRole || "")
    ) {
      return submenus.filter(
        (sub) => !["Usos Herramientas", "Usos Insumos"].includes(sub)
      );
    }
    return submenus;
  };

  const mainItems = [
    { icon: Home, color: "text-[#254030]", text: "Home", to: "/home" },
    ...(userRole === "admin"
      ? [
          {
            icon: Users,
            color: "text-[#254030]",
            text: "Usuarios",
            to: "/usuarios",
          },
        ]
      : []),
  ];

  const baseMenuItems = [
    {
      title: "Cultivos",
      icon: Leaf,
      color: "text-[#254030]",
      submenus: [
        "Tipos Especie",
        "Especies",
        "Cultivos",
        "Semilleros",
        "Lotes",
        "Eras",
        "Informacion Cultivos Sembrados",
      ],
    },
    {
      title: "Actividades",
      icon: Wrench,
      color: "text-[#254030]",
      submenus: [
        "Actividades",
        "Herramientas",
        "Insumos",
        "Usos productos",
        "Usos herramientas"
      ],
      restricted: ["visitante"],
    },
    {
      title: "Finanzas",
      icon: DollarSign,
      color: "text-[#254030]",
      submenus: ["Cosechas", "Ventas","Desechos","Tipos desechos"],
      restricted: ["visitante", "aprendiz"],
    },
    //{
      //  title: "Inventario",
      //  icon: ClipboardList,
    //  color: "text-[#254030]",
    //  submenus: [
    //    "Bodega",
    //    "Insumos",
    //    "Herramientas",
    //    "Usos Herramientas",
    //    "Usos Insumos",
    //  ],
    //},
    {
      title: "Fitosanitario",
      icon: ShieldCheck,
      color: "text-[#254030]",
      submenus: [
        "Tipos de afectaciones",
        "Afectaciones",
        "Afectaciones en cultivos",
        "Tipos de control",
        "Controles",
      ],
    },
    {
      title: "IoT",
      icon: Monitor,
      color: "text-[#254030]",
      submenus: ["iot"],
    },
  ];

  const filteredNavMenuItems = baseMenuItems
    .filter((menu) => {
      return !menu.restricted || !menu.restricted.includes(userRole || "");
    })
    .map((menu) => ({
      ...menu,
      submenus: getFilteredSubmenus(menu.title, menu.submenus),
    }));

  const isSidebarContentVisible = isOpen;

  const handleRestrictedClick = (e: React.MouseEvent, linkText: string) => {
    e.preventDefault();
    addToast({
      title: "Acceso denegado",
      description: `No tienes permiso para acceder a "${linkText}".`,
      color: "warning",
    });
  };

  return (
    <aside
      className={`h-full bg-white shadow-lg flex flex-col transition-all duration-300 relative
        ${isOpen ? "w-48" : "w-20"}
        overflow-hidden md:overflow-visible`}
    >
      <nav className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        {mainItems.map((item) => {
          // Asume que los mainItems no están restringidos
          const isRestricted = false;
          const linkClasses = ({ isActive }: { isActive: boolean }) => `
            flex items-center gap-3 p-2 rounded-lg mb-1 text-sm
            hover:bg-gray-200 transition-colors
            ${isActive ? "bg-gray-200 font-medium" : ""}
            ${!isSidebarContentVisible ? "justify-center" : ""}
          `;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={linkClasses}
              title={!isSidebarContentVisible ? item.text : undefined}
              onClick={
                isRestricted
                  ? (e) => handleRestrictedClick(e, item.text)
                  : undefined
              }
            >
              <item.icon size={20} className={item.color} />
              {isSidebarContentVisible && (
                <span className="whitespace-nowrap">{item.text}</span>
              )}
            </NavLink>
          );
        })}

        {filteredNavMenuItems.map((menu) => (
          <div key={menu.title}>
            <button
              className={`flex items-center w-full p-2 rounded-lg mb-1
                hover:bg-gray-200 transition-colors text-sm
                ${
                  menu.submenus.some((sub) =>
                    location.pathname.includes(
                      sub.toLowerCase().replace(/\s+/g, "-")
                    )
                  )
                    ? "bg-gray-200 font-medium"
                    : ""
                }
                ${!isSidebarContentVisible ? "justify-center px-0" : "justify-between"}`}
              onClick={() => toggleMenu(menu.title)}
              title={!isSidebarContentVisible ? menu.title : undefined}
            >
              <div
                className={`flex items-center ${isSidebarContentVisible ? "gap-3" : "justify-center w-full"}`}
              >
                <menu.icon size={20} className={menu.color} />
                {isSidebarContentVisible && (
                  <span className="whitespace-nowrap">{menu.title}</span>
                )}
              </div>
              {isSidebarContentVisible && (
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    openMenu === menu.title ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </button>

            {isSidebarContentVisible &&
              openMenu === menu.title &&
              menu.submenus.length > 0 && (
                <div className="overflow-hidden transition-all duration-300">
                  <div className="scroll-custom max-h-[150px] overflow-y-auto">
                    {menu.submenus.map((submenu) => {
                      const path = `/${submenu.toLowerCase().replace(/\s+/g, "-")}`;

                      // Lógica de restricción de submenú.
                      const isSubmenuRestricted =
                        (menu.title === "Cultivos" &&
                          submenu !== "Informacion Cultivos Sembrados" &&
                          userRole === "visitante") ||
                        (menu.title === "Fitosanitario" &&
                          [
                            "Tipos de afectaciones",
                            "Afectaciones",
                            "tipos de control",
                          ].includes(submenu) &&
                          userRole === "visitante") ||
                        (menu.title === "Inventario" &&
                          ["Usos Herramientas", "Usos Insumos"].includes(
                            submenu
                          ) &&
                          ["aprendiz", "visitante"].includes(userRole || ""));

                      return (
                        <NavLink
                          key={submenu}
                          to={path}
                          className={({ isActive }) =>
                            `block pl-8 py-1 text-xs text-gray-800 hover:bg-gray-100 rounded-lg whitespace-nowrap
                            ${isActive ? "bg-gray-200 font-medium" : ""}
                            ${isSubmenuRestricted ? "opacity-50 cursor-not-allowed" : ""}`
                          }
                          onClick={
                            isSubmenuRestricted
                              ? (e) => handleRestrictedClick(e, submenu)
                              : undefined
                          }
                        >
                          {submenu}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        ))}

        <NavLink
          to="/mapa"
          className={({ isActive }) => `
            flex items-center p-2 rounded-lg mb-1
            hover:bg-gray-200 transition-colors text-sm text-[#254030]
            ${isActive ? "bg-gray-200 font-medium" : ""}
            ${!isSidebarContentVisible ? "justify-center px-0" : "gap-3"}
          `}
          title={!isSidebarContentVisible ? "Mapa" : undefined}
        >
          <MapPin size={20} />
          {isSidebarContentVisible && (
            <span className="whitespace-nowrap">Mapa</span>
          )}
        </NavLink>
      </nav>

      <div className="mt-auto flex flex-col items-center sticky bottom-0 bg-white py-2 border-t border-gray-200">
        <img src="/sena.png" alt="Logo SENA" className="w-14" />
      </div>
    </aside>
  );
};

export default Sidebar;
