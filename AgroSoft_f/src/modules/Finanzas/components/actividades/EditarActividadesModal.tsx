import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { usePatchActividades } from "../../hooks/actividades/usePatchActividades"; // Hook para actualizar actividades
import { Actividades } from "../../types";
import { Input, Textarea, Select, SelectItem } from "@heroui/react";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";

interface EditarActividadesModalProps {
  actividad: Actividades; // La actividad que se está editando
  onClose: () => void; // Función para cerrar el modal
}

const EditarActividadesModal: React.FC<EditarActividadesModalProps> = ({
  actividad,
  onClose,
}) => {
  const [titulo, setTitulo] = useState<string>(actividad.titulo);
  const [descripcion, setDescripcion] = useState<string>(actividad.descripcion);
  const [fecha, setFecha] = useState<string>(actividad.fecha);
  const [estado, setEstado] = useState<"Asignada" | "Completada" | "Cancelada">(
    actividad.estado
  );
  const [fkCultivos, setFk_Cultivo] = useState<number | null>(
    actividad.fkCultivos || null
  );
  const [fkUsuarios, setFk_Usuario] = useState<number | null>(
    actividad.fkUsuarios || null
  );

  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { mutate, isPending } = usePatchActividades();

  // Convertir fecha a formato ISO
  const fechaISO = new Date(fecha).toISOString();

  const handleSubmit = () => {
    // Verificar que todos los campos estén completos
    if (
      !fkCultivos ||
      !fkUsuarios ||
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
          fecha: fechaISO,
          estado,
          fkCultivos,
          fkUsuarios,
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
        value={titulo}
        label="Título"
        type="text"
        onChange={(e) => setTitulo(e.target.value)}
        required
      />
      <Textarea
        value={descripcion}
        label="Descripción"
        onChange={(e) => setDescripcion(e.target.value)}
        required
      />
      <Input
        value={fecha}
        label="Fecha"
        type="date"
        onChange={(e) => setFecha(e.target.value)}
        required
      />

      {/* Selector de Estado */}
      <Select
        label="Estado"
        value={estado}
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

      {/* Selector de Cultivos */}
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

      {/* Selector de Usuarios */}
      {isLoadingUsers ? (
        <p>Cargando usuarios...</p>
      ) : (
        <Select
          label="Usuario"
          placeholder="Selecciona un Usuario"
          selectedKeys={fkUsuarios ? [fkUsuarios.toString()] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            setFk_Usuario(selectedKey ? Number(selectedKey) : null);
          }}
        >
          {(users || []).map((usuario) => (
            <SelectItem key={usuario.identificacion.toString()}>
              {usuario.nombre}
            </SelectItem>
          ))}
        </Select>
      )}
    </ModalComponent>
  );
};

export default EditarActividadesModal;
