import { useGetDesechos } from "../../hooks/desechos/useGetDesechos";
import { useEditarDesecho } from "../../hooks/desechos/useEditarDesechos";
import { useCrearDesecho } from "../../hooks/desechos/useCrearDesechos";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarDesechosModal from "./EditarDesechosModal";
import { CrearDesechosModal } from "./CrearDesechosModal";
import { Desechos } from "../../types";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetTiposDesechos } from "../../hooks/tiposDesechos/useGetTiposDesechos";

export function DesechosList() {
  const { data, isLoading, error } = useGetDesechos();
  const { data : cultivo, isLoading: loadingCultivo } = useGetCultivos()
  const { data : tiposDesechos, isLoading: loadingTiposDesechos } = useGetTiposDesechos()

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    desechoEditado, 
    handleEditar 
  } = useEditarDesecho();
  
  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearDesecho();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fkCultivos: 0,fkTiposDesecho: 0,nombre: "", descripcion: ""});
  };

  // Definición de columnas movida aquí
  const columnas = [
    { name: "Cultivo", uid: "cultivo"  },
    { name: "Tipo Desecho", uid: "tipoDesecho" },
    { name: "Nombre", uid: "nombre" },
    { name: "Descripcion", uid: "descripcion" },
    { name: "Acciones", uid: "acciones" },
  ];

  // Función de renderizado movida aquí
  const renderCell = (item: Desechos, columnKey: React.Key) => {
    switch (columnKey) {
      case "cultivo":
        const cultivos = cultivo?.find((c) => c.id === item.fkCultivos);
        return <span>{cultivos ? cultivos.nombre : "No definido"}</span>;
      case "tipoDesecho":
        const tipoDesecho = tiposDesechos?.find((c) => c.id === item.fkTiposDesecho);
        return <span>{tipoDesecho ? tipoDesecho.nombre : "No definido"}</span>;
      case "nombre":
        return <span>{item.nombre}</span>;
      case "descripcion":
        return <span>{item.descripcion}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Desechos])}</span>;
    }
  };

  if (isLoading || loadingCultivo || loadingTiposDesechos) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los Desechos</p>;

  return (
    <div className="p-4">
      {/* Tabla reutilizable directa */}
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="nombre"
        placeholderBusqueda="Buscar por nombre"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && desechoEditado && (
        <EditarDesechosModal
          desecho={desechoEditado}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearDesechosModal
          onClose={closeCreateModal}
        />
      )}
    </div>
  );
}