import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchSensor } from "../../hooks/sensor/usePachtSensor";
import { Sensor, SensorType } from "../../types/sensorTypes";
import { Input, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast";

const SENSOR_TYPES: { key: SensorType; label: string }[] = [
  { key: "Temperatura", label: "Temperatura (°C)" },
  { key: "Iluminación", label: "Iluminación (lux)" },
  { key: "Humedad Ambiental", label: "Humedad Ambiental (%)" },
  { key: "Viento", label: "Viento (km/h)" },
  { key: "Lluvia", label: "Lluvia (mm)" },
  { key: "Humedad del Terreno", label: "Humedad del Terreno (%)" },
  { key: "Nivel de PH", label: "Nivel de PH (pH)" },
];

const sensoresLote: SensorType[] = ["Temperatura", "Iluminación", "Humedad Ambiental", "Viento", "Lluvia"];
const sensoresEra: SensorType[] = ["Humedad del Terreno", "Nivel de PH"];
const tiposValidos: SensorType[] = [...sensoresLote, ...sensoresEra];

interface EditarSensorModalProps {
  sensor: Sensor;
  onClose: () => void;
}

const EditarSensorModal: React.FC<EditarSensorModalProps> = ({ sensor, onClose }) => {
  const [tipoSensor, setTipoSensor] = useState<SensorType>(sensor.tipoSensor);
  const [fecha, setFecha] = useState<string>(sensor.fecha);
  const [loteId, setLoteId] = useState<number | null>(sensor.loteId);
  const [eraId, setEraId] = useState<number | null>(sensor.eraId);

  const { mutate, isPending } = usePatchSensor();

  const handleSubmit = () => {
    if (!tipoSensor || !fecha) {
      addToast({
        title: "Error",
        description: "Tipo de sensor y fecha son obligatorios.",
        color: "danger",
      });
      return;
    }

    if (!tiposValidos.includes(tipoSensor)) {
      addToast({
        title: "Error",
        description: "Tipo de sensor inválido.",
        color: "danger",
      });
      return;
    }

    const tieneSoloLote = !!loteId && !eraId;
    const tieneSoloEra = !!eraId && !loteId;

    if (!tieneSoloLote && !tieneSoloEra) {
      addToast({
        title: "Error",
        description: "Debes asignar solo un lote o solo una era (no ambos, no ninguno).",
        color: "danger",
      });
      return;
    }

    if (sensoresLote.includes(tipoSensor) && !loteId) {
      addToast({
        title: "Error",
        description: `El sensor tipo '${tipoSensor}' debe estar asociado a un lote.`,
        color: "danger",
      });
      return;
    }

    if (sensoresEra.includes(tipoSensor) && !eraId) {
      addToast({
        title: "Error",
        description: `El sensor tipo '${tipoSensor}' debe estar asociado a una era.`,
        color: "danger",
      });
      return;
    }

    const updatedData: Partial<Sensor> = {
      tipoSensor,
      fecha,
      loteId,
      eraId
    };

    mutate(
      {
        id: sensor.id,
        data: updatedData
      },
      {
        onSuccess: () => {
          addToast({
            title: "Sensor actualizado",
            description: "Los datos del sensor fueron actualizados correctamente.",
            color: "success",
          });
          onClose();
        },
        onError: (error) => {
          addToast({
            title: "Error",
            description: `No se pudo actualizar el sensor: ${error.message}`,
            color: "danger",
          });
        }
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Sensor"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Select
        label="Tipo de Sensor"
        placeholder="Selecciona un tipo"
        selectedKeys={[tipoSensor]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as SensorType;
          setTipoSensor(selected);
          // Resetear ubicación si cambia el tipo de sensor
          if (sensoresLote.includes(selected)) {
            setEraId(null);
          } else if (sensoresEra.includes(selected)) {
            setLoteId(null);
          }
        }}
      >
        {SENSOR_TYPES.map((tipo) => (
          <SelectItem key={tipo.key}>
            {tipo.label}
          </SelectItem>
        ))}
      </Select>

      <Input
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <Input
        label="ID del Lote"
        type="number"
        value={loteId !== null ? loteId.toString() : ""}
        onChange={(e) => {
          const value = e.target.value ? Number(e.target.value) : null;
          setLoteId(value);
          if (value !== null) setEraId(null);
        }}
        isDisabled={!sensoresLote.includes(tipoSensor)}
      />

      <Input
        label="ID de la Era"
        type="number"
        value={eraId !== null ? eraId.toString() : ""}
        onChange={(e) => {
          const value = e.target.value ? Number(e.target.value) : null;
          setEraId(value);
          if (value !== null) setLoteId(null);
        }}
        isDisabled={!sensoresEra.includes(tipoSensor)}
      />
    </ModalComponent>
  );
};

export default EditarSensorModal;