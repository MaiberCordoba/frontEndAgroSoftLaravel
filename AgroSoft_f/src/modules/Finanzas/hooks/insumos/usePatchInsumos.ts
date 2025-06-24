import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchInsumos } from '../../api/insumosApi'; // asegúrate de tener esta función en tu API
import { Insumos } from '../../types'; // asegúrate de tener este tipo definido
import { addToast } from "@heroui/toast";

export const usePatchInsumos = () => {
  const queryClient = useQueryClient();

  return useMutation<Insumos, Error, { id: number; data: Partial<Insumos> }>({
    mutationFn: ({ id, data }) => patchInsumos(id, data),
    onSuccess: (updatedInsumo, variables) => {
      queryClient.setQueryData<Insumos[]>(['insumos'], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((insumo) =>
          insumo.id === variables.id ? { ...insumo, ...updatedInsumo } : insumo
        );
      });

      addToast({
        title: "Actualización exitosa",
        description: "El insumo se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: "No se pudo actualizar el insumo",
        color: "danger",
      });
    }
  });
};
