import { useState, useEffect } from "react";
import { Table } from "@heroui/react";

interface SensorData {
  tipo_sensor: string;
  valor: number;
  timestamp?: string;
}

interface SensorTableProps {
  sensorId: string;
}

const SensorTable = ({ sensorId }: SensorTableProps) => {
  const [data, setData] = useState<SensorData[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onopen = () => console.log(`✅ WebSocket conectado para tabla de ${sensorId}`);

    ws.onmessage = (event) => {
      try {
        const sensorData = JSON.parse(event.data);

        if (sensorData.tipo_sensor === sensorId) {
          const newData = {
            ...sensorData,
            timestamp: new Date().toISOString(),
          };

          setData((prevData) => [newData, ...prevData.slice(0, 9)]); // Mostrar solo los últimos 10
        }
      } catch (error) {
        console.error("❌ Error al procesar mensaje:", error);
      }
    };

    ws.onclose = () => console.warn("⚠️ WebSocket cerrado");

    return () => {
      ws.close();
    };
  }, [sensorId]);

  return (
    <Table className="mt-6 w-full text-center text-sm">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d, index) => (
          <tr key={index}>
            <td>{new Date(d.timestamp || "").toLocaleDateString()}</td>
            <td>{new Date(d.timestamp || "").toLocaleTimeString()}</td>
            <td>{d.valor}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default SensorTable;
