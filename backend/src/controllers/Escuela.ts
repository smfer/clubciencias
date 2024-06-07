import { Request, Response } from "express";
import { prisma } from "../helpers/BaseDatos";
import bcrypt from "bcrypt";
import { Escuela } from "@prisma/client";


export const obtenerEscuelas = async (_: Request, res: Response) => {
  try {
    const escuelas = await prisma.escuela.findMany({
      select: { Nombre: true, IdEscuela: true },
    });

    res.status(200).json( escuelas );
  } catch (error) {
    res.status(500).json({error: "Tuvimos un error en el servidor, Lamentamos el inconveniente",});
  }
};

export const crearEscuela = async (req: Request, res: Response) => {
  const { Nombre, Contrase_a }:Escuela = req.body;

  if (typeof Nombre !== "string" || Nombre.trim().length < 1 )
    return res.status(400).json({ error: "El campo Nombre es obligatorio" });
  if (typeof Contrase_a !== "string" || Contrase_a.trim().length < 1)
    return res.status(400).json({ error: "El campo Contraseña es obligatorio" });

  try {
    const contraseñaHaseada = await bcrypt.hash(Contrase_a, 10);
    const escuela = await prisma.escuela.create({data: { Nombre, Contrase_a: contraseñaHaseada },select:{"Nombre":true,"IdEscuela":true}});
    res.status(200).json(escuela);
    
  } catch (error) {
    return res.status(500).json({error: "Tuvimos un error en el servidor, Lamentamos el inconveniente",
      });
  }
};
