import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import User from "../models/mongoose/User.js";
import Review from "../models/mongoose/Review.js";
import z from "zod";

export class UserController {
    //admin
    async getAll(req, res) {
        const users = await User.find();
        return res.status(StatusCodes.OK).json(users);
    }

    //admin
    async getById(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("provide right values");
        }
        const user = await User.findById(req.params.id);
        if (!user) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        return res.status(StatusCodes.OK).json({ user });
    }

    //user
    async getMyUserById(req, res) {
        const user = await User.findById({ _id: req.id });
        if (!user) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        return res.status(StatusCodes.OK).json({ user });
    }

    //admin
    async deleteById(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("provide right values");
        }
        const user = await User.findByIdAndDelete({ _id: req.params.id });
        if (!user) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        await Review.deleteMany({ user: req.params.id });
        return res.status(StatusCodes.NO_CONTENT).send();
    }

    //user
    async deleteMyUserById(req, res) {
        const user = await User.findByIdAndDelete({ _id: req.id });
        if (!user) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        await Review.deleteMany({ user: req.id });
        return res.status(StatusCodes.NO_CONTENT).send();
    }

    //user
    async updateMyAcount(req, res) {
        const update = z
            .object({ name: z.string().min(1) })
            .safeParse(req.body);

        if (!update.success) {
            throw new CustomErrors.BadRequestError("bad data");
        }

        const user = await User.findById(req.id);
        if (!user) {
            throw new CustomErrors.NotFoundError("id not found");
        }

        const data = await User.findByIdAndUpdate(
            req.id,
            { name: update.data.name },
            { new: true },
        );
        if (!data) {
            throw new CustomErrors.BadRequestError("no se pudo actualizar");
        }
        return res.status(StatusCodes.OK).json(data);
    }
}
