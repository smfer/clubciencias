import { Request, Response } from "express";
import { prisma } from "../../helpers/BaseDatos";
import { Producto } from "@prisma/client";
import {
  ValidarNumber,
  ValidarString,
  ValidateBolean,
} from "../../helpers/functions";
import { AuthError, ValidatorError } from "../../helpers/Error";

//Middelwares Gerente Cafeteria
export const obtenerProductos = async (req: Request, res: Response) => {
  const productos = await prisma.producto.findMany({
    where: { IdEscuela: req.SesionPersonal.IdEscuela },
    select: {
      IdProducto: true,
      Nombre: true,
      Precio: true,
      IdEscuela: true,
      Activado: true,
      Categoria: true,
    },
  });
  res.status(200).json(productos);
};

export const obtenerProducto = async (req: Request, res: Response) => {
  const IdProducto = Number(req.params.IdProducto);

  try {
    if (isNaN(IdProducto)) throw new AuthError("El id debe ser un numero", 400);

    const producto = await prisma.producto.findUnique({
      where: {
        IdEscuela: req.SesionPersonal.IdEscuela,
        IdProducto,
      },
      select: {
        IdProducto: true,
        Nombre: true,
        Precio: true,
        Url: true,
        IdEscuela: true,
        Activado: true,
        Categoria: true,
      },
    });

    res.status(200).json(producto);
  } catch (error) {
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
  }
};

export const crearProducto = async (req: Request, res: Response) => {
  const Precio = Number(req.body.Precio);
  const Nombre = String(req.body.Nombre);
  const Url = String(req.body.Url);
  const IdCategoria = Number(req.body.IdCategoria);

  try {
    if (typeof Precio !== "number" || Precio < 1)
      new ValidatorError("El Precio debe ser valido", 400);

    if (typeof Nombre !== "string" || Nombre.length < 1)
      new ValidatorError("El Nombre debe ser valido", 400);

    if (typeof Url !== "string" || Url.length < 1)
      new ValidatorError("El Nombre debe ser valido", 400);

    if (typeof IdCategoria !== "number" || IdCategoria < 1)
      new ValidatorError("La url debe ser valida", 400);

    const producto = await prisma.producto.create({
      data: {
        IdEscuela: req.SesionPersonal.IdEscuela,
        Nombre,
        Precio,
        Url,
        IdCategoria,
        Activado: true,
      },
    });
    res.status(201).json(producto);
  } catch (error) {
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });

    res.status(500).json({ error: "Tuvimos un error al crear el producto" });
  }
};

export const actualizarProducto = async (req: Request, res: Response) => {
  const IdProducto: number = Number(req.body.IdProducto);
  const Nombre: string = String(req.body.Nombre);
  const Precio: number = Number(req.body.Precio);
  const Url: string = String(req.body.Url);
  const IdCategoria: number = Number(req.body.IdCategoria);

  try {
    if (isNaN(IdProducto) || IdProducto < 1) {
      throw new ValidatorError("El producto debe ser valido", 400);
    }

    if (typeof Nombre !== "string" || Nombre.length < 1) {
      throw new ValidatorError("El Nombre debe ser valido", 400);
    }

    if (isNaN(Precio) || Precio < 1) {
      throw new ValidatorError("El Precio debe ser valido", 400);
    }

    if (typeof Url !== "string" || Url.length < 1) {
      throw new ValidatorError("La url debe ser valida", 400);
    }

    if (isNaN(IdCategoria) || IdCategoria < 1) {
      throw new ValidatorError("La categoría debe ser valida", 400);
    }
  } catch (error) {
    if (error instanceof ValidatorError) {
      res.status(error.status).json({ error: error.message });
    } else {
      res.sendStatus(500);
    }
    return;
  }

  try {
    const producto = await prisma.producto.update({
      where: {
        IdProducto: IdProducto,
        IdEscuela: req.SesionPersonal.IdEscuela,
      },
      data: { Precio, Nombre, Url, IdCategoria },
    });

    res.status(200).json(producto);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Tuvimos un error al actualizar el producto" });
  }
};

export const desactivarProducto = async (req: Request, res: Response) => {
  let { IdProducto, Activado }: Producto = req.body;

  try {
    IdProducto = ValidarNumber(
      IdProducto,
      new ValidatorError("El producto  debe ser valido", 400)
    );
    Activado = ValidateBolean(
      Activado,
      new ValidatorError("Ingresa un valor valido al activar o desactivar", 400)
    );

    const hayProducto = await prisma.producto.findUnique({
      where: {
        IdProducto: IdProducto,
        IdEscuela: req.SesionPersonal.IdEscuela,
      },
    });

    if (!hayProducto) throw new AuthError("El producto no existe", 404);

    const producto = await prisma.producto.update({
      where: {
        IdProducto: hayProducto.IdProducto,
        IdEscuela: req.SesionPersonal.IdEscuela,
      },
      data: { Activado },
    });

    res.status(200).json(producto);
  } catch (error) {
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
    res
      .status(500)
      .json({ error: "Tuvimos un error al actualizar el producto" });
  }
};

export const obtenerCategorias = async (req: Request, res: Response) => {
  const categorias = await prisma.categoria.findMany({
    where: { IdEscuela: req.SesionPersonal.IdEscuela },
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
        IdEscuela: req.SesionPersonal.IdEscuela,
        IdCategoria: Number(IdCategoria),
      },
    });

    res.status(200).json(categoria);
  } catch (error) {
    if (error instanceof AuthError)
      return res.status(error.status).json({ error: error.message });
  }
};

export const crearCategoria = async (req: Request, res: Response) => {
  let { Nombre } = req.body;

  try {
    Nombre = ValidarString(
      Nombre,
      new ValidatorError("El Nombre debe ser valido", 400)
    );

    const categoria = await prisma.categoria.create({
      data: {
        IdEscuela: req.SesionPersonal.IdEscuela,
        Nombre,
      },
    });
    res.status(201).json(categoria);
  } catch (error) {
    if (error instanceof ValidatorError)
      return res.status(error.status).json({ error: error.message });

    res.status(500).json({ error: "Tuvimos un error al crear el producto" });
  }
};
