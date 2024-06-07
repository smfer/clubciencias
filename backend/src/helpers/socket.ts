import { Server } from "socket.io";
import { verificarToken } from "../middlewares/Autentificar";
import { prisma } from "./BaseDatos";
import { Rol, socketEnum } from "./const";




export const connect = (io: Server) => {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;

    if (typeof token !== "string") return next(new Error("Sin permisos"));

    try {
      const sesion = await verificarToken(token);

      if (sesion.rol === Rol.Alumno) {
        socket.join([socketEnum.ALUMNO.concat(sesion.id.toString())]);
      }

      if (sesion.rol === Rol.Personal) {
        const personal = await prisma.personal.findUniqueOrThrow({
          where: { IdPersonal: sesion.id },
        });

        socket.join([socketEnum.ESCUELA.concat(personal.IdEscuela.toString())]);
      }
      next();
    } catch (error) {
      return next(new Error("sin permisos"));
    }
  });
};
