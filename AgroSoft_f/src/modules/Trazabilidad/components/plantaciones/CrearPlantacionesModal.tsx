import { useState } from "react";
import { usePostPlantaciones } from "../../hooks/plantaciones/usePostPlantaciones";
import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useGetEras } from "../../hooks/eras/useGetEras";
import ModalComponent from "@/components/Modal";
import { Select, SelectItem } from "@heroui/react";
import { Cultivos, Eras } from "../../types";

interface CrearPlantacionModalProps {
  onClose: () => void;
}

export const CrearPlantacionModal = ({ onClose }: CrearPlantacionModalProps) => {
  const [fk_Cultivos, setFk_Cultivo] = useState<number | null>(null);
  const [fk_Eras, setFk_Era] = useState<number | null>(null);

  const { mutate, isPending } = usePostPlantaciones();
  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: eras, isLoading: isLoadingEras } = useGetEras();

  const handleSubmit = () => {
    if (!fk_Cultivos || !fk_Eras) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Cultivos, fk_Eras },
      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
          setFk_Era(null);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Plantación"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Select de Cultivo */}
      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={fk_Cultivos ? [fk_Cultivos.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            if (selectedKey) setFk_Cultivo(Number(selectedKey));
          }}
          selectionMode="single"
        >
          {(cultivos as Cultivos[]).map((cultivo) => (
            <SelectItem key={cultivo.id!.toString()}>{cultivo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Select de Era */}
      {isLoadingEras ? (
        <p>Cargando eras...</p>
      ) : (
        <Select
          label="Era"
          placeholder="Selecciona una era"
          selectedKeys={fk_Eras ? [fk_Eras.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            if (selectedKey) setFk_Era(Number(selectedKey));
          }}
          selectionMode="single"
        >
          {(eras as Eras[]).map((era) => (
            <SelectItem key={era.id!.toString()}>{`Era ${era.id}`}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
