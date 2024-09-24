import mongoose from "mongoose";

export default async function connectDB() {
    try {
        //auto index a falso para produccion
        await mongoose.connect("mongodb://localhost:27017", {
            user: "root",
            pass: "secret",
            dbName: "motos",
        });
    } catch (err) {
        console.error("Error conectando a MongoDB:", err);
        process.exit(1);
    }
}
