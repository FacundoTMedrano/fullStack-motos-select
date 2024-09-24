import express from "express";
const router = express.Router();
import { FichaTecnicaController } from "../controllers/fichasTecnicas.js";
// import { verifyRoles } from "../middlewares/verifyRoles.js";
// import { verifyJWT } from "../middlewares/verifyJWT.js";

const fichaTecnica = new FichaTecnicaController();

// router.get("/", verifyJWT, verifyRoles(["admin"]), fichaTecnica.getAll);
// router.post("/", verifyJWT, verifyRoles(["admin"]), fichaTecnica.create);
// router.delete("/:id", verifyJWT, verifyRoles(["admin"]), fichaTecnica.delete);
// router.patch("/:id", verifyJWT, verifyRoles(["admin"]), fichaTecnica.update);
router.get("/:id", fichaTecnica.getById);

export default router;
