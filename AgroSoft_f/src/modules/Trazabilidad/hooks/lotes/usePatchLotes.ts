import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchLotes } from '../../api/lotesApi';
import { Lotes } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchLotes = () => {
  const queryClient = useQueryClient();

  return useMutation<Lotes, Error, { id: number; data: Partial<Lotes> }>({
    mutationFn: ({ id, data }) => patchLotes(id, data),
    onSuccess: () => {
      // 🔁 Invalida la cache para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['lotes'] });

      // ✅ Mensaje de éxito
      addToast({
        title: "Actualización exitosa",
        description: "El lote se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el lote",
        color: "danger",
      });
    }
  });
};
