import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Actividades } from "../../types";

export const useVerDetalleActividad = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [actividadSeleccionada, setActividadSeleccionada] = useState<Actividades | null>(null);

  const handleVerDetalle = (actividad: Actividades) => {
    setActividadSeleccionada(actividad);
    openModal();
  };

  const handleCloseDetalle = () => {
    closeModal();
  };

  return {
    isOpen,
    closeModal: handleCloseDetalle,
    actividadSeleccionada,
    handleVerDetalle,
  };
};
