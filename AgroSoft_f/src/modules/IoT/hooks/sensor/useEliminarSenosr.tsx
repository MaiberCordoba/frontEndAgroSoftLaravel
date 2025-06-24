import { useState } from "react";
import { UseModal } from "@/hooks/useModal"; // corregido
import { Sensor } from "../../types/sensorTypes";

export const useEliminarSensor = () => {
  const { isOpen, openModal, closeModal } = UseModal(); // corregido
  const [sensorEliminado, setSensorEliminado] = useState<Sensor | null>(null);

  const handleEliminar = (sensor: Sensor) => {
    setSensorEliminado(sensor);
    openModal();
  };

  const handleSuccess = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal,
    sensorEliminado,
    handleEliminar,
    handleSuccess,
  };
};