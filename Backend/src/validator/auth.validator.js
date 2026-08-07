import { body, validationResult } from "express-validator";


export const validateRegisterUser = [
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("fullname").isLength({ min: 3 }).withMessage("Full Name must be at least 3 characters"),
    //for  contact: { type: String, required: true, unique: true },
    body("contact").isLength({ min: 10 }).withMessage("Contact must be atleas 10 digit"),
    body("contact").isLength({ max: 10 }).withMessage("Contact must be atleas 10 digit"),
    body("isSeller").isBoolean().withMessage("isSeller must be boolean"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]

export const validateLoginUser = [
    body("email").isEmail().withMessage("Email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
]