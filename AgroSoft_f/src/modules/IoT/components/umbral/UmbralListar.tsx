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
  } = useEliminarUmbral();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      sensor_id: 1, // Actualizado a camelCase
      valor_minimo: 0, // Actualizado a camelCase
      valor_maximo: 100, // Actualizado a camelCase
    });
  };

  const columnas = [
    { name: "Sensor ID", uid: "sensor_id" }, // Actualizado a camelCase
    { name: "Mínimo", uid: "valor_minimo" }, // Actualizado a camelCase
    { name: "Máximo", uid: "valor_maximo" }, // Actualizado a camelCase
    { name: "Acciones", uid: "acciones" },
  ];

  const renderCell = (item: Umbral, columnKey: React.Key) => {
    switch (columnKey) {
      case "sensor_id": // Actualizado a camelCase
        return <span>{item.sensor_id}</span>;
      case "valor_minimo": // Actualizado a camelCase
        return <span>{item.valor_minimo}</span>;
      case "valor_maximo": // Actualizado a camelCase
        return <span>{item.valor_maximo}</span>;
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
        claveBusqueda="sensor_id" // Actualizado a camelCase
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