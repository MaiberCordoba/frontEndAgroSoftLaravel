//Creacion de los tipos de datos
import { Cultivos, Lotes } from "../Trazabilidad/types"
import { User } from "../Users/types"

export interface Actividades {
    id : number,
    fk_Cultivos?: number,
    cultivo?: Cultivos,
    fk_Usuarios? : number,
    usuario? : User,
    titulo : string,
    descripcion : string,
    fecha : string,
    estado : "Asignada" | "Completada" | "Cancelada"
}

export interface UsosHerramientas {
    id : number,
    fk_Herramientas? : number,
    herramienta?: Herramientas,
    fk_Actividades? : number,
    actividad? : Actividades
}

export interface Herramientas {
    id : number,
    fk_Lotes?: number,
    lote? : Lotes ,
    nombre : string,
    descripcion : string,
    unidades : number
}

export interface Insumos {
    id : number,
    nombre : string,
    descripcion : string,
    precio : number,
    unidades : number
}
export interface UsosProductos {
    id : number,
    fk_Insumos? : number,
    insumo? : Insumos ,
    fk_Actividades? : number,
    actividad? : Actividades,
    cantidadProducto : number
}

export interface Cosechas {
    id : number,
    fk_Cultivos? : number,
    cultivo? : Cultivos,
    unidades : number,
    fecha : string
}

export interface Ventas {
    id : number,
    fk_Cosechas? : number,
    cosecha? : Cosechas,
    precioUnitario : number,
    fecha : string
}
export interface Desechos {
    id : number,
    fk_Cultivos? : number,
    cultivo? : Cultivos,
    fk_TiposDesecho? : number,
    tipoDesecho? : TiposDesechos,
    nombre : string,
    descripcion : string
}

export interface TiposDesechos {
    id : number,
    nombre : string,
    descripcion : string
}

export type ReporteVentas = {
    Producto: string;
    Cantidad: number;
    PrecioProducto: number;
    PrecioFinal: number;
    FechaVenta: string;
  };