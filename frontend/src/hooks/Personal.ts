import { useEffect } from "react";
import { useSocket } from "../context/Socket";
import { Rutas, socketEnum } from "../const";
import { useNavigate } from "react-router-dom";

        
export const useNuevoPedido = () => {
    console.log("Escuchando eento")
    const navegar = useNavigate();
    const socket = useSocket();
    useEffect(() => {
      if (!socket) return;
      socket.on(socketEnum.NUEVO_PEDIDO, () => {
        navegar(Rutas.Personal + "/" + Rutas.Cajero + "/Ordenados")

      });
  
      return () => {
        socket.off(socketEnum.NUEVO_PEDIDO);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);
  };
  
  
  