import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import mongoose from "mongoose";

import express from "express";
const app = express();

import morgan from "morgan";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import { corsOptions } from "./config/corsConfig.js";

import { verifyJWT } from "./middlewares/verifyJWT.js";

import marcasRouter from "./routes/marcaRouter.js";
import estiloRouter from "./routes/estiloRouter.js";
import cilindradaRouter from "./routes/cilindradaRouter.js";
import motosRouter from "./routes/motosRouter.js";
import authRouter from "./routes/authRouter.js";
import userRouter from "./routes/userRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
import fichaTecnicaRouter from "./routes/fichaTecnicaRouter.js";

import connectDB from "./config/db.js";
connectDB();

import notFoundMiddleware from "./middlewares/notFound.js";
import errorHandlerMiddleware from "./middlewares/error-handler.js";

app.set("trust proxy", 1);

app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/imgs", express.static("imgs"));
app.use(helmet());

app.use("/fichas", fichaTecnicaRouter);
app.use("/marcas", marcasRouter);
app.use("/estilos", estiloRouter);
app.use("/cilindradas", cilindradaRouter);
app.use("/motos", motosRouter);
app.use("/auth", authRouter);
app.use("/reviews", reviewsRouter);
app.use("/user", verifyJWT, userRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT ?? 5000;

mongoose.connection.once("open", () => {
    app.listen(PORT, () => {
        console.log(`server listening on port http://localhost:${PORT}`);
    });
});
