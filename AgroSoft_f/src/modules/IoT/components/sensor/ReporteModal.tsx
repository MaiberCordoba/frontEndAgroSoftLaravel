import { useState, useEffect } from "react";
import { Button, Input, Checkbox } from "@heroui/react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { get as getSensores, getHistorico } from "../../api/sensor"; 
import { Sensor, SensorHistorico } from "../../types/sensorTypes";
import html2canvas from "html2canvas";
import Chart from "chart.js/auto";

interface ReporteModalProps {
  onClose: () => void;
}

export default function ReporteModal({ onClose }: ReporteModalProps) {
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [sensoresSeleccionados, setSensoresSeleccionados] = useState<number[]>([]);
  const [datosReporte, setDatosReporte] = useState<Record<number, SensorHistorico[]>>({});
  const [cargando, setCargando] = useState<boolean>(false);
  const [generandoPDF, setGenerandoPDF] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);

  // Obtener lista de sensores disponibles
  useEffect(() => {
    const obtenerSensores = async () => {
      try {
        const data = await getSensores();
        setSensores(data);
      } catch (err) {
        console.error("Error obteniendo sensores:", err);
        setError("Error al cargar la lista de sensores");
      }
    };

    obtenerSensores();
  }, []);

  // Manejar selección de sensores
  const toggleSensor = (sensorId: number) => {
    setSensoresSeleccionados(prev => 
      prev.includes(sensorId) 
        ? prev.filter(id => id !== sensorId) 
        : [...prev, sensorId]
    );
  };

  // Obtener datos para el reporte
  const obtenerDatosReporte = async () => {
    if (!fechaInicio || !fechaFin) {
      setError("Debe seleccionar ambas fechas");
      return;
    }

    if (sensoresSeleccionados.length === 0) {
      setError("Debe seleccionar al menos un sensor");
      return;
    }

    setCargando(true);
    setError("");
    setPreviewVisible(false);
    
    try {
      const datos: Record<number, SensorHistorico[]> = {};
      
      // Obtener datos para cada sensor en paralelo
      const promesas = sensoresSeleccionados.map(async sensorId => {
        const data = await getHistorico(sensorId, fechaInicio, fechaFin);
        datos[sensorId] = data;
      });
      
      await Promise.all(promesas);
      setDatosReporte(datos);
      setPreviewVisible(true);
    } catch (err) {
      console.error("Error obteniendo datos:", err);
      setError("Error al obtener los datos del sensor");
    } finally {
      setCargando(false);
    }
  };

  // Generar PDF - Versión optimizada
  const generarPDF = async () => {
    if (Object.keys(datosReporte).length === 0) {
      setError("Primero debe obtener los datos");
      return;
    }

    setGenerandoPDF(true);
    setError("");
    
    try {
      const doc = new jsPDF();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;
      
      // Título
      doc.setFontSize(18);
      doc.text("Reporte de Sensores", 105, yPosition, { align: "center" });
      yPosition += 10;
      
      // Rango de fechas
      doc.setFontSize(12);
      doc.text(`Desde: ${fechaInicio} - Hasta: ${fechaFin}`, 105, yPosition, { align: "center" });
      yPosition += 15;
      
      // Para cada sensor
      for (const [sensorId, datos] of Object.entries(datosReporte)) {
        const id = parseInt(sensorId);
        const sensor = sensores.find(s => s.id === id);
        if (!sensor) continue;
        
        // Verificar espacio para el encabezado
        if (yPosition > pageHeight - 100) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Encabezado del sensor
        doc.setFontSize(14);
        doc.text(`Sensor: ${sensor.tipoSensor} (ID: ${id})`, margin, yPosition);
        yPosition += 10;
        
        // Crear gráfica temporal
        const chartContainer = document.createElement("div");
        chartContainer.style.width = "800px";
        chartContainer.style.height = "400px";
        chartContainer.style.position = "absolute";
        chartContainer.style.left = "-10000px";
        chartContainer.style.top = "0";
        document.body.appendChild(chartContainer);
        
        // Renderizar gráfica con Chart.js
        const canvas = document.createElement("canvas");
        chartContainer.appendChild(canvas);
        
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("No se pudo crear contexto de canvas");
        }
        
        new Chart(ctx, {
          type: "line",
          data: {
            labels: datos.map(d => new Date(d.fecha).toLocaleDateString()),
            datasets: [{
              label: "Valor",
              data: datos.map(d => d.datosSensor),
              borderColor: "#8884d8",
              backgroundColor: "rgba(136, 132, 216, 0.1)",
              tension: 0.4,
              pointRadius: 3
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            scales: {
              y: {
                beginAtZero: false
              }
            }
          }
        });
        
        // Convertir a imagen
        await new Promise(resolve => setTimeout(resolve, 500));
        const image = await html2canvas(chartContainer, {
          scale: 1.5, // Mejor calidad
          useCORS: true
        });
        const imgData = image.toDataURL("image/png");
        const imgProps = doc.getImageProperties(imgData);
        const pdfWidth = doc.internal.pageSize.getWidth() - margin * 2;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        // Verificar espacio para la imagen
        if (yPosition + pdfHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Agregar imagen al PDF
        doc.addImage(imgData, "PNG", margin, yPosition, pdfWidth, pdfHeight);
        yPosition += pdfHeight + 10;
        
        // Limpiar
        document.body.removeChild(chartContainer);
        
        // Verificar espacio para la tabla
        if (yPosition > pageHeight - 100) {
          doc.addPage();
          yPosition = margin;
        }
        
        // Tabla de datos
        const tableData = datos.map((dato, index) => [
          index + 1,
          new Date(dato.fecha).toLocaleString(),
          dato.datosSensor,
          dato.unidad || ""
        ]);
        
        autoTable(doc, {
          head: [["#", "Fecha", "Valor", "Unidad"]],
          body: tableData,
          startY: yPosition,
          margin: { horizontal: margin },
          styles: { fontSize: 9, cellPadding: 3 },
          theme: 'grid'
        });
        
        // Actualizar posición Y después de la tabla
        yPosition = (doc as any).lastAutoTable.finalY + 10;
      }
      
      // Guardar PDF
      doc.save(`reporte-sensores_${new Date().toISOString().slice(0, 10)}.pdf`);
    } catch (err) {
      console.error("Error generando PDF:", err);
      setError("Error al generar el PDF: " + (err as Error).message);
    } finally {
      setGenerandoPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Generar Reporte de Sensores</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-700 text-2xl"
          aria-label="Cerrar modal"
        >
          &times;
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Selector de fechas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Fecha Inicio</label>
            <Input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              fullWidth
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Fecha Fin</label>
            <Input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              fullWidth
            />
          </div>
        </div>

        {/* Lista de sensores */}
        <div>
          <label className="block mb-2 text-sm font-medium">Sensores</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-2 border rounded">
            {sensores.map(sensor => (
              <div key={sensor.id} className="flex items-center">
                <Checkbox
                  id={`sensor-${sensor.id}`}
                  checked={sensoresSeleccionados.includes(sensor.id)}
                  onChange={() => toggleSensor(sensor.id)}
                />
                <label 
                  htmlFor={`sensor-${sensor.id}`} 
                  className="ml-2 text-sm cursor-pointer"
                >
                  {sensor.tipoSensor} (ID: {sensor.id})
                </label>
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-center">
            {error}
          </div>
        )}

        {/* Previsualización */}
        {previewVisible && Object.keys(datosReporte).length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Vista Previa</h3>
            <div className="space-y-8">
              {Object.entries(datosReporte).map(([sensorId, datos]) => {
                const id = parseInt(sensorId);
                const sensor = sensores.find(s => s.id === id);
                return (
                  <div key={sensorId} className="bg-gray-50 p-4 rounded">
                    <h4 className="font-medium mb-2">
                      {sensor?.tipoSensor} (ID: {id})
                    </h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={datos}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="fecha" 
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                          />
                          <YAxis domain={['auto', 'auto']} />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleString()}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="datosSensor" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="h-4" />
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            variant="flat" 
            color="default" 
            onClick={onClose}
            disabled={cargando || generandoPDF}
          >
            Cancelar
          </Button>
          
          <Button 
            color="primary" 
            onClick={obtenerDatosReporte}
            loading={cargando}
            disabled={generandoPDF}
          >
            Obtener Datos
          </Button>
          
          <Button 
            color="success" 
            onClick={generarPDF}
            loading={generandoPDF}
            disabled={Object.keys(datosReporte).length === 0 || cargando}
          >
            Generar PDF
          </Button>
        </div>
      </div>
    </div>
  );
}