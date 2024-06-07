import { ActionFunctionArgs, Form, Link, redirect } from "react-router-dom";
import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
import { Usuario } from "../../types";
import { crearCategoria } from "../../api/Personal/Gerente";

export const GerenteCrearProducto = () => {
  return (
    <div className="flex  flex-1 items-center justify-center">
      <Form
        method="POST"
        className=" flex   items-center  flex-col bg-gray-800 text-white rounded-lg shadow-md p-12"
      >
        <h2 className="text-4xl font-bold mb-6 text-center">Crear Categoria</h2>
        <input
          name="Nombre"
          type="text"
          className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          placeholder="Nombre del producto"
          defaultValue=""
        />

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
export const actionGerenteCrearCategoria = async ({
  request,
}: ActionFunctionArgs) => {
  const datos = await request.formData();
  const formulario = Object.fromEntries(datos.entries());

  const Nombre = String(formulario.Nombre);

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
    const categoria = await crearCategoria(sesionJson.token, Nombre);
    return redirect("../" + categoria.IdCategoria);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

