import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postAfeccionesCultivo } from "../../api/afeccionescultivo";
import { addToast } from "@heroui/toast";

export const usePostAfeccionCultivo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['crearAfeccionCultivo'],
    mutationFn: postAfeccionesCultivo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['afeccionesCultivo'] });
      addToast({
        title: 'Registro exitoso',
        description: 'Se registró la nueva afección de cultivo',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear la afección de cultivo:", error);
      addToast({
        title: 'Error',
        description: 'No se pudo registrar la afección',
        color: 'danger'
      });
    },
  });
};
