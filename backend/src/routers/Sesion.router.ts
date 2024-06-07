import { Router } from "express";
import {
  crearSesionAlumno,
  crearSesionPersonal,
  iniciarSesion,
} from "../controllers/Sesion";
const router = Router();

router.post("/Alumno", crearSesionAlumno);
router.post("/Personal", crearSesionPersonal);
router.post("/Sesion", iniciarSesion);

export default router;
