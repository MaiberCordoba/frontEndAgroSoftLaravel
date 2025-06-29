export interface User {
  id: number;
  identificacion: number;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string | undefined;
  telefono: string;
  correoElectronico: string;
  passwordHash?: string;
  estado: string;
  rol: string;
}

export interface UserFormState {
  identificacion: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string;
  correoElectronico: string;
  passwordHash: string;
  rol: string;
  estado: string;
}

export interface SensorData {
  id: number;
  name: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface TotalUsers {
  total_usuarios: number;
  usuarios_activos: string;
  usuarios_inactivos: string;
}
