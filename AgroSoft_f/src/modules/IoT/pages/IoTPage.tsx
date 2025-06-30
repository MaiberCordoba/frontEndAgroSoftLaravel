import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@heroui/react";
import {
  WiStrongWind,
  WiThermometer,
  WiDayCloudy,
  WiRaindrop,
  WiHumidity,
  WiRain,
} from "react-icons/wi";
import SensorCard from "../components/SensorCard";
import { SensorLista } from "../components/sensor/SensorListar";
import { UmbralLista } from "../components/umbral/UmbralListar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Umbral } from "../types/sensorTypes";
import ReporteModal from "../components/sensor/ReporteModal";
import apiClient from "@/api/apiClient";

export default function IoTPages() {
  const navigate = useNavigate();
  const [isReporteModalOpen, setIsReporteModalOpen] = useState(false);

  const [sensoresData, setSensoresData] = useState<Record<string, string>>({
    viento: "Cargando...",
    temperatura: "Cargando...",
    Iluminación: "Cargando...",
    humedad: "Cargando...",
    humedadAmbiente: "Cargando...",
    lluvia: "Cargando...",
  });

  const [searchId, setSearchId] = useState("");

  const { data: umbrales = [] } = useQuery<Umbral[]>({
    queryKey: ["umbrales"],
    queryFn: async () => {
      const res = await apiClient.get("umbral");
      return res.data;
    },
  });

  const normalizar = (str: string) => str.toLowerCase().replace(/\s/g, "");

  const mostrarAlerta = (mensaje: string) => {
    // Esta función parece no estar implementada correctamente
    // addToast no es una función importada directamente, debería ser un hook
    console.warn("Alerta de sensor:", mensaje);
    // Implementación alternativa:
    alert(`🚨 Alerta de Sensor: ${mensaje}`);
  };

  useEffect(() => {
    if (umbrales.length === 0) return;

    const sensores = [
      "viento",
      "temperatura",
      "Iluminación",
      "humedad",
      "humedadAmbiente",
      "lluvia",
    ];
    const websockets = new Map<string, WebSocket>();

    sensores.forEach((sensor) => {
      const ws = new WebSocket(`ws://localhost:8080/${sensor}`);

      ws.onopen = () => {
        console.log(`✅ Conectado al WebSocket de ${sensor}`);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const valor = parseFloat(data.valor);

          setSensoresData((prevData) => ({
            ...prevData,
            [sensor]: valor.toFixed(2),
          }));

          const umbral = umbrales.find((u) =>
            u.tipo_sensor && normalizar(u.tipo_sensor) === normalizar(sensor)
          );

          if (umbral) {
            if (valor < umbral.valor_minimo || valor > umbral.valor_maximo) {
              mostrarAlerta(
                `${sensor.toUpperCase()} fuera de umbral.\nValor actual: ${valor}\nRango permitido: ${umbral.valor_minimo} - ${umbral.valor_maximo}`
              );
            }
          }
        } catch (error) {
          console.error(`❌ Error en ${sensor}:`, error);
        }
      };

      ws.onerror = (error) => {
        console.error(`❌ WebSocket error en ${sensor}:`, error);
      };

      ws.onclose = () => {
        console.warn(`⚠️ WebSocket cerrado en ${sensor}`);
      };

      websockets.set(sensor, ws);
    });

    return () => {
      websockets.forEach((ws) => ws.close());
    };
  }, [umbrales]);

  const sensoresList = [
    { id: "viento", title: "Viento", icon: <WiStrongWind size={32} style={{ color: "#5DADE2" }}/> },
    { id: "temperatura", title: "Temperatura", icon: <WiThermometer size={32} style={{ color: "#E74C3C" }} /> },
    { id: "Iluminación", title: "Luz Solar", icon: <WiDayCloudy size={32} style={{ color: "#F1C40F" }} /> },
    { id: "humedad", title: "Humedad", icon: <WiRaindrop size={32} style={{ color: "#3498DB" }} /> },
    { id: "humedadAmbiente", title: "H. Ambiente", icon: <WiHumidity size={32} style={{ color: "#76D7C4" }} /> },
    { id: "lluvia", title: "Lluvia", icon: <WiRain size={32} style={{ color: "#2980B9" }} /> },
  ];

  const sensoresFiltrados = sensoresList.filter((sensor) =>
    sensor.title.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 sm:gap-12 justify-center items-center w-full max-w-6xl mx-auto">
        <div className="flex gap-4 items-center w-full mb-8">
          <div className="flex-1 min-w-[200px] max-w-sm">
            <Input
              placeholder="Filtrar Sensores..."
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              fullWidth
            />
          </div>
          
          <Button 
            onClick={() => setIsReporteModalOpen(true)}
            color="success" variant="light"
            className="px-8 py-3 text-lg whitespace-nowrap"
          >
            Generar Reporte
          </Button>
        </div>
        <div className="h-8" />
        <div className="grid grid-cols-3 flex flex-wrap gap-4 justify-center items-center w-full max-w-6xl mx-auto col-span-full">
          {sensoresFiltrados.length > 0 ? (
            sensoresFiltrados.map((sensor) => (
              <SensorCard
                key={sensor.id}
                icon={sensor.icon}
                title={sensor.title}
                value={sensoresData[sensor.id] ?? "Cargando..."}
                onClick={() => navigate(`/sensores/${sensor.id}`)}
              />
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No se encontraron sensores</p>
          )}
        </div>
        <div className="h-8" />
        <div className="mt-12 text-center col-span-full">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Lista de sensores</h2>
          <SensorLista />
        </div>
        <div className="h-8" />
        <div className="mt-12 text-center col-span-full">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">Umbrales de los sensores</h2>
          <UmbralLista />
        </div>
      </div>
      
      {/* Modal personalizado para el reporte */}
      {isReporteModalOpen && (
        <div className="reporte-modal-overlay">
          <div className="reporte-modal-container">
            <ReporteModal 
              onClose={() => setIsReporteModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}