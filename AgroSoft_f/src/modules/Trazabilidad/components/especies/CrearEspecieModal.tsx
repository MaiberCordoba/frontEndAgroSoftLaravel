import { useState } from "react";
import { usePostEspecies } from "../../hooks/especies/usePostEspecies";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";

interface CrearEspecieModalProps {
  onClose: () => void;
}

export const CrearEspecieModal = ({ onClose }: CrearEspecieModalProps) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tiempoCrecimiento, settiempoCrecimiento] = useState<number | "">("");
  const [fk_TiposEspecie, setfk_TiposEspecie] = useState<number | null>(null);

  const { mutate, isPending } = usePostEspecies();
  const { data: TiposEspecies, isLoading: isLoadingTiposEspecie } = useGetTiposEspecie();

  const handleSubmit = () => {
    if (!nombre || !descripcion || !tiempoCrecimiento || !fk_TiposEspecie) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        nombre,
        descripcion,
        tiempoCrecimiento: Number(tiempoCrecimiento),
        fk_TiposEspecie,
      },
      {
        onSuccess: () => {
          onClose();
          setNombre("");
          setDescripcion("");
          settiempoCrecimiento("");
          setfk_TiposEspecie(null);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Especie"
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
        label="Tiempo de Crecimiento"
        type="number"
        value={tiempoCrecimiento.toString()}
        onChange={(e) => settiempoCrecimiento(Number(e.target.value))}
      />

      {isLoadingTiposEspecie ? (
        <p>Cargando tipos de especie...</p>
      ) : (
        <Select
          label="Tipo de Especie"
          placeholder="Selecciona un tipo"
          selectedKeys={fk_TiposEspecie ? [fk_TiposEspecie.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setfk_TiposEspecie(Number(selectedKey));
          }}
        >
          {(TiposEspecies || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
