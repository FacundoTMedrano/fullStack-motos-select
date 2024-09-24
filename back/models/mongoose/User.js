import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    // numeroDeReviews: {
    //     aceptado: String,
    //     rechazado: String,
    //     pendiente: String,
    // },
    verificationToken: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    verified: Date,
    passwordToken: String,
    passwordTokenExpirationDate: Date,
});

UserSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "user",
});

export default mongoose.model("User", UserSchema);
