import express from "express";
const router = express.Router();
import { CilindradaController } from "../controllers/cilindradas.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const cilindrada = new CilindradaController();

router.get("/", cilindrada.getAll);
router.get("/:id", verifyJWT, verifyRoles(["admin"]), cilindrada.getById);
router.post("/", verifyJWT, verifyRoles(["admin"]), cilindrada.create);
router.delete("/:id", verifyJWT, verifyRoles(["admin"]), cilindrada.delete);
router.put("/:id", verifyJWT, verifyRoles(["admin"]), cilindrada.update);

export default router;
