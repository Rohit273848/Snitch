import productModel from "../models/product.model.js";
// import { config } from "../config/config.js";
import { uploadFile } from "../services/storage.service.js";

export async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body;
        const seller = req.user;
        if (!req.files) {
            return res.status(400).json({
                message: "Product image is required",
            });
        }
        const images = await Promise.all(req.files.map(async (file) => {
            return await uploadFile({
                buffer: file.buffer,
                fileName: file.originalname,
            });
        }))

        const product = await productModel.create({
            title,
            description,
            seller: seller._id,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images
        })
        res.status(201).json({
            message: "product created successfully",
            success: true,
            product
        })

    } catch (err) {
        console.error("Create product error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to create product",
        });
    }
}