import { useState } from "react";
import { usePostActividades } from "../../hooks/actividades/usePostActividades";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { useGetCultivos } from "@/modules/Trazabilidad/hooks/cultivos/useGetCultivos";
import { useGetUsers } from "@/modules/Users/hooks/useGetUsers";

interface CrearActividadesModalProps {
  onClose: () => void;
}

export const CrearActividadesModal = ({
  onClose,
}: CrearActividadesModalProps) => {
  const [fkCultivos, setFk_Cultivo] = useState<number | null>(null);
  const [fkUsuarios, setFk_Usuario] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [estado, setEstado] = useState<"AS" | "CO" | "CA" | "">("");

  const { data: cultivos, isLoading: isLoadingCultivos } = useGetCultivos();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers();
  const { mutate, isPending } = usePostActividades();

  

  const handleSubmit = () => {
  const fechaISO = new Date(fecha).toISOString();
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
      { fkCultivos, fkUsuarios, titulo, descripcion, fecha: fechaISO, estado },
      {
        onSuccess: () => {
          onClose();
          setFk_Cultivo(null);
          setFk_Usuario(null);
          setTitulo("");
          setDescripcion("");
          setFecha("");
          setEstado("");
        },
      }
    );
  };


  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Registro de Actividades"
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
        label="Titulo"
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      <Input
        label="Descripción"
        type="text"
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

      {/* Selector de Estado con valores fijos */}
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
            <SelectItem key={cultivo.id}>{cultivo.nombre}</SelectItem>
          ))}
        </Select>
      )}

      {/* Selector de Usuarios (corregido) */}
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
