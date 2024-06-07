import {
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
import { obtenerProducto } from "../../api/Personal/Gerente";
import { Producto } from "../../types/personal";
import { Usuario } from "../../types";

export const GerenteProducto = () => {
  const producto = useLoaderData() as Producto;
  const activado = producto.Activado ? "Activado" : "Desactivado";
  return (
    <div className="flex  flex-1 items-center justify-center">
      <div className=" flex   items-center  flex-col bg-gray-800 text-white rounded-lg shadow-md p-6">
        <h2 className="text-4xl font-bold mb-6 text-center">
          Información del Producto
        </h2>
        <p className="text-gray-500 mb-4">
          Nombre del producto: {producto.Nombre}
        </p>
        <p className="text-gray-500 mb-4">
          Precio del Producto: {producto.Precio}
        </p>
        <p className="text-gray-500 mb-4">Estado del Producto: {activado}</p>

        <p className="text-gray-500 mb-4">
          Categoria del Producto: {producto.Categoria.Nombre}
        </p>
        <p>Imagen del producto</p>
        <div className="mb-6 w-28 overflow-hidden">
          <img src={producto.Url} alt="" className="rounded-xl object-cover" />
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            to={"../edit/ " + producto.IdProducto}
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
export const loaderGerenteProducto = async ({ params }: LoaderFunctionArgs) => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  console.log(params.IdProducto)
  const sesioJson = JSON.parse(sesion) as Usuario;
  if (
    sesioJson.rol !== Rol.Personal ||
    sesioJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
  )
    redirect(Rutas.Auth);

  try {
    return await obtenerProducto(sesioJson.token, Number(params.IdProducto));
  } catch (error) {
    console.log(error);
    return error
  }
};
