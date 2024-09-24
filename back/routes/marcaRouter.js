import express from "express";
const router = express.Router();
import { MarcaController } from "../controllers/marcas.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 5 },
    fileFilter: function (req, file, cb) {
        const filetypes = new RegExp(/jpeg|jpg|png|svg|webp/);
        const mimetype = filetypes.test(file.mimetype); //esto podria se hackeado
        const extname = filetypes.test(file.originalname); //esto podria se hackeado

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Tipo de archivo no permitido"));
    },
});

const marca = new MarcaController();

router.get("/", marca.getAll);
router.get("/:id", verifyJWT, verifyRoles(["admin"]), marca.getOneMarca);
router.post(
    "/",
    verifyJWT,
    verifyRoles(["admin"]),
    upload.single("imagen"),
    marca.create,
);
router.delete("/:id", verifyJWT, verifyRoles(["admin"]), marca.delete);
router.patch(
    "/:id",
    verifyJWT,
    verifyRoles(["admin"]),
    upload.single("imagen"),
    marca.update,
);

export default router;
