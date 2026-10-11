import { body, validationResult } from "express-validator";

export const createProductValidator = [
    body("title")
        .trim()
        .notEmpty().withMessage("Product title is required")
        .isString().withMessage("Product title must be a string")
        .isLength({ min: 3, max: 120 }).withMessage("Title must be between 3 and 120 characters long"),

    body("description")
        .trim()
        .notEmpty().withMessage("Product description is required")
        .isString().withMessage("Description must be a string")
        .isLength({ min: 5 }).withMessage("Description must be at least 5 characters long"),

    body("priceAmount")
        .notEmpty().withMessage("Price amount is required")
        .isFloat({ min: 0 }).withMessage("Price amount must be a positive number or zero"),

    body("priceCurrency")
        .optional()
        .isIn(["USD", "EUR", "GBP", "JPY", "INR"]).withMessage("Invalid price currency. Must be INR, USD, EUR, GBP, or JPY"),

    body("images").custom((value, { req }) => {
        if (!req.files || req.files.length === 0) {
            throw new Error("At least one product image is required");
        }
        for (const file of req.files) {
            if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.mimetype)) {
                throw new Error(`Unsupported image format: ${file.mimetype}. Only JPEG, PNG, and WebP are allowed.`);
            }
            if (file.size > 5 * 1024 * 1024) {
                throw new Error(`Image ${file.originalname} exceeds the 5MB size limit`);
            }
        }
        return true;
    }),

    body("variants").optional().custom((value) => {
        let parsed = value;
        if (typeof parsed === "string") {
            try {
                parsed = JSON.parse(parsed);
            } catch {
                throw new Error("Variants must be valid JSON");
            }
        }
        if (!Array.isArray(parsed)) {
            throw new Error("Variants must be an array");
        }

        const seenCombos = new Set();
        for (let i = 0; i < parsed.length; i++) {
            const v = parsed[i];
            const stockNum = Number(v.stock);
            if (!Number.isInteger(stockNum) || stockNum < 0) {
                throw new Error(`Variant #${i + 1} stock must be a non-negative integer`);
            }
            if (typeof v.attributes !== "object" || v.attributes === null) {
                throw new Error(`Variant #${i + 1} attributes must be an object`);
            }

            // Check non-empty attribute values
            const entries = Object.entries(v.attributes).filter(([k, val]) => k.trim() && val !== undefined && val !== null && String(val).trim());
            const comboKey = entries
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([k, val]) => `${k.toLowerCase().trim()}:${String(val).toLowerCase().trim()}`)
                .join("|");

            if (comboKey && seenCombos.has(comboKey)) {
                throw new Error(`Duplicate variant combination: ${entries.map(([k, val]) => `${k}=${val}`).join(", ")}`);
            }
            if (comboKey) {
                seenCombos.add(comboKey);
            }
        }
        return true;
    })
];
