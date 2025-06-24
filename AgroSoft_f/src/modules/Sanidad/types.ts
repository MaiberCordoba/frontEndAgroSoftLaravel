import { Plantaciones } from "../Trazabilidad/types";

export interface TiposAfecciones {
  id: number;
  nombre: string;
  descripcion: string;
  img?: string;
}

export interface Afecciones {
  id: number;
  nombre: string;
  descripcion: string;
  img?: string;
  fk_Tipo: number;
  tiposPlaga: {
    id: number;
    nombre: string;
    descripcion: string;
    img?: string;
  };
}

export interface TipoControl {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface ProductosControl {
  id: number;
  nombre: string;
  precio: number;
  compuestoActivo: string;
  fichaTecnica: string;
  contenido: number;
  tipoContenido: string;
  unidades: number;
}

export interface UsoProductosControl {
  id: number;
  fk_ProductoControl?: number;
  fk_Control?: number;
  cantidadProducto: number;
}

export interface Controles {
  id: number;
  fechaControl: string;
  descripcion: string;
  afecciones: AfeccionesCultivo;
  fk_Afeccion: number;
  fk_Afecciones: {
    id: 20;
    fechaEncuentro: "2025-04-08T05:00:00.000Z";
    estado: "EnControl";
    fk_Plagas: {
      idPlaga: 20;
      nombre: "Mosca blanca";
    };
  };
  fk_TipoControl: number;
  tiposControl: TipoControl;
}

export enum EstadoAfeccion {
  Detectado = "SinTratamiento",
  EnTratamiento = "EnControl",
  Erradicado = "Eliminado",
}

export interface AfeccionesCultivo {
  id: number;
  fkPlantaciones: number;
  plagas: Afecciones;
  plantaciones: Plantaciones;
  fkPlagas: number;
  fechaEncuentro: string;
  estado: EstadoAfeccion;
}
