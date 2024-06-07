import { Navigate, Outlet } from "react-router-dom";
import { useSesion } from "../context/Sesion";
import { Personal_Rol, Rol, Rutas } from "../const";
import { PersonalNavBar } from "../components/shared/PersonalNavbar";

export const LayoutPersonal = () => {
  const { sesion } = useSesion();

  if (!sesion || sesion.rol !== Rol.Personal)
    return <Navigate to={Rutas.Auth} />;

  return (
    <div className="flex flex-col min-h-screen max-h-screen  bg-gray-900">
      <Outlet />
      <PersonalNavBar/>
    </div>
  );
};

export const LayoutCajero = () => {
  const { sesion } = useSesion();
  if (!sesion) return <Navigate to={"/"} />;
  if (sesion.rol !== Rol.Personal && sesion.rango === Personal_Rol.Cajero)
    return <Navigate to={Rutas.Auth} />;
  return <Outlet />;
};

export const LayoutGerente = () => {
  const { sesion } = useSesion();
  if (!sesion) return <Navigate to={"/"} />;
  if (
    sesion.rol !== Rol.Personal &&
    sesion.rango === Personal_Rol.Gerente_de_Cafeter_a
  )
    return <Navigate to={Rutas.Auth} />;
  return <Outlet />;
};

/*
 useEffect(() => {
   

  */
