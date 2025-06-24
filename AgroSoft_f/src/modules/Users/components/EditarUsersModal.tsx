import React, { useState } from "react";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { User } from "../types";
import { usePatchUsers } from "../hooks/usePatchUsers";

// Lista de roles válida, alineada con el backend
const VALID_ROLES = ["admin", "instructor", "pasante", "aprendiz", "visitante"];
// Lista de estados válida
const VALID_ESTADOS = ["activo", "inactivo"];

interface EditarUserModalProps {
  user: User; // El usuario que se está editando
  onClose: () => void; // Función para cerrar el modal
}

// Normaliza fechaNacimiento a yyyy-MM-dd
const formatDateToYYYYMMDD = (date: string | undefined): string => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return "";
  return parsedDate.toISOString().split("T")[0]; // Ejemplo: 2025-04-09
};

const EditarUserModal: React.FC<EditarUserModalProps> = ({ user, onClose }) => {
  const [userData, setUserData] = useState({
    identificacion: user.identificacion.toString(),
    nombre: user.nombre,
    apellidos: user.apellidos,
    fechaNacimiento: formatDateToYYYYMMDD(user.fechaNacimiento), // Normalizar fecha
    telefono: user.telefono,
    correoElectronico: user.correoElectronico,
    rol: user.rol || "visitante",
    estado: user.estado || "activo", // Añadir estado por defecto
  });

  const { mutate, isPending } = usePatchUsers();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof userData
  ) => {
    setUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSelectChange = (value: string, field: "rol" | "estado") => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    mutate(
      {
        id: user.identificacion,
        data: {
          ...userData,
          identificacion: Number(userData.identificacion),
          rol: userData.rol.trim().toLowerCase(), // Normalizar rol
          estado: userData.estado, // Incluir estado
          fechaNacimiento: userData.fechaNacimiento, // Manejar fecha vacía
        },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error: any) => {
          console.error(
            "Error al guardar usuario:",
            error.response?.data || error.message
          );
        },
      }
    );
  };

  return (
    <ModalComponent
      isOpen={true}
      onClose={onClose}
      title="Editar Usuario"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar",
          color: "success",
          variant: "light",
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Identificación"
          type="number"
          value={userData.identificacion}
          onChange={(e) => handleInputChange(e, "identificacion")}
          required
        />

        <Input
          label="Nombre"
          type="text"
          value={userData.nombre}
          onChange={(e) => handleInputChange(e, "nombre")}
          required
        />

        <Input
          label="Apellidos"
          type="text"
          value={userData.apellidos}
          onChange={(e) => handleInputChange(e, "apellidos")}
        />

        <Input
          label="Fecha de Nacimiento"
          type="date"
          value={userData.fechaNacimiento}
          onChange={(e) => handleInputChange(e, "fechaNacimiento")}
        />

        <Input
          label="Teléfono"
          type="tel"
          value={userData.telefono}
          onChange={(e) => handleInputChange(e, "telefono")}
        />

        <Input
          label="Correo Electrónico"
          type="email"
          value={userData.correoElectronico}
          onChange={(e) => handleInputChange(e, "correoElectronico")}
          required
        />

        <Select
          label="Rol"
          value={userData.rol}
          onChange={(e) => handleSelectChange(e.target.value, "rol")}
          required
        >
          {VALID_ROLES.map((rol) => (
            <SelectItem key={rol} value={rol}>
              {rol.charAt(0).toUpperCase() + rol.slice(1)}
            </SelectItem>
          ))}
        </Select>

        <Select
          label="Estado"
          value={userData.estado}
          onChange={(e) => handleSelectChange(e.target.value, "estado")}
          required
        >
          {VALID_ESTADOS.map((estado) => (
            <SelectItem key={estado} value={estado}>
              {estado.charAt(0).toUpperCase() + estado.slice(1)}
            </SelectItem>
          ))}
        </Select>
      </div>
    </ModalComponent>
  );
};

export default EditarUserModal;
