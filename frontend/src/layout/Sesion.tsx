import { Navigate, Outlet } from "react-router-dom";
import { useSesion } from "../context/Sesion";
import { Rutas } from "../const";

export const LayoutAuth = () => {
  const { sesion } = useSesion();
  if (!sesion) return <Outlet />;
  if (sesion.rol === "Alumno") return <Navigate to={Rutas.Alumno} />;
  if (sesion.rol === "Personal") return <Navigate to={Rutas.Personal} />;
};
