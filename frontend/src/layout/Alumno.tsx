import { Navigate, Outlet } from "react-router-dom";
import { useSesion } from "../context/Sesion";
import { Rutas } from "../const";
import { AlumnoNavBar } from "../components/shared/AlumnoNavBar";
import { AlumnoProvider } from "../context/Alumno";

export const LayoutAlumno = () => {
  const { sesion } = useSesion();
  if (sesion && sesion.rol === "Alumno") return <Alumno />;

  return <Navigate to={Rutas.Auth} />;
};

const Alumno = () => {
  return (
    <AlumnoProvider>
      <div className="max-h-screen min-h-screen w-screen bg-gray-800  flex flex-col overflow-hidden">
        <Outlet />
        <AlumnoNavBar />
      </div>
    </AlumnoProvider>
  );
};
