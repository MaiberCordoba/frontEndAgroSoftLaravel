import { useQuery } from "@tanstack/react-query";
import { getById } from "../../api/controles";
import { Controles } from "../../types";

export const useGetByIdControles = (id: number) => {
  return useQuery<Controles, Error>({
    queryKey: ["controles", id],
    queryFn: () => getById(id),
  });
};
