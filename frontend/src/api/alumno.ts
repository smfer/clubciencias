import {
  DatosAlumno,
  PedidoAlumno,
  Producto,
  ProductoAOrdenar,
} from "../types";
import { APIURL, ApiRutas } from "../const";
import { Categoria } from "../types/personal";
import { peticion } from "./funcion";

//inicio
export const obtenerProductos = async (token: string, IdCategoria?: number) => {
  const headers = {
    Authorization: token,
  };
  console.log(IdCategoria)
    try {
      return peticion<Producto[], "GET">({
        url: ApiRutas.obtenerProductos,
        querys: IdCategoria ?  { IdCategoria: IdCategoria.toString() }: undefined ,
        body: undefined,
        headers,
        method: "GET",
        base:APIURL
      });
    } catch (error) {
      console.log(error)
    }
 
};

export const obtenerProducto = async (token: string, IdPedido: number) => {
  const headers = {
    Authorization: token,
  };

  return peticion<Producto, "GET">({
    url: ApiRutas.obtenerProducto(IdPedido),
    base: APIURL,
    body: undefined,
    headers,
    method: "GET",
  });
};

export const obtenerCategorias = async (token: string) => {
  const headers = {
    Authorization: token,
  };

  return peticion<Categoria[], "GET">({
    url: ApiRutas.obtenerCategorias,
    method: "GET",
    body: undefined,
    base: APIURL,
    headers,
  });
};

export const obtenerCategoria = async (token: string, IdCategoria: number) => {
  const headers = {
    Authorization: token,
  };
  return peticion<Categoria, "GET">({
    url: ApiRutas.obtenerCategoria(IdCategoria),
    method: "GET",
    body: undefined,
    base: APIURL,
    headers,
  });
};

//Carrito
export const crearPedido = async (
  token: string,
  productos: ProductoAOrdenar[]
) => {
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    Productos: productos,
  });

  peticion<PedidoAlumno, "POST">({
    url: ApiRutas.crearPedido,
    method: "POST",
    body,
    headers,
    base: APIURL,
  });
};

export const obtenerPedidoOrdenado = async (token: string) => {
  const headers = {
    Authorization: token,
  };
  return peticion<PedidoAlumno, "GET">({
    url: ApiRutas.obtenerPedidosOrdenasdos,
    headers,
    body: undefined,
    base: APIURL,
    method: "GET",
  });
};

//Pedidos
export const obtenerPedidos = async (token: string) => {
  const headers = {
    Authorization: token,
  };

  return peticion<PedidoAlumno[], "GET">({
    base: APIURL,
    url: ApiRutas.obtenerPedidos,
    body: undefined,
    headers,
    method: "GET",
  });
};

export const modificarPedido = async (token: string, IdPedido: number) => {
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify({
    IdPedido,
  });

  return peticion<PedidoAlumno, "PUT">({
    url: ApiRutas.modificarPedido,
    headers,
    body,
    method: "PUT",
    base: APIURL,
  });
};

//Configuracion

export const obtenerAlumno = async (toekn: string) => {
  const headers = {
    Authorization: toekn,
  };
  return peticion<DatosAlumno, "GET">({
    url: ApiRutas.obtenerAlumno,
    headers,
    method: "GET",
    base: APIURL,
    body: undefined,
  });
};
