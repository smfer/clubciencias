import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SesionProvider } from "./context/Sesion.tsx";
import { SocketProvider } from "./context/Socket.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SesionProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </SesionProvider>
  </React.StrictMode>
);
