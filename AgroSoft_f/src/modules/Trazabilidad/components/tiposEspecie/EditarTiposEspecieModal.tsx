import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchTiposEspecie } from "../../hooks/tiposEspecie/usePatchTiposEspecie";
import { TiposEspecie } from "../../types";
import { Input, Textarea } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query"; // 👈 Import necesario

interface EditarTiposEspecieModalProps {
  especie: TiposEspecie;
  onClose: () => void;
}

const EditarTiposEspecieModal: React.FC<EditarTiposEspecieModalProps> = ({ especie, onClose }) => {
  const [nombre, setNombre] = useState<string>(especie.nombre);
  const [descripcion, setDescripcion] = useState<string>(especie.descripcion);
  const [img, setImg] = useState<string>(especie.img);

  const queryClient = useQueryClient(); // 👈 Cliente para refrescar queries
  const { mutate, isPending } = usePatchTiposEspecie();

  const handleSubmit = () => {
    mutate(
      {
        id: especie.id,
        data: {
          nombre,
          descripcion,
          img,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["tiposEspecie"] }); // ✅ Refresca la lista
          onClose();
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Tipo de Especie"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <Input
        value={nombre}
        label="Nombre"
        type="text"
        onChange={(e) => setNombre(e.target.value)}
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        type="text"
        onChange={(e) => setDescripcion(e.target.value)}
      />
    </ModalComponent>
  );
};

export default EditarTiposEspecieModal;
