import { Alumno, IniciarSesion, Personal, Sesion } from "../types";
import { APIURL, ApiRutas } from "../const";
import { peticion } from "./funcion";

export const iniciarSesion = async (Sesion: IniciarSesion) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(Sesion);
  return peticion<Sesion, "POST">({
    base: APIURL,
    url: ApiRutas.inicioSesion,
    body,
    method: "POST",
    headers,
  });
};

export const crearSesionAlumno = async (Alumno: Alumno) => {
  const headers = {
    "Content-Type": "application/json",
  };
  const body = JSON.stringify(Alumno);
  return peticion<Sesion, "POST">({
    base: APIURL,
    url:  ApiRutas.crearAlumno,
    body,
    method: "POST",
    headers,
  });
};

export const crearSesionPersonal = async (Personal: Personal) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const body = JSON.stringify(Personal);

  return peticion<Sesion, "POST">({
    base: APIURL,
    url: ApiRutas.crearCafeteria,
    body,
    method: "POST",
    headers,
  });
};
