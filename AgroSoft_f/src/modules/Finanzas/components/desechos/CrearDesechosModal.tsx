import { useState } from "react";
import { usePostDesecho } from "../../hooks/desechos/usePostDesechos";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetTiposDesechos } from "../../hooks/tiposDesechos/useGetTiposDesechos";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";

interface CrearDesechosModalProps {
  onClose: () => void;
}

export const CrearDesechosModal = ({ onClose }: CrearDesechosModalProps) => {
  const [fkCultivos, setFk_Cultivo] = useState<number | null>(null); // Cambiado a número o null
  const [fkTiposDesecho, setFk_TipoDesecho] = useState<number | null>(null); 
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const { data: tiposDesechos, isLoading: isLoadingTiposDesechos } = useGetTiposDesechos();
  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { mutate, isPending } = usePostDesecho();

  const handleSubmit = () => {
    if (!fkCultivos || !fkTiposDesecho || !nombre || !descripcion) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fkCultivos, fkTiposDesecho, nombre, descripcion },
      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
          setFk_TipoDesecho(null);
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
      title="Registro de Desechos"
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

      {/* Selector de Cultivos */}
      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={fkCultivos ? [fkCultivos.toString()] : []} // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
            setFk_Cultivo(selectedKey ? Number(selectedKey) : null); // Actualiza el estado con el nuevo ID
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id}>
              {cultivo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Tipos de Desechos */}
      {isLoadingTiposDesechos ? (
        <p>Cargando tipos de desechos...</p>
      ) : (
        <Select
          label="Tipo de desecho"
          placeholder="Selecciona un tipo de desecho"
          selectedKeys={fkTiposDesecho ? [fkTiposDesecho.toString()] : []} // HeroUI espera un array de strings
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0]; // HeroUI devuelve un Set
            setFk_TipoDesecho(selectedKey ? Number(selectedKey) : null); // Actualiza el estado con el nuevo ID
          }}
        >
          {(tiposDesechos || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>
              {tipo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
