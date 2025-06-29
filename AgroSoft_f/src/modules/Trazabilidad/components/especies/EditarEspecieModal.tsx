import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchEspecies } from "../../hooks/especies/usePatchEspecies";
import { Especies } from "../../types";
import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useGetTiposEspecie } from "../../hooks/tiposEspecie/useGetTiposEpecie";

interface EditarEspecieModalProps {
  especie: Especies;
  onClose: () => void;
}

const EditarEspecieModal: React.FC<EditarEspecieModalProps> = ({ especie, onClose }) => {
  const [nombre, setNombre] = useState<string>(especie.nombre);
  const [descripcion, setDescripcion] = useState<string>(especie.descripcion);
  const [tiempoCrecimiento, settiempocrecimiento] = useState(especie.tiempoCrecimiento);
  const [fk_TiposEspecie, setFk_TiposEspecie] = useState(especie.fk_TiposEspecie ?? null);

  const { mutate, isPending } = usePatchEspecies();
  const { data: tiposEspecie, isLoading: isLoadingTiposEspecie } = useGetTiposEspecie();

  const handleSubmit = () => {
  mutate(
    {
      id: especie.id,
      data: {
        nombre,
        descripcion,
        tiempoCrecimiento,
        fk_TiposEspecie,
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
      title="Editar Especie"
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
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <Input
        label="Tiempo de Crecimiento"
        type="number"
        value={tiempoCrecimiento.toString()}
        onChange={(e) => settiempocrecimiento(Number(e.target.value))}
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
            setFk_TiposEspecie(Number(selectedKey));
          }}
        >
          {(tiposEspecie || []).map((tipo) => (
            <SelectItem key={tipo.id.toString()}>{tipo.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarEspecieModal;
