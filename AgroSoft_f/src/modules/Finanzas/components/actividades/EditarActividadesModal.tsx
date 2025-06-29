import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchActividades } from "../../hooks/actividades/usePatchActividades";
import { Actividades } from "../../types";
import { Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";

interface EditarActividadesModalProps {
  actividad: Actividades;
  onClose: () => void;
}

const EditarActividadesModal: React.FC<EditarActividadesModalProps> = ({
  actividad,
  onClose,
}) => {
  const [titulo, setTitulo] = useState<string>(actividad.titulo);
  const [descripcion, setDescripcion] = useState<string>(actividad.descripcion);
  const [fecha, setFecha] = useState<string>(actividad.fecha);
  const [estado, setEstado] = useState<"Asignada" | "Completada" | "Cancelada">(
    actividad.estado as "Asignada" | "Completada" | "Cancelada"
  );
  const [fk_Cultivos, setFk_Cultivo] = useState<number | null>(
    actividad.fk_Cultivos || null
  );
  const [fk_Usuarios, setFk_Usuario] = useState<number | null>(
    actividad.fk_Usuarios || null
  );

  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { mutate, isPending } = usePatchActividades();

  const handleSubmit = () => {
    if (
      !fk_Cultivos ||
      !fk_Usuarios ||
      !titulo ||
      !descripcion ||
      !fecha ||
      !estado
    ) {
      console.log("Por favor, completa todos los campos.");
      return;
    }

    mutate(
      {
        id: actividad.id,
        data: {
          titulo,
          descripcion,
          fecha,
          estado,
          fk_Cultivos,
          fk_Usuarios,
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
      title="Editar Actividad"
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
        label="Título"
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <Textarea
        label="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />

      <Input
        label="Fecha"
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        required
      />

      <Select
        label="Estado"
        selectedKeys={[estado]}
        onSelectionChange={(keys) => {
          const selectedKey = Array.from(keys)[0] as
            | "Asignada"
            | "Completada"
            | "Cancelada";
          setEstado(selectedKey);
        }}
        required
      >
        <SelectItem key="Asignada">Asignado</SelectItem>
        <SelectItem key="Completada">Completado</SelectItem>
        <SelectItem key="Cancelada">Cancelado</SelectItem>
      </Select>

      {isLoadingCultivos ? (
        <p>Cargando cultivos...</p>
      ) : (
        <Select
          label="Cultivo"
          placeholder="Selecciona un cultivo"
          selectedKeys={fk_Cultivos ? [fk_Cultivos.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Cultivo(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(cultivos || []).map((cultivo) => (
            <SelectItem key={cultivo.id}>{cultivo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {isLoadingUsers ? (
        <p>Cargando usuarios...</p>
      ) : (
        <Select
          label="Usuario"
          placeholder="Selecciona un Usuario"
          selectedKeys={fk_Usuarios ? [fk_Usuarios.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Usuario(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(users || []).map((usuario) => (
            <SelectItem key={usuario.id.toString()}>
              {usuario.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarActividadesModal;
