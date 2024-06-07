import { Filtro, Pedido_Estado } from "../../types";
import { APIURL, ApiRutas } from "../../const";
import { Pedido } from "../../types/personal";
import { peticion } from "../funcion";

export const obtenerPedidos = async (token: string, filtro: Filtro) => {
  const headers = {
    Authorization: token,
  };
 return peticion<Pedido[], "GET">({
    method: "GET",
    headers,
    body: undefined,
    url: ApiRutas.obtenerPedidosPersonal(filtro),
    base: APIURL,
  });
};

export const obtenerPedido = async (token: string, IdPedido: number) => {
  const headers = {
    Authorization: token,
  };

  return peticion<Pedido, "GET">({
    method: "GET",
    headers,
    body: undefined,
    url: ApiRutas.obtenerPedido(IdPedido),
    base: APIURL,
  });
};

export const editarPedido = (
  token: string,
  nuevoEstado: Pedido_Estado,
  IdPedido: number
) => {
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };
  const body = JSON.stringify({ nuevoEstado, IdPedido });

  return peticion<Pedido, "PUT">({
    method: "PUT",
    headers,
    body,
    url: ApiRutas.editarPedido,
    base: APIURL,
  });
};
