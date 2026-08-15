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

export async function getProducts(req, res) {
    try {
        const user = req.user;
        const products = await productModel.find({ seller: user._id });
        res.status(200).json({
            message: "produts fetches successfully",
            success: true,
            products
        })
    } catch (err) {
        console.error("get product error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to get product",
        });
    }
}
export async function getAllProducts(req, res) {
    try {
        const products = await productModel.find().populate("seller", "username email name");
        res.status(200).json({
            message: "all products fetches successfully",
            success: true,
            products
        })
    } catch (err) {
        console.error("get product error:", err);

        return res.status(500).json({
            success: false,
            message: "Failed to get product",
        });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id).populate("seller", "username email name");
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            message: "product fetched successfully",
            success: true,
            product
        });
    } catch (err) {
        console.error("get product by id error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to get product",
        });
    }
}