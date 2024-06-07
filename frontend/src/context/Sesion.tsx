import {
    useState,
    createContext,
    ReactNode,
    FC,
    useContext,
    useEffect,
  } from "react";
  import { SesionContextValue, Usuario } from "../types";
  import {  EventEnum, localStorageEnum } from "../const";
  
  const SesionContext = createContext<SesionContextValue>({
    sesion: null,
  });
  
  export const SesionProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [sesion, setSesion] = useState<Usuario | null>(() => {
      const sesion = localStorage.getItem(localStorageEnum.Sesion);
      return sesion ? (JSON.parse(sesion) as Usuario) : null;
    });
  
    useEffect(() => {
      const iniciarSesion = (e: Event) =>
        setSesion((e as CustomEvent<Usuario>).detail);
      const cerraSesion = () => setSesion(null);
  
      document.addEventListener(EventEnum.iniciarSesion, iniciarSesion);
      document.addEventListener(EventEnum.cerrarSesion, cerraSesion)
  
      return () => {
        document.removeEventListener(EventEnum.iniciarSesion, iniciarSesion);
        document.removeEventListener(EventEnum.cerrarSesion, cerraSesion);
      };
  
     
    }, []);
  
    const contextValue: SesionContextValue = {
      sesion,
    };
  
    return (
      <SesionContext.Provider value={contextValue}>
        {children}
      </SesionContext.Provider>
    );
  };
  
  // eslint-disable-next-line react-refresh/only-export-components
  export const useSesion = () => {
    return useContext(SesionContext);
  };
  