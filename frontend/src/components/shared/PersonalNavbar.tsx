import { Link, Navigate } from "react-router-dom";
import { Rutas } from "../../const";
import { useSesion } from "../../context/Sesion";
import {  FaCog, FaChartBar, FaStore, FaCogs } from 'react-icons/fa';
import { FC } from "react";
import { IconType } from "react-icons";

export const PersonalNavBar = () => {
  const { sesion } = useSesion();

  if (!sesion || sesion.rol !== "Personal") return <Navigate to={Rutas.Auth} />;
  
  return (
    <div className=" bg-gray-950 p-4">
      <div className="container mx-auto flex items-center justify-between">
          {(sesion.rango === "Cajero" ||
            sesion.rango === "Gerente_de_Cafeter_a") && (
            <NavLink to={Rutas.Personal + "/" + Rutas.Cajero} Icon={FaStore } />
          )}

          {sesion.rango === "Gerente_de_Cafeter_a" && (
            <NavLink to={Rutas.Personal + "/" + Rutas.Gerente} Icon={FaChartBar } />
          )}

          {sesion.rango === "Analista_de_Datos" && (
            <NavLink to={Rutas.Personal + "/" + Rutas.Administrador} Icon={FaCog} />
          )}

          {sesion.rango === "Administrador" && (
            <NavLink to={Rutas.Personal + "/" + Rutas.Administrador} Icon={FaCog } />
          )}

          <NavLink to={Rutas.Personal + "/" + Rutas.PersonalConfigucarion} Icon={FaCogs} />
        </div>
    </div>
  );
};

const NavLink: FC<{to:string,Icon:IconType}>  = ({ to, Icon }) => {
  return (
    <Link
      to={to}
      className="text-white h-20 w-20 flex flex-col items-center justify-center mb-4 md:mb-0 hover:bg-gray-800 rounded transition duration-300"
    >
      <Icon className=" w-14 h-14"/>
    </Link>
  );
};
