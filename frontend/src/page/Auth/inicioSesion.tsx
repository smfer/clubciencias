import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useActionData,
  useLoaderData,
} from "react-router-dom";
import { EventEnum, Rutas, localStorageEnum } from "../../const.ts";
import { useRef, useState } from "react";
import { Escuela, Rol, Usuario } from "../../types/index";
import { iniciarSesion } from "../../api/sesion.ts";
import { obtenerEscuelas } from "../../api/escuela.ts";
import { Rol as RolConst } from "../../const.ts";
import { ApiError } from "../../Error.ts";
const style = {
  divInputs: "first:mt-0 last:mb-0 flex flex-col my-2",
  input:
    "peer/error:border-red-500 p-2 m-1 bg-transparent outline-none  box-content border-2 border-blue-500 text-white rounded-md",
  label: "text-gray-100 text-center mb-2 text-lg",
  spanError: "peer/error",
} as const;

export const PaginaInicioSesion = () => {
  const [form, setForm] = useState<Rol | null>(null);
  const escuelas = useLoaderData() as Escuela[];
  const rolRef = useRef<null | HTMLSelectElement>(null);
  const errors = useActionData() as ErroresInicioSesion | null;
  console.log(errors);
  const handleRolChange = () => {
    const selectedRol = rolRef.current?.value;
    if (selectedRol !== "Alumno" && selectedRol !== "Personal") return;
    setForm(selectedRol);
  };

  return (
    <main className="font-sans bg-zinc-900 h-screen flex items-center flex-col">
      <p className="text-5xl  text-center  text-blue-50 font-bold pt-4 mb-3">
        Inicio{" "}
        <span className=" text-transparent bg-clip-text bg-gradient-to-t to-blue-500 from-blue-800">
          Sesión
        </span>
      </p>

      <Form
        className=" flex-1  flex justify-between flex-col  my-8"
        method="post"
      >
        <div className=" ">
          <div className={style.divInputs}>
            <label htmlFor="rol" className={style.label}>
              Usuario
            </label>
            {errors?.InvalidRol && <span></span>}
            <select
              ref={rolRef}
              className={style.input}
              name="Rol"
              onChange={handleRolChange}
            >
              <option value="Alumno">Alumno</option>
              <option value="Personal">Personal</option>
            </select>

            {errors && errors.InvalidRol && (
              <p className=" text-red-500"> {errors.InvalidRol} </p>
            )}
          </div>

          {form && (
            <div className={style.divInputs}>
              <label htmlFor="IdEscuela" className={style.label}>
                Ingresa tu Escuela
              </label>

              <select className={style.input} name="IdEscuela">
                {escuelas &&
                  escuelas.map((escuela) => (
                    <option key={escuela.IdEscuela} value={escuela.IdEscuela}>
                      {escuela.Nombre}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {form && (
            <div className={style.divInputs}>
              <label htmlFor="Contraseña" className={style.label}>
                Ingresa tu Contraseña
              </label>
              <input
                className={style.input}
                type="password"
                name="Contraseña"
              />
            </div>
          )}

          {form === "Alumno" && (
            <div className={style.divInputs}>
              <label className={style.label} htmlFor="NoControl">
                Ingresa tu NoControl
              </label>
              {errors?.InvalidNoControl && (
                <span className={style.spanError}></span>
              )}
              <input className={style.input} type="number" name="NoControl" />
            </div>
          )}

          {form === "Personal" && (
            <div className={style.divInputs}>
              <label className={style.label} htmlFor="Nombres">
                Ingresa tus Nombres
              </label>
              {errors?.InvalidNoControl && (
                <span className={style.spanError}></span>
              )}
              <input type="text" name="Nombres" className={style.input} />
            </div>
          )}
        </div>
        {errors && errors.Usuario404 && (
          <p className=" text-red-400  text-center font-bold text-xl">
            Usuario no encontrado
          </p>
        )}

        <div className="my-16 flex justify-center flex-col">
        <div className="mb-5  text-center ">
            <button className="  shadow-button hover:shadow-buttonHover hover:shadow-blue-500 shadow-blue-500 text-2xl mb-6  bg-blue-500 text-white  px-4 py-3 rounded-xl">
              <p>Crear Cuenta</p>
            </button>
          </div>

          <div className="text-center">
            <Link
              className="text-slate-100"
              to={Rutas.Auth + "/" + Rutas.CrearSesionAlumno}
            >
              Crear cuenta alumno
            </Link>
          </div>
        </div>
      </Form>
    </main>
  );
};

type ErroresInicioSesion = {
  InvalidIdEscuela?: boolean;
  InvalidRol?: boolean;
  InvalidContraseña?: boolean;
  InvalidNombres?: boolean;
  InvalidNoControl?: boolean;
  Usuario404?: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const actionInicioSesion = async ({ request }: ActionFunctionArgs) => {
  const data = await request.formData();
  const formulario = Object.fromEntries(data.entries());
  // Definir los tipos para las variables

  const IdEscuela = Number(formulario.IdEscuela);
  const Rol = String(formulario.Rol) as Rol;
  const Nombres = String(formulario.Nombres);
  const Contraseña = String(formulario.Contraseña);
  const NoControl = Number(formulario.NoControl);

  const errores: ErroresInicioSesion = {};

  if (isNaN(IdEscuela) || IdEscuela < 1) {
    errores.InvalidIdEscuela = true;
  }

  if (Rol !== RolConst.Alumno && Rol !== RolConst.Personal) {
    errores.InvalidRol = true;
  }
  if (Contraseña.trim().length < 1) {
    errores.InvalidContraseña = true;
  }

  if (Rol === RolConst.Personal && Nombres.trim().length < 1) {
    errores.InvalidNombres = true;
  }

  if (Rol === RolConst.Alumno && NoControl < 1) {
    errores.InvalidNoControl = true;
  }

  if (Object.values(errores).length >= 1) {
    return errores;
  }

  try {
    const sesion = await iniciarSesion({
      Rol,
      NoControl,
      Nombres,
      IdEscuela,
      Contraseña,
    });

    localStorage.setItem(
      localStorageEnum.Sesion,
      JSON.stringify({ token: sesion.token, rol: Rol, rango: sesion.rango })
    );

    const event = new CustomEvent<Usuario>(EventEnum.iniciarSesion, {
      detail: { token: sesion.token, rol: Rol, rango: sesion.rango },
    });

    document.dispatchEvent(event);

    return redirect(Rutas.Auth);
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.status === 404) return { Usuario404: true };
    }
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderInicioSesion = async () => {
  try {
    const escuelas = await obtenerEscuelas();
    return escuelas;
  } catch (error) {
    console.log(error);
    return null;
  }
};
