import apiClient from "@/api/apiClient";
import { Afecciones } from "../types";

export const getAfecciones = async ():Promise<Afecciones[]> => {
    const response = await apiClient.get("plaga/");
    return response.data
};

export const postAfecciones = async (data?:any):Promise<Afecciones> => {
    const response = await apiClient.post<Afecciones>('plaga/',data);
    return response.data
}

export const patchAfecciones = async ( id: number, data: Partial<Afecciones>): Promise<Afecciones> => {
    const response = await apiClient.put<Afecciones>(`plaga/${id}`, data);
    return response.data;
  };


export const deleteAfecciones = async (id: number): Promise<Afecciones> => {
    const response = await apiClient.delete<Afecciones>(`plaga/${id}/`);
    return response.data
}