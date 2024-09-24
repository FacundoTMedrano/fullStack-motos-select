import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        motor: Number,
        velocidadMaxima: Number,
        armadoYTerminaciones: Number,
        equipamientoEInstrumental: Number,
        bateriasYRecarga: Number,
        consumoYAutonimia: Number,
        neumaticos: Number,
        frenos: Number,
        luces: Number,
        costoDeMantenimiento: Number,
        moto: {
            type: mongoose.Schema.ObjectId,
            ref: "Moto",
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        },
        opinionPositiva: String,
        opinionNegativa: String,
        state: {
            type: String,
            enum: ["approved", "disapproved", "pending"],
            default: "pending",
        },
    },
    { timestamps: true },
);

export default mongoose.model("Review", ReviewSchema);
