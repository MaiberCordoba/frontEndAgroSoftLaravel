import apiClient from "@/api/apiClient";
import { UsosProductos } from "../types";

export const getUsosProductos = async (): Promise<UsosProductos[]> => {
  const response = await apiClient.get("usosProductos/")
  return response.data ?? []
}

export const postUsoProducto = async (UsosProductosData: Partial<UsosProductos>): Promise<UsosProductos> => {
  const response = await apiClient.post("usosProductos/", UsosProductosData);
  return response.data
};

export const patchUsosProductos = async ( id: number, data: Partial<UsosProductos>): Promise<UsosProductos> => {

    const response = await apiClient.patch<UsosProductos>(`usosProductos/${id}/`, data);
    return response.data;
  };

  export const deleteUsosProductos = async (id: number): Promise<UsosProductos> => {
    const response = await apiClient.delete<UsosProductos>(`usosProductos/${id}/`);
    return response.data
}