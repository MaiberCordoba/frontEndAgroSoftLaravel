import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { addToast } from "@heroui/react";
import { VerticalDotsIcon } from "./Icons";
import { useAuth } from "@/hooks/UseAuth";

interface AccionesTablaProps {
  onEditar: () => void;
  onEliminar?: () => void; // Hacer onEliminar opcional
  permitirEditar?: boolean;
  permitirEliminar?: boolean;
  onVerDetalles?: () => void;
}

export const AccionesTabla: React.FC<AccionesTablaProps> = ({
  onEditar,
  onEliminar,
  permitirEditar = true,
  permitirEliminar = true,
  onVerDetalles,
}) => {
  const { hasRole } = useAuth();

  // Función para mostrar toast de permisos denegados
  const showPermissionDeniedToast = () => {
    addToast({
      title: "Acción no permitida",
      description: "No tienes permisos para realizar esta acción",
      color: "danger",
    });
  };

  // Envolver las funciones originales para verificar permisos
  const handleEditar = () => {
    if (hasRole("visitante") || hasRole("aprendiz")) {
      showPermissionDeniedToast();
      return;
    }
    if (permitirEditar) {
      onEditar();
    }
  };

  const handleEliminar = () => {
    if (hasRole("visitante") || hasRole("aprendiz")) {
      showPermissionDeniedToast();
      return;
    }
    if (onEliminar && permitirEliminar) {
      onEliminar();
    }
  };

  // Crear elementos de menú de forma condicional
  const menuItems = React.useMemo(() => {
    const items = [];

    if (onVerDetalles) {
      items.push(
        <DropdownItem key="ver" onPress={onVerDetalles}>
          Ver detalles
        </DropdownItem>
      );
    }

    // Mostrar "Editar" si permitirEditar es true, sin restringir por rol
    if (permitirEditar) {
      items.push(
        <DropdownItem key="editar" onPress={handleEditar}>
          Editar
        </DropdownItem>
      );
    }

    // Mostrar "Eliminar" si onEliminar está definido y permitirEliminar es true, sin restringir por rol
    if (onEliminar && permitirEliminar) {
      items.push(
        <DropdownItem key="eliminar" onPress={handleEliminar}>
          Eliminar
        </DropdownItem>
      );
    }

    return items;
  }, [
    onVerDetalles,
    permitirEditar,
    permitirEliminar,
    handleEditar,
    handleEliminar,
    onEliminar,
  ]);

  // Si no hay acciones disponibles
  if (menuItems.length === 0) {
    return <span className="text-gray-400 text-sm">Sin acciones</span>;
  }

  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" className="bg-success p-2 rounded">
            <VerticalDotsIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Acciones">{menuItems}</DropdownMenu>
      </Dropdown>
    </div>
  );
};
