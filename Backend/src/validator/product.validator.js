import { body, validationResult } from "express-validator";

export const createProductValidator = [
    body("title")
        .notEmpty().withMessage("Title is required")
        .isString().withMessage("Title must be a string")
        .isLength({ min: 3 }).withMessage("Title must be at least 3 characters long"),
    body("description")
        .notEmpty().withMessage("Description is required")
        .isString().withMessage("Description must be a string"),
    body("priceAmount")
        .notEmpty().withMessage("Price amount is required")
        .isNumeric().withMessage("Price amount must be a valid number"),
    body("priceCurrency")
        .optional()
        .isIn(["USD", "EUR", "GBP", "JPY", "INR"]).withMessage("Invalid price currency"),
    body("images").custom((value, { req }) => {
        if (!req.files || req.files.length === 0) {
            throw new Error("Product image is required");
        }
        return true;
    }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];
