import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

import Escuela from "./routers/Escuela.router";
import Sesion from "./routers/Sesion.router";
import Personal from "./routers/Personal.router";
import Alumno from "./routers/Alumno.router";

import { Conexion } from "./helpers/BaseDatos";
import morgan from "morgan";
import { connect } from "./helpers/socket";
import { socketEnum } from "./helpers/const";
import { getToken } from "./helpers/paypal";

const app = express();
const httpserver = http.createServer(app);
const io = new Server(httpserver, { cors: { origin: "*" } });

const PORT = process.env.PORT || 4000;



app.set(socketEnum.IO, io);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/Sesion", Sesion);
app.use("/Escuela", Escuela);
app.use("/Personal", Personal);
app.use("/Alumno", Alumno);

app.post("/complete_order", async (req, res) => {
  try {
    const { access_token } = await getToken();

    const response = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.body.id}/confirm-payment-source`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          payment_source: {
            paypal: {
              name: { given_name: "John", surname: "Doe" },
            },
          },
        }),
      }
    );

    const jsonResponse = await response.json();

    console.log(jsonResponse);
    res.send(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

connect(io);

Conexion().then(() => {
  httpserver.listen(PORT, () => {
    console.log("Servidor eschuchando ".concat(PORT.toString()));
  });
});
