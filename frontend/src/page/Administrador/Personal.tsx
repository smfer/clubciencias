import {
    Link,
    LoaderFunctionArgs,
    redirect,
    useLoaderData,
  } from "react-router-dom";
  import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
  import {  Personal } from "../../types/personal";
  import { Usuario } from "../../types";
import { obtenerPersonal } from "../../api/Personal/Administrador";
  
  export const AdministradorPersonal = () => {
    const personal = useLoaderData() as Personal;
    console.log(personal)
    return (
      <div className="flex  flex-1 items-center justify-center">
        <div className=" flex  flex-col bg-gray-800 text-white rounded-lg shadow-md p-6">
          <h2 className="text-4xl font-bold mb-6 text-center">
            Información del personal
          </h2>
          <p className="text-gray-500 mb-4">
            Nombres : {personal.Nombres}
          </p>
        

          <p className="text-gray-500 mb-4">
            Rol : {personal.Rol}
          </p>

          <div className="flex justify-center space-x-4">
            <Link
              to={"../editar/ " + personal.IdPersonal}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Editar
            </Link>
            <Link
              to={"../"}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Volver
            </Link>
          </div>
        </div>
      </div>
    );
  };
  
 
  // eslint-disable-next-line react-refresh/only-export-components
  export const loaderAdminitradorPersonal = async ({ params }: LoaderFunctionArgs) => {
    const sesion = localStorage.getItem(localStorageEnum.Sesion);
    if (!sesion) return redirect(Rutas.Auth);
  
    const sesioJson = JSON.parse(sesion) as Usuario;
    if (
      sesioJson.rol !== Rol.Personal ||
      sesioJson.rango !== Personal_Rol.Administrador
    )
      redirect(Rutas.Auth);
  
    try {
      return await obtenerPersonal(sesioJson.token, Number(params.IdPersonal));
    } catch (error) {
      console.log(error);
    }
  };
  
