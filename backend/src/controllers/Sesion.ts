import { prisma } from "../helpers/BaseDatos";
import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import { Alumno, Personal, Personal_Rol } from "@prisma/client";
import { generarToken } from "../middlewares/Autentificar";
import { ValidarNumber, ValidarString } from "../helpers/functions";
import { AuthError, ValidatorError } from "../helpers/Error";
import { Rol as ROL } from "../helpers/const";
import { Rol } from "../type";

export const iniciarSesion = async (req: Request, res: Response) => {
  const Rol = String(req.body.Rol) as Rol ;
  const Contraseña = String(req.body.Contraseña);
  const IdEscuela = Number(req.body.IdEscuela);
  const NoControl = Number(req.body.NoControl);
  const Nombres = String(req.body.Nombres);

  let usuario: Personal | null | Alumno = null;

  try {
    if (!Object.keys(ROL).includes(Rol))
      throw new ValidatorError("Ingresa un rol valido", 400);
    if (typeof IdEscuela !== "number" || IdEscuela < 1)
      new ValidatorError("Ingresa una escuela valdia", 400);
    if (typeof Contraseña !== "string" || Contraseña.length < 1)
      throw new ValidatorError("La Contraseña debe ser valida", 400);

    if (Rol === ROL.Alumno) {
      if (typeof NoControl !== "number" || NoControl < 1)
        throw new ValidatorError("Ingrese un numero de control valido", 400);

      usuario = await prisma.alumno.findFirst({
        where: { IdEscuela, NoControl },
      });
    }

    if (Rol === ROL.Personal) {
      if (typeof Nombres !== "string" || Nombres.length < 1)
        throw new ValidatorError("Ingrese nombres validos", 400);
      usuario = await prisma.personal.findFirst({
        where: { IdEscuela, Nombres },
      });
    }

    if (!usuario) throw new AuthError("Usuario no encontrada", 404);

    if (!(await compare(Contraseña, usuario.Contrase_a)))
      throw new AuthError("Las contraseñas no coinciden", 401);

    if ("IdPersonal" in usuario) {
      const token = await generarToken({
        rol: "Personal",
        id: usuario.IdPersonal,
      });
      return res.status(200).json({ token, rango: usuario.Rol });
    }

    if ("IdAlumno" in usuario) {
      const token = await generarToken({
        rol: "Personal",
        id: usuario.IdAlumno,
      });
      return res.status(200).json({ token });
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: "Tuvimos un problema en el servidor" });
  }
};

export const crearSesionAlumno = async (req: Request, res: Response) => {
  const { Nombres, NoControl, IdEscuela, Contrase_a }: Alumno = req.body;

  try {
    ValidarString(Nombres, new ValidatorError("Ingresa nombres validos", 400));
    ValidarString(
      Nombres,
      new ValidatorError("Ingrese una contraseña valida", 400)
    );
    ValidarNumber(
      IdEscuela,
      new ValidatorError("La escuela debe ser valida", 400)
    );
    ValidarNumber(
      NoControl,
      new ValidatorError("El numero de control debe ser un numero", 400)
    );

    const escuela = await prisma.escuela.findUnique({
      where: { IdEscuela },
    });

    if (!escuela) throw new AuthError("La escuela ingresada no existe ", 404);

    const existeAlumno = await prisma.alumno.findFirst({
      where: { IdEscuela, NoControl },
    });

    if (existeAlumno) throw new AuthError("El alumno ya existe", 403);

    const contraseñaHaseada = await hash(Contrase_a, 10);
    const alumo = await prisma.alumno.create({
      data: { IdEscuela, Nombres, NoControl, Contrase_a: contraseñaHaseada },
    });

    const token = await generarToken({ rol: "Alumno", id: alumo.IdAlumno });

    res.status(200).json({ token });
  } catch (error) {
    console.log(error);

    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });

    res.status(500).json(error);
  }
};

export const crearSesionPersonal = async (req: Request, res: Response) => {
  const { Nombres, Contrase_a, IdEscuela }: Personal = req.body;
  const { ContraseñaEscuela }: { ContraseñaEscuela: string } = req.body;

  try {
    ValidarString(
      Nombres,
      new ValidatorError("El nombre debe ser valido", 400)
    );
    ValidarString(
      Contrase_a,
      new ValidatorError("La contraseña debe ser valida", 400)
    );
    ValidarString(
      ContraseñaEscuela,
      new ValidatorError("La contraseña de la escuela debe ser valida", 400)
    );
    ValidarNumber(
      IdEscuela,
      new ValidatorError("La escuela debe ser valida", 400)
    );

    const escuela = await prisma.escuela.findUnique({
      where: { IdEscuela },
    });

    if (!escuela) throw new AuthError("La escuela ingresada no existe ", 404);

    if (!(await compare(ContraseñaEscuela, escuela.Contrase_a)))
      throw new AuthError("La Contraseña no coincide ", 403);

    const contraseñaHaseada = await hash(Contrase_a, 10);

    const personal = await prisma.personal.create({
      data: {
        Nombres,
        Contrase_a: contraseñaHaseada,
        IdEscuela,
        Rol: Personal_Rol.Administrador,
      },
    });

    const token = await generarToken({
      rol: "Personal",
      id: personal.IdPersonal,
    });
    res.status(200).json({ token, rango: personal.Rol });
  } catch (error) {
    console.log(error);

    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: "Tuvimos un problema en el servidor" });
  }
};
