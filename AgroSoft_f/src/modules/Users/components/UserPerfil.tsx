import React, { useState, useEffect } from "react";
import { Input, Button } from "@heroui/react";
import ModalComponent from "@/components/Modal";
import { useAuth } from "@/hooks/UseAuth";
import apiClient from "@/api/apiClient";
import { addToast } from "@heroui/react";
import { User } from "../types";

interface EditarPerfilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: () => void;
}

const EditarPerfilModal: React.FC<EditarPerfilModalProps> = ({
  isOpen,
  onClose,
  onUpdateSuccess,
}) => {
  const { user: authUser, login, token } = useAuth();

  const [userData, setUserData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    identificacion: "",
    telefono: "",
    password: "",
  });
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (authUser && isOpen) {
      setUserData({
        nombre: authUser.nombre || "",
        apellidos: authUser.apellidos || "",
        email: authUser.email || "",
        identificacion: authUser.identificacion?.toString() || "",
        telefono: authUser.telefono || "",
        password: "",
      });
    }
  }, [authUser, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof typeof userData
  ) => {
    setUserData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!authUser?.identificacion || !token) {
      addToast({
        title: "Error",
        description: "No se pudo identificar al usuario",
        color: "danger",
      });
      return;
    }

    const changedData: Partial<User> = {};

    // Campos normales (excluyendo password)
    Object.keys(userData).forEach((key) => {
      if (key === "password") return;

      const userKey = key as keyof User;
      const currentValue = userData[key as keyof typeof userData];
      const originalValue = authUser[userKey]?.toString() || "";

      if (currentValue !== originalValue) {
        changedData[userKey] = currentValue;
      }
    });

    // Manejo especial para password: solo si no está vacío
    if (userData.password !== "") {
      changedData.password = userData.password;
    }

    if (Object.keys(changedData).length === 0) {
      addToast({
        title: "Sin cambios",
        description: "No se detectaron cambios para guardar",
        color: "default",
      });
      onClose();
      return;
    }

    setIsPending(true);
    try {
      await apiClient.patch(`/users/${authUser.identificacion}`, changedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refrescar los datos del usuario usando getUser
      const userData = await apiClient.get("/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedUser = userData.data.user || userData.data;

      // Actualizar el contexto con login
      await login(token); // login recarga el usuario usando getUser

      addToast({
        title: "¡Perfil actualizado!",
        description: "Tus cambios se guardaron correctamente",
        color: "success",
      });
      onUpdateSuccess();
      onClose();
    } catch (error) {
      addToast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        color: "danger",
      });
      console.error("Error updating user:", error);
    } finally {
      setIsPending(false);
    }
  };

  if (!authUser) return null;

  return (
    <ModalComponent
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Mi Perfil"
      footerButtons={[
        {
          label: isPending ? "Guardando..." : "Guardar Cambios",
          color: "success",
          variant: "solid",
          onClick: handleSubmit,
        },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Identificación"
          type="text"
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
          required
        />
        <Input
          label="Correo Electrónico"
          type="email"
          value={userData.email}
          onChange={(e) => handleInputChange(e, "email")}
          required
        />
        <Input
          label="Contraseña"
          type="password"
          value={userData.password}
          onChange={(e) => handleInputChange(e, "password")}
        />
        <Input
          label="Teléfono"
          type="tel"
          value={userData.telefono}
          onChange={(e) => handleInputChange(e, "telefono")}
        />
      </div>
    </ModalComponent>
  );
};

export default EditarPerfilModal;
