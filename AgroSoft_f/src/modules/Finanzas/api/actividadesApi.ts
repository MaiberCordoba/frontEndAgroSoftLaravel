import apiClient from "@/api/apiClient";
import { Actividades } from "../types";

export const getActividades = async (): Promise<Actividades[]> => {
  const response = await apiClient.get("actividades");
  // Aquí está el cambio clave: accedemos a response.data.rows
  return response.data ?? []
};

export const getActividadById = async (id: number): Promise<Actividades | null> => {
  const response = await apiClient.get(`actividades/${id}`);
  return response.data ?? null;
};

export const postActividad = async (actividadesData: Partial<Actividades>): Promise<Actividades> => {
  const response = await apiClient.post("actividades", actividadesData);
  return response.data;
};

export const patchActividades = async (id: number, data: Partial<Actividades>): Promise<Actividades> => {
  const response = await apiClient.patch<Actividades>(`actividades/${id}/`, data);
  return response.data;
};

export const deleteActividades = async (id: number): Promise<Actividades> => {
  const response = await apiClient.delete<Actividades>(`actividades/${id}/`);
  return response.data
}