import { Form, redirect, useLoaderData } from "react-router-dom";
import { EventEnum, localStorageEnum, Rutas } from "../../const";
import { DatosAlumno, Usuario } from "../../types";
import { obtenerAlumno } from "../../api/alumno";

export const AlumnoConfiguracion = () => {
  const alumno = useLoaderData() as DatosAlumno;
  return (
    <div className=" flex-1 flex flex-col">
      <div className="flex-1 text-white p-8">
        <h1 className="text-2xl font-semibold mb-4">
          Configuración del Usuario
        </h1>

        <div className="mb-4">
          <p className="text-gray-400">Datos del Usuario</p>
          <p className="text-lg">Nombre:{alumno.Nombres}</p>
          <p className="text-lg">Escuela:{alumno.Escuela.Nombre}</p>
          <p className="text-lg">NoControl:{alumno.NoControl}</p>
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
export const actionAlumnoConfiguracion = async () => {
  localStorage.removeItem(localStorageEnum.Sesion);
  const event = new Event(EventEnum.cerrarSesion);
  document.dispatchEvent(event);
  redirect(Rutas.Auth);
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderAlumnoConfiguracion = async () => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect("/");
  const sesionJson = JSON.parse(sesion) as Usuario;

  try {
    return await obtenerAlumno(sesionJson.token);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
