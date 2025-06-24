import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchAfecciones } from "../../hooks/afecciones/usePatchAfecciones";
import { Afecciones } from "../../types";
import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useGetTipoAfecciones } from "../../hooks/tiposAfecciones/useGetTipoAfecciones";

interface EditarAfeccionModalProps {
  afeccion: Afecciones;
  onClose: () => void;
}

const EditarAfeccionModal: React.FC<EditarAfeccionModalProps> = ({
  afeccion,
  onClose,
}) => {
  const [nombre, setNombre] = useState<string>(afeccion.nombre);
  const [descripcion, setDescripcion] = useState<string>(afeccion.descripcion);
  const [tipoPlagaId, setTipoPlagaId] = useState<number>(
    afeccion.tiposPlaga?.id || 0
  );

  const { data: tiposPlaga, isLoading: isLoadingTiposPlaga } =
    useGetTipoAfecciones();
  const { mutate, isPending } = usePatchAfecciones();

  const handleSubmit = () => {
    if (!nombre.trim()) return console.log("Ingrese nombre.");
    if (!descripcion.trim()) return console.log("Ingrese descripción.");
    if (tipoPlagaId <= 0) return console.log("Seleccione un tipo de plaga.");

    mutate(
      {
        id: afeccion.id,
        data: {
          nombre,
          descripcion,
          fk_Tipo: tipoPlagaId,
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
      title="Editar Afección"
      footerButtons={[
        {
          label: isPending ? "Guardando…" : "Guardar",
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

      <Textarea
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />

      {isLoadingTiposPlaga ? (
        <p>Cargando tipos de plaga...</p>
      ) : (
        <Select
          label="Tipo de Plaga"
          placeholder="Selecciona un tipo de plaga"
          selectedKeys={[tipoPlagaId.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setTipoPlagaId(Number(selectedKey));
          }}
        >
          {(tiposPlaga || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarAfeccionModal;
