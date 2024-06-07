 import { Form, redirect, useLoaderData } from "react-router-dom";
import { EventEnum, localStorageEnum, Rutas } from "../../const";
import {  Usuario } from "../../types";
import { obtenerPersonal } from "../../api/Personal/Personal";
import { Personal } from "../../types/personal";

export const PersonalConfiguracion = () => {
  const personal = useLoaderData() as Personal;
  return (
    <div className=" flex-1 flex flex-col">
      <div className="flex-1 text-white p-8">
        <h1 className="text-2xl font-semibold mb-4">
          Configuración del Personal
        </h1>

        <div className="mb-4">
          <p className="text-gray-400">Datos del Usuario</p>
          <p className="text-lg">Nombre:{personal.Nombres}</p>
          <p className="text-lg">Escuela:{personal.Escuela.Nombre}</p>
          <p className="text-lg">Rol:{personal.Rol}</p>
        </div>
        <Form method="POST">
          <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Cerrar Sesión
          </button>
        </Form>
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const actionPersonalConfiguracion = async () => {
  localStorage.removeItem(localStorageEnum.Sesion);
  const event = new Event(EventEnum.cerrarSesion);
  document.dispatchEvent(event);
  redirect(Rutas.Auth);
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderPersonalConfiguracion = async () => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;
  if(sesionJson.rol !== "Personal")return redirect(Rutas.Auth)

  try {
    return await obtenerPersonal(sesionJson.token);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
