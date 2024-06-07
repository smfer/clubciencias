import { APIURL, ApiRutas } from "../../const";
import { Personal } from "../../types/personal";
import { peticion } from "../funcion";

export const obtenerPersonal =async (token:string) =>{
  const headers = {
    Authorization: token,
  };
   return peticion<Personal,"GET">({headers,method:"GET","body":undefined,"url":ApiRutas.obtenerDatosPersonal,base:APIURL})
}