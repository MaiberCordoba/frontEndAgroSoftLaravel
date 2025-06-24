import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postEspecies } from "../../api/especiesApi";
import { NuevaEspecie } from "../../types";

export const usePostEspecies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nuevaEspecie: NuevaEspecie) => postEspecies(nuevaEspecie),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["especies"] });
    },
    onError: (err) => {
      console.error(err);
    },
  });
};
