import { NextFunction, Request, Response } from "express";
import { verify, sign } from "jsonwebtoken";
import { prisma } from "../helpers/BaseDatos";
import { Alumno, Personal, Personal_Rol } from "@prisma/client";
import { Rol, Sesion } from "../type";
import { Rol as ROL } from "../helpers/const";

export const Verificar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let usuario: Personal | Alumno | null = null;

  const token = req.header("authorization");

  if (!token) return res.status(401).json({ error: "No estas autentificado" });
  try {
    const sesion = await verificarToken(token);

    if (sesion.rol === "Alumno") {
      usuario = await prisma.alumno.findFirst({
        where: { IdAlumno: sesion.id },
      });
    }
    if (sesion.rol === "Personal") {
      usuario = await prisma.personal.findFirst({
        where: { IdPersonal: sesion.id },
      });
    }

    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    if ("IdAlumno" in usuario) {
      req.SesionAlumno = usuario;
    } else {
      req.SesionPersonal = usuario;
    }
    next();
  } catch (error) {
    console.log(error)
    res.status(500).json(error);
  }
};

export const AutentificarRol = (rol: Rol) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (
      (rol === ROL.Alumno && !req.SesionAlumno) ||
      (rol === ROL.Personal && !req.SesionPersonal)
    ) {
      return res.status(401).json({ error: "No  Tienes permiso para acceder" });
    }
    next();
  };
};

export const AutentificarPersonal = (rol: Personal_Rol[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!rol.includes(req.SesionPersonal.Rol))
      return res
        .status(401)
        .json({ error: "No tienes el suficiente acceso para acceder" });
    next();
  };
};

export const verificarToken = (token: string) => {
  return new Promise<Sesion>((resolve, reject) => {
    if (!process.env.SECRETTOKEN)
      return reject(new Error("Tuvimos un error en el servidor "));

    verify(token, process.env.SECRETTOKEN, (error, sesion) => {
      if (error || !sesion || typeof sesion !== "object") {
        return reject(new Error("Token Invalido"));
      }

      const { rol, id } = sesion;
      if (typeof rol !== "string" || (rol !== "Alumno" && rol !== "Personal")) {
        reject(new Error("Token Invalido"));
      } else {
        resolve({ rol, id });
      }
    });
  });
};

export const generarToken = ({ rol, id}: Sesion) => {
  return new Promise<string>((resolve, reject) => {
    if (!process.env.SECRETTOKEN) {
      reject(new Error("Tuvimos un error en el servidor"));
      return;
    }

    sign(
      { rol, id},
      process.env.SECRETTOKEN,
      (error: Error | null, token: string | undefined) => {
        if (error || !token) {
          reject(error);
        } else {
          resolve(token);
        }
      }
    );
  });
};
