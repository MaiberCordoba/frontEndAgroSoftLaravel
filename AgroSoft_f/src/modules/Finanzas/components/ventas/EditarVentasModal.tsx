import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchVentas } from "../../hooks/ventas/usePatchVentas";
import { useGetCosechas } from "../../hooks/cosechas/useGetCosechas";
import { Ventas } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";

interface EditarVentaModalProps {
  venta: Ventas;
  onClose: () => void;
}

const EditarVentaModal: React.FC<EditarVentaModalProps> = ({
  venta,
  onClose,
}) => {
  const [precioUnitario, setPrecioUnitario] = useState(venta.precioUnitario);
  const [fecha, setFecha] = useState<string>(venta.fecha);
  const [fk_Cosechas, setFk_Cosecha] = useState<number | null>(
    venta.fk_Cosechas || null
  );

  const { mutate, isPending } = usePatchVentas();
  const { data: cosechas, isLoading: isLoadingCosechas } = useGetCosechas();

  // Convertir fecha a formato ISO
  const handleSubmit = () => {
    if (!precioUnitario || !fecha || !fk_Cosechas) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    mutate(
      {
        id: venta.id,
        data: { precioUnitario, fecha, fk_Cosechas },
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
      title="Editar Venta"
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

      {/* Selector de Cosechas */}
      {isLoadingCosechas ? (
        <p>Cargando cosechas...</p>
      ) : (
        <Select
          label="Cosecha"
          placeholder="Selecciona la fecha de la cosecha"
          selectedKeys={fk_Cosechas ? [fk_Cosechas.toString()] : []}
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

export default EditarVentaModal;
