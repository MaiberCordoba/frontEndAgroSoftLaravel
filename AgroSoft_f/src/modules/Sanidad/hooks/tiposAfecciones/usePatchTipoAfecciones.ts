import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchTipoAfecciones } from '../../api/tipoAfecciones';
import { TiposAfecciones } from '../../types';
import { addToast } from "@heroui/react";

export const usePatchTipoAfecciones = () => {
  const queryClient = useQueryClient();

  return useMutation<TiposAfecciones, Error, { id: number; data: Partial<TiposAfecciones> }>({
    mutationFn: ({ id, data }) => patchTipoAfecciones(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['TiposAfecciones'] });

      addToast({
        title: "Actualización exitosa",
        description: "El tipo de afección se actualizó correctamente",
        color: "success",
      });
    },
    onError: () => {
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el tipo de afección",
        color: "danger",
      });
    }
  });
};
