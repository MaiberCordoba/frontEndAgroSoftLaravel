import { useQuery } from "@tanstack/react-query";
import { getEras } from "../../api/erasApi";
import { Eras } from "../../types";

export const useGetEras = () => {
  return useQuery<Eras[], Error>({
    queryKey: ["eras"], 
    queryFn: getEras, 
  });
};

