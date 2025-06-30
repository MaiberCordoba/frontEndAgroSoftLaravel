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
  const [fk_Herramientas, setFk_Herramienta] = useState<number>(usoHerramienta.fk_Herramientas || 0);
  const [fk_Actividades, setFk_Actividad] = useState<number>(usoHerramienta.fk_Actividades || 0);

  const { data: herramientas, isLoading: isLoadingHerramientas } = useGetHerramientas();
  const { data: actividades, isLoading: isLoadingActividades } = useGetActividades();
  const { mutate, isPending } = usePatchUsosHerramientas();

  const handleSubmit = () => {
    mutate(
      {
        id: usoHerramienta.id,
        data: {
          fk_Herramientas,
          fk_Actividades,
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
          selectedKeys={[fk_Herramientas.toString()]}
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
          selectedKeys={[fk_Actividades.toString()]}
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
