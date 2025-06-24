import { useState } from "react";
import { usePostEras } from "../../hooks/eras/usePostEras";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";

interface CrearEraModalProps {
  onClose: () => void;
}

export const CrearEraModal = ({ onClose }: CrearEraModalProps) => {
  const [fk_Lotes, setFkLoteId] = useState<number | null>(null);
  const [tamX, setTamX] = useState<number | null>(null);
  const [tamY, setTamY] = useState<number | null>(null);
  const [posX, setPosX] = useState<number | null>(null);
  const [posY, setPosY] = useState<number | null>(null);
  const [estado, setEstado] = useState<boolean>(true); // Por defecto "Disponible"

  const { mutate, isPending } = usePostEras();
  const { data: lotes, isLoading: isLoadingLotes } = useGetLotes();

  const handleSubmit = () => {
    if (
      fk_Lotes === null ||
      tamX === null ||
      tamY === null ||
      posX === null ||
      posY === null
    ) {
      console.error("⚠️ Error: Todos los campos son obligatorios.");
      return;
    }

    const payload = {
      fk_Lotes,
      tamX,
      tamY,
      posX,
      posY,
      estado,
    };

    console.log("Enviando payload:", payload);

    mutate(payload, {
      onSuccess: () => {
        onClose();
        setFkLoteId(null);
        setTamX(null);
        setTamY(null);
        setPosX(null);
        setPosY(null);
        setEstado(true);
      },
    });
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Era"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {isLoadingLotes ? (
        <p>Cargando lotes...</p>
      ) : (
        <Select
          label="Lote"
          placeholder="Selecciona un lote"
          selectedKeys={fk_Lotes !== null ? [fk_Lotes.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkLoteId(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(lotes ?? []).map((lote) =>
            lote?.id !== undefined ? (
              <SelectItem key={lote.id.toString()}>{lote.nombre}</SelectItem>
            ) : null
          )}
        </Select>
      )}

      <Select
        label="Estado"
        selectedKeys={[estado.toString()]}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0];
          setEstado(selectedKey === "true");
        }}
      >
        <SelectItem key="true">Disponible</SelectItem>
        <SelectItem key="false">Ocupado</SelectItem>
      </Select>

      <Input
        label="Tamaño X"
        type="number"
        value={tamX !== null ? tamX.toString() : ""}
        onChange={(e) => setTamX(e.target.value === "" ? null : Number(e.target.value))}
        required
      />

      <Input
        label="Tamaño Y"
        type="number"
        value={tamY !== null ? tamY.toString() : ""}
        onChange={(e) => setTamY(e.target.value === "" ? null : Number(e.target.value))}
        required
      />

      <Input
        label="Posición X"
        type="number"
        value={posX !== null ? posX.toString() : ""}
        onChange={(e) => setPosX(e.target.value === "" ? null : Number(e.target.value))}
        required
      />

      <Input
        label="Posición Y"
        type="number"
        value={posY !== null ? posY.toString() : ""}
        onChange={(e) => setPosY(e.target.value === "" ? null : Number(e.target.value))}
        required
      />
    </ModalComponent>
  );
};
