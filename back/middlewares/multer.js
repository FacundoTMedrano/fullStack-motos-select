import multer, { memoryStorage } from "multer";

export default () => {
    return multer({
        storage: memoryStorage(),
        limits: { fileSize: 1024 * 1024 * 5 }, // Límite de tamaño
        fileFilter: function (req, file, cb) {
            const filetypes = new RegExp(/jpeg|jpg|png|svg|webp/); // Expresión regular para tipos de archivo permitidos
            const mimetype = filetypes.test(file.mimetype);
            const extname = filetypes.test(file.originalname);

            if (mimetype && extname) {
                return cb(null, true);
            }
            cb(new Error("Tipo de archivo no permitido"));
        },
    });
};
