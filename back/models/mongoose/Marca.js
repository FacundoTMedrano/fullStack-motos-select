import mongoose from "mongoose";

const marcaSchema = new mongoose.Schema({
    marca: String,
    img: String,
});

export default mongoose.model("Marca", marcaSchema);
