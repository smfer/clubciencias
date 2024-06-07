import { Link, Outlet, redirect, useLoaderData } from "react-router-dom";
import { obtenerPersonales } from "../../api/Personal/Administrador";
import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
import { Usuario } from "../../types";
import { Personal } from "../../types/personal";

export const AdministradorInicio = () => {
  const personales = useLoaderData() as Personal[];
  return (
    <div className="flex-1 bg-gray-900 flex flex-row overflow-hidden">
      <div className="flex flex-col   ">
        <button className="px-6 py-2 m-4 bg-green-300 rounded-lg">
          <Link to={"crear"}>
            Crear Personal
          </Link>
        </button>

        {personales.length >= 1 && (
          <div
            className="flex flex-col  bg-custom-color overflow-auto scroll-m-0 max-h-screen shadow-md mt-4 mb-4"
            style={{
              scrollbarColor: "red", // Cambia estos colores según tus preferencias
              scrollbarWidth: "thin", // Ajusta el ancho del scrollbar (thin, auto, etc.)
            }}
          >
            {personales.map((personal, index) => (
              <div
                key={index}
                className={
                  "my-4 pl-1 pr-8 bg-slate-600 text-white rounded-r-2xl "
                }
              >
                <p className=""> Personal N°: {personal.IdPersonal}</p>
                <p>Nombre:{personal.Nombres}</p>
                <p className="text-center">
                  <button className="p-3">
                    <Link to={"" + personal.IdPersonal}> Ver Detalles </Link>
                  </button>
                </p>
              </div>
            ))}
          </div>
        )}

        {personales.length < 1 && (
          <div
            className="flex-1 flex justify-center items-center text-white"
            style={{
              scrollbarColor: "red", // Cambia estos colores según tus preferencias
              scrollbarWidth: "thin", // Ajusta el ancho del scrollbar (thin, auto, etc.)
            }}
          >
            Sin Personal :C
          </div>
        )}
      </div>

      <Outlet />
    </div>
  );
};

export const loaderAdminitrador = async () => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);

  const sesionJson = JSON.parse(sesion) as Usuario;
  if (
    sesionJson.rol !== Rol.Personal ||
    sesionJson.rango !== Personal_Rol.Administrador
  )
    return redirect(Rutas.Auth);
  try {
    return await obtenerPersonales(sesionJson.token);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
