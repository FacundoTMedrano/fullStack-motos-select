import express from "express";
const router = express.Router();
import { UserController } from "../controllers/user.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";

const user = new UserController();

router.get("/", verifyRoles(["admin"]), user.getAll);
router.get("/:id", verifyRoles(["admin"]), user.getById);
router.delete("/:id", verifyRoles(["admin"]), user.deleteById);
router.get("/my-user", user.getMyUserById);
router.patch("/update", user.updateMyAcount);
router.delete("/my-user", user.deleteMyUserById);

export default router;
