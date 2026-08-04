import { config } from "../config/config.js";
import userModel from "../models/user.model.js";

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign({
        id: user.id,
    }, config.jwt_secret, {
        expiresIn: "7d"
    })
    res.cookie("token", token)
    res.status(200), json({
        message,
        success: true,
        user: {
            id: user.id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
}

export const register = async (req, res) => {
    const { email, contact, password, fullname, isSeller } = req.body;

    try {
        const existingUser = await userModel.findOne({
            $or: [{ email }, { contact }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email or contact" });
        }

        const user = await userModel.create({
            email,
            contact,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"

        })
        await sendTokenResponse(user, res, "user registered successfully")

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" })
        }

        sendTokenResponse(user, res, "Login successfully")
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server error" })
    }
}