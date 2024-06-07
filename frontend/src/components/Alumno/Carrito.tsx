import { useAlumno } from "../../context/Alumno";

export const Carrito = () => {
  const { carrito, quitarProducto, agregarProducto } = useAlumno();

  return (
    <div className=" max-h-full w-full overflow-auto flex-wrap  items-center flex flex-col flex-1">
      {carrito &&
        carrito.map((producto) => (
          <div
            key={producto.IdProducto}
            className="bg-gray-700 box-border mt-6  mx-4 flex flex-row py-6 rounded-xl  overflow-hidden"
          >
            <div className=" ml-2     max-w-full rounded-full overflow-hidden ">
              <img className="w-28 h-full " src={producto.Url} alt="" />
            </div>
            <div className="flex flex-col pl-6 max-w-full overflow-hidden">
              <p className=" text-slate-100 font-bold text-2xl max-w-full mb-2 text-ellipsis overflow-hidden">
                {producto.Nombre}
              </p>
              <div className="flex flex-row  gap-14 ">
                <p className=" text-slate-200">${producto.Precio}</p>
                <div className=" mr-3 flex bg-blue-500 p-2 px-3 rounded-full">
                  <button
                    onClick={() => agregarProducto(producto)}
                    className=" px-2 text-slate-100"
                  >
                    +
                  </button>
                  <p className="text-slate-100">{producto.Cantidad}</p>
                  <button
                    onClick={() => quitarProducto(producto.IdProducto)}
                    className=" px-2 text-slate-100"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};
