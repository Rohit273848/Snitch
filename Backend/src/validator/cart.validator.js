import { param, body } from "express-validator";

export const validateAddToCart = [
       param("productId").isMongoId().withMessage("Invalid product ID"),
        param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
        body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1")
]