import { Router } from "express";
import { aceptarPago, cancelarPedido, crearOrden, crearPedido, modificarPedido, obtenerAlumno, obtenerCategoria, obtenerCategorias, obtenerPedidoActual, obtenerPedidos, obtenerProducto, obtenerProductos } from "../controllers/Alumno";
import { AutentificarRol, Verificar } from "../middlewares/Autentificar";

const router = Router()
router.use(Verificar,AutentificarRol("Alumno"))


router.post("/Orden",crearOrden)
router.post("/Pago",aceptarPago)


router.get("/Productos",obtenerProductos)
router.get("Producto/:IdProducto",obtenerProducto)

router.get("/Categorias",obtenerCategorias)
router.get("Categoria/:IdCategoria",obtenerCategoria)

router.get("/Datos",obtenerAlumno)

router.get("/Pedidos",obtenerPedidos)

router.get("/Pedido",obtenerPedidoActual)
router.post("/Pedido",crearPedido)
router.put("/Pedido",modificarPedido)
router.delete("/Pedido",cancelarPedido)

export default router