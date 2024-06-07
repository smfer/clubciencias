import { FC } from "react";
import { PedidoAlumno } from "../../types";

export const PedidoActual:FC<{PedidoActual:PedidoAlumno}> = ({PedidoActual}) => {
  
  return (
    <div className="bg-gray-800 p-4 rounded-md mb-4  my-10 ">
      {PedidoActual && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-white">Pedido Actual</h2>
          <p className="text-gray-300 mb-2">Estado: {PedidoActual.Estado}</p>
          <p className="text-gray-300 mb-2">Lista de Productos</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PedidoActual.DetallesPedido.map((detalle) => (
              <div key={detalle.IdDetallesPedido} className="bg-gray-700 p-4 rounded-md">
                <p className="text-blue-400 font-semibold mb-2">
                  Nombre: {detalle.Producto.Nombre}
                </p>
                <p className="text-gray-300 mb-2">Precio: ${detalle.Producto.Precio}</p>
                <p className="text-gray-300 mb-2">Cantidad: {detalle.Cantidad}</p>
                <p className="text-gray-300">Subtotal: ${detalle.Cantidad * detalle.Producto.Precio}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

