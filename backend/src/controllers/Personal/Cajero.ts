import { Request, Response } from "express";
import { prisma } from "../../helpers/BaseDatos";
import { Server } from "socket.io";
import { Pedido, Pedido_Estado } from "@prisma/client";
import { socketEnum } from "../../helpers/const";
import { ValidarNumber, ValidarString } from "../../helpers/functions";
import { AuthError, ValidatorError } from "../../helpers/Error";

const Filtro = {
  Ordenados: "Ordenados",
  Aceptados: "Aceptados",
  Entregados: "Entregados",
} as const;

const filtroRelacion = {
  [Filtro.Ordenados]: Pedido_Estado.Ordenado,
  [Filtro.Entregados]: Pedido_Estado.Entregado,
  [Filtro.Aceptados]: Pedido_Estado.Aceptado,
};

//Cajero
export const obtenerPedidosFiltro = async (req: Request, res: Response) => {
  const { filtro } = req.params;

  if (typeof filtro !== "string")
    throw new AuthError("El filtro debe ser valido", 400);

  if (
    filtro !== Filtro.Ordenados &&
    filtro !== Filtro.Entregados &&
    filtro !== Filtro.Aceptados
  )
    throw new AuthError("El filtro debe ser valido", 400);

  filtro;
  const pedidos = await prisma.pedido.findMany({
    where: {
      Alumno: { IdEscuela: req.SesionPersonal.IdEscuela },
      Estado: filtroRelacion[filtro],
    },
    select: {
      IdPedido: true,
      Fecha: true,
      Estado: true,
      Total: true,
      DetallesPedido: {
        select: {
          IdDetallesPedido: true,
          IdProducto: true,
          Cantidad: true,
          SubTotal: true,
          Producto: {
            select: {
              Nombre: true,
              Precio: true,
            },
          },
        },
      },

      Alumno: {
        select: { Nombres: true },
      },
    },
  });

  res.status(200).json(pedidos);
};

export const obtenerPedido = async (req: Request, res: Response) => {
  const { IdPedido } = req.params;

  try {
    if (isNaN(Number(IdPedido)))
      throw new AuthError("El id debe ser un numero", 400);

    const pedidos = await prisma.pedido.findUnique({
      where: {
        Alumno: { IdEscuela: req.SesionPersonal.IdEscuela },
        IdPedido: Number(IdPedido),
      },
      select: {
        IdPedido: true,
        Fecha: true,
        Estado: true,
        Total: true,
        DetallesPedido: {
          select: {
            IdDetallesPedido: true,
            IdProducto: true,
            Cantidad: true,
            SubTotal: true,
            Producto: {
              select: {
                Nombre: true,
                Precio: true,
              },
            },
          },
        },

        Alumno: {
          select: { Nombres: true },
        },
      },
    });

    res.status(200).json(pedidos);
  } catch (error) {
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
  }
};

export const editarPedido = async (req: Request, res: Response) => {
  let { IdPedido }: Pedido = req.body;
  let { nuevoEstado }: { nuevoEstado: string } = req.body;

  try {
    IdPedido = ValidarNumber(
      IdPedido,
      new ValidatorError("El pedido debe ser valido", 400)
    );
    nuevoEstado = ValidarString(
      nuevoEstado,
      new ValidatorError("El Estado debe ser valido", 400)
    );

    if (
      nuevoEstado !== Pedido_Estado.Cancelado &&
      nuevoEstado !== Pedido_Estado.Aceptado &&
      nuevoEstado !== Pedido_Estado.Listo_para_Recoger &&
      nuevoEstado !== Pedido_Estado.Pago_Realizado
    )
      throw new ValidatorError(
        "El nuevo estado debe ser un Estado valido",
        400
      );
  } catch (error) {
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });
    return res.sendStatus(500);
  }

  try {
    // Actualizar el estado del pedido en la base de datos
    const pedidoActualizado = await prisma.pedido.update({
      where: { IdPedido },
      data: { Estado: nuevoEstado },
      select: {
        IdAlumno: true,
        IdPedido: true,
        Estado: true,
        Fecha: true,
        Total: true,
        DetallesPedido: {
          select: {
            Producto: true,
            SubTotal: true,
            Cantidad: true,
            IdDetallesPedido: true,
          },
        },
      },
    });

    res.status(200).json(pedidoActualizado);

    const io: Server = res.app.get(socketEnum.IO);
    io.to(socketEnum.ALUMNO.concat(pedidoActualizado.IdAlumno.toString())).emit(
      socketEnum.ACTUALIAR_PEDIDO,
      pedidoActualizado
    );
  } catch (error) {
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};
