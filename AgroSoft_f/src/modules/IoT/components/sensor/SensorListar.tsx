import { useNavigate } from "react-router-dom";
import { useGetSensor } from "../../hooks/sensor/useGetSensor";
import { useEditarSensor } from "../../hooks/sensor/useEditarSensor";
import { useCrearSensor } from "../../hooks/sensor/useCrearSensor";
import { useEliminarSensor } from "../../hooks/sensor/useEliminarSenosr";
import { TablaReutilizable } from "@/components/ui/table/TablaReutilizable";
import { AccionesTabla } from "@/components/ui/table/AccionesTabla";
import EditarSensorModal from "./EditarSensorModal";
import { CrearSensorModal } from "./CrearSensorModal";
import EliminarSensorModal from "./EliminarSensorModal";
import { Sensor } from "../../types/sensorTypes";

// Actualizado para usar los valores completos de SensorType
const SENSOR_TYPES = [
  { key: "Temperatura", label: "Temperatura" },
  { key: "Iluminación", label: "Iluminación" },
  { key: "Humedad Ambiental", label: "Humedad Ambiental" },
  { key: "Humedad del Terreno", label: "Humedad del Terreno" },
  { key: "Nivel de PH", label: "Nivel de PH" },
  { key: "Viento", label: "Viento" },
  { key: "Lluvia", label: "Lluvia" },
];

export function SensorLista() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetSensor();

  console.log("Sensores:", data);

  const {
    isOpen: isEditModalOpen,
    closeModal: closeEditModal,
    sensorEditado,
    handleEditar,
  } = useEditarSensor();

  const {
    isOpen: isCreateModalOpen,
    closeModal: closeCreateModal,
    handleCrear,
  } = useCrearSensor();

  const {
    isOpen: isDeleteModalOpen,
    closeModal: closeDeleteModal,
    sensorEliminado,
    handleEliminar,
  } = useEliminarSensor();

  const handleCrearNuevo = () => {
    handleCrear({
      id: 0,
      tipo_sensor: "Temperatura", // Valor por defecto
      datos_sensor: 0,
      fecha: new Date().toISOString(),
      loteId: null,
      eraId: null,
    });
  };

  const getSensorLabel = (tipo_sensor: string) => {
    const sensor = SENSOR_TYPES.find(s => s.key === tipo_sensor);
    return sensor ? sensor.label : tipo_sensor;
  };

  const columnas = [
    { name: "Fecha", uid: "fecha", sortable: true },
    { name: "Tipo de Sensor", uid: "tipo_sensor" },
    { name: "Valor", uid: "datos_sensor" },
  ];

  const handleRowClick = (sensorId: number) => {
    navigate(`/sensores/${sensorId}`);
  };

  const renderCell = (item: Sensor, columnKey: React.Key) => {
    const cellContent = (() => {
      switch (columnKey) {
        case "fecha":
          return <span>{new Date(item.fecha).toLocaleString()}</span>;
        case "tipo_sensor":
          return <span>{getSensorLabel(item.tipo_sensor)}</span>;
        case "datos_sensor":
          return <span>{item.datos_sensor}</span>;
        default:
          return <span>{String(item[columnKey as keyof Sensor])}</span>;
      }
    })();

    if (columnKey !== "acciones") {
      return (
        <div 
          className="w-full h-full cursor-pointer" 
          onClick={() => handleRowClick(item.id)}
        >
          {cellContent}
        </div>
      );
    }

    return cellContent;
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error al cargar los sensores</p>;

  return (
    <div className="p-4">
      <TablaReutilizable
        datos={data || []}
        columnas={columnas}
        claveBusqueda="tipo_sensor"
        placeholderBusqueda="Buscar por tipo"
        renderCell={renderCell}
        onCrearNuevo={handleCrearNuevo}
      />

      {/* Modales */}
      {isEditModalOpen && sensorEditado && (
        <EditarSensorModal sensor={sensorEditado} onClose={closeEditModal} />
      )}

      {isCreateModalOpen && (
        <CrearSensorModal onClose={closeCreateModal} />
      )}

      {isDeleteModalOpen && sensorEliminado && (
        <EliminarSensorModal
          sensor={sensorEliminado}
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
        />
      )}
    </div>
  );
}