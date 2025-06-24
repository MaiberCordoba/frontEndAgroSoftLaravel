import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchEras } from '../../api/erasApi';
import { Eras } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchEras = () => {
  const queryClient = useQueryClient();

  return useMutation<Eras, Error, { id: number; data: Partial<Eras> }>({
    mutationFn: ({ id, data }) => patchEras(id, data),
    onSuccess: () => {
      // 🔁 Invalida la caché de eras para forzar recarga y obtener datos actualizados
      queryClient.invalidateQueries({ queryKey: ['eras'] });

      // ✅ Toast de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La era se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la era",
        color: "danger",
      });
    }
  });
};
