import { Escuela } from "../types";
import { APIURL, ApiRutas } from "../const";
import { peticion } from "./funcion";

export const obtenerEscuelas = async (): Promise<Escuela[]> => {
  return peticion<Escuela[], "GET">({
    url: ApiRutas.obtenerEscuelas,
    body: undefined,
    method: "GET",
    base: APIURL,
  });
};
