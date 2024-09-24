import mongoose from "mongoose";

const MotoSchema = new mongoose.Schema({
    nombre: String,
    img: String,
    cilindrada: Number,
    marca: {
        type: mongoose.Schema.ObjectId,
        ref: "Marca",
    },
    estilo: {
        type: mongoose.Schema.ObjectId,
        ref: "Estilo",
    },
});

export default mongoose.model("Moto", MotoSchema);
