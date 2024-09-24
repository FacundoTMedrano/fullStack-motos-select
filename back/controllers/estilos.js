import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import Estilo from "../models/mongoose/Estilo.js";
import z from "zod";

export class EstiloController {
    async getAll(req, res) {
        const estilos = await Estilo.find();
        console.log(estilos);
        return res.status(StatusCodes.OK).json(estilos);
    }

    async create(req, res) {
        const estilo = z
            .object({
                estilo: z.string().min(1),
            })
            .safeParse(req.body);
        if (!estilo.success) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const datoNuevo = await Estilo.create(estilo.data);
        return res.status(StatusCodes.CREATED).json(datoNuevo);
    }

    async delete(req, res) {
        if (!req.params?.id) throw new CustomErrors.BadRequestError("bad data");
        const estilo = await Estilo.findByIdAndDelete(req.params.id);
        if (!estilo) {
            throw new CustomErrors.NotFoundError("not find");
        }
        return res.status(StatusCodes.NO_CONTENT).send();
    }

    async update(req, res) {
        const estilo = z
            .object({
                estilo: z.string().min(1),
            })
            .safeParse(req.body);
        if (!estilo.success || !req.params?.id) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const update = await Estilo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!update) {
            throw new CustomErrors.NotFoundError("not found");
        }
        return res.status(StatusCodes.OK).json(update);
    }
}
