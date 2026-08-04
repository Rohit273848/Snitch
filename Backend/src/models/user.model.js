import mongoose from "mongoose";
import bcrypt from "bcrypt"

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

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})
userSchema.method.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}
const userModel = new mongoose.model("user", userSchema)
export default userModel