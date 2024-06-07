import { Router } from "express";
import { AutentificarPersonal, AutentificarRol, Verificar } from "../middlewares/Autentificar";
import { editarPedido, obtenerPedido, obtenerPedidosFiltro } from "../controllers/Personal/Cajero";
import { actualizarProducto, crearCategoria, crearProducto, desactivarProducto, obtenerCategoria, obtenerCategorias, obtenerProducto, obtenerProductos } from "../controllers/Personal/Gerente";
import { crearPersonal, editarPersonal, eliminarPersonal, obtenerPersonal, obtenerPersonales } from "../controllers/Personal/Admin";
import { obtenerPersonal as DatosPersonal } from "../controllers/Personal/Personal";
const router = Router()

//Administrador

router.use(Verificar,AutentificarRol("Personal"))


router.get("/Personales",AutentificarPersonal(["Administrador"]),obtenerPersonales)
router.get("/Personal/:IdPersonal",AutentificarPersonal(["Administrador"]),obtenerPersonal)

router.post("/Personal",AutentificarPersonal(["Administrador"]),crearPersonal)
router.put("/Personal",AutentificarPersonal(["Administrador"]),editarPersonal)
router.delete("/Personal",AutentificarPersonal(["Administrador"]),eliminarPersonal)
    
//Rol Gerente
router.get("/Productos",AutentificarPersonal(["Gerente_de_Cafeter_a"]),obtenerProductos)
router.get("/Producto/:IdProducto",AutentificarPersonal(["Gerente_de_Cafeter_a"]),obtenerProducto)
router.post("/Producto",AutentificarPersonal(["Gerente_de_Cafeter_a"]),crearProducto)
router.put("/Producto",AutentificarPersonal(["Gerente_de_Cafeter_a"]),actualizarProducto)
router.delete("/Producto",AutentificarPersonal(["Gerente_de_Cafeter_a"]),desactivarProducto)

router.get("/Categorias",AutentificarPersonal(["Gerente_de_Cafeter_a"]),obtenerCategorias)
router.get("/Categoria/:IdCategoria",AutentificarPersonal(["Gerente_de_Cafeter_a"]),obtenerCategoria)
router.post("/Categoria",AutentificarPersonal(["Gerente_de_Cafeter_a"]),crearCategoria)

//Rol  Gerente Cafeteria    
router.get("/Pedidos/:filtro",AutentificarPersonal(["Cajero","Gerente_de_Cafeter_a"]),obtenerPedidosFiltro)
router.get("/Pedido/:IdPedido",AutentificarPersonal(["Cajero","Gerente_de_Cafeter_a"]),obtenerPedido)
router.put("/Pedido",AutentificarPersonal(["Cajero","Gerente_de_Cafeter_a"]),editarPedido)


router.get("/Datos",DatosPersonal)
export default router