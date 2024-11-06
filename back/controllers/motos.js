import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import FichaTecnica from "../models/mongoose/FichaTecnica.js";
import Moto from "../models/mongoose/Moto.js";
import { nanoid } from "nanoid";
import path from "node:path";
import z from "zod";
import sharp from "sharp";
import fs from "node:fs/promises";
import Review from "../models/mongoose/Review.js";
import fichaMecanConfigValidate from "../schemas/zod/fichaTecnica.js";
import saveImg from "../utils/saveImg.js";

export class MotoController {
    async getAll(req, res) {
        const query = {};
        if (req.query?.marca) {
            query.marca = req.query.marca;
        }
        if (req.query?.estilo) {
            query.estilo = req.query.estilo;
        }
        if (req.query?.cilindrada) {
            const cilindrada = {};
            if (req.query.cilindrada?.max) {
                cilindrada.$lt = req.query.cilindrada.max;
            }
            if (req.query.cilindrada?.min) {
                cilindrada.$gt = req.query.cilindrada.min;
            }
            query.cilindrada = cilindrada;
        }
        const motos = await Moto.find(query);
        return res.status(StatusCodes.OK).json(motos);
    }

    async getById(req, res) {
        const moto = await Moto.findById({ _id: req.params.id });
        if (!moto) {
            throw new CustomErrors.NotFoundError("not found moto id");
        }
        return res.status(StatusCodes.OK).json(moto);
    }

    async create(req, res) {
        const datos = JSON.parse(req.body.datos);

        const motoImg = req.files?.["motoImg"]?.[0];
        const fichaImgs = req.files?.["fichaImgs"];
        if (
            !motoImg ||
            !fichaImgs ||
            !datos.mecanica ||
            !datos.configuracion ||
            !datos.moto
        ) {
            throw new CustomErrors.BadRequestError(
                "bad data moto en la recibida",
            );
        }
        const moto = z
            .object({
                nombre: z.string().min(1),
                marca: z.string().min(1),
                estilo: z.string().optional(),
                cilindrada: z.number().min(0),
            })
            .safeParse(datos.moto);

            const ficha = fichaMecanConfigValidate({
            mecanica: datos.mecanica,
            configuracion: datos.configuracion,
        });

        if (!moto.success || !ficha.success) {
            console.log(
                "moto errors-->",
                moto.error?.errors,
                "ficha errors-->",
                ficha.error?.errors,
            );
            throw new CustomErrors.BadRequestError(
                "bad data moto en la verificacion",
            );
        }

        const nombreNuevo = `${nanoid(10)}${path.extname(motoImg.originalname)}`;
        await fs.writeFile(`imgs/big/${nombreNuevo}`, motoImg.buffer);
        const metadata = await sharp(motoImg.buffer).metadata();
        const mitadancho = Math.floor(metadata.width);
        const mitadAlto = Math.floor(metadata.height);
        await sharp(motoImg.buffer)
            .resize(mitadancho, mitadAlto)
            .toFile(`imgs/medium/${nombreNuevo}`);

        moto.data.img = nombreNuevo;
        const nuevaMoto = new Moto(moto.data);

        const imagenes = [];
        for (let i = 0; i < fichaImgs.length; i++) {
            const nombreNuevo = await saveImg(fichaImgs[i]);
            imagenes.push(nombreNuevo);
        }

        ficha.data.imagenes = imagenes;

        const newFicha = await FichaTecnica.create(ficha.data);
        nuevaMoto.fichaTecnica = newFicha._id;
        await nuevaMoto.save();
        return res
            .status(StatusCodes.CREATED)
            .json({ fichaTecnica: newFicha, moto: nuevaMoto });
    }

    async delete(req, res) {
        if (!req.params.id) {
            throw new CustomErrors.NotFoundError("not found moto id");
        }
        const moto = await Moto.findByIdAndDelete(req.params.id);
        if (!moto) {
            throw new CustomErrors.NotFoundError("not found moto id");
        }
        const ficha = await FichaTecnica.findByIdAndDelete(moto.fichaTecnica);
        if (!ficha) {
            throw new CustomErrors.NotFoundError("not found ficha id");
        }
        await Review.deleteMany({ moto: moto._id });

        // borra las imagenes de moto
        await Promise.all([
            fs.unlink(`imgs/big/${moto.img}`),
            fs.unlink(`imgs/medium/${moto.img}`),
        ]);

        // borra las imagenes de ficha
        for (let i = 0; i < ficha.imagenes.length; i++) {
            await Promise.all([
                fs.unlink(`imgs/big/${ficha.imagenes[i]}`),
                fs.unlink(`imgs/medium/${ficha.imagenes[i]}`),
            ]);
        }

        return res.status(StatusCodes.NO_CONTENT).send();
    }

    async update(req, res) {
        const motoImg = req.files?.["motoImg"]?.[0];
        const fichaImgs = req.files?.["fichaImgs"] ?? [];
        if (!req.body?.datos || !req.params?.id) {
            throw new CustomErrors.BadRequestError("bad data moto");
        }
        const datos = JSON.parse(req.body.datos);
        const moto = z
            .object({
                nombre: z.string().min(1),
                marca: z.string().min(1),
                estilo: z.string().optional(),
                cilindrada: z.number().min(0),
            })
            .safeParse(datos.moto ?? {});

        const ficha = fichaMecanConfigValidate({
            mecanica: datos.mecanica ?? {},
            configuracion: datos.configuracion ?? {},
        });

        if (!moto.success || !ficha.success) {
            console.log("errores--->", moto.error?.errors, ficha.error?.errors);
            throw new CustomErrors.BadRequestError("bad data moto");
        }
        const motoDB = await Moto.findById(req.params.id);
        if (!motoDB) {
            throw new CustomErrors.NotFoundError("id not found");
        }

        const fichaDB = await FichaTecnica.findById(motoDB.fichaTecnica);
        if (!fichaDB) {
            throw new CustomErrors.NotFoundError("id ficha not found");
        }

        if (motoImg) {
            //borro la imagen anterior
            await Promise.all([
                fs.unlink(`imgs/big/${motoDB.img}`),
                fs.unlink(`imgs/medium/${motoDB.img}`),
            ]);
            const nombreNuevo = await saveImg(motoImg); //guardo la nueva imagen
            console.log(nombreNuevo);
            moto.data.img = nombreNuevo;
        }
        for (let key in moto.data) {
            motoDB[key] = moto.data[key];
        }

        await motoDB.save();

        if (fichaImgs.length > 0) {
            const imagenes = [];
            for (let i = 0; i < fichaImgs.length; i++) {
                const nombreNuevo = await saveImg(fichaImgs[i]);
                imagenes.push(nombreNuevo);
            }
            fichaDB.imagenes.push(...imagenes);
        }

        if (datos.eliminar?.length > 0) {
            const eliminar = datos.eliminar;
            for (let i = 0; i < eliminar.length; i++) {
                await Promise.all([
                    fs.unlink(`imgs/big/${eliminar[i]}`),
                    fs.unlink(`imgs/medium/${eliminar[i]}`),
                ]);
            }
            fichaDB.imagenes = fichaDB.imagenes.filter(
                (v) => !eliminar.includes(v),
            );
        }
        for (let key in ficha.data) {
            fichaDB[key] = ficha.data[key];
        }
        await fichaDB.save();

        return res.status(StatusCodes.OK).json({ msg: "success" });
    }
}
