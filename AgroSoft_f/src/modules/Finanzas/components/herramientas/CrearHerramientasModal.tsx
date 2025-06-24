import { useState } from "react";
import { usePostHerramienta } from "../../hooks/herramientas/usePostHerramientas";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetLotes } from "@/modules/Trazabilidad/hooks/lotes/useGetLotes";

interface CrearHerramientasModalProps {
  onClose: () => void;
}

export const CrearHerramientasModal = ({ onClose }: CrearHerramientasModalProps) => {
  const [fkLotes, setFk_Lote] = useState<number | null>(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [unidades, setUnidades] = useState(0);

  const { data: lotes, isLoading: isLoadingLotes } = useGetLotes();
  const { mutate, isPending } = usePostHerramienta();

  const handleSubmit = () => {
    if (!fkLotes || !nombre.trim() || !descripcion.trim() || unidades <= 0) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fkLotes, unidades, nombre, descripcion },
      {
        onSuccess: () => {
          onClose();
          setFk_Lote(null);
          setUnidades(0);
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
      title="Registro de Herramientas"
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
        label="Unidades"
        type="number"
        value={unidades.toString()}
        onChange={(e) => setUnidades(e.target.value ? Number(e.target.value) : 0)}
        required
      />

      {/* Selector de Lotes */}
      {isLoadingLotes ? (
        <p>Cargando Lotes...</p>
      ) : (
        <Select
          label="Lote"
          placeholder="Selecciona un Lote"
          selectedKeys={fkLotes?.toString() ? [fkLotes.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Lote(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(lotes || []).map((lote) => (
            <SelectItem key={lote?.id}>
              {lote.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
