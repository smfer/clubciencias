import { Request, Response } from "express";
import { prisma } from "../helpers/BaseDatos";
import { PedidoAlumno, ProductoCarro } from "../type";
import { Server } from "socket.io";
import { Pedido, Pedido_Estado } from "@prisma/client";
import { socketEnum } from "../helpers/const";
import { ValidarNumber } from "../helpers/functions";
import { AuthError, ValidatorError } from "../helpers/Error";
import { getToken } from "../helpers/paypal";

export const obtenerProductos = async (req: Request, res: Response) => {
  const { IdCategoria } = req.query;
  try {
    const productos = await prisma.producto.findMany({
      where: {
        IdEscuela: req.SesionAlumno.IdEscuela,
        Activado: true,
        IdCategoria: IdCategoria ? Number(IdCategoria) : undefined,
      },
    });
    res.status(200).json(productos);
  } catch (error) {
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });

    return res.status(500).json({ error: "Tuvimos un error con el servidor" });
  }
};

export const obtenerProducto = async (req: Request, res: Response) => {
  const { IdProducto } = req.params;

  try {
    if (isNaN(Number(IdProducto)))
      throw new AuthError("El id debe ser un numero", 400);

    const producto = await prisma.producto.findUnique({
      where: {
        IdEscuela: req.SesionAlumno.IdEscuela,
        Activado: true,
        IdProducto: Number(IdProducto),
      },
    });
    res.status(200).json(producto);
  } catch (error) {
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });

    return res.status(500).json({ error: "Tuvimos un error con el servidor" });
  }
};

export const obtenerCategorias = async (req: Request, res: Response) => {
  const categorias = await prisma.categoria.findMany({
    where: { IdEscuela: req.SesionAlumno.IdEscuela },
  });
  res.status(200).json(categorias);
};

export const obtenerCategoria = async (req: Request, res: Response) => {
  const { IdCategoria } = req.params;

  try {
    if (isNaN(Number(IdCategoria)))
      throw new AuthError("El id debe ser un numero", 400);

    const categoria = await prisma.categoria.findUnique({
      where: {
        IdEscuela: req.SesionAlumno.IdEscuela,
        IdCategoria: Number(IdCategoria),
      },
    });
    res.status(200).json(categoria);
  } catch (error) {
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });

    return res.status(500).json({ error: "Tuvimos un error con el servidor" });
  }
};

export const crearPedido = async (req: Request, res: Response) => {
  const { Productos }: { Productos: ProductoCarro[] } = req.body;
  //Validacion de los datos
  if (!(Productos instanceof Array) || Productos.length < 1) {
    return res.status(400).json({ error: "Lista de productos invalidos " });
  }

  for (const Producto of Productos) {
    if (typeof Producto !== "object")
      return res.status(400).json({ error: "El producto es invalido" });
    if (!("Cantidad" in Producto))
      return res
        .status(400)
        .json({ error: "El Producto debe de tener cantidad" });
    if (!("IdProducto" in Producto))
      return res
        .status(400)
        .json({ error: "El Producto debe de tener IdProducto" });
  }

  try {
    //Validacion de los productos
    const ids = Productos.map((Producto) => Producto.IdProducto);

    const existeProductos = await prisma.producto.findMany({
      where: { IdProducto: { in: ids }, IdEscuela: req.SesionAlumno.IdEscuela },
    });

    if (existeProductos.length !== Productos.length)
      return res
        .status(400)
        .json({ error: "Ingresa  productos de tu escuela" });

    //Creacion del pedido

    const detallePedido = existeProductos.map((Producto) => {
      return {
        SubTotal:
          (Productos.find(
            (producto) => producto.IdProducto === Producto.IdProducto
          )?.Cantidad ?? 0) * Producto.Precio,
        IdProducto: Producto.IdProducto,
        Cantidad:
          Productos.find(
            (producto) => producto.IdProducto === Producto.IdProducto
          )?.Cantidad ?? 0,
      };
    });

    const total = detallePedido.reduce(
      (total, pedido) => pedido.SubTotal + total,
      0
    );

    const pedido = await prisma.pedido.create({
      data: {
        IdAlumno: req.SesionAlumno.IdAlumno,
        Fecha: new Date(),
        Estado: "Ordenado",
        Total: total,
        DetallesPedido: { createMany: { data: detallePedido } },
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
                IdProducto: true,
              },
            },
          },
        },
        Alumno: {
          select: { Nombres: true },
        },
      },
    });

    const io: Server = res.app.get(socketEnum.IO);
    io.to(
      socketEnum.ESCUELA.concat(req.SesionAlumno.IdEscuela.toString())
    ).emit(socketEnum.NUEVO_PEDIDO, pedido);
    res.status(201).json(pedido);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const modificarPedido = async (req: Request, res: Response) => {
  const { IdPedido } = req.body;
  try {
    ValidarNumber(IdPedido, new AuthError("Ingresa un id", 400));

    const pedido = await prisma.pedido.findUnique({
      where: { IdPedido, Estado: Pedido_Estado.Listo_para_Recoger },
    });
    if (!pedido) throw new AuthError("No existe ningun pedido", 404);

    const nuevoPedido = await prisma.pedido.update({
      where: { IdPedido },
      data: { Estado: Pedido_Estado.Entregado },
    });
    res.status(200).json(nuevoPedido);
  } catch (error) {
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
    res.status(500).json({ error: "Tuvimos un error al eliminar el personal" });
  }
};

export const obtenerPedidoActual = async (req: Request, res: Response) => {
  const pedido = await prisma.pedido.findFirst({
    where: {
      IdAlumno: req.SesionAlumno.IdAlumno,
      Estado: {
        in: ["Ordenado", "Aceptado", "Listo_para_Recoger", "Entregado"],
      },
    },
    select: {
      IdPedido: true,
      Fecha: true,
      Estado: true,
      Total: true,
      DetallesPedido: {
        select: {
          Cantidad: true,
          IdDetallesPedido: true,
          SubTotal: true,
          Producto: {
            select: {
              Nombre: true,
              Precio: true,
            },
          },
        },
      },
    },
  });
  if (!pedido) return res.status(404).json(pedido);

  res.status(200).json(pedido);
};

export const obtenerPedidos = async (req: Request, res: Response) => {
  const pedidos = await prisma.pedido.findMany({
    where: { IdAlumno: req.SesionAlumno.IdAlumno },
    select: {
      IdPedido: true,
      Fecha: true,
      Estado: true,
      Total: true,
      DetallesPedido: {
        select: {
          Cantidad: true,
          Producto: {
            select: {
              Nombre: true,
              Precio: true,
            },
          },
          IdDetallesPedido: true,
          SubTotal: true,
        },
      },
    },
  });
  res.status(200).json(pedidos);
};

export const obtenerAlumno = async (req: Request, res: Response) => {
  const alumno = await prisma.alumno.findUnique({
    where: { IdAlumno: req.SesionAlumno.IdAlumno },
    select: {
      Escuela: { select: { Nombre: true } },
      NoControl: true,
      Nombres: true,
      Contrase_a: false,
    },
  });
  if (!alumno) res.sendStatus(409);

  res.status(200).json(alumno);
};

export const cancelarPedido = async (req: Request, res: Response) => {
  const { IdPedido }: Pedido = req.body;

  if (typeof IdPedido !== "number")
    return res.status(400).json({ error: "El IdPedido debe ser un numero" });

  try {
    const pedido = await prisma.pedido.update({
      where: { IdPedido, Estado: "Ordenado" },
      data: { Estado: "Cancelado" },
    });

    res.status(200).json(pedido);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const crearOrden = async (req: Request, res: Response) => {
  try {
    const { access_token, token_type } = await getToken();

    const pedido: PedidoAlumno = req.body.pedido;

    console.log(pedido);
    console.log(pedido.DetallesPedido[0]);

    const total = pedido.Total;

    const orderData = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total,
          },
        },
      ],
    };

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token_type} ${access_token}`,
      },
      body: JSON.stringify(orderData),
    };

    const response = await fetch(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      requestOptions
    );

    const jsonResponse = await response.json();

    res.send(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

export const aceptarPago = async (req: Request, res: Response) => {
  try {
    const { access_token, token_type } = await getToken();
    const orderId = Number(req.query.orderId)
    const IdPedido = Number(req.body.IdPedido)

    console.log(req.body)
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token_type} ${access_token}`,
      },
    };

    const response = await fetch(
      "https://www.sandbox.paypal.com/v2/checkout/orders/"+orderId+"/capture",
      requestOptions
    );

    if (response.status) {
      await prisma.pedido.update({
        where: { IdPedido },
        data: { Estado: Pedido_Estado.Entregado },
      });
    }
    const jsonResponse = await response.json();

    res.send(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

/**
 *
 */
