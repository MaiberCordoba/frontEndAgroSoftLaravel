import React from "react";
import ModalComponent from "@/components/Modal";
import { useGetByIdControles } from "../../hooks/controles/useGetByIdControles";

interface DetallesControles {
  id: number;
  isOpen: boolean;
  onClose: () => void;
}

const DetallesControles: React.FC<DetallesControles> = ({
  id,
  isOpen,
  onClose,
}) => {
  const { data } = useGetByIdControles(id);

  return (
    <ModalComponent isOpen={isOpen} onClose={onClose} title="Detalles controles">
      <p><strong>Fecha Asignación: </strong>{data?.fechaControl || "Cargando..."}</p>
      <p><strong>Afeccion Encontrada: </strong>{data?.afecciones.plagas.nombre || "Cargando..."}</p>
      <p><strong>Tipo Control: </strong>{data?.tiposControl.nombre || "Cargando..."}</p>
      <p><strong>Estado Plaga: </strong>{data?.afecciones.estado || "Cargando..."}</p>
      <p><strong>Descripcion: </strong>{data?.descripcion || "Cargando..."}</p>
    </ModalComponent>
  );
};

export default DetallesControles;