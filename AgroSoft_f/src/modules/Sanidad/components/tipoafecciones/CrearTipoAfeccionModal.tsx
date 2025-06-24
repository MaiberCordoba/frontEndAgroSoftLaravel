import { useState } from "react";
import { usePostTipoAfeccion } from "../../hooks/tiposAfecciones/usePostTipoAfecciones";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearTipoAfeccionModalProps {
  onClose: () => void;
}

export const CrearTipoAfeccionModal = ({
  onClose,
}: CrearTipoAfeccionModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { mutate, isPending } = usePostTipoAfeccion();

  const handleSubmit = () => {
    if (!nombre || !descripcion) {
      console.log("Por favor, completa todos los campos.");
      return;
    }
    mutate(
      { nombre, descripcion },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de tipo de  afectaciones"
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
        label="Nombre"
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />

      <Input
        label="Descripción"
        type="text"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
    </ModalComponent>
  );
};
