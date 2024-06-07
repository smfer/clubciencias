import {  RouterProvider, createBrowserRouter } from "react-router-dom";
import { Rutas } from "./const.ts";
import { LayoutAuth } from "./layout/Sesion.tsx";
import {
  PaginaInicioSesion,
  actionInicioSesion,
  loaderInicioSesion,
} from "./page/Auth/inicioSesion.tsx";
import {
  PaginaCrearAlumno,
  actionCrearAlumno,
  loaderCrearAlumno,
} from "./page/Auth/CrearAlumno.tsx";
import {
  PaginaCrearPersonal,
  actionCrearPersonal,
  loaderCrearPersonal,
} from "./page/Auth/CrearPersonal.tsx";
import { LayoutAlumno } from "./layout/Alumno.tsx";
import { AlumnoInicio, loaderAlumnoInicio } from "./page/Alumo/Inicio.tsx";
import {
  AlumnoCarrito,
  actionCarrito,
  loaderCarrito,
} from "./page/Alumo/AlumnoCarrito.tsx";
import {
  AlumnoPedidos,
  loaderAlumnoPedidos,
} from "./page/Alumo/AlumnoPedidos.tsx";
import {
  AlumnoConfiguracion,
  actionAlumnoConfiguracion,
  loaderAlumnoConfiguracion,
} from "./page/Alumo/AlumnoConfiguracion.tsx";
import {
  LayoutCajero,
  LayoutGerente,
  LayoutPersonal,
} from "./layout/Personal.tsx";
import {
  CajeroInicio,
  loaderCajeroIndex,
  loaderCajeroInicio,
} from "./page/Cajero/Inicio.tsx";
import {
  CajeroPedido,
  actionCajeroPedido,
  loaderCajeroPedido,
} from "./page/Cajero/Pedido.tsx";
import {
  GerenteProductos,
  loaderGerenteInicio,
} from "./page/Gerente/Productos.tsx";
import {
  GerenteProducto,
  loaderGerenteProducto,
} from "./page/Gerente/Producto.tsx";
import { GerenteIndex } from "./page/Gerente/Index.tsx";
import {
  GerenteCategorias,
  loaderGerenteCategorias,
} from "./page/Gerente/Categorias.tsx";
import {
  GerenteCategoria,
  loaderGerenteCategoria,
} from "./page/Gerente/Categoria.tsx";
import {
  GerenteCrearProducto, actionGerenteCrearProducto, loaderCrearProducto,
} from "./page/Gerente/CrearProducto.tsx";
import {
  AdministradorInicio,
  loaderAdminitrador,
} from "./page/Administrador/Inicio.tsx";
import {
  AdministradorPersonal,
  loaderAdminitradorPersonal,
} from "./page/Administrador/Personal.tsx";
import { AdministradorEditarPersonal, actionPersonalEditar } from "./page/Administrador/EditarPersonal.tsx";
import { AdministradorCrearPersonal, actionPersonalCrear } from "./page/Administrador/CrearPersonal.tsx";
import {
  PersonalConfiguracion,
  actionPersonalConfiguracion,
  loaderPersonalConfiguracion,
} from "./page/Personal/Configuracion.tsx";
import ErrorPage from "./page/errors/Inicial.tsx";
import { Index } from "./page/Index.tsx";
import { GerenteEditarCategoria, actionGerenteEditarCategoria } from "./page/Gerente/EditarCategoria.tsx";
import { GerenteEditarProducto, actionGerenteEditarProducto } from "./page/Gerente/EditarProducto.tsx";

const router = createBrowserRouter([
  {
    path: Rutas.Auth,
    element: <LayoutAuth />,
    children: [
      {
        index: true,
        element: <PaginaInicioSesion />,
        action: actionInicioSesion,
        loader: loaderInicioSesion,
      },
      {
        path: Rutas.CrearSesionAlumno,
        element: <PaginaCrearAlumno />,
        action: actionCrearAlumno,
        loader: loaderCrearAlumno,
      },
      {
        path: Rutas.CrearSesionPersonal,
        element: <PaginaCrearPersonal />,
        action: actionCrearPersonal,
        loader: loaderCrearPersonal,
      },
    ],
  },
  {
    path: Rutas.Alumno,
    element: <LayoutAlumno />,
    errorElement :<ErrorPage/>,
    children: [
      {
        index:true,
        element: <AlumnoInicio />,
        loader: loaderAlumnoInicio,
        errorElement:<ErrorPage/>
      },
      {
        path: Rutas.AlumnoCarrito,
        element: <AlumnoCarrito />,
        action: actionCarrito,
        loader: loaderCarrito,
      },
      {
        path: Rutas.AlumnoPedidos,
        element: <AlumnoPedidos />,
        loader: loaderAlumnoPedidos,
      },
      {
        path: Rutas.AlumnoConfiguracion,
        element: <AlumnoConfiguracion />,
        loader: loaderAlumnoConfiguracion,
        action: actionAlumnoConfiguracion,
      },
    ],
  },
  {
    path: Rutas.Personal,
    element: <LayoutPersonal />,
    errorElement:<ErrorPage/>,
    children: [
      {
        path: Rutas.Cajero,
        element: <LayoutCajero />,
        children: [
          {
            path: ":filtro",
            element: <CajeroInicio />,
            loader: loaderCajeroInicio,
            children: [
              {
                path: Rutas.CajeroPedidoDetalle,
                element: <CajeroPedido />,
                loader: loaderCajeroPedido,
                action: actionCajeroPedido,
              },
              {
                index: true,
                element: (
                  <div className="flex flex-1 items-center justify-center text-white">
                    Selecciona un pedido
                  </div>
                ),
              },
            ],
          },
          { index: true, element: <CajeroInicio />, loader: loaderCajeroIndex },
        ],
      },
      {
        path: Rutas.Gerente,
        element: <LayoutGerente />,
        children: [
          {
            path: "productos",
            element: <GerenteProductos />,
            loader: loaderGerenteInicio,
            children: [
              {
                path: ":IdProducto",
                element: <GerenteProducto />,
                loader: loaderGerenteProducto,
              },
              {
                path: "edit/:IdProducto",
                element: <GerenteEditarProducto />,
                loader: loaderGerenteProducto,
                action: actionGerenteEditarProducto,
              },
              {
                path: "Crear",
                element: <GerenteCrearProducto />,
                action: actionGerenteCrearProducto,
                loader:loaderCrearProducto
              },
            ],
          },
          {
            path: "Categorias",
            element: <GerenteCategorias />,
            loader: loaderGerenteCategorias,
            children: [
              {
                path: ":IdCategoria",
                element: <GerenteCategoria />,
                loader: loaderGerenteCategoria,
              },
              {
                path: "edit/:IdCategoria",
                element: <GerenteEditarCategoria />,
                loader: loaderGerenteCategoria,
                action: actionGerenteEditarCategoria,
              },
            ],
          },
          {
            index: true,
            element: <GerenteIndex />,
            loader: loaderGerenteInicio,
          },
        ],
      },
      {
        path: Rutas.Administrador,
        element: <AdministradorInicio />,
        loader: loaderAdminitrador,
        children: [
          {
            path: ":IdPersonal",
            element: <AdministradorPersonal />,
            loader: loaderAdminitradorPersonal,
          },
          {
            path: "crear",
            element: <AdministradorCrearPersonal />,
            action: actionPersonalCrear,

          },
          {
            path: "editar/:IdPersonal",
            element: <AdministradorEditarPersonal />,
            loader: loaderAdminitradorPersonal,
            action:actionPersonalEditar

          },
        ],
      },
      {
        path: "Configuracion",
        element: <PersonalConfiguracion />,
        loader: loaderPersonalConfiguracion,
        action: actionPersonalConfiguracion,
      },
    ],
  },
  {index:true,element:<Index/>}
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
