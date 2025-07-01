export type SensorType = 
  | 'Temperatura' 
  | 'Iluminación' 
  | 'Humedad Ambiental' 
  | 'Humedad del Terreno' 
  | 'Nivel de PH' 
  | 'Viento' 
  | 'Lluvia';

export interface Sensor {
  id: number;  
  tipo_sensor: SensorType;         
  datos_sensor: number;        
  fecha: string;               
  lote_id: number | null;
  era_id: number | null;        
}

export interface SensorConExtras extends Omit<Sensor, 'tipoSensor'> {
  tipoSensor: string;
  unidad: string;              
  alerta?: boolean;            
}

export interface SensorHistorico {
  id: number;
  tipoSensor: string;    // Valor: tipo_sensor del backend
  datosSensor: number;   // Valor: datos_sensor del backend
  fecha: string;
  unidad: string;
}

export interface Umbral {
  id: number;
  sensor_id: number;
  valor_minimo: number;
  valor_maximo: number;
  tipo_sensor?: string;
}

export interface UmbralResponse extends Umbral {
  sensor?: {
    id: number;
    tipoSensor: string;
  };
}