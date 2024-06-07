import {
    ActionFunctionArgs,
    Link,
    redirect,
    useLoaderData,
  } from "react-router-dom";
  import { EventEnum, Rutas, localStorageEnum } from "../../const";
  import { Escuela, Usuario } from "../../types";
  import { crearSesionPersonal } from "../../api/sesion";
  import { obtenerEscuelas } from "../../api/escuela";

  type ErroresFormulario = {
    IdEscuela?: string;
    Nombres?: string;
    Contrase_a?: string;
    ContraseñaEscuela?: string;
  }

  export const PaginaCrearPersonal = () => {
    const escuelas = useLoaderData() as Escuela[];

    return (
      <div className="bg-zinc-900 h-screen flex   items-center flex-col">
        <p className=" text-5xl  font-sans  text-center text-blue-50 font-bold pt-4 mb-3">
          Crear <span className="text-red-700">Sesion </span>{" "}
        </p>
        <form className=" flex-1 flex flex-col justify-between py-8">
          <div>
            <div className="flex flex-col mx-4 mb-2">
              <label className="text-slate-100 text-lg" htmlFor="">
                Ingrese su Nombre
              </label>
              <input
                className="px-2 m-1 rounded-lg py-1 outline-none"
                type="text"
                name={"Nombres"}
              />
            </div>

            <div className="flex flex-col mx-4 mb-2">
              <label className="text-slate-100 text-lg" htmlFor="">
                Ingrese su Contraseña
              </label>
              <input
                className="px-2 m-1 rounded-lg py-1 outline-none"
                type="password"
                name={"Contrase_a"}
              />
            </div>

            <div className="flex flex-col mx-4 mb-2">
              <label className="text-slate-100 text-lg" htmlFor="">
                Ingrese la contraseña de la Escuela
              </label>
              <input
                className="px-2 m-1 rounded-lg py-1 outline-none"
                type="password"
                name={"ContraseñaEscuela"}
              />
            </div>

            <div className="flex flex-col mx-4 mb-2">
              <label className="text-slate-100 text-lg" htmlFor="">
                Ingresa su Escuela
              </label>
              <select
                className="px-2 m-1 rounded-lg py-1 outline-none"
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
            </div>
          </div>

          <div className="mb-16 flex justify-center flex-col">
            <div className="mb-7  text-center ">
              <button className=" text-slate-100 p-4 px-12 rounded-2xl bg-red-600">
                <p>Crear Cuenta</p>
              </button>
            </div>
            <div className="text-center">
              <Link className=" text-slate-100 " to={Rutas.Auth}>
                Iniciar Sesion
              </Link>
            </div>
          </div>
        </form>
      </div>
    );
  };

  // eslint-disable-next-line react-refresh/only-export-components
  export const actionCrearPersonal = async ({ request }: ActionFunctionArgs) => {
    const data = await request.formData();

    const formulario = Object.fromEntries(data.entries());
    const errores: ErroresFormulario = {};

    const IdEscuela = Number(formulario.IdEscuela);
    const Nombres = String(formulario.Nombres);
    const Contrase_a = String(formulario.Contrase_a);
    const ContraseñaEscuela = String(formulario.ContraseñaEscuela);
  
    // Validaciones y acumulación de errores
    if (isNaN(Number(IdEscuela)) || IdEscuela < 0) {
      errores.IdEscuela = "El campo IdEscuela debe ser un número";
    }
    if (typeof Nombres !== "string"||Nombres.length < 1 ) {
      errores.Nombres = "El campo Nombres debe ser una cadena de texto";
    }
    if (typeof Contrase_a !== "string" || Contrase_a.length < 1) {
      errores.Contrase_a = "El campo Contrase_a debe ser una cadena de texto";
    }
    if (typeof ContraseñaEscuela !== "string"|| ContraseñaEscuela.length < 1) {
      errores.ContraseñaEscuela =
        "El campo ContraseñaEscuela debe ser una cadena de texto";
    }

    if (Object.keys(errores).length > 0) {
      return errores;
    }

    try {
      // Lógica para crear la sesión personal
      const sesion = await crearSesionPersonal({
        Nombres,
        IdEscuela,
        ContraseñaEscuela,
        Contrase_a,
      });

      localStorage.setItem(
        localStorageEnum.Sesion,
        JSON.stringify({
          rango: sesion.rango,
          token: sesion.token,
          rol: "Personal",
        })
      );
      const event = new CustomEvent<Usuario>(EventEnum.iniciarSesion, {
        detail: { rango: sesion.rango, token: sesion.token, rol: "Personal" },
      });
      document.dispatchEvent(event);
      return redirect(Rutas.Personal);
    } catch (error) {
      return { error: "Se produjo un error durante la creación de la sesión" };
    }
  };

  // eslint-disable-next-line react-refresh/only-export-components
  export const loaderCrearPersonal = async () => {
    try {
      const escuelas = await obtenerEscuelas();
      return escuelas;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
