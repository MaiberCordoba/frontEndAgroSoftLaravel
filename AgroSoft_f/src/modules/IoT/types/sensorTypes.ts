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
  tipoSensor: SensorType;         
  datosSensor: number;        
  fecha: string;               
  loteId: number | null;
  eraId: number | null;        
}

export interface SensorConExtras extends Omit<Sensor, 'tipoSensor'> {
  tipoSensor: string;
  unidad: string;              
  alerta?: boolean;            
}

export interface SensorHistorico {
  id: number;
  tipoSensor: string;
  datosSensor: number;
  fecha: string;
  unidad: string;
}

export interface Umbral {
  id: number;
  sensorId: number;
  valorMinimo: number;
  valorMaximo: number;
  tipoSensor?: string;
}

export interface UmbralResponse extends Umbral {
  sensor?: {
    id: number;
    tipoSensor: string;
  };
}