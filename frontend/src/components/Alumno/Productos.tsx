import { FC } from "react";
import { useAlumno } from "../../context/Alumno";
import { Producto } from "../../types";

export const Productos: FC<{ productos: Producto[] }> = ({ productos }) => {
  const { agregarProducto } = useAlumno();
  return (
    <div className=" flex-1 flex mt-12 py-3 w-screen overflow-auto   items-center">
      {productos &&
        productos.map((producto) => (
          <div
            className=" flex flex-col  items-center bg-gray-700 rounded-3xl py-6  mx-6 px-12 shadow-2xl shadow-slate-900"
            key={producto.IdProducto}
          >
            <div className=" w-40 max-md:w-28  max-md:-mt-16 rounded-full text-center overflow-hidden bottom-16 shadow-2xl  -mt-20">
              <img className=" object-cover" alt="" src={producto.Url} />
            </div>

            <h2 className=" font-bold  text-4xl font-mono text-center text-slate-100 mt-9">
              {producto.Nombre}
            </h2>
            <p className=" text-center font-bold text-xl text-slate-100 mb-2">
              ${producto.Precio}
            </p>

            <button
              className=" rounded-xl bg-slate-600 hover:bg-slate-500 text-slate-100  px-8 py-2   text-xl "
              onClick={() => {
                agregarProducto(producto);
              }}
            >
              ordenar
            </button>
          </div>
        ))}
    </div>
  );
};



