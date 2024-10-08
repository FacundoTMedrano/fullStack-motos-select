import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import FichaTecnica from "../models/mongoose/FichaTecnica.js";

export class FichaTecnicaController {
    async getById(req, res) {
        const ficha = await FichaTecnica.findById({ _id: req.params.id });
        if (!ficha) {
            throw new CustomErrors.NotFoundError("not found id");
        }
        return res.status(StatusCodes.OK).json(ficha);
    }
}
