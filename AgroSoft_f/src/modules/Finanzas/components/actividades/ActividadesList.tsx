import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { useEditarActividad } from "../../hooks/actividades/useEditarActividades";
import { useCrearActividad } from "../../hooks/actividades/useCrearActividades";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarActividadesModal from "./EditarActividadesModal";
import { CrearActividadesModal } from "./CrearActividadModal";
import { Actividades } from "../../types";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useVerDetalleActividad } from "../../hooks/actividades/useVerDetalleActividad";
import DetalleActividadModal from "./DetalleActividadModal";

export function ActividadesList() {
  const { data, isLoading, error } = useGetActividades();
  const { data: users, isLoading: loadingUser } = useGetUsers(); // Corregido
  const { data: cultivo, isLoading: loadingCultivo } = useGetCultivos()

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    actividadEditada,
    handleEditar
  } = useEditarActividad();

  const {
    isOpen,
    closeModal: handleCloseDetalle,
    actividadSeleccionada,
    handleVerDetalle
  } = useVerDetalleActividad();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear
  } = useCrearActividad();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fkCultivos: 0, fkUsuarios: 0, titulo: "", descripcion: "", fecha: "", estado: "Asignada" });
  };

  // Definición de columnas
  const columnas = [
    { name: "Cultivo", uid: "cultivo" },
    { name: "Usuario", uid: "usuario" },
    { name: "Titulo", uid: "titulo" },
    { name: "Descripcion", uid: "descripcion" },
    { name: "Fecha", uid: "fecha" },
    { name: "Estado", uid: "estado" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Renderizado de celdas
  const renderCell = (item: Actividades, columnKey: React.Key) => {
    switch (columnKey) {
      case "cultivo":
        const cultivos = cultivo?.find((c) => c.id === item.fkCultivos);
        return <span>{cultivos ? cultivos.nombre : "No definido"}</span>;
      case "usuario":
        const usuario = users?.find((c) => c.identificacion === item.fkUsuarios);
        return <span>{usuario ? usuario.nombre : "No definido"}</span>;
      case "titulo":
        return <span>{item.titulo}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "fecha":
        return <span>{item.fecha}</span>;
      case "estado":
        return <span>{item.estado}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            onVerDetalles={() => handleVerDetalle(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Actividades])}</span>;
    }
  };

  if (isLoading || loadingUser || loadingCultivo) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las actividades</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="titulo"
        placeholderBusqueda="Buscar por Título"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && actividadEditada && (
        <EditarActividadesModal actividad={actividadEditada} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && <CrearActividadesModal onClose={closeCreateModal} />}

      {isOpen && actividadSeleccionada && (
        <DetalleActividadModal
          actividad={actividadSeleccionada}
          onClose={handleCloseDetalle}
        />
      )}
    </div>
  );
}
