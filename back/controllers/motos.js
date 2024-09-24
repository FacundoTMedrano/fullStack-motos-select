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
        const motoImg = req.files?.["motoImg"][0];
        const fichaImgs = req.files?.["fichaImgs"];
        if (!motoImg || !fichaImgs || !req.body?.ficha || req.body?.moto) {
            throw new CustomErrors.BadRequestError("bad data moto");
        }
        const moto = z
            .object({
                nombre: z.string().min(1),
                marca: z.string().min(1),
                estilo: z.string().min(1).optional(),
                cilindrada: z.number().min(0).optional(),
            })
            .safeParse(req.body.moto);

        if (!moto.success) {
            throw new CustomErrors.BadRequestError("bad data moto");
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
        const nuevaMoto = await Moto.create(moto.data);

        const ficha = { informacion: req.body.ficha.informacion }; //solo deberia tener {informacion}
        ficha.moto = nuevaMoto._id;
        const imagenes = [];
        for (let i = 0; i < fichaImgs.length; i++) {
            const nombreNuevo = `${nanoid(10)}${path.extname(fichaImgs[i].originalname)}`;
            await fs.writeFile(`imgs/big/${nombreNuevo}`, fichaImgs[i].buffer);
            const metadata = await sharp(fichaImgs[i].buffer).metadata();
            const mitadancho = Math.floor(metadata.width / 2);
            const mitadAlto = Math.floor(metadata.height / 2);
            await sharp(fichaImgs[i].buffer)
                .resize(mitadancho, mitadAlto)
                .toFile(`imgs/medium/${nombreNuevo}`);
            imagenes.push(nombreNuevo);
        }
        ficha.imagenes = imagenes;

        const newFicha = await FichaTecnica.create(ficha);

        return res
            .status(StatusCodes.CREATED)
            .json({ fichaTecnica: newFicha, moto: nuevaMoto });
    }

    async delete(req, res) {
        if (!req.paras.id) {
            throw new CustomErrors.NotFoundError("not found moto id");
        }
        const moto = await Moto.findByIdAndDelete(req.params.id);
        if (!moto) {
            throw new CustomErrors.NotFoundError("not found moto id");
        }
        const ficha = await FichaTecnica.findOneAndDelete({
            moto: moto.fichaTecnica,
        });
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
        const motoImg = req.files?.["motoImg"][0];
        const fichaImgs = req.files?.["fichaImgs"];
        if (!req.body?.ficha || req.body?.moto || !req.params?.id) {
            throw new CustomErrors.BadRequestError("bad data moto");
        }
        const moto = z
            .object({
                nombre: z.string().min(1),
                marca: z.string().min(1),
                estilo: z.string().min(1).optional(),
                cilindrada: z.number().min(0).optional(),
            })
            .safeParse(req.body.moto);

        if (!moto.success) {
            throw new CustomErrors.BadRequestError("bad data moto");
        }
        const motoDB = await Moto.findById(req.params.id);
        if (!motoDB) {
            throw new CustomErrors.NotFoundError("id not found");
        }

        const ficha = await FichaTecnica.findOne({ moto: motoDB._id });
        if (!ficha) {
            throw new CustomErrors.NotFoundError("id ficha not found");
        }

        if (motoImg) {
            //borro la imagen anterior
            await Promise.all([
                fs.unlink(`imgs/big/${motoDB.img}`),
                fs.unlink(`imgs/medium/${motoDB.img}`),
            ]);
            const nombreNuevo = `${nanoid(10)}${path.extname(motoImg.originalname)}`;
            await fs.writeFile(`imgs/big/${nombreNuevo}`, motoImg.buffer);
            const metadata = await sharp(motoImg.buffer).metadata();
            const mitadancho = Math.floor(metadata.width / 2);
            const mitadAlto = Math.floor(metadata.height / 2);
            await sharp(motoImg.buffer)
                .resize(mitadancho, mitadAlto)
                .toFile(`imgs/medium/${nombreNuevo}`);
            moto.data.img = nombreNuevo;
        }
        for (let key in moto.data) {
            motoDB[key] = moto.data[key];
        }

        await motoDB.save();

        if (fichaImgs.length > 0) {
            const imagenes = [];
            for (let i = 0; i < fichaImgs.length; i++) {
                const nombreNuevo = `${nanoid(10)}${path.extname(fichaImgs[i].originalname)}`;
                await fs.writeFile(
                    `imgs/big/${nombreNuevo}`,
                    fichaImgs[i].buffer,
                );
                const metadata = await sharp(fichaImgs[i].buffer).metadata();
                const mitadancho = Math.floor(metadata.width / 2);
                const mitadAlto = Math.floor(metadata.height / 2);
                await sharp(fichaImgs[i].buffer)
                    .resize(mitadancho, mitadAlto)
                    .toFile(`imgs/medium/${nombreNuevo}`);

                imagenes.push(nombreNuevo);
            }
            ficha.imagenes.push(...imagenes);
        }

        if (req.body.ficha.eliminar > 0) {
            const eliminar = req.body.ficha.eliminar;
            for (let i = 0; i < eliminar.length; i++) {
                await Promise.all([
                    fs.unlink(`imgs/big/${eliminar[i]}`),
                    fs.unlink(`imgs/medium/${eliminar[i]}`),
                ]);
            }
            ficha.imagenes = ficha.imagenes.filter(
                (v) => !eliminar.includes(v),
            );
        }
        ficha.informacion = req.body.ficha.informacion;
        await ficha.save();

        return res.status(StatusCodes.OK).json({ msg: "success" });
    }
}
