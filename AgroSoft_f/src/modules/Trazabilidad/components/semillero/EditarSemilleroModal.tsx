import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchSemilleros } from "../../hooks/semilleros/usePatchSemilleros";
import { Semilleros } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetEspecies } from "../../hooks/especies/useGetEpecies";

interface EditarSemilleroModalProps {
  semillero: Semilleros;
  onClose: () => void;
}

const EditarSemilleroModal: React.FC<EditarSemilleroModalProps> = ({ semillero, onClose }) => {
  const [unidades, setUnidades] = useState<number>(semillero.unidades);
  const [fechaSiembra, setFechaSiembra] = useState<string>(semillero.fechaSiembra.split("T")[0]); // solo YYYY-MM-DD
  const [fechaEstimada, setFechaEstimada] = useState<string>(semillero.fechaEstimada.split("T")[0]);
  const [fk_Especies, setFk_Especie] = useState<number>(semillero.fk_Especies);

  const { mutate, isPending } = usePatchSemilleros();
  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();

  const handleSubmit = () => {
    mutate(
      {
        id: semillero.id,
        data: {
          unidades,
          fechaSiembra,
          fechaEstimada,
          fk_Especies,
        },
      },
      {
        onSuccess: (res) => {
          console.log("Actualizado correctamente:", res);
          onClose();
        },
        onError: (err) => {
          console.error("Error al actualizar:", err);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Semillero"
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
        value={unidades.toString()}
        label="Unidades"
        type="number"
        onChange={(e) => setUnidades(Number(e.target.value))}
      />

      <Input
        label="Fecha de Siembra"
        type="date"
        value={fechaSiembra}
        onChange={(e) => setFechaSiembra(e.target.value)}
      />

      <Input
        label="Fecha Estimada"
        type="date"
        value={fechaEstimada}
        onChange={(e) => setFechaEstimada(e.target.value)}
      />

      {isLoadingEspecies ? (
  <p>Cargando especies...</p>
) : (
  <Select
    label="Especie"
    placeholder="Selecciona una especie"
    selectedKeys={fk_Especies ? [fk_Especies.toString()] : []}
    onSelectionChange={(keys) => {
      const selected = Array.from(keys)[0];
      setFk_Especie(Number(selected));
    }}
  >
    {(especies || []).map((especie) => (
      <SelectItem key={especie.id.toString()}>{especie.nombre}</SelectItem>
    ))}
  </Select>
)}

    </ModalComponent>
  );
};

export default EditarSemilleroModal;
