import { useState } from "react";
import { usePostUsoProducto } from "../../hooks/usosProductos/usePostUsosProductos";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { usegetInsumos } from "../../hooks/insumos/useGetInsumos";

interface CrearUsosProductosModalProps {
  onClose: () => void;
}

export const CrearUsosProductosModal = ({ onClose }: CrearUsosProductosModalProps) => {
  const [fk_Insumos, setFkInsumo] = useState<number | null>(null);
  const [fk_Actividades, setFkActividad] = useState<number | null>(null);
  const [cantidadProducto, setCantidadProducto] = useState<number>(0);

  const { data: insumos, isLoading: isLoadingInsumos } = usegetInsumos();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { mutate, isPending } = usePostUsoProducto();

  const handleSubmit = () => {
    if (!fk_Insumos || !fk_Actividades || cantidadProducto <= 0) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      { fk_Insumos, fk_Actividades, cantidadProducto },
      {
        onSuccess: () => {
          onClose();
          setFkInsumo(null);
          setFkActividad(null);
          setCantidadProducto(0);
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Uso de Productos"
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
        label="Cantidad de Producto"
        type="number"
        value={cantidadProducto.toString()}
        onChange={(e) => setCantidadProducto(Number(e.target.value))}
        required
      />

      {/* Selector de Insumos */}
      {isLoadingInsumos ? (
        <p>Cargando insumos...</p>
      ) : (
        <Select
          label="Insumo"
          placeholder="Selecciona un insumo"
          selectedKeys={fk_Insumos ? [fk_Insumos.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkInsumo(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(insumos || []).map((insumo) => (
            <SelectItem key={insumo.id.toString()} textValue={insumo.nombre}>
              {insumo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Actividades */}
      {isLoadingActividades ? (
        <p>Cargando actividades...</p>
      ) : (
        <Select
          label="Actividad"
          placeholder="Selecciona una actividad"
          selectedKeys={fk_Actividades ? [fk_Actividades.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkActividad(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(actividades || []).map((actividad) => (
            <SelectItem key={actividad.id.toString()} textValue={actividad.titulo}>
              {actividad.titulo}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};
