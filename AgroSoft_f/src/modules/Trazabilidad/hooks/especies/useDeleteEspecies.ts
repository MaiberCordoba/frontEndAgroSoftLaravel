import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Especies } from "../../types";
import { deleteEspecies } from "../../api/especiesApi";
import { addToast } from "@heroui/react";

export const useDeleteEspecies = () => {
    const queryClient = useQueryClient();

    return useMutation<Especies, Error, { id: number }, { previousEspecies?: Especies[] }>({
        mutationFn: ({ id }) => deleteEspecies(id),
        onMutate: async (variables) => {
            await queryClient.cancelQueries({ queryKey: ["especies"] });
            const previousEspecies = queryClient.getQueryData<Especies[]>(["especies"]);
            queryClient.setQueryData<Especies[]>(["especies"], (old) => 
                old?.filter(Especies => Especies.id !== variables.id) || []
            );
            return { previousEspecies };
        },
        onError: (error, _variables, context) => {
            addToast({
                title: "Error al eliminar",
                description: "No se pudo eliminar la especie",
                color: "danger",
            });
            
            if (context?.previousEspecies) {
                console.error(error)
                queryClient.setQueryData(["especies"], context.previousEspecies);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["especies"] });
            
            addToast({
                title: "Operación exitosa",
                description: "la especie fue eliminado correctamente",
                color: "success",
            });
        }
    });
};