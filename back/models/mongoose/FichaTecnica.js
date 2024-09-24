import mongoose from "mongoose";
const Schema = mongoose.Schema;

const FichaTecnicaSchema = new Schema({
    moto: {
        type: mongoose.Schema.ObjectId,
        ref: "Moto",
        required: true,
    },
    informacion: [
        {
            grupo: String,
            propiedades: {},
        },
    ],
    imagenes: [String],
});

export default mongoose.model("FichaTecnica", FichaTecnicaSchema);
