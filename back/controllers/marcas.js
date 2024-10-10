import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import Marca from "../models/mongoose/Marca.js";
import Moto from "../models/mongoose/Moto.js";
import Review from "../models/mongoose/Review.js";
import Ficha from "../models/mongoose/FichaTecnica.js";
import path from "node:path";
import { nanoid } from "nanoid";
import fs from "node:fs/promises";
import z from "zod";

export class MarcaController {
    async getAll(req, res) {
        const marcas = await Marca.find();
        return res.status(StatusCodes.OK).json(marcas);
    }

    async getOneMarca(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const marca = await Marca.findById(req.params.id);
        if (!marca) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        return res.status(StatusCodes.OK).json(marca);
    }

    async create(req, res) {
        const validacion = z
            .object({
                marca: z.string().min(1),
            })
            .safeParse(req.body);
        console.log(req.file, req.body);
        if (!validacion.success || !req.file) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const nombre = `${nanoid(10)}${path.extname(req.file.originalname)}`;
        await fs.writeFile(`imgs/basics/${nombre}`, req.file.buffer);
        await Marca.create({
            marca: validacion.data.marca,
            img: nombre,
        });

        return res.status(StatusCodes.CREATED).json({ msg: "success" });
    }

    async delete(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        //borrado marca
        const marca = await Marca.findByIdAndDelete(req.params.id);
        if (!marca) {
            throw new CustomErrors.NotFoundError("not found");
        }
        await fs.unlink(`imgs/basics/${marca.img}`); //chequear que borre bien
        //borrado moto
        const moto = await Moto.find({ marca: marca._id });
        if (moto.length > 0) {
            for (let i = 0; i < moto.length; i++) {
                await Review.deleteMany({ moto: moto[i]._id }); //borra todo los reviews

                const ficha = await Ficha.findByIdAndDelete(
                    moto[i].fichaTecnica,
                ); //borra la ficha

                for (let j = 0; j < ficha.imagenes.length; j++) {
                    await Promise.all([
                        fs.unlink(`imgs/big/${ficha.imagenes[j]}`),
                        fs.unlink(`imgs/medium/${ficha.imagenes[j]}`),
                    ]);
                }

                await Promise.all([
                    fs.unlink(`imgs/big/${moto[i].img}`),
                    fs.unlink(`imgs/medium/${moto[i].img}`),
                ]);
            }
            await Moto.deleteMany({ marca: marca._id }); //borro todos los datos de las motos
        }

        return res.status(StatusCodes.NO_CONTENT).send();
    }

    async update(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const actualizaciones = z
            .object({
                marca: z.string().min(1),
            })
            .safeParse(req.body);
        if (!actualizaciones.success && !req.file) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const update = await Marca.findById(req.params.id);
        if (!update) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        update.marca = actualizaciones.data.marca;
        if (req.file) {
            const nombre = `${nanoid(10)}${path.extname(req.file.originalname)}`;
            await fs.unlink(`imgs/basics/${update.img}`);
            await fs.writeFile(`imgs/basics/${nombre}`, req.file.buffer);
            update.img = nombre;
        }
        await update.save();

        return res.status(StatusCodes.OK).json(update);
    }
}
