import { Request, Response } from "express";
import { prisma } from "../../helpers/BaseDatos";

export const obtenerPersonal = async (req: Request, res: Response) => {
    try {
        const personal = await prisma.personal.findUnique({
            where: { IdPersonal: req.SesionPersonal.IdPersonal },
            select: {
              Escuela: { select: { Nombre: true } },
              Nombres: true,
              Contrase_a: false,
              Rol: true,
            },
          });
          if (!personal) return res.sendStatus(409);
        
          res.status(200).json(personal);
    } catch (error) {
        console.log(error)
    }
  
};
