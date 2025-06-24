import { useState, ChangeEvent } from "react";
import ModalComponent from "@/components/Modal";
import { Input, Select, SelectItem } from "@heroui/react";
import { usePostUsers } from "../hooks/usePostUsers";
import { UserFormState } from "../types";

// Lista de roles válida, alineada con el backend
const VALID_ROLES = ["admin", "instructor", "pasante", "aprendiz", "visitante"];
// Lista de estados válida
const VALID_ESTADOS = ["activo", "inactivo"];

interface CrearUsersModalProps {
  isOpen: boolean; // Agrega la prop isOpen
  onClose: () => void;
}

export const CrearUsersModal = ({ isOpen, onClose }: CrearUsersModalProps) => {
  const [userData, setUserData] = useState<UserFormState>({
    identificacion: "",
    nombre: "",
    apellidos: "",
    fechaNacimiento: "",
    telefono: "",
    correoElectronico: "",
    passwordHash: "",
    rol: "visitante", 
    estado: "activo", 
  });

  const { mutate, isPending } = usePostUsers();

  // Maneja cambios en inputs normales
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: keyof Omit<UserFormState, "rol" | "estado">
  ) => {
    setUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // Maneja cambios en selects (rol y estado)
  const handleSelectChange = (value: string, field: "rol" | "estado") => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !userData.identificacion ||
      !userData.nombre ||
      !userData.correoElectronico ||
      !userData.passwordHash
    ) {
      console.log("Por favor, completa los campos requeridos.");
      return;
    }

    if (!VALID_ROLES.includes(userData.rol)) {
      console.log("Rol inválido:", userData.rol);
      return;
    }

    if (!VALID_ESTADOS.includes(userData.estado)) {
      console.log("Estado inválido:", userData.estado);
      return;
    }

    const payload = {
      ...userData,
      identificacion: Number(userData.identificacion),
      rol: userData.rol.trim().toLowerCase(), // Normalizar
      estado: userData.estado,
      fechaNacimiento: userData.fechaNacimiento || null, // Manejar fecha vacía
    };

    console.log("Datos enviados:", payload);

    mutate(payload, {
      onSuccess: () => {
        console.log("Usuario creado con éxito");
        onClose();
        setUserData({
          identificacion: "",
          nombre: "",
          apellidos: "",
          fechaNacimiento: "",
          telefono: "",
          correoElectronico: "",
          passwordHash: "",
          rol: "visitante",
          estado: "activo",
        });
      },
      onError: (error: any) => {
        console.error(
          "Error al crear usuario:",
          error.response?.data || error.message
        );
      },
    });
  };

  return (
    <ModalComponent
      isOpen={isOpen} // Usa la prop isOpen
      onClose={onClose}
      title="Registro de Usuario"
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
        <Input
          label="Contraseña"
          type="passwordHash"
          value={userData.passwordHash}
          onChange={(e) => handleInputChange(e, "passwordHash")}
          required
        />
        <Select
          label="Rol"
          value={userData.rol}
          onChange={(e) => handleSelectChange(e.target.value, "rol")}
          required
        >
          {VALID_ROLES.map((rol) => (
            <SelectItem key={rol}>
              {rol.charAt(0).toUpperCase() + rol.slice(1)}
            </SelectItem>
          ))}
        </Select>
      </div>
    </ModalComponent>
  );
};