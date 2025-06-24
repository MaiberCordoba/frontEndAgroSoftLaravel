//Creacion de los tipos de datos
import { Cultivos, Lotes } from "../Trazabilidad/types"
import { User } from "../Users/types"

export interface Actividades {
    id : number,
    fkCultivos?: number,
    cultivo?: Cultivos,
    fkUsuarios? : number,
    usuario? : User,
    titulo : string,
    descripcion : string,
    fecha : string,
    estado : "Asignada" | "Completada" | "Cancelada"
}

export interface UsosHerramientas {
    id : number,
    fkHerramientas? : number,
    herramienta?: Herramientas,
    fkActividades? : number,
    actividad? : Actividades
}

export interface Herramientas {
    id : number,
    fkLotes?: number,
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
    fkInsumos? : number,
    insumo? : Insumos ,
    fkActividades? : number,
    actividad? : Actividades,
    cantidadProducto : number
}

export interface Cosechas {
    id : number,
    fkCultivos? : number,
    cultivo? : Cultivos,
    unidades : number,
    fecha : string
}

export interface Ventas {
    id : number,
    fkCosechas? : number,
    cosecha? : Cosechas,
    precioUnitario : number,
    fecha : string
}
export interface Desechos {
    id : number,
    fkCultivos? : number,
    cultivo? : Cultivos,
    fkTiposDesecho? : number,
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