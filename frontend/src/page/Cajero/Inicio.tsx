import {
  Link,
  LoaderFunctionArgs,
  Outlet,
  redirect,
  useLoaderData,
  useLocation,
} from "react-router-dom";
import {
  Filtro,
  Personal_Rol,
  Rol,
  Rutas,
  localStorageEnum,
} from "../../const";
import { Filtro as typeFiltro, Usuario } from "../../types";
import { obtenerPedidos } from "../../api/Personal/Cajero";
import { Pedido } from "../../types/personal";
import { useNuevoPedido } from "../../hooks/Personal";

export const CajeroInicio = () => {
  const pedidos = useLoaderData() as Pedido[];
  const location = useLocation();
  const url = location.pathname.split("/");
  const path = url[url.length-1]
  useNuevoPedido();
  return (
    <div className="flex-1 bg-gray-900 flex flex-row overflow-hidden">
      <div className="flex flex-col   ">
        <ol className="  py-12">
          <button className=" px-6 py-2 mx-4 bg-slate-200 rounded-lg">
            <Link to={Rutas.Personal + "/" + Rutas.Cajero + "/Aceptados"}>
              Aceptados
            </Link>
          </button>
          <button className=" px-6 py-2 mx-4 bg-slate-200 rounded-lg">
            <Link to={Rutas.Personal + "/" + Rutas.Cajero + "/Ordenados"}>
              Ordenados
            </Link>
          </button>

          <button className=" px-6 py-2 mx-4 bg-slate-200 rounded-lg">
            <Link to={Rutas.Personal + "/" + Rutas.Cajero + "/Entregados"}>
              Entregados
            </Link>
          </button>
        </ol>

        {pedidos.length >= 1 && (
          <div
            className="flex flex-col  bg-custom-color overflow-auto scroll-m-0 max-h-screen shadow-md mt-4 mb-4"
            style={{
              scrollbarColor: "red", // Cambia estos colores según tus preferencias
              scrollbarWidth: "thin", // Ajusta el ancho del scrollbar (thin, auto, etc.)
            }}
          >
            {pedidos.map((pedido, index) => (
              <div
                key={index}
                className={`my-4 pl-1 pr-8 bg-slate-600 text-white rounded-r-2xl ${
                  index === pedidos.length - 1 ? "mb-4" : ""
                }`}
              >
                <p className=""> Pedido N°: {pedido.IdPedido}</p>
                <p>Total:{pedido.Total}</p>
                <p className="text-center">
                  <button className="p-3">
                    <Link to={path ===  "Cajero" ? "Ordenados" :"" + pedido.IdPedido}> Ver Detalles </Link>
                  </button>
                </p>
              </div>
            ))}
          </div>
        )}

        {pedidos.length < 1 && (
          <div
            className="flex-1 flex justify-center items-center text-white"
            style={{
              scrollbarColor: "red", // Cambia estos colores según tus preferencias
              scrollbarWidth: "thin", // Ajusta el ancho del scrollbar (thin, auto, etc.)
            }}
          >
            Sin pedidos :C
          </div>
        )}
      </div>

      <Outlet />
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderCajeroInicio = async ({ params }: LoaderFunctionArgs) => {
  const filtro: typeFiltro | null = Filtro[params.filtro as typeFiltro];
  if (!filtro) throw new Error();

  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) throw new Error();

  const sesionJson = JSON.parse(sesion) as Usuario;
  if (
    sesionJson.rol !== Rol.Personal &&
    sesionJson.rango !== Personal_Rol.Cajero &&
    sesionJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
  )
    throw new Error();

  try {
    return await obtenerPedidos(sesionJson.token, filtro);
  } catch (error) {
    console.log(error);
    return error;
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderCajeroIndex = async () => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);

  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;

  if (
    sesionJson.rol !== Rol.Personal &&
    sesionJson.rango !== Personal_Rol.Administrador &&
    sesionJson.rango !== Personal_Rol.Cajero
  )
    return redirect(Rutas.Auth);
  try {
    console.log("2")
    
    return await obtenerPedidos(sesionJson.token, Filtro.Ordenados);
  } catch (error) {
    alert(error);
    return error;
  }
};
