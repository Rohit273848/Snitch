import { body, param } from "express-validator";

export const validateCreateAddress = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),
    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Please enter a valid 10-digit Indian mobile number"),
    body("street")
        .trim()
        .notEmpty()
        .withMessage("Street address / House info is required")
        .isLength({ min: 5, max: 250 })
        .withMessage("Street address must be between 5 and 250 characters"),
    body("landmark")
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ max: 100 })
        .withMessage("Landmark cannot exceed 100 characters"),
    body("city")
        .trim()
        .notEmpty()
        .withMessage("City is required"),
    body("state")
        .trim()
        .notEmpty()
        .withMessage("State is required"),
    body("pincode")
        .trim()
        .notEmpty()
        .withMessage("Pincode is required")
        .matches(/^\d{6}$/)
        .withMessage("Pincode must be a valid 6-digit code"),
    body("country")
        .optional()
        .trim(),
    body("addressType")
        .optional()
        .isIn(["HOME", "WORK", "OTHER"])
        .withMessage("Address type must be HOME, WORK, or OTHER"),
    body("isDefault")
        .optional()
        .isBoolean()
        .withMessage("isDefault must be a boolean"),
    body("selectForCart")
        .optional()
        .isBoolean()
        .withMessage("selectForCart must be a boolean"),
];

export const validateUpdateAddress = [
    param("addressId")
        .isMongoId()
        .withMessage("Invalid address ID"),
    body("fullName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Full name must be between 2 and 100 characters"),
    body("phone")
        .optional()
        .trim()
        .matches(/^[6-9]\d{9}$/)
        .withMessage("Please enter a valid 10-digit Indian mobile number"),
    body("street")
        .optional()
        .trim()
        .isLength({ min: 5, max: 250 }),
    body("pincode")
        .optional()
        .trim()
        .matches(/^\d{6}$/)
        .withMessage("Pincode must be a valid 6-digit code"),
    body("addressType")
        .optional()
        .isIn(["HOME", "WORK", "OTHER"])
        .withMessage("Address type must be HOME, WORK, or OTHER"),
];

export const validateAddressIdParam = [
    param("addressId")
        .isMongoId()
        .withMessage("Invalid address ID"),
];
