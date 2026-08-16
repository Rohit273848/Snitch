import productModel from "../models/product.model.js";
// import { config } from "../config/config.js";
import { uploadFile, deleteFileByUrl } from "../services/storage.service.js";

export async function createProduct(req, res) {
    try {
        let { title, description, priceAmount, priceCurrency, attributeKeys, variants } = req.body;
        const seller = req.user;
        if (!req.files) {
            return res.status(400).json({
                message: "Product image is required",
            });
        }
        if (typeof attributeKeys === 'string') {
            try { attributeKeys = JSON.parse(attributeKeys); } catch (e) { attributeKeys = []; }
        }
        if (!Array.isArray(attributeKeys)) attributeKeys = [];

        let parsedVariants = [];
        if (typeof variants === 'string') {
            try { variants = JSON.parse(variants); } catch (e) { variants = []; }
        }
        if (Array.isArray(variants)) {
            parsedVariants = variants.map(v => ({
                stock: Number(v.stock || 0),
                attributes: typeof v.attributes === 'object' && v.attributes !== null ? v.attributes : {},
                images: Array.isArray(v.images) ? v.images.filter(img => img && img.url && !img.url.startsWith('blob:')) : [],
                price: v.price?.amount ? { amount: Number(v.price.amount), currency: v.price.currency || priceCurrency || "INR" } : undefined
            }));
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
            images,
            attributeKeys,
            variants: parsedVariants
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

export async function updateSellerProduct(req, res) {
    try {
        const { id } = req.params;
        const user = req.user;

        const product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.seller.toString() !== user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this product",
            });
        }

        const { title, description, priceAmount, priceCurrency } = req.body;
        if (title) product.title = title;
        if (description) product.description = description;
        if (priceAmount !== undefined && priceAmount !== null && priceAmount !== "") {
            product.price.amount = Number(priceAmount);
        }
        if (priceCurrency) {
            product.price.currency = priceCurrency;
        }

        let newlyUploadedImages = [];
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(async (file) => {
                    return await uploadFile({
                        buffer: file.buffer,
                        fileName: file.originalname,
                    });
                })
            );
            
            newlyUploadedImages = uploadedImages;
            if (req.body.replaceImages === "true") {
                product.images = uploadedImages;
            } else {
                product.images.push(...uploadedImages);
            }
        }

        if (req.body.images) {
            let parsedImages = req.body.images;
            if (typeof parsedImages === 'string') {
                try { parsedImages = JSON.parse(parsedImages); } catch (e) {}
            }
            if (Array.isArray(parsedImages)) {
                product.images = parsedImages.map(img => typeof img === 'string' ? { url: img } : img);
            }
        }

        if (req.body.variants !== undefined) {
            let parsedVariants = req.body.variants;
            if (typeof parsedVariants === 'string') {
                try {
                    parsedVariants = JSON.parse(parsedVariants);
                } catch (e) {
                    parsedVariants = [];
                }
            }
            if (Array.isArray(parsedVariants)) {
                // Collect existing variant image URLs before updating
                const oldVariantImageUrls = new Set();
                if (Array.isArray(product.variants)) {
                    product.variants.forEach(v => {
                        if (Array.isArray(v.images)) {
                            v.images.forEach(img => {
                                const url = typeof img === 'string' ? img : img?.url;
                                if (url && typeof url === 'string') {
                                    oldVariantImageUrls.add(url);
                                }
                            });
                        }
                    });
                }

                const formattedVariants = parsedVariants.map(v => {
                    const amount = v.price?.amount || v.priceAmount;
                    const currency = v.price?.currency || v.priceCurrency || product.price.currency || "INR";
                    
                    // Filter out transient blob: URLs
                    const validImages = Array.isArray(v.images)
                        ? v.images
                            .map(img => typeof img === 'string' ? { url: img } : img)
                            .filter(img => img && img.url && typeof img.url === 'string' && !img.url.startsWith('blob:'))
                        : [];

                    let attrsObj = v.attributes;
                    if (typeof attrsObj === 'string') {
                        try { attrsObj = JSON.parse(attrsObj); } catch (e) { attrsObj = {}; }
                    }
                    if (attrsObj instanceof Map) {
                        attrsObj = Object.fromEntries(attrsObj);
                    }
                    if (typeof attrsObj !== 'object' || attrsObj === null) {
                        attrsObj = {};
                    }

                    const formattedVariant = {
                        stock: Number(v.stock || 0),
                        attributes: attrsObj,
                        images: validImages
                    };

                    if (amount !== undefined && amount !== null && amount !== "") {
                        formattedVariant.price = {
                            amount: Number(amount),
                            currency: currency
                        };
                    }
                    return formattedVariant;
                });

                // Attach newly uploaded images to any new variant that lacks images
                if (newlyUploadedImages.length > 0 && formattedVariants.length > 0) {
                    const targetVariant = formattedVariants[formattedVariants.length - 1];
                    if (targetVariant && targetVariant.images.length === 0) {
                        targetVariant.images = newlyUploadedImages.map(img => ({ url: img.url }));
                    }
                }

                // Collect remaining variant image URLs after update
                const newVariantImageUrls = new Set();
                formattedVariants.forEach(v => {
                    if (Array.isArray(v.images)) {
                        v.images.forEach(img => {
                            if (img && img.url && typeof img.url === 'string') {
                                newVariantImageUrls.add(img.url);
                            }
                        });
                    }
                });

                // Identify image URLs from deleted variants that are no longer used by any variant
                const deletedImageUrls = [...oldVariantImageUrls].filter(url => !newVariantImageUrls.has(url));

                if (deletedImageUrls.length > 0) {
                    // Remove deleted variant images from main product images array
                    product.images = product.images.filter(img => !deletedImageUrls.includes(img.url));

                    // Delete files from ImageKit storage
                    Promise.all(deletedImageUrls.map(url => deleteFileByUrl(url))).catch(err => {
                        console.error("Error deleting variant images from storage:", err);
                    });
                }

                product.variants = formattedVariants;
            }
        }

        await product.save();

        const updatedProduct = await productModel.findById(id).populate("seller", "username email name");

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (err) {
        console.error("Update product error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update product"
        });
    }
}

export async function deleteSellerProduct(req, res) {
    try {
        const { id } = req.params;
        const sellerId = req.user._id;

        const product = await productModel.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.seller.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this product"
            });
        }

        // Collect all image URLs across product.images and variant images
        const allImageUrls = new Set();
        if (Array.isArray(product.images)) {
            product.images.forEach(img => img?.url && allImageUrls.add(img.url));
        }
        if (Array.isArray(product.variants)) {
            product.variants.forEach(v => {
                if (Array.isArray(v.images)) {
                    v.images.forEach(img => img?.url && allImageUrls.add(img.url));
                }
            });
        }

        await productModel.findByIdAndDelete(id);

        // Delete all associated files from ImageKit storage
        if (allImageUrls.size > 0) {
            Promise.all([...allImageUrls].map(url => deleteFileByUrl(url))).catch(err => {
                console.error("Error deleting product images from storage:", err);
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product removed successfully"
        });
    } catch (err) {
        console.error("Delete product error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
}