import { Personal, Alumno, Personal_Rol,Producto as ProductoType } from "@prisma/client";
import { Producto as ProductoAlumno } from "@prisma/client";
declare module "express-serve-static-core" {
  interface Request {
    SesionAlumno: Alumno;
    SesionPersonal: Personal;
  }
}

export type Sesion = {
  rol: Rol;
  id: number;
  rango?: Personal_Rol;
};

export type ProductoCarro = {
  IdProducto: number;
  Cantidad: number;
};

export type InicioSesion = {
  Contraseña: string;
  NoControl?: number;
  IdEscuela: number;
  Nombres?: string;
  Rol: Rol;
};


export type PedidoAlumno = {
  IdPedido: number;
  Fecha: Date;
  Estado: Pedido_Estado;
  DetallesPedido: DetallesPedido[];
  Total: number;
};


export type DetallesPedido = {
  Cantidad: number;
  Producto: ProductoType;
  IdDetallesPedido: number;
  SubTotal: number;
  IdProducto: number;
};

export const Rol = { Alumno: "Alumno", Personal: "Personal" } as const;

export type Rol = keyof typeof Rol;



export const Pedido_Estado= {
  Ordenado: 'Ordenado',
  Aceptado: 'Aceptado',
  Listo_para_Recoger: 'Listo_para_Recoger',
  Entregado: 'Entregado',
  Cancelado: 'Cancelado',
  Pago_Realizado: 'Pago_Realizado'
} ;



export const Personal_Rol= {
  Administrador: 'Administrador',
  Cajero: 'Cajero',
  Analista_de_Datos: 'Analista_de_Datos',
  Gerente_de_Cafeter_a: 'Gerente_de_Cafeter_a'
} ;

