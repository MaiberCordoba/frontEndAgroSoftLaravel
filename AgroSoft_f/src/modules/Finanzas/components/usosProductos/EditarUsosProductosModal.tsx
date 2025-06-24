import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchUsosProductos } from "../../hooks/usosProductos/usePatchUsosProductos";
import { UsosProductos } from "../../types";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";
import { usegetInsumos } from "../../hooks/insumos/useGetInsumos";

interface EditarUsoProductoModalProps {
  usoProducto: UsosProductos;
  onClose: () => void;
}

const EditarUsoProductoModal: React.FC<EditarUsoProductoModalProps> = ({ usoProducto, onClose }) => {
  const [cantidadProducto, setCantidadProducto] = useState<number>(usoProducto.cantidadProducto);
  const [fkInsumos, setFkInsumo] = useState<number>(usoProducto.fkInsumos|| 0);
  const [fkActividades, setFkActividad] = useState<number>(usoProducto.fkActividades || 0);

  const { data: insumos, isLoading: isLoadingInsumos } = usegetInsumos();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { mutate, isPending } = usePatchUsosProductos();

  const handleSubmit = () => {
    mutate(
      {
        id: usoProducto.id,
        data: {
          cantidadProducto,
          fkInsumos,
          fkActividades,
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
      title="Editar Uso de Producto"
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
        value={cantidadProducto.toString()}
        label="Cantidad del Producto"
        type="number"
        onChange={(e) => setCantidadProducto(Number(e.target.value))}
      />

      {isLoadingInsumos ? (
        <p>Cargando insumos...</p>
      ) : (
        <Select
          label="Insumo"
          placeholder="Selecciona un insumo"
          selectedKeys={[fkInsumos.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkInsumo(Number(selectedKey));
          }}
        >
          {(insumos || []).map((insumo) => (
            <SelectItem key={insumo.id.toString()} textValue={insumo.nombre}>
              {insumo.nombre}
            </SelectItem>
          ))}
        </Select>
      )}

      {isLoadingActividades ? (
        <p>Cargando actividades...</p>
      ) : (
        <Select
          label="Actividad"
          placeholder="Selecciona una actividad"
          selectedKeys={[fkActividades.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFkActividad(Number(selectedKey));
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

export default EditarUsoProductoModal;
