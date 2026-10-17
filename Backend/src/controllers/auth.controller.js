import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken"

async function sendTokenResponse(user, res, message) {
    const token = jwt.sign({
        id: user.id,
    }, config.jwt_secret, {
        expiresIn: "7d"
    })
    res.cookie("token", token, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
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

        await sendTokenResponse(user, res, "Login successfully")
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal Server error" })
    }
}

export const googleCallBackController = async (req, res) => {
    try {
        const { id, emails, displayName } = req.user;

        const email = emails?.[0]?.value;

        if (!email) {
            console.error("Google auth callback: No email in Google profile", req.user);
            return res.redirect(`${config.CLIENT_URL.replace(/\/+$/, "")}/login?error=no_email`);
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                email,
                fullname: displayName || "Google User",
                role: "buyer",
                googleID: id,
            });
            console.log(`[Google Auth] Created new user: ${user.email} (${user._id})`);
        } else if (!user.googleID) {
            user.googleID = id;
            await user.save();
            console.log(`[Google Auth] Linked Google ID to existing user: ${user.email}`);
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            config.jwt_secret,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite:
                config.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const targetPath = user.role === "seller" ? "/seller/dashboard" : "/";
        res.redirect(`${config.CLIENT_URL.replace(/\/+$/, "")}${targetPath}`);

    } catch (error) {
        console.error("googleCallBackController error:", error);
        res.redirect(`${config.CLIENT_URL.replace(/\/+$/, "")}/login?error=auth_failed`);
    }
};

export const getMe = async (req, res) => {
    const user = req.user;
    res.status(200).json({
        message: "User fetched successfully",
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    })
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "None" : "Lax",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to log out",
        });
    }
};