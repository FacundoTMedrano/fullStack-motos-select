import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import FichaTecnica from "../models/mongoose/FichaTecnica.js";
// import Marca from "../models/mongoose/Marca.js";
// import Moto from "../models/mongoose/Moto.js";
// import { validateCreate, validateUpdate } from "../schemas/zod/fichaTecnica.js";

export class FichaTecnicaController {
    async getById(req, res) {
        const ficha = await FichaTecnica.findById({ _id: req.params.id });
        if (!ficha) {
            throw new CustomErrors.NotFoundError("not found id");
        }
        return res.status(StatusCodes.OK).json(ficha);
    }

    // async getAll(req, res) {
    //     const fichas = await FichaTecnica.find();
    //     return res.status(StatusCodes.OK).json({ fichasTecnicas: fichas });
    // }

    // async create(req, res) {
    //     const ficha = validateCreate(req.body);
    //     if (!ficha.success) {
    //         throw new CustomErrors.BadRequestError("bad data");
    //     }
    //     const marca = await Marca.findById({ _id: ficha.data?.marca }); // verifica que existe
    //     const moto = await Moto.findById({ _id: ficha.data?.moto });
    //     if (!marca || !moto) {
    //         throw new CustomErrors.NotFoundError("id not found");
    //     }
    //     const newFicha = await FichaTecnica.create(ficha.data);
    //     moto.fichaTecnica = newFicha._id;
    //     await moto.save();
    //     return res.status(StatusCodes.CREATED).json({ fichaTecnica: newFicha });
    // }
    // async delete(req, res) {
    //     const ficha = await FichaTecnica.findByIdAndDelete({
    //         _id: req.params.id,
    //     });
    //     if (!ficha) {
    //         throw new CustomErrors.NotFoundError("not found id");
    //     }
    //     return res.status(StatusCodes.NO_CONTENT).send();
    // }

    // async update(req, res) {
    //     const ficha = validateUpdate(req.body);
    //     if (!ficha.success) {
    //         throw new CustomErrors.BadRequestError("bad data");
    //     }
    //     const marca = { modelo: Marca, id: ficha.data?.marca };
    //     const moto = { modelo: Moto, id: ficha.data?.moto };
    //     await existID([marca, moto]);
    //     const update = await FichaTecnica.findByIdAndUpdate(
    //         { _id: req.params.id },
    //         ficha.data,
    //         { new: true },
    //     );
    //     if (!update) {
    //         throw new CustomErrors.NotFoundError("bad id");
    //     }
    //     return res.status(StatusCodes.OK).json({ update });
    // }
}
