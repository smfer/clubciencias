export const Filtro = {
  Ordenados: "Ordenados",
  Aceptados: "Aceptados",
  Entregados: "Entregados",
} as const;

export const Rutas = {
  Auth: "/auth",
  IniciarSesion: "iniciarSesion",
  CrearSesionPersonal: "Personal",
  CrearSesionAlumno: "Alumno",

  Personal: "/Personal",

  Cajero: "Cajero",
  CajeroPedidoDetalle: ":IdPedido",
  CajeroPedidosEntregados: "Entregados",
  CajeroPedidosAceptados: "Aceptados",

  Administrador: "Administrador",
  Gerente: "Gerente",

  PersonalConfigucarion: "Configuracion",

  Alumno: "/Alumno",
  AlumnoInicio: "Inicio",
  AlumnoPedidos: "Pedidos",
  AlumnoCarrito: "Carrito",
  AlumnoConfiguracion: "Configuracion",
} as const;

export const ApiRutas = {
  inicioSesion: "/Sesion/Sesion",
  crearAlumno: "/Sesion/Alumno",
  crearCafeteria: "/Sesion/Personal",
  obtenerProductos: "/Alumno/productos",
  obtenerProducto: (IdPedido: number) => "/Alumno/producto" + IdPedido,
  obtenerCategorias: "/Alumno/Categorias",
  obtenerCategoria: (IdCategoria: number) => "/Alumno/Categoria" + IdCategoria,
  crearPedido: "/Alumno/Pedido",
  obtenerPedidosOrdenasdos: "/Alumno/Pedido",
  obtenerPedidos: "/Alumno/Pedidos",
  modificarPedido: "/Alumno/Pedido",
  obtenerAlumno: "/Alumno/Datos",
  obtenerEscuelas: "/Escuela",
  obtenerDatosPersonal: "/Personal/Datos",
  obtenerPersonales: "/Personal/Personales",
  obtenerPersonal: (IdPersonal: number) => "/Personal/Personal/" + IdPersonal,
  crearPersonal: "/Personal/Personal",
  editarPersonal: "Personal/Personal",

  obtenerPedidosPersonal: (filtro: keyof typeof Filtro) =>
    "/Personal/Pedidos/" + filtro,
  obtenerPedido: (IdPedido: number) => "/Personal/Pedido/" + IdPedido,
  editarPedido: "/Personal/Pedido",

  crearProducto: "/Personal/Producto",
  crearCategoria: "/Personal/Categoria",

  actualizarProducto: "/Personal/Producto",
  obtenerProductosPersonal: "/Personal/Productos",
  obtenerProductoPersonal: (IdProducto: number) => "/Personal/Producto/" + IdProducto,
  obtenerCategoriasPersonal: "/Personal/Categorias",
  obtenerCategoriaPersonal: (IdCategoria: number) =>
    "/Personal/Categoria/" + IdCategoria,
} as const;
export const EventEnum = {
  iniciarSesion: "iniciarSesio",
  cerrarSesion: "cerrarSesion",
} as const;

export const localStorageEnum = {
  Sesion: "Sesion",
} as const;

export const socketEnum = {
  ACTUALIAR_PEDIDO: "actualizarPedido",
  NUEVO_PEDIDO: "nuevoPedido",
} as const;

export const Rol = { Alumno: "Alumno", Personal: "Personal" } as const;

export const Personal_Rol = {
  Administrador: "Administrador",
  Cajero: "Cajero",
  Analista_de_Datos: "Analista_de_Datos",
  Gerente_de_Cafeter_a: "Gerente_de_Cafeter_a",
} as const;

export const Pedido_Estado = {
  Ordenado: "Ordenado",
  Aceptado: "Aceptado",
  Listo_para_Recoger: "Listo_para_Recoger",
  Entregado: "Entregado",
  Cancelado: "Cancelado",
  Pago_Realizado: "Pago_Realizado",
} as const;

export const Method = {
  POST: "POST",
  GET: "GET",
  PUT: "PUT",
} as const;

export const CLIENTID = import.meta.env.VITE_CLIENTID as string;
export const APIURL = import.meta.env.VITE_API as string;
