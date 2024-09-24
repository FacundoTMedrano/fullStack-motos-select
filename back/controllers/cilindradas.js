import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import { Validatesafe } from "../schemas/zod/cilindrada.js";
import Cilindrada from "../models/mongoose/Cilindrada.js";

export class CilindradaController {
    async getAll(req, res) {
        const cilindrada = await Cilindrada.find();
        return res.status(StatusCodes.OK).json(cilindrada);
    }

    async getById(req, res) {
        if (!req.params?.id) throw new CustomErrors.BadRequestError("bad data");
        const cilindrada = await Cilindrada.findById(req.params.id);
        if (!cilindrada) {
            throw new CustomErrors.NotFoundError("not find");
        }
        return res.status(StatusCodes.OK).json(cilindrada);
    }

    async create(req, res) {
        const cilindrada = Validatesafe(req.body);
        if (!cilindrada.success) {
            throw new CustomErrors.BadRequestError(`bad data`);
        }
        const datoNuevo = await Cilindrada.create(cilindrada.data);
        return res.status(StatusCodes.CREATED).json(datoNuevo);
    }

    async delete(req, res) {
        if (!req.params?.id) throw new CustomErrors.BadRequestError("bad data");
        const cilindrada = await Cilindrada.findByIdAndDelete(req.params.id);
        if (!cilindrada) {
            throw new CustomErrors.NotFoundError("not find");
        }
        return res.status(StatusCodes.NO_CONTENT).send();
    }

    async update(req, res) {
        const cilindrada = Validatesafe(req.body);
        if (!cilindrada.success || !req.params?.id) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const update = await Cilindrada.findByIdAndUpdate(
            req.params.id,
            cilindrada.data,
            { new: true },
        );
        if (!update) {
            throw new CustomErrors.NotFoundError("not found");
        }
        return res.status(StatusCodes.OK).json({ update });
    }
}
