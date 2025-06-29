import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchPlantaciones } from "../../hooks/plantaciones/usePatchPlantaciones";
import { Plantaciones } from "../../types";
import { Select, SelectItem } from "@heroui/react";
import { useGetCultivos } from "../../hooks/cultivos/useGetCultivos";
import { useGetEras } from "../../hooks/eras/useGetEras";

interface EditarPlantacionModalProps {
  plantacion: Plantaciones;
  onClose: () => void;
}

const EditarPlantacionModal: React.FC<EditarPlantacionModalProps> = ({ plantacion, onClose }) => {
  const [fk_Cultivos, setFk_Cultivo] = useState<number>(plantacion.fk_Cultivos);
  const [fk_Eras, setFk_Era] = useState<number>(plantacion.fk_Eras);

  const { mutate, isPending } = usePatchPlantaciones();
  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: eras, isLoading: isLoadingEras } = useGetEras();

  const handleSubmit = () => {
    mutate(
      {
        id: plantacion.id,
        data: {
          fk_Cultivos,
          fk_Eras,
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Plantación"
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
            setFk_Cultivo(Number(selectedKey));
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id?.toString()}>{cultivo.nombre}</SelectItem>
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
            setFk_Era(Number(selectedKey));
          }}
        >
          {(eras || []).map((era) => (
            <SelectItem key={era.id?.toString()}>{`Era ${era.id}`}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarPlantacionModal;
