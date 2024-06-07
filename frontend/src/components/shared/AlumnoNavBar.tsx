import {  Link } from "react-router-dom";
import { Rutas } from "../../const";
import { FaHome, FaShoppingCart, FaClipboardList, FaCog } from "react-icons/fa";
import { FC } from "react";
import { IconType } from "react-icons";

export const AlumnoNavBar = () => {
  return (
    <div className=" bg-gray-950 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <NavLink to={Rutas.Alumno} Icon={FaHome} />
        <NavLink
          to={Rutas.Alumno + "/" + Rutas.AlumnoCarrito}
          Icon={FaShoppingCart}
        />
        <NavLink
          to={Rutas.Alumno + "/" + Rutas.AlumnoPedidos}
          Icon={FaClipboardList}
        />
        <NavLink
          to={Rutas.Alumno + "/" + Rutas.AlumnoConfiguracion}
          Icon={FaCog}
        />
      </div>
    </div>
  );
};

const NavLink: FC<{ to: string; Icon: IconType }> = ({ to, Icon }) => {
  return (
    <Link
      to={to}
      className="text-white h-20 w-20 flex flex-col items-center justify-center mb-4 md:mb-0 hover:bg-gray-800 rounded transition duration-300"
    >
      <Icon className=" w-14 h-14" />
    </Link>
  );
};
