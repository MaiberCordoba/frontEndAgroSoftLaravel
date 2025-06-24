import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchEras } from "../../hooks/eras/usePatchEras";
import { Eras } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetLotes } from "../../hooks/lotes/useGetLotes";

interface EditarEraModalProps {
  era: Eras;
  onClose: () => void;
}

const EditarEraModal: React.FC<EditarEraModalProps> = ({ era, onClose }) => {
  const [fk_Lotes, setFkLotes] = useState<number | null>(era.fk_Lotes ?? null);
  const [estado, setEstado] = useState<boolean>(era.estado);
  const [tamX, setTamX] = useState<number>(era.tamX ?? 0);
  const [tamY, setTamY] = useState<number>(era.tamY ?? 0);
  const [posX, setPosX] = useState<number>(era.posX ?? 0);
  const [posY, setPosY] = useState<number>(era.posY ?? 0);

  const { mutate, isPending } = usePatchEras();
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

    mutate(
      {
        id: era.id ?? 0,
        data: {
          lotes: { connect: { id: fk_Lotes } }, // ✅ Corrección aquí
          estado,
          tamX,
          tamY,
          posX,
          posY,
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
      title="Editar Era"
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
          selectedKeys={fk_Lotes ? [fk_Lotes.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkLotes(Number(selectedKey) || null);
          }}
        >
          {(lotes || []).map((lote) => (
            <SelectItem key={lote.id?.toString()}>{lote.nombre}</SelectItem>
          ))}
        </Select>
      )}

      <Select
        label="Estado"
        selectedKeys={[estado ? "true" : "false"]}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          setEstado(selected === "true");
        }}
      >
        <SelectItem key="true">Disponible</SelectItem>
        <SelectItem key="false">Ocupado</SelectItem>
      </Select>

      <Input
        label="Tamaño X"
        type="number"
        value={tamX.toString()}
        onChange={(e) => setTamX(Number(e.target.value) || 0)}
        required
      />

      <Input
        label="Tamaño Y"
        type="number"
        value={tamY.toString()}
        onChange={(e) => setTamY(Number(e.target.value) || 0)}
        required
      />

      <Input
        label="Posición X"
        type="number"
        value={posX.toString()}
        onChange={(e) => setPosX(Number(e.target.value) || 0)}
        required
      />

      <Input
        label="Posición Y"
        type="number"
        value={posY.toString()}
        onChange={(e) => setPosY(Number(e.target.value) || 0)}
        required
      />
    </ModalComponent>
  );
};

export default EditarEraModal;
