import { Router } from "express";
import {crearEscuela, obtenerEscuelas } from "../controllers/Escuela";
const router = Router()
router.get("/",obtenerEscuelas)
router.post("/",crearEscuela)
export default router