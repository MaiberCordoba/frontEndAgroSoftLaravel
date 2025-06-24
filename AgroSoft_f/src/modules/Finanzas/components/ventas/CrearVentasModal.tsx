import { useState } from "react";
import { usePostVentas } from "../../hooks/ventas/usePostVentas";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";

interface CrearVentasModalProps {
  onClose: () => void;
}

export const CrearVentasModal = ({ onClose }: CrearVentasModalProps) => {
  const [fkCosechas, setFk_Cosecha] = useState<number | null>(null); // Cambiado a número o null
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [fecha, setFecha] = useState("");

  const { data: cosechas, isLoading: isLoadingCosechas } = useGetCosechas();
  const { mutate, isPending } = usePostVentas();


  const handleSubmit = () => {
    const fechaISO = new Date(fecha).toISOString();
    if (!fkCosechas || !precioUnitario || !fecha) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fkCosechas, precioUnitario, fecha: fechaISO },
      {
        onSuccess: () => {
          onClose();
          setFk_Cosecha(null);
          setPrecioUnitario(0);
          setFecha("");
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Ventas"
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
        label="Precio Unitario"
        type="number"
        value={precioUnitario.toString()}
        onChange={(e) => setPrecioUnitario(Number(e.target.value))}
        required
      />

      <Input
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />

      {/* Selector de Ventas */}
      {isLoadingCosechas ? (
        <p>Cargando cosechas...</p>
      ) : (
        <Select
          label="Cosecha"
          placeholder="Selecciona la fecha en que se cosecho"
          selectedKeys={fkCosechas ? [fkCosechas.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Cosecha(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(cosechas || []).map((cosecha) => (
            <SelectItem
              key={cosecha.id.toString()}
              textValue={`${cosecha.id} - ${cosecha.fecha}`}
            >
              {cosecha.id} - {cosecha.fecha}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
