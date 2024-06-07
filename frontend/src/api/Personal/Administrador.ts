import { APIURL, ApiRutas } from "../../const";
import { CrearPersonal, EditarPersonal, Personal } from "../../types/personal";
import { peticion } from "../funcion";

export const obtenerPersonales = async (token: string) => {
  const headers = {
    Authorization: token,
  };

  return peticion<Personal[], "GET">({
    method: "GET",
    headers,
    body: undefined,
    url: ApiRutas.obtenerPersonales,
    base: APIURL,
  });
};

export const obtenerPersonal = async (token: string, IdPersonal: number) => {
  const headers = {
    Authorization: token,
  };
  return peticion<Personal, "GET">({
    method: "GET",
    headers,
    body: undefined,
    url: ApiRutas.obtenerPersonal(IdPersonal),
    base: APIURL,
  });
};

export const crearPersonal = async (token: string, personal: CrearPersonal) => {
  const headers = {
    Authorization: token,
    "Content-Type": "application/json",
  };

  const body = JSON.stringify(personal);

  return peticion<Personal, "POST">({
    method: "POST",
    headers,
    body,
    url: ApiRutas.crearPersonal,
    base: APIURL,
  });
};

export const editarPersonal = async (
  token: string,
  personal: EditarPersonal
) => {
  const headers = {
    authorization: token,
    "Content-type": "application/json",
  };
  const body = JSON.stringify(personal);

  return peticion<Personal, "PUT">({
    method: "PUT",
    headers,
    body,
    url: ApiRutas.editarPersonal,
    base: APIURL,
  });
};
