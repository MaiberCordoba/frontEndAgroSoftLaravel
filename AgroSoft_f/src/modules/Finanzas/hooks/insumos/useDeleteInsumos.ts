import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Insumos } from "../../types"; // Asegúrate de tener esta interfaz en tu archivo types
import { deleteInsumos } from "../../api/insumosApi"; // Asegúrate de tener esta función en tu API
import { addToast } from "@heroui/react";

export const useDeleteInsumos = () => {
    const queryClient = useQueryClient();

    return useMutation<Insumos, Error, { id: number }, { previousInsumos?: Insumos[] }>({
        mutationFn: ({ id }) => deleteInsumos(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ['insumos'] });
            const previousInsumos = queryClient.getQueryData<Insumos[]>(['insumos']);
            queryClient.setQueryData<Insumos[]>(['insumos'], (old) =>
                old?.filter(insumo => insumo.id !== variables.id) || []
            );
            return { previousInsumos };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el insumo",
                color: "danger",
            });

            if (context?.previousInsumos) {
                console.error(error);
                queryClient.setQueryData(['insumos'], context.previousInsumos);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['insumos'] });

            addToast({
                title: "Operación exitosa",
                description: "El insumo fue eliminado correctamente",
                color: "success",
            });
        }
    });
};
