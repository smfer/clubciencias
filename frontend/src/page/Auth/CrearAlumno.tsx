import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router-dom";
import { Escuela, Usuario } from "../../types";
import { EventEnum, Rutas, localStorageEnum } from "../../const";
import { obtenerEscuelas } from "../../api/escuela";
import { crearSesionAlumno } from "../../api/sesion";

const style = {
  divInputs: "first:mt-0 last:mb-0 flex flex-col my-2",
  input:
    "peer/error:border-red-500 p-2 m-1 bg-transparent outline-none  box-content border-2 border-blue-500 text-white rounded-md",
  label: "text-gray-100 text-center mb-2 text-lg",
  spanError: "peer/error",
} as const;


export const PaginaCrearAlumno = () => {
  const escuelas = useLoaderData() as Escuela[];
  const errors = useActionData() as ErroresFormulario | null;

  return (
    <div className="bg-zinc-900 h-screen  items-center flex flex-col">
      <p className="text-5xl  text-center  text-blue-50 font-bold pt-4 mb-3">
        Crear{" "}
        <span className=" text-transparent bg-clip-text bg-gradient-to-t to-blue-500 from-blue-800">
          Sesión
        </span>
      </p>
      <Form
        method="post"
        className=" flex-1 flex flex-col justify-between py-8"
      >
        <div>
          <div className={style.divInputs}>
            <label className={style.label} htmlFor="">
              Ingresa tu nombre{" "}
            </label>
            <input
              className={style.input}
              type="text"
              name="Nombres"
            />
            {errors && errors.Nombres && (
              <p className=" text-red-500"> {errors.Nombres} </p>
            )}
          </div>

          <div className={style.divInputs}>
            <label className={style.label} htmlFor="">
              Ingresa el numero de control{" "}
            </label>
            <input
              className={style.input}
              type="number"
              name="NoControl"
            />
            {errors && errors.NoControl && (
              <p className=" text-red-500"> {errors.NoControl} </p>
            )}
          </div>

          <div className={style.divInputs}>
            <label className={style.label} htmlFor="">
              Ingresa tu contraseña{" "}
            </label>
            <input
              className={style.input}
              type="password"
              name={"Contrase_a"}
            />
            {errors && errors.Contrase_a && (
              <p className=" text-red-500"> {errors.Contrase_a} </p>
            )}
          </div>

          <div className={style.divInputs}>
            <label className={style.label} htmlFor="">
              Ingresa tu Cafeteria{" "}
            </label>
            <select
              className={style.input}
              datatype="number"
              name={"IdEscuela"}
            >
              {escuelas &&
                escuelas.map((Escuela) => {
                  return (
                    <option value={Escuela.IdEscuela} key={Escuela.IdEscuela}>
                      {Escuela.Nombre}
                    </option>
                  );
                })}
            </select>
            {errors && errors.IdEscuela && (
              <p className=" text-red-500"> {errors.IdEscuela} </p>
            )}
          </div>
        </div>

        <div className="my-16 flex justify-center flex-col">
          <div className="mb-5  text-center ">
            <button className="  shadow-button hover:shadow-buttonHover hover:shadow-blue-500 shadow-blue-500 text-2xl mb-6  bg-blue-500 text-white  px-4 py-3 rounded-xl">
              <p>Crear Cuenta</p>
            </button>
          </div>
          <div className="text-center">
            <Link className=" text-slate-100 " to={Rutas.Auth}>
              Iniciar Sesion
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
};

type ErroresFormulario = {
  IdEscuela?: string;
  Nombres?: string;
  Contrase_a?: string;
  NoControl?: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const actionCrearAlumno = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  const formulario = Object.fromEntries(data.entries());

  const errores: ErroresFormulario = {};

  const IdEscuela = Number(formulario.IdEscuela);
  const Nombres = String(formulario.Nombres);
  const Contrase_a = String(formulario.Contrase_a);
  const NoControl = Number(formulario.NoControl);

  if (isNaN(IdEscuela) || IdEscuela < 0) {
    errores.IdEscuela = "IdEscuela debe ser un número";
  }
  if (typeof Nombres !== "string" || Nombres.length < 1) {
    errores.Nombres = "Nombres debe ser una cadena de texto";
  }
  if (typeof Contrase_a !== "string" || Contrase_a.length < 1) {
    errores.Contrase_a = "Contraseña debe ser una cadena de texto";
  }
  if (isNaN(NoControl) || NoControl < 0) {
    errores.NoControl = "NoControl debe ser un número";
  }

  if (Object.keys(errores).length > 0) {
    return errores;
  }

  try {
    const sesion = await crearSesionAlumno({
      NoControl,
      Nombres,
      IdEscuela,
      Contrase_a,
    });

    localStorage.setItem(
      localStorageEnum.Sesion,
      JSON.stringify({ token: sesion.token, rol: "Alumno" })
    );
    const event = new CustomEvent<Usuario>(EventEnum.iniciarSesion, {
      detail: { token: sesion.token, rol: "Alumno" },
    });
    document.dispatchEvent(event);

    return redirect(Rutas.Alumno);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderCrearAlumno = async () => {
  try {
    const escuelas = await obtenerEscuelas();
    return escuelas;
  } catch (error) {
    console.log(error);
    return error;
  }
};
