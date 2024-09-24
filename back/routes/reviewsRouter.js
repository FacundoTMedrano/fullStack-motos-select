/* eslint-disable prettier/prettier */
import express from "express";
const router = express.Router();
import { ReviewController } from "../controllers/reviews.js";
import { verifyRoles } from "../middlewares/verifyRoles.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";

const review = new ReviewController();

router.get("/get-all", verifyJWT, verifyRoles(["admin"]), review.getAll);
router.get("/moto/:id", review.getAllbyMoto);
router.post("/create", verifyJWT, review.createReview);
router.get("/get-by-user/:id", verifyJWT, verifyRoles(["admin"]), review.getByUser);
router.get("/my-reviews", verifyJWT, review.getByMyAcount);
router.get("/get-single-review/:id", verifyJWT, verifyRoles(["admin"]), review.getSingleReview);
router.get("/get-review/:id", verifyJWT, review.getMySingleReview);
router.delete("/delete-by-admin/:id", verifyJWT, verifyRoles(["admin"]), review.deleteById);
router.delete("/delete/:id", verifyJWT, review.deleteByIdUser);
router.patch("/update-state-by-admin/:id", verifyJWT, verifyRoles(["admin"]), review.updateStateById);
router.patch("/update/:id", verifyJWT, review.updateReviewByIdUser);

export default router;
