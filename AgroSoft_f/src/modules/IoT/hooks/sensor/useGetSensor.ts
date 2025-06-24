import { useQuery } from "@tanstack/react-query";
import { get } from "../../api/sensor";
import { Sensor } from "../../types/sensorTypes";

export const useGetSensor = () => {
  return useQuery<Sensor[], Error>({
    queryKey: ["sensor"],
    queryFn: get,
  });
};
