import apiClient from "@/api/apiClient";
import { Umbral } from "../types/sensorTypes";

export const getUmbrales = async (): Promise<Umbral[]> => {
  const response = await apiClient.get("umbral");
  return response.data;
};

export const postUmbral = async ({
  sensorId,
  valorMinimo,
  valorMaximo,
}: Umbral): Promise<Umbral> => {
  const response = await apiClient.post(`umbral/${sensorId}`, {
    valor_minimo: valorMinimo,
    valor_maximo: valorMaximo,
  });
  return response.data;
};

export const putUmbral = async (id: number, data: Partial<Umbral>): Promise<Umbral> => {
  const response = await apiClient.put(`umbral/${id}`, data);
  return response.data;
};

export const deleteUmbral = async (id: number): Promise<Umbral> => {
  const response = await apiClient.delete(`umbral/${id}`);
  return response.data;
};
