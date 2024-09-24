import mongoose from "mongoose";

const EstiloSchema = new mongoose.Schema({
    estilo: String,
});

export default mongoose.model("Estilo", EstiloSchema);
