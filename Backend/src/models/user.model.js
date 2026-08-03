import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    contact: {
        type: String, required: true, unique: true
    },
    role: {
        type: String,
        enum: ["seller", "buyer"],
        default: "buyer"
    }
})

const userModel = new mongoose.model("user", userSchema)
export default userModel