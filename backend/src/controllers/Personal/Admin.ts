import { Request, Response } from "express";
import { Personal, Personal_Rol } from "@prisma/client";
import { hash } from "bcrypt";
import { prisma } from "../../helpers/BaseDatos";
import {  ValidarString } from "../../helpers/functions";
import { AuthError, ValidatorError } from "../../helpers/Error";

//Middelwares para el admin
export const crearPersonal = async (req: Request, res: Response) => {
  let { Nombres, Rol, Contrase_a }: Personal = req.body;
  console.log();
  try {
    Nombres = ValidarString(
      Nombres,
      new ValidatorError("Los nombres deben ser validos", 400)
    );
    Contrase_a = ValidarString(
      Contrase_a,
      new ValidatorError("La contraseña debe ser valida", 400)
    );

    if (!Object.keys(Personal_Rol).includes(Rol))
      throw new ValidatorError("El rol debe ser valido", 400);
  } catch (error) {
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });
    res.sendStatus(500);
    return;
  }

  try {
    const contraseñaHaseada = await hash(Contrase_a, 10);
    const personal = await prisma.personal.create({
      data: {
        Contrase_a: contraseñaHaseada,
        IdEscuela: req.SesionPersonal.IdEscuela,
        Nombres,
        Rol,
      },
      select: {
        IdPersonal: true,
        Contrase_a: false,
        Escuela: { select: { Nombre: true } },
        Nombres: true,
        Rol: true,
      },
    });
    res.status(201).json(personal);
  } catch (error) {
    res.status(500).json({ error: "Tuvimos un Error al crear el Personal" });
  }
};

export const obtenerPersonales = async (req: Request, res: Response) => {
  try {
    const personales = await prisma.personal.findMany({
      where: { IdEscuela: req.SesionPersonal.IdEscuela },
      select: {
        IdPersonal: true,
        Contrase_a: false,
        Escuela: { select: { Nombre: true } },
        Nombres: true,
        Rol: true,
      },
    });
    res.status(200).json(personales);
  } catch (error) {
    res.status(500).json({ error: "Tuvimos un eror al obtener el Personal" });
  }
};

export const obtenerPersonal = async (req: Request, res: Response) => {
  const IdPersonal = Number(req.params.IdPersonal);

  try {
    if (isNaN(IdPersonal)) throw new AuthError("El id debe ser un numero", 400);

    const personales = await prisma.personal.findUnique({
      where: { IdEscuela: req.SesionPersonal.IdEscuela, IdPersonal },
      select: {
        IdPersonal: true,
        Contrase_a: false,
        Escuela: { select: { Nombre: true } },
        Nombres: true,
        Rol: true,
      },
    });
    res.status(200).json(personales);
  } catch (error) {
    res.status(500).json({ error: "Tuvimos un eror al obtener el Personal" });
  }
};

export const editarPersonal = async (req: Request, res: Response) => {
  const IdPersonal = Number(req.body.IdPersonal);
  const Rol = String(req.body.IdPersonal);
  const Nombres = String(req.body.IdPersonal);

  try {
    if (typeof IdPersonal !== "number" || IdPersonal < 1)
      throw new ValidatorError("Proporciona un Personal", 400);
    if (typeof Nombres !== "string" || Nombres.length < 1)
      throw new ValidatorError("Ingresa nombres validos", 400);


    if (!Object.keys(Personal_Rol).includes(Rol))
      throw new ValidatorError("El Rol debe ser valido", 400);

    const encontrarPersonal = await prisma.personal.findFirst({
      where: { IdPersonal, IdEscuela: req.SesionPersonal.IdEscuela },
    });
    if (!encontrarPersonal)
      throw new AuthError("El personal debe ser de tu escuela", 404);

    if (encontrarPersonal.Rol === "Administrador" && Rol !== "Administrador") {
      const personales = await prisma.personal.findMany({
        where: {
          IdEscuela: req.SesionPersonal.IdEscuela,
          Rol: "Administrador",
        },
      });
      if (personales.length < 1)
        throw new AuthError(
          "No Puedes eliminar a todos los Administrador de tu escuela",
          403
        );
    }

    const personal = await prisma.personal.update({
      where: { IdPersonal, IdEscuela: req.SesionPersonal.IdEscuela },
      data: { Rol:Rol as Personal_Rol, Nombres },
      select: {
        IdPersonal: true,
        Contrase_a: false,
        Escuela: { select: { Nombre: true } },
        Nombres: true,
        Rol: true,
      },
    });

    res.status(202).json(personal);
  } catch (error) {
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });

    res
      .status(500)
      .json({ error: "Tuvimos un error al actualizar el personal" });
  }
};

export const eliminarPersonal = async (req: Request, res: Response) => {
  const   IdPersonal   =Number (req.body.IdPersonal);
  try {
    if (typeof IdPersonal !== "number" || IdPersonal < 1)
      new ValidatorError("Proporciona un Personal", 400)
    

    const personal = await prisma.personal.findUnique({
      where: { IdPersonal, IdEscuela: req.SesionPersonal.IdEscuela },
    });
    if (!personal) throw new AuthError("Personal no encontrado", 404);
    if (personal.Rol === "Administrador") {
      const personales = await prisma.personal.findMany({
        where: {
          IdEscuela: req.SesionPersonal.IdEscuela,
          Rol: "Administrador",
        },
      });
      if (personales.length < 1)
        throw new AuthError(
          "No Puedes eliminar a todos los Administrador de tu escuela",
          403
        );
    }

    await prisma.personal.delete({
      where: { IdPersonal, IdEscuela: req.SesionPersonal.IdEscuela },
    });
    res.sendStatus(204);
  } catch (error) {
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: "Tuvimos un error al eliminar el personal" });
  }
};
