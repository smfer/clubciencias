import { APIURL, ApiRutas } from "../../const";
import {
  ActualizarProducto,
  Categoria,
  CrearProducto,
  Producto,
} from "../../types/personal";
import { peticion } from "../funcion";

export const crearProducto = async (token: string, producto: CrearProducto) => {
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify(producto);
  return peticion<Producto, "POST">({
    method: "POST",
    headers,
    body,
    url: ApiRutas.crearProducto,
    base: APIURL,
  });
};

export const crearCategoria = async (token: string, categoria: string) => {
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify(categoria);
  return peticion<Categoria, "POST">({
    method: "POST",
    headers,
    body,
    url: ApiRutas.crearCategoria,
    base: APIURL,
  });
};


export const actualizarProducto = async (
  token: string,
  producto: ActualizarProducto
) => {
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify(producto);
  return peticion<Producto, "PUT">({
    method: "PUT",
    headers,
    body,
    url: ApiRutas.actualizarProducto,
    base: APIURL,
  });
};

export const obtenerProductos = async (token: string) => {
  const headers = {
    Authorization: token,
  };
  return peticion<Producto[], "GET">({
    method: "GET",
    headers,
    body: undefined,
    url: ApiRutas.obtenerProductosPersonal,
    base: APIURL,
  });
};

export const obtenerProducto = async (token: string, IdProducto: number) => {
  const headers = {
    Authorization: token,
  };
  return peticion<Producto, "GET">({
    method: "GET",
    headers,
    body: undefined,
    url: ApiRutas.obtenerProductoPersonal(IdProducto),
    base: APIURL,
  });
};

export const obtenerCategorias = async (token: string) => {
  const headers = {
    Authorization: token,
  };
  return peticion<Categoria[],"GET">({method:"GET",headers,body:undefined,"url":ApiRutas.obtenerCategoriasPersonal,base:APIURL})

};

export const obtenerCategoria = async (token: string, IdCategoria: number) => {
  const headers = {
    Authorization: token,
  };
  return peticion<Categoria,"GET">({method:"GET",headers,body:undefined,"url":ApiRutas.obtenerCategoria(IdCategoria),base:APIURL})
};
