import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
import { Usuario } from "../../types";
import { crearProducto, obtenerCategorias } from "../../api/Personal/Gerente";
import { Categoria, CrearProducto } from "../../types/personal";

export const GerenteCrearProducto = () => {
  const categorias = useLoaderData() as Categoria[];
  return (
    <div className="flex  flex-1 items-center justify-center">
      <Form
        method="POST"
        className=" flex   items-center  flex-col bg-gray-800 text-white rounded-lg shadow-md p-12"
      >
        <h2 className="text-4xl font-bold mb-6 text-center">Crear Producto</h2>
        <input
          name="Nombre"
          type="text"
          className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          placeholder="Nombre del producto"
          defaultValue=""
        />
        <input
          name="Precio"
          type="number"
          className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          placeholder="Precio del producto"
          defaultValue=""
        />
        <input
          name="Url"
          type="url"
          className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          placeholder="Url del producto"
          defaultValue=""
        />

        <select
          name="IdCategoria"
          id=""
          className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
        >
          {categorias.map((categoria) => {
            return (
              <option key={categoria.IdCategoria} value={categoria.IdCategoria}>
                {categoria.Nombre}
              </option>
            );
          })}
        </select>

        <p>Imagen del producto</p>
        <div className="mb-6 w-28 overflow-hidden">
          <img src="" alt="" className="rounded-xl object-cover" />
        </div>

        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Aceptar
          </button>
          <Link
            to={"../"}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Volver
          </Link>
        </div>
      </Form>
    </div>
  );
};


// eslint-disable-next-line react-refresh/only-export-components
export const actionGerenteCrearProducto = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const datos = Object.fromEntries(form.entries());
  const { Nombre, Precio, Url, IdCategoria } = datos;
  if (typeof Nombre !== "string") throw new Error();
  if (isNaN(Number(Precio))) throw new Error();
  if (typeof Url !== "string") throw new Error();
  if (isNaN(Number(IdCategoria))) throw new Error();

  const producto: CrearProducto = {
    Nombre,
    Precio: Number(Precio),
    Url,
    IdCategoria: Number(IdCategoria),
  };
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;

  if (
    sesionJson.rol !== Rol.Personal &&
    sesionJson.rango !== Personal_Rol.Cajero &&
    sesionJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
  )
    return redirect(Rutas.Auth);
  try {
    const productoCreado = await crearProducto(sesionJson.token, producto);
    return redirect("../" + productoCreado.IdProducto);
  } catch (error) {
    console.log(error);
    throw error;
  }
};


// eslint-disable-next-line react-refresh/only-export-components
export const loaderCrearProducto = async () => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesioJson = JSON.parse(sesion) as Usuario;
  if (
    sesioJson.rol !== Rol.Personal ||
    sesioJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
  )
    redirect(Rutas.Auth);

    return await obtenerCategorias(sesioJson.token)
};
