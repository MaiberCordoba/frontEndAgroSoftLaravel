import { useGetPlantaciones } from "../../hooks/plantaciones/useGetPlantaciones";
import { useEditarPlantaciones } from "../../hooks/plantaciones/useEditarPlantaciones";
import { useCrearPlantaciones } from "../../hooks/plantaciones/useCrearPlantaciones";
import { useEliminarPlantaciones } from "../../hooks/plantaciones/useEliminarPlantaciones";
import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useGetEras } from "../../hooks/eras/useGetEras";

import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarPlantacionModal from "./EditarPlantacionesModal";
import { CrearPlantacionModal } from "./CrearPlantacionesModal";
import EliminarPlantacionModal from "./EliminarPlantaciones";
import { Plantaciones } from "../../types";

export function PlantacionesList() {
  const { data: plantaciones, isLoading, error } = useGetPlantaciones();
  const { data: cultivos } = useGetCultivos();
  const { data: eras } = useGetEras();

  const { 
    isOpen: isEditModalOpen, 
    closeModal: closeEditModal, 
    PlantacionesEditada, 
    handleEditar 
  } = useEditarPlantaciones();

  const { 
    isOpen: isCreateModalOpen, 
    closeModal: closeCreateModal, 
    handleCrear 
  } = useCrearPlantaciones();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    PlantacionesEliminada,
    handleEliminar
  } = useEliminarPlantaciones();

  const handleCrearNuevo = () => {
    handleCrear({ id: 0, fk_Cultivos: 0, fk_Eras: 0 });
  };

  const columnas = [
    { name: "ID", uid: "id", sortable: true },
    { name: "Cultivo", uid: "fk_Cultivo", sortable: true },
    { name: "Era", uid: "fk_Era", sortable: true },
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Plantaciones, columnKey: React.Key) => {
    switch (columnKey) {
      case "id":
        return <span>{item.id}</span>;

      case "fk_Cultivo": {
        const cultivo = cultivos?.find(c => c.id === item.fkCultivos);
        return <span>{cultivo ? cultivo.nombre : "Sin asignar"}</span>;
      }

      case "fk_Era": {
        const era = eras?.find(e => e.id === item.fkEras);
        return <span>{era ? `Era ${era.id}` : "Sin asignar"}</span>;
      }

      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
          />
        );

      default:
        return <span>{String(item[columnKey as keyof Plantaciones])}</span>;
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar las plantaciones</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={plantaciones || []}
        columnas={columnas}
        claveBusqueda="id"
        placeholderBusqueda="Buscar por ID"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && PlantacionesEditada && (
        <EditarPlantacionModal
          plantacion={PlantacionesEditada}
          onClose={closeEditModal}
        />
      )}

      {isCreateModalOpen && (
        <CrearPlantacionModal
          onClose={closeCreateModal}
        />
      )}

      {isDeleteModalOpen && PlantacionesEliminada && (
        <EliminarPlantacionModal
          plantacion={PlantacionesEliminada}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}
