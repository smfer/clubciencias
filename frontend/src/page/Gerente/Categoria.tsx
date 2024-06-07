import {
    Link,
    LoaderFunctionArgs,
    redirect,
    useLoaderData,
  } from "react-router-dom";
  import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
  import {  obtenerCategoria } from "../../api/Personal/Gerente";
  import {  Categoria } from "../../types/personal";
  import { Usuario } from "../../types";
  
  export const GerenteCategoria = () => {
    const categoria = useLoaderData() as Categoria;
    return (
      <div className="flex  flex-1 items-center justify-center">
        <div className=" flex  flex-col bg-gray-800 text-white rounded-lg shadow-md p-6">
          <h2 className="text-4xl font-bold mb-6 text-center">
            Información de la Categoria
          </h2>
          <p className="text-gray-500 mb-4">
            Nombre de la Categoria: {categoria.Nombre}
          </p>
        
          <div className="flex justify-center space-x-4">
            <Link
              to={"../edit/ " + categoria.IdCategoria}
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
  export const loaderGerenteCategoria = async ({ params }: LoaderFunctionArgs) => {
    const sesion = localStorage.getItem(localStorageEnum.Sesion);
    if (!sesion) return redirect(Rutas.Auth);
  
    const sesioJson = JSON.parse(sesion) as Usuario;
    if (
      sesioJson.rol !== Rol.Personal ||
      sesioJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
    )
      redirect(Rutas.Auth);
  
    try {
      return await obtenerCategoria(sesioJson.token, Number(params.IdCategoria));
    } catch (error) {
      console.log(error);
    }
  };
  
 