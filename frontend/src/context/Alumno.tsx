import { FC, ReactNode, createContext, useContext, useState } from "react";
import { Producto, ProductoCarrito } from "../types";

const AlumnoContext = createContext<{
  carrito: ProductoCarrito[];
  agregarProducto: (producto: Producto) => void;
  quitarProducto: (id: number) => void;
}>({
  carrito: [],
  agregarProducto: () => {},
  quitarProducto: () => {},
});

export const AlumnoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  //Estado para el carrito
  const [carrito, setCarrito] = useState<ProductoCarrito[]>([]);

  const agregarProducto = (producto: Producto) => {
    const productoExistenteIndex = carrito.findIndex(
      (p) => p.IdProducto === producto.IdProducto
    );

    if (productoExistenteIndex !== -1) {
      const carritoActualizado = [...carrito];
      carritoActualizado[productoExistenteIndex].Cantidad += 1;
      setCarrito(carritoActualizado);
      return;
    }

    setCarrito([...carrito, { Cantidad: 1, ...producto }]);
  };

  const quitarProducto = (id: number) => {
    const idProducto = carrito.findIndex(
      (producto) => producto.IdProducto === id
    );

    let nuevoCarrito: ProductoCarrito[] = [];

    if (idProducto === -1) return;

    if (carrito[idProducto].Cantidad === 1) {
      nuevoCarrito = carrito.filter((producto) => producto.IdProducto !== id);
    }

    if (carrito[idProducto].Cantidad > 1) {
      nuevoCarrito = [...carrito];
      nuevoCarrito[idProducto].Cantidad--;
    }

    setCarrito(nuevoCarrito);
  };

  return (
    <AlumnoContext.Provider
      value={{
        carrito,
        agregarProducto,
        quitarProducto,
      }}
    >
      {children}
    </AlumnoContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAlumno = () => {
  return useContext(AlumnoContext);
};
