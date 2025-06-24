export interface TiposEspecie {
  id: number;
  nombre: string;
  descripcion: string;
  img: string | null;
}

export interface Especies {
  id: number;
  nombre: string;
  descripcion: string;
  img?: string;
  tiempoCrecimiento: number;
  TiposEspecie?: TiposEspecie;
  fk_TiposEspecie?: number;
  tipo_especie_nombre?: string | null;
}

// Si usás TypeScript, creá este tipo en tu archivo de tipos:
export type NuevaEspecie = Omit<Especies, "id">;

export interface Semilleros {
  id: number;
  unidades: number;
  fechaSiembra: string;
  fechaEstimada: string;
  Especies?: Especies;
  fk_Especies: number;
}

export interface Cultivos {
  id?: number;
  nombre: string;
  unidades: number;
  activo: boolean;
  fechaSiembra: string;
  Especies?: Especies;
  fk_Especies: number;
}

export interface Lotes {
  id?: number;
  nombre: string;
  descripcion: string;
  tamX: number;
  tamY: number;
  estado: boolean;
  posX: number;
  posY: number;
}

export interface Eras {
  id?: number;
  tamX: number;
  tamY: number;
  posX: number;
  posY: number;
  estado: boolean;
  Lotes?: Lotes;
  fk_Lotes: number;
}

export interface Plantaciones {
  id: number;
  cultivos?: Cultivos;
  fk_Cultivos: number;
  Eras?: Eras;
  fk_Eras: number;
}
