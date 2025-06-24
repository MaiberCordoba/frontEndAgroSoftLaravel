import { UseModal } from "@/hooks/useModal";
import { useState } from "react";

export const useDetallesControl = () => {
  const { isOpen, openModal, closeModal } = UseModal();
  const [selectedControlId, setSelectedControlId] = useState<number | null>(null);

  const handleVerDetalles = (id: number) => {
    setSelectedControlId(id);
    openModal();
  };

  return {
    isOpen,
    closeModal,
    selectedControlId,
    handleVerDetalles,
  };
};