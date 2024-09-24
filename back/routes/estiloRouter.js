import express from "express";
const router = express.Router();
import { EstiloController } from "../controllers/estilos.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const estilo = new EstiloController();

router.get("/", estilo.getAll);
router.post("/", verifyJWT, verifyRoles(["admin"]), estilo.create);
router.delete("/:id", verifyJWT, verifyRoles(["admin"]), estilo.delete);
router.patch("/:id", verifyJWT, verifyRoles(["admin"]), estilo.update);

export default router;
