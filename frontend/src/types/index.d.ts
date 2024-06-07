import { ApiRutas, Filtro, Method, Pedido_Estado, Personal_Rol, Rol } from "../const";

export type SesionContextValue = {
  sesion: Usuario | null;
};

export type Usuario = {
  token: string;
  rol: Rol;
  rango?: Personal_Rol;
};

//Api Esccuela
export type Escuela = {
  Nombre: string;
  IdEscuela: number;
};
//Error Api

export type responseError = {
  error: string;
  codeError : string
  status: number
};
//Api Sesion
export interface Alumno {
  Nombres: string;
  NoControl: number;
  Contrase_a: string;
  IdEscuela: number;
}

export type Personal = {
  Nombres: string;
  Contrase_a: string;
  IdEscuela: number;
  ContraseñaEscuela: string;
};

export type IniciarSesion = {
  Contraseña: string;
  NoControl?: number;
  IdEscuela: number;
  Nombres?: string;
  Rol: Rol | null;
};

export type Sesion = {
  token: string;
  rango?: Personal_Rol;
};

//Api Alumno

//Inicio
export type Producto = {
  IdProducto: number;
  Nombre: string;
  Precio: number;
  IdEscuela: number;
  Url: string;
};

//Carrito
export type ProductoCarrito = Producto & {
  Cantidad: number;
};

export type ProductoAOrdenar = {
  Cantidad: number;
  IdProducto: number;
};

//Pedido
export type PedidoAlumno = {
  IdPedido: number;
  Fecha: Date;
  Estado: Pedido_Estado;
  DetallesPedido: DetallesPedido[];
  Total: number;
};

export type DetallesPedido = {
  Cantidad: number;
  Producto: Producto;
  IdDetallesPedido: number;
  SubTotal: number;
  IdProducto: number;
};

//Configuracion
export interface DatosAlumno {
  Escuela: Escuela;
  NoControl: number;
  Nombres: string;
}

//Enums

export type Rol = keyof typeof Rol ;
export type Filtro = keyof typeof Filtro;
export type Personal_Rol = keyof typeof Personal_Rol;
export type Pedido_Estado = keyof typeof Pedido_Estado;
export type Method = keyof typeof Method
export type ApiRutas = keyof typeof ApiRutas


//

type Body<T extends Method > = T  extends "GET" ? undefined :string

type Config<T extends Method> = {
  url:string
  base?:string
  body: Body<T>
  method:Method
  headers?: { [key: string]: string };
  querys ?: { [key: string]: string };
}
