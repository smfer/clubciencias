import {  ActionFunctionArgs, Form, Link, redirect, useLoaderData } from "react-router-dom";
import { ActualizarProducto, Categoria } from "../../types/personal";
import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
import { Usuario } from "../../types";
import { actualizarProducto } from "../../api/Personal/Gerente";

export const GerenteEditarCategoria = () => {
    const categoria = useLoaderData() as Categoria;
    return (
      <div className="flex  flex-1 items-center justify-center">
        <Form method="POST" className="flex items-center justify-center h-full">
          <div className="bg-gray-800 text-white rounded-lg shadow-md p-6">
            <h2 className="text-4xl font-bold mb-6 text-center">
              Editar Producto
            </h2>
            <input
            name="Nombre"
              className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
              placeholder="Nombre del producto"
              defaultValue={categoria.Nombre}
            />
         
            <div className="flex justify-center space-x-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Aceptar
              </button>
              <Link
                to={"../"}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              >
                Volver
              </Link>
            </div>
          </div>
        </Form>
      </div>
    );
  };
  
   // eslint-disable-next-line react-refresh/only-export-components
   export const actionGerenteEditarCategoria = async ({
    request,
    params,
  }:ActionFunctionArgs) => {
    const form = await request.formData();
    const datos = Object.fromEntries(form.entries()) ;
    const {Nombre,Precio,Url} = datos
    if(typeof Nombre  !== "string") throw new   Error()
    if(isNaN( Number(Precio))) throw new Error()
    if(typeof Url  !== "string")  throw new Error()
  
    const producto :ActualizarProducto = {IdProducto:Number(params.IdProducto),Nombre,Precio:Number(Precio),Url}
    const sesion = localStorage.getItem(localStorageEnum.Sesion);
    if (!sesion) return redirect(Rutas.Auth);
    const sesionJson = JSON.parse(sesion) as Usuario;
  
    if (
      sesionJson.rol !== Rol.Personal &&
      sesionJson.rango !== Personal_Rol.Cajero &&
      sesionJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
    )
      return redirect(Rutas.Auth);
  
    const pedido = await actualizarProducto(sesionJson.token,producto);
  
    console.log(pedido);
    return redirect("..");
  };
  