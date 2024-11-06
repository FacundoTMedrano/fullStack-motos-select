import express from "express";
const router = express.Router();
import { MotoController } from "../controllers/motos.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
const moto = new MotoController();

import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function (req, file, cb) {
        const filetypes = new RegExp(/jpeg|jpg|png|svg|webp|gif/);
        const mimetype = filetypes.test(file.mimetype); //esto podria se hackeado
        const extname = filetypes.test(file.originalname); //esto podria se hackeado

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Tipo de archivo no permitido"));
    },
});

router.get("/", moto.getAll);
router.get("/:id", moto.getById);
router.post(
    "/",
    verifyJWT,
    verifyRoles(["admin"]),
    upload.fields([{ name: "motoImg" }, { name: "fichaImgs" }]),
    moto.create,
);
router.patch(
    "/:id",
    verifyJWT,
    verifyRoles(["admin"]),
    upload.fields([{ name: "motoImg" }, { name: "fichaImgs" }]),
    moto.update,
);
router.delete("/:id", verifyJWT, verifyRoles(["admin"]), moto.delete);

export default router;
