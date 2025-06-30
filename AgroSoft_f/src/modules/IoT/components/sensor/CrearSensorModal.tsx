import { useState } from "react";
import { usePostSensor } from "../../hooks/sensor/usePostSensor";
import { useQuery } from "@tanstack/react-query";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Sensor, SensorType } from "../../types/sensorTypes";
import apiClient from "@/api/apiClient";

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
  const res = await apiClient.get("lotes/");
    return res.data
};

const fetchEras = async (): Promise<Era[]> => {
  const res = await apiClient.get("eras/");
  return res.data
};

export const CrearSensorModal = ({ onClose }: CrearSensorModalProps) => {
  const [tipo_sensor, settipo_sensor] = useState<SensorType | null>(null);
  const [datos_sensor, setdatos_sensor] = useState<number | null>(null);
  const [lote_id, setlote_id] = useState<number | null>(null);
  const [era_id, setera_id] = useState<number | null>(null);
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
    if (!tipo_sensor || datos_sensor === null) {
      addToast({
        title: "Error",
        description: "Tipo de sensor y valor del sensor son obligatorios.",
        color: "danger",
      });
      return;
    }

    if (!tiposValidos.includes(tipo_sensor)) {
      addToast({
        title: "Error",
        description: "Tipo de sensor inválido. Usa uno de los permitidos.",
        color: "danger",
      });
      return;
    }

    // Validación de solo uno: lote o era (no ambos, no ninguno)
    const tieneSoloLote = !!lote_id && !era_id;
    const tieneSoloEra = !!era_id && !lote_id;

    if (!tieneSoloLote && !tieneSoloEra) {
      addToast({
        title: "Error",
        description: "Debes seleccionar solo un lote o solo una era, no ambos y no ninguno.",
        color: "danger",
      });
      return;
    }

    if (sensoresLote.includes(tipo_sensor) && !lote_id) {
      addToast({
        title: "Error",
        description: `El sensor tipo '${tipo_sensor}' debe registrarse en un lote.`,
        color: "danger",
      });
      return;
    }

    if (sensoresEra.includes(tipo_sensor) && !era_id) {
      addToast({
        title: "Error",
        description: `El sensor tipo '${tipo_sensor}' debe registrarse en una era.`,
        color: "danger",
      });
      return;
    }

    const sensorData: Sensor = {
      id: 0, // El backend ignorará este ID al crear
      tipo_sensor,
      datos_sensor,
      lote_id,
      era_id,
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
        settipo_sensor(null);
        setdatos_sensor(null);
        setlote_id(null);
        setera_id(null);
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
        value={datos_sensor !== null ? String(datos_sensor) : ""}
        onChange={(e) => setdatos_sensor(e.target.value ? Number(e.target.value) : null)}
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
        selectedKeys={tipo_sensor ? [tipo_sensor] : []}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as SensorType;
          settipo_sensor(selected);
          // Resetear ubicación al cambiar tipo
          setlote_id(null);
          setera_id(null);
        }}
      >
        {SENSOR_TYPES.map((sensor) => (
          <SelectItem key={sensor.key}>{sensor.label}</SelectItem>
        ))}
      </Select>

      {tipo_sensor && sensoresLote.includes(tipo_sensor) && (
        <Select
          label="Lote"
          placeholder="Selecciona un lote"
          selectedKeys={lote_id !== null ? [String(lote_id)] : []}
          onSelectionChange={(keys) => {
            const selected = Number(Array.from(keys)[0]);
            setlote_id(selected);
            setera_id(null); // Desactiva era si seleccionas lote
          }}
        >
          {lotes.map((lote) => (
            <SelectItem key={String(lote.id)}>{lote.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {tipo_sensor && sensoresEra.includes(tipo_sensor) && (
        <Select
          label="Era"
          placeholder="Selecciona una era"
          selectedKeys={era_id !== null ? [String(era_id)] : []}
          onSelectionChange={(keys) => {
            const selected = Number(Array.from(keys)[0]);
            setera_id(selected);
            setlote_id(null); // Desactiva lote si seleccionas era
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