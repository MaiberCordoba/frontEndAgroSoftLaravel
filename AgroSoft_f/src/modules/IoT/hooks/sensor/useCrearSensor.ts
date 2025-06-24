import { UseModal } from "@/hooks/useModal"
import { Sensor } from "../../types/sensorTypes";
import { useState } from "react";

export const useCrearSensor = () => {
  const { isOpen, openModal, closeModal } = UseModal(); // corregido aquí también
  const [sensorCreado, setSensorCreado] = useState<Sensor | null>(null);

  const handleCrear = (sensor: Sensor) => {
    setSensorCreado(sensor);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    sensorCreado,
    handleCrear,
  };
};