import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Sensor } from "../../types/sensorTypes";
import { usePostUmbral } from "../../hooks/umbral/usePostUmbral";
import apiClient from "@/api/apiClient";

interface CrearUmbralModalProps {
  onClose: () => void;
}

const fetchSensores = async (): Promise<Sensor[]> => {
  const response = await apiClient.get("sensores");
  return response.data;
};

export const CrearUmbralModal = ({ onClose }: CrearUmbralModalProps) => {
  const [sensorId, setSensorId] = useState<number | null>(null);
  const [valorMinimo, setValorMinimo] = useState<number | null>(null);
  const [valorMaximo, setValorMaximo] = useState<number | null>(null);

  const { data: sensores = [] } = useQuery({
    queryKey: ["sensores"],
    queryFn: fetchSensores,
  });

  const mutation = usePostUmbral({
    onSuccess: () => {
      addToast({
        title: "Éxito",
        description: "Umbral registrado correctamente",
        color: "success",
      });
      resetForm();
      onClose();
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description: error.message || "No se pudo registrar el umbral",
        color: "danger",
      });
    },
  });

  const handleSubmit = () => {
    if (sensorId === null || valorMinimo === null || valorMaximo === null) {
      addToast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos",
        color: "warning",
      });
      return;
    }

    if (valorMinimo >= valorMaximo) {
      addToast({
        title: "Error de validación",
        description: "El valor mínimo debe ser menor al máximo",
        color: "danger",
      });
      return;
    }

    mutation.mutate({
      sensorId: sensorId,
      valorMinimo: valorMinimo,
      valorMaximo: valorMaximo,
    });
  };

  const resetForm = () => {
    setSensorId(null);
    setValorMinimo(null);
    setValorMaximo(null);
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registrar Umbral"
      footerButtons={[
        {
          label: mutation.isPending ? "Guardando..." : "Guardar",
          color: "success",
          onClick: handleSubmit,
        },
      ]}
    >
      {sensores.length === 0 && (
        <p className="text-sm text-gray-500 mb-2">Cargando sensores...</p>
      )}

      <Select
        label="Sensor"
        placeholder="Selecciona un sensor"
        required
        selectedKeys={sensorId !== null ? [String(sensorId)] : []}
        onSelectionChange={(keys) =>
          setSensorId(Number(Array.from(keys)[0]))
        }
      >
        {sensores.map((sensor) => (
          <SelectItem key={String(sensor.id)}>
            {sensor.tipo_sensor} (ID {sensor.id})
          </SelectItem>
        ))}
      </Select>

      <Input
        label="Valor Mínimo"
        type="number"
        required
        value={valorMinimo !== null ? String(valorMinimo) : ""}
        onChange={(e) =>
          setValorMinimo(e.target.value ? parseFloat(e.target.value) : null)
        }
      />

      <Input
        label="Valor Máximo"
        type="number"
        required
        value={valorMaximo !== null ? String(valorMaximo) : ""}
        onChange={(e) =>
          setValorMaximo(e.target.value ? parseFloat(e.target.value) : null)
        }
      />
    </ModalComponent>
  );
};