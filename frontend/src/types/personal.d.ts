import { DetallesPedido, Pedido_Estado, Personal_Rol } from ".";

export type CrearProducto = {
  Precio: number;
  Nombre: string;
  Url: string;
  IdCategoria:number
};



export type Producto = {
  IdProducto: number;
  Nombre: string;
  Url: string;
  Precio: number;
  IdEscuela: number;
  IdCategoria: number;
  Activado: boolean;
  Categoria:Categoria
};

export type ActualizarProducto =  {
  IdProducto: number;
  Precio: number;
  Nombre: string;
  Url: string;
};

export type Alumno = { Nombres: string };

export type Pedido = {
  IdPedido: number;
  Fecha: Date;
  Estado: Pedido_Estado;
  DetallesPedido: DetallesPedido[];
  Alumno: Alumno;
  Total: number;
};

export type Categoria = {
  IdCategoria: number;
  IdEscuela: number;
  Nombre: string;
};

export type CrearPersonal = {
  Contrase_a:   string;
  Nombres:    string;
  Rol:        Personal_Rol;
}

export type EditarPersonal = {
  Nombres: string,
  Rol:Personal_Rol
  IdPersonal: number;

}

export type Personal ={
  IdPersonal: number;
  Escuela:    Escuela;
  Nombres:    string;
  Rol:        Personal_Rol;
}

export type Escuela = {
  Nombre: string;
}
