import { FC } from "react";
import { PedidoAlumno } from "../../types";

export const Pedidos :FC<{pedidos:PedidoAlumno[]}>= ({pedidos}) => {

  return (
    <div className="overflow-auto w-full flex  flex-col items-center  bg-gray-900 text-white">
      {pedidos &&
        pedidos.map((pedido) => (
          <div key={pedido.IdPedido} className="mb-8 bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-3xl font-bold mb-4">Resumen del Pedido</h2>
            <p className="text-gray-500 mb-2">Estado del pedido: {pedido.Estado}</p>

            <div className="border-t border-b border-gray-700 my-4">
              <h3 className="text-2xl font-semibold mb-2">Productos Ordenados</h3>
              <ul>
                {pedido.DetallesPedido.map((detalle) => (
                  <li key={detalle.IdDetallesPedido} className="mb-4">
                    <h4 className="text-xl font-medium mb-2">Producto</h4>
                    <p className="mb-1">Nombre: {detalle.Producto.Nombre}</p>
                    <p className="mb-1">Precio: {detalle.Producto.Precio}</p>
                    <p className="mb-1">Cantidad: {detalle.Cantidad}</p>
                    <p>
                      Subtotal: ${detalle.Producto.Precio * detalle.Cantidad}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
    </div>
  );
};

