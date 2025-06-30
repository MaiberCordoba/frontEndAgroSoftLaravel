import { useMutation, useQueryClient } from "@tanstack/react-query";
import { put } from "../../api/sensor";
import { Sensor } from "../../types/sensorTypes";
import { addToast } from "@heroui/react";

export const usePatchSensor = () => {
  const queryClient = useQueryClient();

  return useMutation<Sensor, Error, { id: number; data: Partial<Sensor> }>({
    mutationFn: ({ id, data }) => {
      if (data.lote_id && data.eraid) {
        throw new Error("No se puede asignar un sensor a un lote y una era al mismo tiempo.");
      }
      if (!data.lote_id && !data.era_id) {
        throw new Error("El sensor debe estar asignado a un lote o una era.");
      }
      return put(id, data);
    },
    onSuccess: (updatedSensor, variables) => {
      queryClient.setQueryData<Sensor[]>(["sensor"], (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((sensor) =>
          sensor.id === variables.id ? { ...sensor, ...updatedSensor } : sensor
        );
      });

      addToast({
        title: "Actualización exitosa",
        description: "El sensor se actualizó correctamente",
        color: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      addToast({
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar el sensor",
        color: "danger",
      });
    },
  });
};