import { useQuery } from "@tanstack/react-query";
import { getActividadById } from "../../api/actividadesApi";
import { Actividades } from "../../types";

export const useGetActividadById = (id: number) => {
  return useQuery<Actividades | null, Error>({
    queryKey: ["actividad", id],
    queryFn: () => getActividadById(id),
    enabled: !!id, // evita ejecutar la query si id es 0, null o undefined
  });
};
