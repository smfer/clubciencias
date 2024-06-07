import { Link, redirect, useLoaderData } from "react-router-dom";
import { Rutas, localStorageEnum } from "../../const";
import { PedidoAlumno, Usuario } from "../../types";
import { obtenerPedidos } from "../../api/alumno";
import { Pedidos } from "../../components/Alumno/Pedidos";

export const AlumnoPedidos = () => {
  const pedidos = useLoaderData() as PedidoAlumno[];

  return (
    <div className="flex-1 flex flex-col overflow-clip">
      {/* Contenido principal */}
      <div className="flex-1 text-slate-100 flex  overflow-clip">
        {pedidos.length > 0 && <Pedidos pedidos={pedidos} />}

        {pedidos.length === 0 && (
          <div className="flex-1 flex justify-evenly items-center flex-col ">
            <div className=" pb-10 flex flex-col">
              <p className=" text-3xl mb-8 font-bold text-slate-100">
                Sin pedidos
              </p>
            </div>
            <Link className=" " to={Rutas.Alumno}>
              <button className="bg-blue-500 hover:bg-blue-600 rounded-3xl p-5 px-8 text-slate-100">
                Explorar Productos
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderAlumnoPedidos = async () => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;

  try {
    return await obtenerPedidos(sesionJson.token);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
