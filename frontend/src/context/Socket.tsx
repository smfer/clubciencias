import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import { APIURL } from "../const";
import { useSesion } from "./Sesion";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { sesion } = useSesion();

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io(APIURL, { auth: { token: sesion?.token } })
    setSocket(socket);
  }, [sesion]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket =  () =>{
  return useContext(SocketContext)
}