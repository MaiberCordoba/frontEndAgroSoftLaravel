import { Route, Routes, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "./context/ToastProvider";

// Importaciones de tus módulos
import Principal from "@/layouts/principal";
import { Inicio } from "./pages/Inicio";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Login from "@/pages/Login";
import UserRegister from "./modules/Users/pages/registrarUsuario";
import { useAuth } from "@/hooks/UseAuth";

// Finanzas
import { TiposDesechos } from "./modules/Finanzas/pages/pageTiposDesechos";
import { Desechos } from "./modules/Finanzas/pages/pageDesechos";
import { Actividades } from "./modules/Finanzas/pages/pageActividades";
import { Herramientas } from "./modules/Finanzas/pages/pageHerramientas";
import { UsosHerramientas } from "./modules/Finanzas/pages/pageUsosHerramientas";
import { Ventas } from "./modules/Finanzas/pages/pageVentas";
import { Cosechas } from "./modules/Finanzas/pages/pageCosechas";

// Electronica
import IoTPage from "./modules/IoT/pages/IoTPage";
import SensorDetail from "./modules/IoT/pages/SensorDetail";

// trazabilidad
import { TiposEspecie } from "./modules/Trazabilidad/pages/tiposEspecies";
import { EspeciesList } from "./modules/Trazabilidad/pages/especies";
import { Semillero } from "./modules/Trazabilidad/pages/semilleros";
import { Plantaciones } from "./modules/Trazabilidad/pages/plantaciones";
import { CultivoList } from "./modules/Trazabilidad/pages/cultivos";
import { ErasList } from "./modules/Trazabilidad/pages/eras";
import { LotesList } from "./modules/Trazabilidad/pages/lotes";

// sanidad
import { Afecciones } from "./modules/Sanidad/Pages/afecciones";
import { TipoAfecciones } from "./modules/Sanidad/Pages/tipoafecciones";
import { TipoControl } from "./modules/Sanidad/Pages/tipocontrol";
import { ProductosControl } from "./modules/Sanidad/Pages/productoscontrol";
import { UsoProductosControl } from "./modules/Sanidad/Pages/usoproductoscontrol";
import { Controles } from "./modules/Sanidad/Pages/controles";
import { AfeccionesCultivo } from "./modules/Sanidad/Pages/afeccionescultivo";

// usuarios
import { Usuarios } from "./modules/Users/pages/pageUsers";

// testeo
import Testeo from "./pages/testeo";
import { TotalUsersPage } from "./modules/Users/pages/totalUsersPage";
import MapaEras from "./modules/Trazabilidad/pages/mapaPage";
import { Insumos } from "./modules/Finanzas/pages/pageInsumos";
import { UsosProductos } from "./modules/Finanzas/pages/pageUsosProductos";

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    const path = window.location.pathname;

    // Rutas públicas que no requieren autenticación
    const publicPaths = ["/login", "/registro", "/forgot-password"];

    // Solo redirige si NO estamos cargando Y NO hay token Y NO estamos en una ruta pública
    if (!isLoading && token === null && !publicPaths.includes(path)) {
      console.log(
        "Autenticación terminada, no hay token, redirigiendo a login..."
      );
      navigate("/login");
    }
  }, [token, isLoading, navigate]);

  if (isLoading) {
    return <div>Cargando autenticación...</div>;
  }

  return (
    <Providers>
      <QueryClientProvider client={queryClient}>
        <Routes>
          {/* Rutas públicas */}
          <Route path="login" element={<Login />} />
          <Route path="/registro" element={<UserRegister />} />

          {/* Rutas protegidas */}
          <Route element={<Principal />}>
            {/* ProtectedRoute ahora debería usar 'token' para su propia lógica */}
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<Inicio />} />
              <Route path="/" element={<Inicio />} />

              {/* Usuarios */}
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/usuarios/reporte" element={<TotalUsersPage />} />

              {/* Finanzas */}
              <Route path="/tipos-desechos" element={<TiposDesechos />} />
              <Route path="/desechos" element={<Desechos />} />
              <Route path="/herramientas" element={<Herramientas />} />
              <Route path="/ventas" element={<Ventas />} />
              <Route path="/cosechas" element={<Cosechas />} />
              <Route path="/actividades" element={<Actividades />} />
              <Route path="/usos-herramientas" element={<UsosHerramientas />} />
              <Route path="/usos-productos" element={<UsosProductos />} />
              <Route path="/insumos" element={<Insumos />} />

              {/* Electronica */}
              <Route path="/iot" element={<IoTPage />} />
              <Route path="/sensores/:id" element={<SensorDetail />} />

              {/* Trazabilidad */}
              <Route path="/tipos-especie" element={<TiposEspecie />} />
              <Route path="/especies" element={<EspeciesList />} />
              <Route path="/semilleros" element={<Semillero />} />
              <Route
                path="/Informacion-Cultivos-Sembrados"
                element={<Plantaciones />}
              />
              <Route path="/cultivos" element={<CultivoList />} />
              <Route path="/eras" element={<ErasList />} />
              <Route path="/lotes" element={<LotesList />} />
              <Route path="/mapa" element={<MapaEras />} />

              {/* Sanidad */}
              <Route
                path="/tipos-de-afectaciones"
                element={<TipoAfecciones />}
              ></Route>
              <Route path="/afectaciones" element={<Afecciones />} />
              <Route path="/tipos-de-control" element={<TipoControl />}></Route>
              <Route
                path="/productos-para-el-control"
                element={<ProductosControl />}
              ></Route>
              <Route
                path="/usos-de-productos-para-el-control"
                element={<UsoProductosControl />}
              ></Route>
              <Route path="/controles" element={<Controles />}></Route>
              <Route
                path="/Afectaciones-en-cultivos"
                element={<AfeccionesCultivo />}
              ></Route>

              {/* test */}
              <Route path="/testeo" element={<Testeo />}></Route>
            </Route>
          </Route>

          <Route path="*" element={!token ? <Login /> : <Inicio />} />
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Providers>
  );
}

export default App;
