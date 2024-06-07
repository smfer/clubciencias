import { Productos } from "../../components/Alumno/Productos";

import { Rol, Rutas, localStorageEnum } from "../../const";
import {
  Form,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { obtenerCategorias, obtenerProductos } from "../../api/alumno";
import { Producto, Usuario } from "../../types";
import { Categoria } from "../../types/personal";

export const AlumnoInicio = () => {
  const datos = useLoaderData() as {
    productos: Producto[];
    categorias: Categoria[];
  };
  const { productos } = datos;
  const { categorias } = datos;

  return (
    <div className=" flex-1 flex flex-row  ">
      <div className=" flex-1 flex flex-col  over">
        <p className=" w-60  m-8 mb-10  text-slate-100 font-bold text-2xl">
          Productos Deliciosos para ti
        </p>

        <div className="  flex py-3  w-screen overflow-auto   items-center">
          <Form>
            <button className="px-6 py-2 mx-4 bg-slate-100 rounded-lg">
              Productos
            </button>
          </Form>

          {categorias.map((categoria) => {
            return (
              <Form key={categoria.IdCategoria}>
                <button className="px-6 py-2 mx-4 bg-slate-100 rounded-lg">
                  {categoria.Nombre}
                </button>{" "}
                <input
                  type="text"
                  hidden
                  defaultValue={categoria.IdCategoria}
                  name="IdCategoria"
                />
              </Form>
            );
          })}
        </div>

        {productos.length >= 1 && <Productos productos={productos} />}

        {productos.length < 1 && (
          <div className="flex-1 flex flex-col justify-center items-center ">
            <p className="text-gray-100 text-xl font-bold mb-8">
              Sin Productos
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderAlumnoInicio = async ({ request }: LoaderFunctionArgs) => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);

  const sesionJson = JSON.parse(sesion) as Usuario;
  if (sesionJson.rol !== Rol.Alumno) return redirect(Rutas.Auth);

  const url = new URL(request.url);
  const IdCategoria = Number(url.searchParams.get("IdCategoria"));

  const categorias = await obtenerCategorias(sesionJson.token);
  if (isNaN(IdCategoria)) {
    const productos = await obtenerProductos(sesionJson.token);

    return { productos, categorias };
  }
  console.log(IdCategoria);

  const productos = await obtenerProductos(sesionJson.token, IdCategoria);
  return { categorias, productos };
};
