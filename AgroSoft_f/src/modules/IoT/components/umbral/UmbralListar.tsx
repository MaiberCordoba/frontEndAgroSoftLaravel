import { useGetUmbral } from "../../hooks/umbral/useGetUmbral";
import { useEditarUmbral } from "../../hooks/umbral/useEditarUmbral";
import { useCrearUmbral } from "../../hooks/umbral/useCrearUmbral";
import { useEliminarUmbral } from "../../hooks/umbral/useEliminarUmbral";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarUmbralModal from "./editarUmbralModal";
import { CrearUmbralModal } from "./crearUmbralModal";
import EliminarUmbralModal from "./EliminarUmbralModal";
import { Umbral } from "../../types/sensorTypes";

export function UmbralLista() {
  const { data, isLoading, error } = useGetUmbral();

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    itemEditado: umbralEditado,
    handleEditar,
  } = useEditarUmbral();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearUmbral();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    umbralEliminado,
    handleEliminar,
  } = useEliminarUmbral();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      sensorId: 1, // Actualizado a camelCase
      valorMinimo: 0, // Actualizado a camelCase
      valorMaximo: 100, // Actualizado a camelCase
    });
  };

  const columnas = [
    { name: "Sensor ID", uid: "sensorId" }, // Actualizado a camelCase
    { name: "Mínimo", uid: "valorMinimo" }, // Actualizado a camelCase
    { name: "Máximo", uid: "valorMaximo" }, // Actualizado a camelCase
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Umbral, columnKey: React.Key) => {
    switch (columnKey) {
      case "sensorId": // Actualizado a camelCase
        return <span>{item.sensorId}</span>;
      case "valorMinimo": // Actualizado a camelCase
        return <span>{item.valorMinimo}</span>;
      case "valorMaximo": // Actualizado a camelCase
        return <span>{item.valorMaximo}</span>;
      case "acciones":
        return (
          <AccionesTabla
            onEditar={() => handleEditar(item)}
            //onEliminar={() => handleEliminar(item)}
          />
        );
      default:
        return <span>{String(item[columnKey as keyof Umbral])}</span>;
    }
  };

  if (isLoading) return <p>Cargando umbrales...</p>;
  if (error) return <p>Error al cargar los umbrales</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="sensorId" // Actualizado a camelCase
        placeholderBusqueda="Buscar por Sensor ID"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && umbralEditado && (
        <EditarUmbralModal umbral={umbralEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && (
        <CrearUmbralModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && umbralEliminado && (
        <EliminarUmbralModal
          umbral={umbralEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}