export const connectWebSocket = (
  sensorTipo: string,
  onMessage: (data: any) => void
) => {
  const socket = new WebSocket(`ws://localhost:8080/${sensorTipo}`);

  socket.onopen = () => console.log(`✅ WebSocket conectado a ${sensorTipo}`);

  socket.onmessage = (event) => {
    try {
      const newData = JSON.parse(event.data);
      onMessage(newData);
    } catch (error) {
      console.error("❌ Error al parsear JSON del WebSocket:", error);
    }
  };

  socket.onerror = (error) => {
    console.error(`❌ Error en WebSocket de ${sensorTipo}:`, error);
  };

  socket.onclose = () => {
    console.warn(`⚠️ WebSocket de ${sensorTipo} cerrado, reintentando...`);
    setTimeout(() => connectWebSocket(sensorTipo, onMessage), 5000);
  };

  return socket;
};
