import { useGetUsosProductos } from "../../hooks/usosProductos/useGetUsosProductos";
import { useEditarUsoProducto } from "../../hooks/usosProductos/useEditarUsosProductos";
import { useCrearUsosProducto } from "../../hooks/usosProductos/useCrearUsosProductos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarUsosProductosModal from "./EditarUsosProductosModal";
import { CrearUsosProductosModal } from "./CrearUsosProductosModal";
import { UsosProductos } from "../../types";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { usegetInsumos } from "../../hooks/insumos/useGetInsumos";

export function UsosProductosList() {
  const { data, isLoading, error } = useGetUsosProductos();
  const { data : actividades, isLoading : loadingActividades } = useGetActividades();
  const { data : insumos, isLoading : loadingInsumos } = usegetInsumos();
  
  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    usoProductoEditado, 
    handleEditar 
  } = useEditarUsoProducto();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearUsosProducto();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fkInsumos: 0, fkActividades: 0, cantidadProducto: 0 });
  };

  // Definición de columnas
  const columnas = [
    { name: "Insumo", uid: "insumo" },
    { name: "Actividad", uid: "actividad" },
    { name: "Cantidad", uid: "cantidadProducto" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado
  const renderCell = (item: UsosProductos, columnKey: React.Key) => {
    switch (columnKey) {
      case "insumo":
        const insumo = insumos?.find((c) => c.id === item.fkInsumos);
        return <span>{insumo ? insumo.nombre : "No definido"}</span>;
      case "actividad":
        const actividad = actividades?.find((c) => c.id === item.fkActividades);
        return <span>{actividad ? actividad.titulo : "No definido"}</span>;
      case "cantidadProducto":
        return <span>{item.cantidadProducto}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof UsosProductos])}</span>;
    }
  };

  if (isLoading || loadingActividades || loadingInsumos) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los Usos de Productos</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="insumo"
        placeholderBusqueda="Buscar por insumo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && usoProductoEditado && (
        <EditarUsosProductosModal
          usoProducto={usoProductoEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearUsosProductosModal
          onClose={closeCreateModal}
        />
      )}

    </div>
  );
}
