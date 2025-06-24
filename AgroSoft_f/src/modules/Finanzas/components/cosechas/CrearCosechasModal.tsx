import { useState } from "react";
import { usePostCosecha } from "../../hooks/cosechas/usePostCosechas";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";

interface CrearCosechasModalProps {
  onClose: () => void;
}

export const CrearCosechasModal = ({ onClose }: CrearCosechasModalProps) => {
  const [fkCultivos, setFk_Cultivo] = useState<number | null>(null);
  const [unidades, setUnidades] = useState(0); // Inicializado en 0
  const [fecha, setFecha] = useState("");

  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { mutate, isPending } = usePostCosecha();

  const handleSubmit = () => {
    if (!fkCultivos || unidades <= 0 || !fecha) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    // Convertir fecha a formato ISO
    const fechaISO = new Date(fecha).toISOString();

    mutate(
      { unidades, fecha: fechaISO, fkCultivos },
      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
          setUnidades(0); // Restablecer a 0
          setFecha("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Cosechas"
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
        label="Unidades"
        type="number"
        value={unidades.toString()}
        onChange={(e) => setUnidades(Number(e.target.value))} // Convertir a número
        required
      />

      <Input
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />

      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={fkCultivos ? [fkCultivos.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Cultivo(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo?.id}>{cultivo.nombre}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
