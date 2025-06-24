import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Sensor } from "../../types/sensorTypes";

export const useEditarSensor = () => {
  const { isOpen, openModal, closeModal } = UseModal(); // corregido aquí también
  const [sensorEditado, setSensorEditado] = useState<Sensor | null>(null);

  const handleEditar = (sensor: Sensor) => {
    setSensorEditado(sensor);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    sensorEditado,
    handleEditar,
  };
};
