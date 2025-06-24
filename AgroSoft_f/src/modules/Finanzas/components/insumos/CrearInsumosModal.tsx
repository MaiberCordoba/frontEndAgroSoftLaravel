import { useState } from "react";
import { usePostInsumos } from "../../hooks/insumos/usePostInsumos";
import ModalComponent from "@/components/Modal";
import { Input } from "@heroui/react";

interface CrearInsumosModalProps {
  onClose: () => void;
}

export const CrearInsumosModal = ({ onClose }: CrearInsumosModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState<number | "">("");
  const [unidades, setUnidades] = useState<number | "">("");

  const { mutate, isPending } = usePostInsumos();

  const handleSubmit = () => {
    if (!nombre || !descripcion || precio === "" || unidades === "") {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { nombre, descripcion, precio: Number(precio), unidades: Number(unidades) },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
          setPrecio("");
          setUnidades("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Insumos"
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

      <Input
        label="Precio"
        type="number"
        value={precio}
        onChange={(e) => setPrecio(Number(e.target.value))}
        required
      />

      <Input
        label="Unidades"
        type="number"
        value={unidades}
        onChange={(e) => setUnidades(Number(e.target.value))}
        required
      />
    </ModalComponent>
  );
};
