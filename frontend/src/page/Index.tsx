import { Link } from "react-router-dom";
import { Rutas } from "../const";

export const Index = () => {
  return (
    <div className=" font-sans items-center overflow-hidden flex-col flex   min-h-screen  h-screen max-h-screen w-screen  bg-gray-800 text-white">
      <p className="max-sm:text-5xl bg-clip-text text-transparent  bg-gradient-to-t to-blue-200 from-blue-800 pt-8 text-8xl text-center uppercase  font-bold mb-4">
        Comida Deliciosa
      </p>

      <div className=" flex-grow w-full  flex flex-col justify-center">
        <img
          className=" h-[50%] object-contain  m-auto"
          src="/taco.png"
          alt="Taco"
        />
      </div>
      <button className="max-sm:text-2xl  shadow-button hover:shadow-buttonHover hover:shadow-blue-500 shadow-blue-500 text-6xl mb-6  bg-blue-500 text-white  px-6 py-4 rounded-full">
        <Link to={Rutas.Auth}>Ordenar YA</Link>
      </button>


    </div>
  );
};
