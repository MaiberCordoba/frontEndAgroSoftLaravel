import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button
} from "@heroui/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

interface SensorDataPoint {
  valor: number;        // Cambiado de datosSensor a valor
  fecha: string;
  unidad: string;       // Nueva propiedad
}

export default function SensorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<SensorDataPoint[]>([]);

  // Cargar datos guardados al iniciar
  useEffect(() => {
    if (!id) return;
    
    const savedData = localStorage.getItem(`sensorData_${id}`);
    if (savedData) {
      setSensorData(JSON.parse(savedData));
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const ws = new WebSocket(`ws://localhost:8080/${id}`);

    ws.onopen = () => {
      console.log(`✅ Conectado al WebSocket del sensor: ${id}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const timestamp = new Date().toLocaleTimeString();

        const newEntry: SensorDataPoint = {
          valor: parseFloat(data.valor),  // Cambiado a 'valor'
          fecha: timestamp,
          unidad: data.unidad || ''       // Nueva propiedad
        };

        setSensorData((prev) => {
          // Mantener solo los últimos 50 puntos para no sobrecargar
          const newData = [...prev.slice(-49), newEntry];
          
          // Guardar en localStorage para persistencia
          localStorage.setItem(`sensorData_${id}`, JSON.stringify(newData));
          
          return newData;
        });
      } catch (error) {
        console.error(`❌ Error en mensaje WebSocket (${id}):`, error);
      }
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket cerrado");
    };

    return () => {
      ws.close();
    };
  }, [id]);

  return (
    <div className="p-6">
      <Button color="success" variant="light" onClick={() => navigate(-1)}>
        Regresar
      </Button>

      <h1 className="text-2xl font-bold text-center mb-4">
        Detalles del Sensor: {id}
      </h1>

      <div className="bg-white p-4 shadow-md rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Gráfica en tiempo real</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sensorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Cambiado dataKey de "valor" a "valor" */}
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke="green" 
              strokeWidth={2}
              name={id} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-4 shadow-md rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Datos recientes</h2>
        <Table aria-label="Datos del sensor" selectionMode="single">
          <TableHeader>
            <TableColumn>Tiempo</TableColumn>
            <TableColumn>Valor</TableColumn>
            <TableColumn>Unidad</TableColumn>
          </TableHeader>
          <TableBody>
            {sensorData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.fecha}</TableCell>
                <TableCell>{item.valor}</TableCell>
                <TableCell>{item.unidad}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}