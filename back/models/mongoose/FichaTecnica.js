import mongoose from "mongoose";

const FichaTecnicaSchema = new mongoose.Schema({
    moto: {
        type: mongoose.Schema.ObjectId,
        ref: "Moto",
    },
    mecanica: {
        Motor: String,
        Cilindrada: String,
        "Potencia máxima": String,
        "Velocidad máxima": String,
        Alimentación: String,
        Encendido: String,
        Arranque: String,
        Transmisión: String,
        Tracción: String,
    },
    configuracion: {
        "Faro Delantero": String,
        Llantas: String,
        "Frenos D / T": String,
        "Neumático Delantero": String,
        "Neumático Trasero": String,
        "Suspensión Delantera": String,
        "Suspensión Trasera": String,
        "Largo / Ancho / Alto": String,
        "Distancia entre Ejes": String,
        Peso: String,
        "Capacidad de Carga": String,
        "Capacidad del Tanque": String,
        "Consumo y Autonomía": String,
        "Puerto USB": String,
        "Altura del Asiento": String,
        Equipamiento: [String],
        "Tipo de Batería": String,
        "Cantidad de Baterías": String,
        "Tiempo de Carga": String,
    },
    imagenes: [String],
});

export default mongoose.model("FichaTecnica", FichaTecnicaSchema);
