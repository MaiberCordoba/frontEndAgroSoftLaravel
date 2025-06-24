import { useState } from "react";
import { usePostSensor } from "../../hooks/sensor/usePostSensor";
import { useQuery } from "@tanstack/react-query";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Sensor, SensorType } from "../../types/sensorTypes";

interface Lote {
  id: number;
  nombre: string;
}

interface Era {
  id: number;
}

const SENSOR_TYPES: { key: SensorType; label: string }[] = [
  { key: "Temperatura", label: "Temperatura (°C)" },
  { key: "Iluminación", label: "Iluminación (lux)" },
  { key: "Humedad Ambiental", label: "Humedad Ambiental (%)" },
  { key: "Viento", label: "Viento (km/h)" },
  { key: "Lluvia", label: "Lluvia (mm)" },
  { key: "Humedad del Terreno", label: "Humedad del Terreno (%)" },
  { key: "Nivel de PH", label: "Nivel de PH (pH)" },
];

interface CrearSensorModalProps {
  onClose: () => void;
}

const fetchLotes = async (): Promise<Lote[]> => {
  const res = await fetch("http://localhost:3000/lotes", {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWNhY2lvbiI6MTA4NDMzMTczMSwibm9tYnJlIjoiYWRtaW4gY29yZG9iYSIsImNvcnJlb0VsZWN0cm9uaWNvIjoiYWRtaW5AZ21haWwuY29tIiwiYWRtaW4iOjAsImlhdCI6MTc0Mzk1MzkzMn0.GcG2Pifg7BYswjiHtvaonGwJlbZKvJFS4rSrZEuCzTM`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener los lotes");
  return res.json();
};

const fetchEras = async (): Promise<Era[]> => {
  const res = await fetch("http://localhost:3000/eras", {
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZGVudGlmaWNhY2lvbiI6MTA4NDMzMTczMSwibm9tYnJlIjoiYWRtaW4gY29yZG9iYSIsImNvcnJlb0VsZWN0cm9uaWNvIjoiYWRtaW5AZ21haWwuY29tIiwiYWRtaW4iOjAsImlhdCI6MTc0Mzk1MzkzMn0.GcG2Pifg7BYswjiHtvaonGwJlbZKvJFS4rSrZEuCzTM`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener las eras");
  return res.json();
};

export const CrearSensorModal = ({ onClose }: CrearSensorModalProps) => {
  const [tipoSensor, setTipoSensor] = useState<SensorType | null>(null);
  const [datosSensor, setDatosSensor] = useState<number | null>(null);
  const [loteId, setLoteId] = useState<number | null>(null);
  const [eraId, setEraId] = useState<number | null>(null);
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split("T")[0]);

  const { data: lotes = [] } = useQuery<Lote[]>({
    queryKey: ["lotes"],
    queryFn: fetchLotes,
  });

  const { data: eras = [] } = useQuery<Era[]>({
    queryKey: ["eras"],
    queryFn: fetchEras,
  });

  const sensoresLote: SensorType[] = ["Temperatura", "Iluminación", "Humedad Ambiental", "Viento", "Lluvia"];
  const sensoresEra: SensorType[] = ["Humedad del Terreno", "Nivel de PH"];
  const tiposValidos: SensorType[] = [...sensoresLote, ...sensoresEra];

  const { mutate, isPending } = usePostSensor();

  const handleSubmit = () => {
    if (!tipoSensor || datosSensor === null) {
      addToast({
        title: "Error",
        description: "Tipo de sensor y valor del sensor son obligatorios.",
        color: "danger",
      });
      return;
    }

    if (!tiposValidos.includes(tipoSensor)) {
      addToast({
        title: "Error",
        description: "Tipo de sensor inválido. Usa uno de los permitidos.",
        color: "danger",
      });
      return;
    }

    // Validación de solo uno: lote o era (no ambos, no ninguno)
    const tieneSoloLote = !!loteId && !eraId;
    const tieneSoloEra = !!eraId && !loteId;

    if (!tieneSoloLote && !tieneSoloEra) {
      addToast({
        title: "Error",
        description: "Debes seleccionar solo un lote o solo una era, no ambos y no ninguno.",
        color: "danger",
      });
      return;
    }

    if (sensoresLote.includes(tipoSensor) && !loteId) {
      addToast({
        title: "Error",
        description: `El sensor tipo '${tipoSensor}' debe registrarse en un lote.`,
        color: "danger",
      });
      return;
    }

    if (sensoresEra.includes(tipoSensor) && !eraId) {
      addToast({
        title: "Error",
        description: `El sensor tipo '${tipoSensor}' debe registrarse en una era.`,
        color: "danger",
      });
      return;
    }

    const sensorData: Sensor = {
      id: 0, // El backend ignorará este ID al crear
      tipoSensor,
      datosSensor,
      loteId,
      eraId,
      fecha,
    };

    mutate(sensorData, {
      onSuccess: () => {
        addToast({
          title: "Éxito",
          description: "Sensor creado con éxito.",
          color: "success",
        });
        onClose();
        setTipoSensor(null);
        setDatosSensor(null);
        setLoteId(null);
        setEraId(null);
        setFecha(new Date().toISOString().split("T")[0]);
      },
      onError: (error) => {
        addToast({
          title: "Error",
          description: `Error al crear sensor: ${error.message}`,
          color: "danger",
        });
      }
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Sensores"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        label="Valor del Sensor"
        type="number"
        value={datosSensor !== null ? String(datosSensor) : ""}
        onChange={(e) => setDatosSensor(e.target.value ? Number(e.target.value) : null)}
        required
      />

      <Input
        label="Fecha del Registro"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />

      <Select
        label="Tipo de Sensor"
        placeholder="Selecciona un tipo de sensor"
        selectedKeys={tipoSensor ? [tipoSensor] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as SensorType;
          setTipoSensor(selected);
          // Resetear ubicación al cambiar tipo
          setLoteId(null);
          setEraId(null);
        }}
      >
        {SENSOR_TYPES.map((sensor) => (
          <SelectItem key={sensor.key}>{sensor.label}</SelectItem>
        ))}
      </Select>

      {tipoSensor && sensoresLote.includes(tipoSensor) && (
        <Select
          label="Lote"
          placeholder="Selecciona un lote"
          selectedKeys={loteId !== null ? [String(loteId)] : []}
          onSelectionChange={(keys) => {
            const selected = Number(Array.from(keys)[0]);
            setLoteId(selected);
            setEraId(null); // Desactiva era si seleccionas lote
          }}
        >
          {lotes.map((lote) => (
            <SelectItem key={String(lote.id)}>{lote.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {tipoSensor && sensoresEra.includes(tipoSensor) && (
        <Select
          label="Era"
          placeholder="Selecciona una era"
          selectedKeys={eraId !== null ? [String(eraId)] : []}
          onSelectionChange={(keys) => {
            const selected = Number(Array.from(keys)[0]);
            setEraId(selected);
            setLoteId(null); // Desactiva lote si seleccionas era
          }}
        >
          {eras.map((era) => (
            <SelectItem key={String(era.id)}>{`Era ${era.id}`}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};