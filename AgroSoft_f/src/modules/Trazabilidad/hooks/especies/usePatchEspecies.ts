import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchEspecies } from '../../api/especiesApi';
import { Especies } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchEspecies = () => {
  const queryClient = useQueryClient();

  return useMutation<Especies, Error, { id: number; data: Partial<Especies> }>({
    mutationFn: ({ id, data }) => patchEspecies(id, data),
    onSuccess: () => {
      // 🔁 Invalida la cache para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['especies'] });

      // ✅ Mensaje de éxito
      addToast({
        title: "Actualización exitosa",
        description: "La especie se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la especie",
        color: "danger",
      });
    }
  });
};
