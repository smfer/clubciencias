import {
  ActionFunctionArgs,
  Form,
  Link,
  redirect,
  useLoaderData,
} from "react-router-dom";
import {

  Pedido_Estado,
  Rutas,
  localStorageEnum,
} from "../../const";


import { PedidoAlumno, Usuario } from "../../types";
import { useAlumno } from "../../context/Alumno";
import {
  crearPedido,
  modificarPedido,
  obtenerPedidoOrdenado,
} from "../../api/alumno";
import { Carrito } from "../../components/Alumno/Carrito";
import { PedidoActual } from "../../components/Alumno/PedidoActual";
import { useModificarPedido } from "../../hooks/Alumno";

const EnumAcciones = {
  Ordenar: "Ordenar",
  Pagar: "Pagar",
} as const;

const acciones = {
  [EnumAcciones.Ordenar]: async (data: FormData, token: string) => {
    const productos = Array.from(data.keys())
      .filter((key) => key.startsWith("producto"))
      .map((key) => {
        const IdProducto = parseInt(key.replace("producto", ""), 10);

        const Cantidad = Number(data.get(key)) ?? 0;
        return { IdProducto, Cantidad };
      });

    try {
      await crearPedido(token, productos);
      return Rutas.Alumno + "/" + Rutas.AlumnoCarrito;
    } catch (error) {
      // Manejar el error de crearPedido
      console.error("Error al crear el pedido:", error);
      throw error;
    }
  },
  [EnumAcciones.Pagar]: async (token: string, IdPedido: number) => {
    if (isNaN(IdPedido)) throw new Error("el id debe ser un numero");
    try {
      await modificarPedido(token, IdPedido);
      return Rutas.Alumno + "/" + Rutas.AlumnoCarrito;
    } catch (error) {
      // Manejar el error de crearPedido
      console.error("Error al crear el pedido:", error);
      throw error;
    }
  },
} as const;

export const AlumnoCarrito = () => {
  const pedidoActual = useLoaderData() as PedidoAlumno | null;
  useModificarPedido();
  console.log(pedidoActual);
  const { carrito } = useAlumno();
  return (
    <div className=" flex flex-1 flex-col overflow-hidden">
      <div className=" flex-1 flex flex-row  overflow-hidden">
        {pedidoActual && pedidoActual.Estado === Pedido_Estado.Ordenado && (
          <div className="flex-1 flex flex-col items-center justify-between overflow-auto max-h-full">
            <PedidoActual PedidoActual={pedidoActual} />
            <button className=" text-slate-100 bg-red-500 rounded-full px-6 py-2 mb-8 mt-4">
              cancelar{" "}
            </button>
          </div>
        )}

        {pedidoActual && pedidoActual.Estado === Pedido_Estado.Aceptado && (
          <div className="flex-1 flex flex-col items-center justify-between overflow-auto max-h-full">
            <PedidoActual PedidoActual={pedidoActual} />
            <button className=" text-slate-100 bg-orange-500 rounded-full px-6 py-2 mb-8 mt-4">
              Tu pedido fue aceptado... Espera a que lo preparen{" "}
            </button>
          </div>
        )}

        {pedidoActual &&
          pedidoActual.Estado === Pedido_Estado.Listo_para_Recoger && (
            <div className="flex-1 flex flex-col items-center justify-center   overflow-auto max-h-full">
              <p className="text-gray-100 text-xl font-bold mb-8">
                Tu pedido ya esta listo
              </p>
              <Form method="POST">
                <button
                  name="accion"
                  value={EnumAcciones.Pagar}
                  className=" bg-green-400 px-8 py-2 rounded-xl text-xl text-slate-100"
                >
                  Pagar
                </button>
                
                <input
                  type="number"
                  hidden
                  defaultValue={pedidoActual.IdPedido}
                  name="IdPedido"
                />
              </Form>
            </div>
          )}

        {pedidoActual && pedidoActual.Estado === Pedido_Estado.Entregado && (
          <div className="flex-1 flex flex-col items-center justify-center   overflow-auto max-h-full">
            <p className="text-gray-100 text-xl font-bold mb-8">
              Espera a que Acepten tu pago
            </p>

            <button className=" bg-green-400 px-8 py-2 rounded-xl text-xl text-slate-100">
              ok
            </button>
          </div>
        )}

        {!pedidoActual && carrito.length >= 1 && (
          <div className=" flex-1 flex flex-col justify-between items-center max-h-full ">
            <Carrito />

            <Form method="POST">
              {carrito.map((producto) => {
                return (
                  <input
                    type="number"
                    key={producto.IdProducto}
                    name={"producto" + producto.IdProducto}
                    defaultValue={producto.Cantidad}
                    hidden
                  />
                );
              })}

              <button
                name="accion"
                value={EnumAcciones.Ordenar}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 self-center text-white rounded-3xl p-5 px-16  mt-6 mb-10 "
              >
                Ordenar Carrito
              </button>
            </Form>
          </div>
        )}

        {!pedidoActual && carrito.length < 1 && (
          <div className="flex-1 flex justify-evenly items-center flex-col ">
            <div className=" pb-10 flex flex-col">
              <p className=" text-3xl mb-8 font-bold text-slate-100">
                Tu carrito está vacío
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
export const actionCarrito = async ({ request }: ActionFunctionArgs) => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;
  if (sesionJson.rol !== "Alumno") return redirect(Rutas.Auth);

  const data = await request.formData();
  const formulario = Object.fromEntries(data.entries());

  const IdPedido = Number(formulario.IdPedido);

  let ruta: string = "";
  try {
    const accion = String(formulario.accion);

    if (EnumAcciones.Pagar !== accion && EnumAcciones.Ordenar !== accion)
      return null;

    if (accion === EnumAcciones.Ordenar) {
      ruta = await acciones[accion](data, sesionJson.token);
    }
    if (accion === EnumAcciones.Pagar) {
      ruta = await acciones[accion](sesionJson.token, IdPedido);
    }

    return redirect(ruta);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderCarrito = async () => {
  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;
  try {
    return await obtenerPedidoOrdenado(sesionJson.token);
  } catch (error) {
    return null
  }
};
