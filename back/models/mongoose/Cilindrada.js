import mongoose from "mongoose";

const CilindradaSchema = new mongoose.Schema({
    cilindrada: String,
    max: Number,
    min: Number,
});

export default mongoose.model("Cilindrada", CilindradaSchema);
