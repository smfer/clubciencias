import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/Socket";
import { useEffect } from "react";
import { Rutas, socketEnum } from "../const";

export const useModificarPedido = () => {
    const socket = useSocket();
    const navegar = useNavigate();
  
    useEffect(() => {
      if (!socket) return;
      socket.on(socketEnum.ACTUALIAR_PEDIDO, () =>
        navegar(Rutas.Alumno + "/" + Rutas.AlumnoCarrito)
      );
  
      return () => {
        socket.off(socketEnum.ACTUALIAR_PEDIDO);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
  };
  