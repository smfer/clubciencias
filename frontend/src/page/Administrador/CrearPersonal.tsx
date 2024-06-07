import { ActionFunctionArgs, Form, Link, redirect } from "react-router-dom";
import { Personal_Rol, Rol, Rutas, localStorageEnum } from "../../const";
import { Personal_Rol as Personal_RolType, Usuario } from "../../types";
import { crearPersonal } from "../../api/Personal/Administrador";

type ErroresFormulario = {
  Nombres?: string;
  Rol?: string;
  IdPersonal?: string;
};

export const AdministradorCrearPersonal = () => {
  const roles = Object.values(Personal_Rol);
  console.log(roles);
  return (
    <Form method="POST" className="flex  flex-1 items-center justify-center">
      <div className=" flex  flex-col bg-gray-800 text-white rounded-lg shadow-md p-6">
        <h2 className="text-4xl font-bold mb-6 text-center">Crear personal</h2>

        <div>
          <label htmlFor="Nombres" className="text-gray-500 mb-4">
            Nombres:
          </label>
          <input
            type="text"
            name="Nombres"
            defaultValue={""}
            className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          />
        </div>

        <div>
          <label htmlFor="" className="text-gray-500 mb-4">
            Rol:
          </label>

          <select
            name="Rol"
            id=""
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
            name="Contrase_a"
            defaultValue={""}
            className="bg-gray-700 text-white p-2 mb-4 w-full rounded"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
            Crear
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

// eslint-disable-next-line react-refresh/only-export-components
export const actionPersonalCrear = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const datos = Object.fromEntries(form.entries());

  const Nombres = String(datos.Nombres);
  const rol = String(datos.Rol);
  const Contrase_a = String(datos.Contrase_a);
  const errores: ErroresFormulario = {};

  if (typeof Nombres !== "string" || Nombres.length < 1)
    errores.Nombres = "Ingresa un nombre valido";
  if (typeof rol !== "string" || !Object.keys(Personal_Rol).includes(rol))
    errores.Rol = "Ingresa un rol valido";
  if (typeof Contrase_a !== "string" || Contrase_a.length < 1)
    errores.Rol = "Ingresa una contraseña valida";

  if (Object.keys(errores).length >= 1) return errores;

  const personal = { Rol: rol as Personal_RolType, Nombres, Contrase_a };

  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;

  if (
    sesionJson.rol !== Rol.Personal &&
    sesionJson.rango !== Personal_Rol.Cajero &&
    sesionJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
  )
    return redirect(Rutas.Auth);
  const personalCreado = await crearPersonal(sesionJson.token, personal);

  return redirect("../" + personalCreado.IdPersonal);
};
