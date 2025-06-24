import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Lotes } from "../../types";
import { deleteLotes } from "../../api/lotesApi";
import { addToast } from "@heroui/react";

export const useDeleteLotes = () => {
    const queryClient = useQueryClient();

    return useMutation<Lotes, Error, { id: number }, { previousLotes?: Lotes[] }>({
        mutationFn: ({ id }) => deleteLotes(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["lotes"] });
            const previousLotes = queryClient.getQueryData<Lotes[]>(["lotes"]);
            queryClient.setQueryData<Lotes[]>(["lotes"], (old) => 
                old?.filter(Lotes => Lotes.id !== variables.id) || []
            );
            return { previousLotes };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar el lote",
                color: "danger",
            });
            
            if (context?.previousLotes) {
                console.error(error)
                queryClient.setQueryData(["lotes"], context.previousLotes);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lotes"] });
            
            addToast({
                title: "Operación exitosa",
                description: "el lote fue eliminado correctamente",
                color: "success",
            });
        }
    });
};