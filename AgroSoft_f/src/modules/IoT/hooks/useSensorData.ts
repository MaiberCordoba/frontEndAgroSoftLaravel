import { useEffect, useState } from "react";
import { Sensor } from "../types/sensorTypes";

export default function useSensorData(sensorTipo: string) {
  const [sensorData, setSensorData] = useState<Sensor | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/${sensorTipo}`);

    ws.onmessage = (event) => {
      try {
        const data: Sensor = JSON.parse(event.data);
        setSensorData(data);
      } catch (error) {
        console.error("❌ Error al recibir datos:", error);
      }
    };

    ws.onerror = () => console.warn("⚠️ WebSocket error");
    ws.onclose = () => console.warn("⚠️ WebSocket cerrado");

    return () => ws.close();
  }, [sensorTipo]);

  return sensorData;
}
