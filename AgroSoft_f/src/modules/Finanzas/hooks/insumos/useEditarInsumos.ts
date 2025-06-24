import { useState } from "react";
import { UseModal } from "@/hooks/useModal";
import { Insumos } from "../../types";

export const useEditarInsumo = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [insumoEditado, setInsumoEditado] = useState<Insumos | null>(null);

  const handleEditar = (insumo: Insumos) => {
    setInsumoEditado(insumo);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    insumoEditado,
    handleEditar,
  };
};