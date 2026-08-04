import userModel from "../models/user.model.js";


export const register = async (req, res) => {
    const { email, contact, password, fullname } = req.body;

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
            role
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server error" })
    }
}