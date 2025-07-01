import apiClient from "@/api/apiClient";
import { Sensor, SensorHistorico } from "../types/sensorTypes";

export const get = async (): Promise<Sensor[]> => {
  const response = await apiClient.get("sensores");
  return response.data;
};

export const post = async (data?: any): Promise<Sensor> => {
  const response = await apiClient.post<Sensor>("sensores", data);
  return response.data;
};

export const put = async (id: number, data: Partial<Sensor>): Promise<Sensor> => {
  const response = await apiClient.put<Sensor>(`sensores/${id}`, data);
  return response.data;
};

export const deleteSensor = async (id: number): Promise<Sensor> => {
  const response = await apiClient.delete<Sensor>(`sensores/${id}`);
  return response.data;
};

// Nueva función para obtener datos históricos
export const getHistorico = async (
  id: string,
  fechaInicio: string,
  fechaFin: string
): Promise<SensorHistorico[]> => {
  const response = await apiClient.get(`/sensores/${id}/historico`, {
    params: {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    }
  });

  // El backend devuelve { success: true, data: [...] }
  const responseData = response.data.data || [];
  
  // Transformar al tipo SensorHistorico
  return responseData.map((item: any) => ({
    id: item.id,
    tipoSensor: item.tipo_sensor,
    datosSensor: item.datos_sensor,
    fecha: item.fecha,
    unidad: item.unidad
  }));
};