import { StatusCodes } from "http-status-codes";
import CustomErrors from "../errors/index.js";
import User from "../models/mongoose/User.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import { makeAccess, makeRefresh } from "../utils/jwt.js";
import { sendResetEmail } from "../utils/sendResetEmail.js";
import { verifyReturnData } from "../utils/jwt.js";
import z from "zod";

const cookie = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export class AuthController {
    async register(req, res) {
        const user = z
            .object({
                name: z.string(),
                email: z.string().email(),
                password: z.string(),
            })
            .safeParse(req.body);
        if (!user.success) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const duplicate = await User.findOne({ email: user.data.email });
        if (duplicate) {
            throw new CustomErrors.BadRequestError("duplicated email");
        }

        //podria mejorar la primera verificacion para ser rol de admin
        const isFirstAccount = (await User.countDocuments({})) === 0;
        const role = isFirstAccount ? "admin" : "user";

        const verificationToken = crypto.randomBytes(112).toString("hex");
        const verificationTokenHash = await bcrypt.hash(verificationToken, 10);

        const password = await bcrypt.hash(user.data.password, 10);

        const newUser = await User.create({
            name: user.data.name,
            email: user.data.email,
            password,
            role,
            verificationToken: verificationTokenHash,
        });

        console.log("origin--->", req.headers?.origin);

        //checkear el origen de donde se envia el email
        await sendVerificationEmail({
            origin: process.env.ORIGIN,
            name: newUser.name,
            email: newUser.email,
            verificationToken,
        });

        return res.status(StatusCodes.CREATED).json({
            msg: "Success! Please check your email to verify account",
        });
    }

    async vefiryEmail(req, res) {
        const validacion = z
            .object({
                email: z.string().email(),
                verificationToken: z.string(),
            })
            .safeParse(req.body);
        console.log(req.body);
        if (!validacion.success) {
            throw new CustomErrors.BadRequestError("bad data");
        }
        const user = await User.findOne({
            email: validacion.data?.email,
        });
        if (!user) {
            throw new CustomErrors.UnauthenticatedError("Verification Failed");
        }
        const match = await bcrypt.compare(
            validacion.data.verificationToken,
            user.verificationToken,
        );
        if (!match) {
            throw new CustomErrors.UnauthenticatedError("invalid credentials");
        }
        user.isVerified = true;
        user.verificationToken = null;
        user.verified = Date.now();
        user.save();
        return res.status(StatusCodes.OK).json({ msg: "Email Verified" });
    }

    async login(req, res) {
        const validate = z
            .object({
                email: z.string().email(),
                password: z.string(),
            })
            .safeParse(req.body);
        if (!validate.success) {
            throw new CustomErrors.BadRequestError(
                "Please provide email and password",
            );
        }
        const user = await User.findOne({ email: validate.data.email });
        if (!user) {
            throw new CustomErrors.UnauthenticatedError("invalid credentials");
        }
        const match = await bcrypt.compare(
            validate.data.password,
            user.password,
        );
        if (!match) {
            console.log("mal password");
            throw new CustomErrors.UnauthenticatedError("invalid credentials");
        }
        if (!user.isVerified) {
            throw new CustomErrors.UnauthenticatedError(
                "Please verify your email",
            );
        }

        const jwt = req?.cookies?.jwt;
        if (jwt) {
            res.clearCookie("jwt", cookie);
        }

        const accessToken = makeAccess({
            user: { id: user._id, role: user.role },
        });
        const refreshToken = makeRefresh({ user: { id: user._id } });

        res.cookie("jwt", refreshToken, cookie);

        res.status(StatusCodes.OK).json({
            role: user.role,
            accessToken,
            name: user.name,
            email: user.email,
        });
    }

    async logOut(req, res) {
        const jwt = req?.cookies?.jwt;
        if (jwt) {
            res.clearCookie("jwt", cookie);
        }

        return res.status(StatusCodes.NO_CONTENT).send();
    }

    async refreshToken(req, res) {
        const refreshToken = req?.cookies?.jwt;
        if (!refreshToken) {
            throw new CustomErrors.UnauthorizedError(
                "no autorizado en el refresh",
            );
        }
        res.clearCookie("jwt", cookie);

        const decode = await verifyReturnData(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        if (!decode) throw new CustomErrors.UnauthorizedError("bad token");

        const user = await User.findById(decode.user.id);

        if (!user) {
            throw new CustomErrors.UnauthorizedError(
                "no autorizado en el refresh",
            );
        }

        const accessToken = makeAccess({
            user: { id: user._id, role: user.role },
        });

        const newRefreshToken = makeRefresh({
            user: { id: user._id },
        });

        res.cookie("jwt", newRefreshToken, cookie);

        return res.status(StatusCodes.CREATED).json({
            role: user.role,
            accessToken,
            name: user.name,
            email: user.email,
        });
    }

    async forgotPassword(req, res) {
        const email = z
            .object({
                email: z.string().email(),
            })
            .safeParse(req.body);

        if (!email.success) {
            throw new CustomErrors.BadRequestError(
                "Please provide valid email",
            );
        }
        const user = await User.findOne({ email: email.data.email });
        if (!user) {
            throw new CustomErrors.BadRequestError(
                "Please provide valid email",
            );
        }
        const passwordToken = crypto.randomBytes(70).toString("hex");
        const passwordTokenHash = await bcrypt.hash(passwordToken, 10);

        await sendResetEmail({
            name: user.name,
            email: user.email,
            token: passwordToken,
            origin: process.env.ORIGIN,
        });

        const tenMinutes = 1000 * 60 * 10;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes); //debe hacerse con orario mundial

        user.passwordToken = passwordTokenHash;
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();

        res.status(StatusCodes.OK).json({
            msg: "Please check your email for reset password link",
        });
    }

    async resetPassword(req, res) {
        const validacion = z
            .object({
                email: z.string().email(),
                password: z.string(),
                token: z.string(),
            })
            .safeParse(req.body);

        if (!validacion.success) {
            throw new CustomErrors.BadRequestError("Please provide all values");
        }

        const user = await User.findOne({ email: validacion.data.email });
        if (!user) {
            throw new CustomErrors.BadRequestError(
                "Please provide valid values",
            );
        }

        const match = await bcrypt.compare(
            user.passwordToken,
            validacion.data.token,
        );
        if (!match) {
            throw new CustomErrors.BadRequestError(
                "Please provide valid values",
            );
        }
        const currentDate = new Date();
        if (user.passwordTokenExpirationDate > currentDate) {
            const passHashed = await bcrypt.hash(validacion.data.password, 10);
            user.password = passHashed;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
            await user.save();
        } else {
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
            throw new CustomErrors.BadRequestError(
                "Please provide valid values",
            );
        }
        res.status(StatusCodes.OK).json({
            msg: "reset password",
        });
    }

    async cambiarPassword(req, res) {
        console.log(req.body);
        const validacion = z
            .object({
                oldPassword: z.string(),
                newPassword: z.string().min(5).max(20),
                repetNewPassword: z.string().min(5).max(20),
            })
            .refine((data) => data.oldPassword !== newPassword, {
                path: ["newPassword"],
            })
            .refine((data) => data.newPassword === data.repetNewPassword, {
                path: ["repetNewPassword"],
            })
            .safeParse(req.body);

        if (!validacion.success) {
            throw new CustomErrors.BadRequestError("Please provide all values");
        }

        const user = await User.findById(req.id);
        if (!user) {
            throw new CustomErrors.BadRequestError("Please provide all values");
        }

        const match = await bcrypt.compare(
            validacion.data.oldPassword,
            user.password,
        );
        if (!match) {
            throw new CustomErrors.BadRequestError(
                "Please provide valid values",
            );
        }

        const newPassword = await bcrypt.hash(validacion.data.newPassword, 10);

        user.password = newPassword;
        await user.save();
        res.status(StatusCodes.OK).json({
            msg: "password change",
        });
    }
}
