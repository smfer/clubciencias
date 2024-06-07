import { Link } from "react-router-dom";
import { Rutas } from "../../const";

export const GerenteIndex = () => {
  return (
    <div className=" flex-1 bg-gray-900 flex flex-row overflow-hidden">
      <div className="flex flex-col py-12">
        <ol className="flex">
          <button className="px-6 py-2 mx-4 bg-slate-100 rounded-lg">
            <Link to={Rutas.Personal + "/" + Rutas.Gerente + "/Categorias"}>
              Categorías
            </Link>
          </button>
          <button className="px-6 py-2 mx-4 bg-slate-100 rounded-lg">
            <Link to={Rutas.Personal + "/" + Rutas.Gerente + "/Productos"}>
              Productos
            </Link>
          </button>
        </ol>
      </div>
      <div className="flex-1 flex justify-center items-center text-white ">
        Selecciona una opción
      </div>
    </div>
  );
};
