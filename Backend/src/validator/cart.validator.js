import { param, body } from "express-validator";

export const validateAddToCart = [
       param("productId").isMongoId().withMessage("Invalid product ID"),
        param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
        body("quantity").optional().isInt({min:1}).withMessage("Quantity must be at least 1")
]

export const validateIncrementCartItemQuantity = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
    param("variantID").optional().isMongoId().withMessage("Invalid variant ID"),
];

export const validateDecrementCartItemQuantity = [
    param("productId").isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
    param("variantID").optional().isMongoId().withMessage("Invalid variant ID"),
];

export const validateRemoveCartItem = [
    param("productId").optional().isMongoId().withMessage("Invalid product ID"),
    param("variantId").optional().isMongoId().withMessage("Invalid variant ID"),
    param("variantID").optional().isMongoId().withMessage("Invalid variant ID"),
    param("itemId").optional().isMongoId().withMessage("Invalid item ID"),
];