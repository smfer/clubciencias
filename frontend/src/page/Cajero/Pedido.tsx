import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import {
  Pedido_Estado,
  Personal_Rol,
  Rol,
  Rutas,
  localStorageEnum,
} from "../../const";
import { Pedido_Estado as TypePedido_Estado, Usuario } from "../../types";
import { editarPedido, obtenerPedido } from "../../api/Personal/Cajero";
import { Pedido } from "../../types/personal";
export const CajeroPedido = () => {
  const pedido = useLoaderData() as Pedido;

  return (
    <div className="flex  flex-1 items-center justify-center">
      <div className=" flex   items-center  flex-col bg-gray-800 text-white rounded-lg shadow-md p-12">
        <h2 className="text-3xl font-bold mb-4">Resumen del Pedido</h2>
        <p className="text-gray-500 mb-2">Estado del pedido: {pedido.Estado}</p>
        <p className="text-gray-500 mb-2">Total del Pedido: {pedido.Total}</p>

        <div className="border-t border-b border-gray-700 my-4">
          <h3 className="text-2xl font-semibold mb-2">Productos Ordenados</h3>
          <ul>
            {pedido.DetallesPedido.map((detalle) => (
              <li key={detalle.IdDetallesPedido} className="mb-4">
                <h4 className="text-xl font-medium mb-2">Producto</h4>
                <p className="mb-1">Nombre: {detalle.Producto.Nombre}</p>
                <p className="mb-1">Precio: {detalle.Producto.Precio}</p>
                <p className="mb-1">Cantidad: {detalle.Cantidad}</p>
                <p>Subtotal: ${detalle.SubTotal}</p>
              </li>
            ))}
          </ul>
        </div>

        <Form method="POST" className="mb-4">
          {pedido.Estado === "Ordenado" && (
            <button
              className="bg-green-500 text-white py-2 px-4  mx-2   rounded hover:bg-green-600"
              value={"aceptar"}
              name="accion"
            >
              Aceptar
            </button>
          )}
          {pedido.Estado === "Aceptado" && (
            <button
              className="bg-green-500 text-white py-2 px-4   mx-2  rounded hover:bg-green-600"
              value={"EntregarPedido"}
              name="accion"
            >
              Entregar
            </button>
          )}

          {pedido.Estado === "Entregado" && (
            <button
              className="bg-green-500 text-white py-2 px-4   mx-2  rounded hover:bg-green-600"
              value={"aceptarPago"}
              name="accion"
            >
              Aceptar Pago
            </button>
          )}
          <button
            className="bg-red-500 text-white py-2 px-4  mx-2 rounded hover:bg-red-600"
            value={"eliminar"}
            name="accion"
          >
            Cancelar
          </button>
        </Form>

        <Link
          to={".."}
          className="bg-blue-500 text-white py-2 px-4  mx-2 rounded hover:bg-blue-600"
        >
          Volver
        </Link>
      </div>
    </div>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const loaderCajeroPedido = async ({ params }: LoaderFunctionArgs) => {
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
    return await obtenerPedido(sesionJson.token, Number(params.IdPedido));
  } catch (error) {
    console.log(error);
  }
};

// eslint-disable-next-line react-refresh/only-export-components
export const actionCajeroPedido = async ({
  request,
  params,
}: ActionFunctionArgs) => {
  const form = await request.formData();
  const datos = Object.fromEntries(form.entries());

  let estado: TypePedido_Estado | null = null;

  if (datos.accion === "eliminar") estado = Pedido_Estado.Cancelado;
  if (datos.accion === "aceptar") estado = Pedido_Estado.Aceptado;
  if (datos.accion === "EntregarPedido")
    estado = Pedido_Estado.Listo_para_Recoger;
  if (datos.accion === "aceptarPago") estado = Pedido_Estado.Pago_Realizado;

  if (estado === null) return null;

  const sesion = localStorage.getItem(localStorageEnum.Sesion);
  if (!sesion) return redirect(Rutas.Auth);
  const sesionJson = JSON.parse(sesion) as Usuario;

  if (
    sesionJson.rol !== Rol.Personal &&
    sesionJson.rango !== Personal_Rol.Cajero &&
    sesionJson.rango !== Personal_Rol.Gerente_de_Cafeter_a
  )
    return redirect(Rutas.Auth);

  const pedido = await editarPedido(
    sesionJson.token,
    estado,
    Number(params.IdPedido)
  );

  console.log(pedido);
  return redirect("..");
};
