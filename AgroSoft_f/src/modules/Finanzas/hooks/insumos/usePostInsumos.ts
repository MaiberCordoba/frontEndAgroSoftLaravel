import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postInsumo } from "../../api/insumosApi"; // Asegúrate de tener esta función en tu API
import { Insumos } from "../../types"; // Asegúrate de que el tipo exista en tu types.ts
import { addToast } from "@heroui/toast";

export const usePostInsumos = () => {
  const queryClient = useQueryClient();

  return useMutation<Insumos, Error, Insumos>({
    mutationKey: ['crearInsumo'],
    mutationFn: postInsumo,
    onSuccess: (data) => {
      console.log("Insumo creado con éxito:", data);

      // Invalida la query para que se refresquen los datos
      queryClient.invalidateQueries({ queryKey: ['insumos'] });

      addToast({
        title: 'Creación exitosa',
        description: 'Insumo registrado con éxito',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error al crear el insumo:", error);
      addToast({
        title: 'Error al crear el insumo',
        description: 'No fue posible registrar el nuevo insumo',
        color: 'danger'
      });
    },
  });
};
