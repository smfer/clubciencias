import { Link, Outlet, redirect, useLoaderData } from "react-router-dom";
import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
import { Usuario } from "../../types";
import { obtenerProductos } from "../../api/Personal/Gerente";
import { Producto } from "../../types/personal";

export const GerenteProductos = () => {
  const productos = useLoaderData() as Producto[];

  return (
    <div className="flex flex-1 bg-gray-900">
      <div className="flex flex-col py-12">
      <ol className="flex">
          <button className="px-6 py-2 mx-4 bg-slate-100 rounded-lg">
            <Link to={Rutas.Personal + "/" + Rutas.Gerente + "/Categorias"}>
              Categorías
            </Link>
          </button>
          <button className="px-6 py-2 mx-4 bg-slate-100 rounded-lg">
            <Link to={Rutas.Personal + "/" + Rutas.Gerente + "/Productos"}>
              Productos
            </Link>
          </button>
        </ol>


        <button className="px-6 py-2 m-4 bg-green-300 rounded-lg">
            <Link to={Rutas.Personal + "/" + Rutas.Gerente + "/Productos/crear"}>
             Crear Productos
            </Link>
          </button>


        {productos.length >= 1 ? (
          <div className="flex flex-col bg-gray-800 overflow-auto max-h-screen shadow-md mt-4 mb-4">
            {productos.map((producto, index) => (
              <div
                key={index}
                className="my-4 pl-4 pr-8 bg-gray-700 text-white rounded-r-2xl"
              >
                <p className="text-lg font-bold">Producto N°: {producto.IdProducto}</p>
                <p>Nombre: {producto.Nombre}</p>
                <p className="text-center">
                  <button className="p-3 bg-gray-500 rounded">
                    <Link to={"" + producto.IdProducto}>Ver Detalles</Link>
                  </button>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center text-white">
            Sin productos :C
          </div>
        )}
      </div>

      <Outlet />
    </div>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const loaderGerenteInicio = async () => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);

  const sesioJson = JSON.parse(sesion) as Usuario;
  if (
    sesioJson.rol !== Rol.Personal ||
    sesioJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
  ) {
    redirect(Rutas.Auth);
  }

  try {
    return await obtenerProductos(sesioJson.token);
  } catch (error) {
    return error
  }
};
