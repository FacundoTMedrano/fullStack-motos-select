import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import Review from "../models/mongoose/Review.js";
import Moto from "../models/mongoose/Moto.js";
import { validateReview } from "../schemas/zod/review.js";

export class ReviewController {
    async getAll(req, res) {
        const reviews = await Review.find();
        return res.status(StatusCodes.OK).json({ reviews });
    }

    async getAllbyMoto(req, res) {
        if (!req.params.id) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const reviews = await Review.find({
            moto: req.params.id,
            state: "approved",
        }).populate({ path: "user", select: "name" });

        return res.status(StatusCodes.OK).json(reviews);
    }

    async createReview(req, res) {
        req.body.user = req.id;
        req.body.state = "pending";
        const validacion = validateReview(req.body);
        if (!validacion.success) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const moto = await Moto.findById(validacion.data.moto);
        if (!moto) {
            throw new CustomErrors.NotFoundError("bad id moto");
        }
        const review = await Review.create(validacion.data);
        return res.status(StatusCodes.CREATED).json(review);
    }

    //admin
    async getByUser(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const reviews = await Review.find({ user: req.params.id });
        return res.status(StatusCodes.OK).json(reviews);
    }

    //user
    async getByMyAcount(req, res) {
        const reviews = await Review.find({ user: req.id }).populate({
            path: "moto",
            select: "nombre marca",
            populate: {
                path: "marca",
                select: "marca",
            },
        });
        return res.status(StatusCodes.OK).json(reviews);
    }

    //admin
    async getSingleReview(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const review = await Review.findOne({ _id: req.params.id });
        if (!review) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        return res.status(StatusCodes.OK).json(review);
    }

    //user
    async getMySingleReview(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const review = await Review.findOne({
            user: req.id,
            _id: req.params.id,
        });
        if (!review) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        return res.status(StatusCodes.OK).json(review);
    }

    //admin
    async deleteById(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        return res.status(StatusCodes.OK).json(review);
    }

    //user
    async deleteByIdUser(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const review = await Review.findOneAndDelete({
            user: req.id,
            _id: req.params.id,
        });
        if (!review) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        return res.status(StatusCodes.OK).json(review);
    }

    //admin
    async updateStateById(req, res) {
        const state = req.body?.state;
        if (!state || !req.params?.id) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const result = ["approverd", "disapproved", "pending"].includes(state);
        if (!result) {
            throw new CustomErrors.BadRequestError("provide right values");
        }
        const review = await Review.findOneAndUpdate(
            { _id: req.params.id },
            { state },
            { new: true },
        );
        if (!review) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        return res.status(StatusCodes.OK).json(review);
    }

    //user
    async updateReviewByIdUser(req, res) {
        if (!req.params?.id) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        req.body.user = req.id;
        req.body.state = "pending";
        const validacion = validateReview(req.body);

        if (!validacion.success) {
            throw new CustomErrors.BadRequestError("provide values");
        }
        const review = await Review.findOneAndUpdate(
            { _id: req.params.id, user: req.id },
            validacion.data,
            { new: true },
        );
        if (!review) {
            throw new CustomErrors.NotFoundError("id not found");
        }
        return res.status(StatusCodes.OK).json({ review });
    }
}