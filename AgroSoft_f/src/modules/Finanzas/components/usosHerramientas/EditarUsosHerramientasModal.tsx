import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchUsosHerramientas } from "../../hooks/usosHerramientas/usePatchUsosHerramientas";
import { UsosHerramientas } from "../../types";
import { Select, SelectItem } from "@heroui/react";
import { useGetHerramientas } from "../../hooks/herramientas/useGetHerramientas";
import { useGetActividades } from "../../hooks/actividades/useGetActividades";

interface EditarUsoHerramientaModalProps {
  usoHerramienta: UsosHerramientas; // El uso de herramienta que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarUsoHerramientaModal: React.FC<EditarUsoHerramientaModalProps> = ({ usoHerramienta, onClose }) => {
  const [fkHerramientas, setFk_Herramienta] = useState<number>(usoHerramienta.fkHerramientas || 0);
  const [fkActividades, setFk_Actividad] = useState<number>(usoHerramienta.fkActividades || 0);

  const { data: herramientas, isLoading: isLoadingHerramientas } = useGetHerramientas();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { mutate, isPending } = usePatchUsosHerramientas();

  const handleSubmit = () => {
    mutate(
      {
        id: usoHerramienta.id,
        data: {
          fkHerramientas,
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
      title="Editar Uso de Herramienta"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      {/* Selector de Herramientas */}
      {isLoadingHerramientas ? (
        <p>Cargando herramientas...</p>
      ) : (
        <Select
          label="Herramienta"
          placeholder="Selecciona una herramienta"
          selectedKeys={[fkHerramientas.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Herramienta(Number(selectedKey));
          }}
        >
          {(herramientas || []).map((herramienta) => (
            <SelectItem key={herramienta.id.toString()}>{herramienta.nombre}</SelectItem>
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
          selectedKeys={[fkActividades.toString()]}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Actividad(Number(selectedKey));
          }}
        >
          {(actividades || []).map((actividad) => (
            <SelectItem key={actividad.id.toString()}>{actividad.titulo}</SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarUsoHerramientaModal;
