import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "react-router-dom";
import {  Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
import { Personal } from "../../types/personal";
import {  Personal_Rol as  Personal_RolType , Usuario } from "../../types";
import { editarPersonal } from "../../api/Personal/Administrador";

type ErroresFormulario = {
  Nombres?: string;
  Rol?: string;
  IdPersonal?: string;
}


export const AdministradorEditarPersonal = () => {
  const roles = Object.values(Personal_Rol);
  const personal = useLoaderData() as Personal;
  return (
    <Form method="POST" className="flex  flex-1 items-center justify-center">
      <div className=" flex  flex-col bg-gray-800 text-white rounded-lg shadow-md p-6">
        <h2 className="text-4xl font-bold mb-6 text-center">Editar personal</h2>

        <div>
          <label htmlFor="Nombres" className="text-gray-500 mb-4">
            Nombres:
          </label>
          <input
            type="text"
            name="Nombres"
            defaultValue={personal.Nombres}
            className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          />
        </div>

        <div>
          <label htmlFor="" className="text-gray-500 mb-4">
            Rol:
          </label>

          <select
            name="Rol"
            className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          >
            {roles.map((Rol, index) => (
              <option key={index} value={Rol}>
                {Rol}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="Rol" className="text-gray-500 mb-4">
            Contraseña:
          </label>
          <input
            type="password"
            defaultValue={""}
            className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Editar
          </button>
          <Link
            to={"../"}
            className="bg-orange-500  text-white py-2 px-4 rounded hover:bg-orange-600"
          >
            Volver
          </Link>
        </div>
      </div>
    </Form>
  );
};

export const actionPersonalEditar = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const datos = Object.fromEntries(form.entries());
  console.log(datos)


  const Nombres = String(datos.Nombres);
  const rol = String(datos.Rol);
  const Id = Number(params.IdPersonal);

  const errores:ErroresFormulario = {};

  console.log(rol)
  console.log(Object.keys(Personal_Rol).includes(rol))
  
  if (typeof Nombres !== "string" || Nombres.length < 1)
    errores.Nombres = "El campo IdEscuela debe ser un número";
    if (typeof rol !== "string" || !Object.keys(Personal_Rol).includes(rol))
    errores.Rol = "El campo IdEscuela debe ser un número";
    if (typeof Id !== "number" || Id < 1)
    errores.IdPersonal = "Selecciona un personal valido";

  if(Object.keys(errores).length >= 1   ) return errores


  const personal = {Rol :rol as Personal_RolType ,Nombres,IdPersonal:Id}

  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;

  if (
    sesionJson.rol !== Rol.Personal &&
    sesionJson.rango !== Personal_Rol.Cajero &&
    sesionJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
  )
    return redirect(Rutas.Auth);
  console.log(sesionJson.token)
  await editarPersonal(sesionJson.token, personal);

  return redirect("../"+Id);
};
