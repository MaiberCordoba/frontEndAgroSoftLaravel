import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToast } from "@heroui/react";
import { User } from "../types";
import { updateUser } from "../api/usersApi";

interface UpdateUserResponse {
  msg: string; // Respuesta real del backend
}

export const usePatchUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateUserResponse, // Tipo de retorno correcto
    Error,
    { id: number; data: Partial<User> }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: (response, variables) => {
      console.log("Respuesta del backend:", response);
      // Actualiza la caché con los datos enviados
      queryClient.setQueryData<User[]>(["users"], (oldData) => {
        if (!oldData) {
          console.log("No hay datos en caché, invalidando consulta");
          queryClient.invalidateQueries({ queryKey: ["users"] });
          return oldData;
        }
        return oldData.map((user) =>
          user.identificacion === variables.id
            ? { ...user, ...variables.data }
            : user
        );
      });

      // Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El usuario se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error("Error actualizando usuario:", error.message);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el usuario",
        color: "danger",
      });
    },
  });
};
