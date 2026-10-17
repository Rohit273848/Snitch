import mongoose from "mongoose";
import productModel from "../models/product.model.js";
import { uploadFile, deleteFileByUrl, deleteFileById } from "../services/storage.service.js";

export async function createProduct(req, res) {
    try {
        let { title, description, priceAmount, priceCurrency, attributeKeys, variants, imageMetadata, category, gender } = req.body;
        const seller = req.user;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one product image is required",
            });
        }

        // Clean & parse attributeKeys
        if (typeof attributeKeys === 'string') {
            try { attributeKeys = JSON.parse(attributeKeys); } catch { attributeKeys = []; }
        }
        if (!Array.isArray(attributeKeys)) attributeKeys = [];
        const cleanAttributeKeys = attributeKeys
            .map(k => String(k || "").trim())
            .filter(Boolean);

        // Parse imageMetadata
        let parsedImageMeta = [];
        if (typeof imageMetadata === 'string') {
            try { parsedImageMeta = JSON.parse(imageMetadata); } catch { parsedImageMeta = []; }
        } else if (Array.isArray(imageMetadata)) {
            parsedImageMeta = imageMetadata;
        }

        // Clean & parse variants
        let parsedVariants = [];
        if (typeof variants === 'string') {
            try { variants = JSON.parse(variants); } catch { variants = []; }
        }
        if (Array.isArray(variants)) {
            const seenCombos = new Set();
            for (let i = 0; i < variants.length; i++) {
                const v = variants[i];
                const rawAttrs = (typeof v.attributes === 'object' && v.attributes !== null) ? v.attributes : {};
                const cleanAttrs = {};
                for (const [k, val] of Object.entries(rawAttrs)) {
                    if (k.trim() && val !== undefined && val !== null && String(val).trim()) {
                        cleanAttrs[k.trim()] = String(val).trim();
                    }
                }

                // If attributeKeys are defined, ensure each variant has those attributes filled
                if (cleanAttributeKeys.length > 0) {
                    const missing = cleanAttributeKeys.filter(k => !cleanAttrs[k]);
                    if (missing.length > 0) {
                        return res.status(400).json({
                            success: false,
                            message: `Variant #${i + 1} is missing attribute values for: ${missing.join(", ")}`,
                        });
                    }
                }

                // Check for duplicate attribute combinations
                const comboKey = Object.entries(cleanAttrs)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([k, val]) => `${k.toLowerCase()}:${val.toLowerCase()}`)
                    .join("|");

                if (comboKey && seenCombos.has(comboKey)) {
                    return res.status(400).json({
                        success: false,
                        message: `Duplicate variant combination detected: ${Object.entries(cleanAttrs).map(([k, val]) => `${k}=${val}`).join(", ")}`,
                    });
                }
                if (comboKey) {
                    seenCombos.add(comboKey);
                }

                const stockNum = Number(v.stock);
                if (isNaN(stockNum) || !Number.isInteger(stockNum) || stockNum < 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Variant #${i + 1} stock must be a non-negative integer`,
                    });
                }

                const variantObj = {
                    attributes: cleanAttrs,
                    stock: stockNum,
                    images: Array.isArray(v.images)
                        ? v.images.filter(img => img && img.url && typeof img.url === "string" && !img.url.startsWith("blob:"))
                        : [],
                };

                // Optional variant price override
                if (v.price && (v.price.amount !== undefined && v.price.amount !== null && v.price.amount !== "")) {
                    const vAmount = Number(v.price.amount);
                    if (!isNaN(vAmount) && vAmount >= 0) {
                        variantObj.price = {
                            amount: vAmount,
                            currency: v.price.currency || priceCurrency || "INR",
                        };
                    }
                }

                parsedVariants.push(variantObj);
            }
        }

        // Upload images via storage service
        const uploadedImages = await Promise.all(
            req.files.map(async (file, idx) => {
                const uploaded = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname,
                });
                const meta = parsedImageMeta[idx] || {};
                return {
                    url: uploaded.url,
                    fileId: uploaded.fileId || "",
                    color: meta.color ? String(meta.color).trim() : "",
                    isCover: Boolean(meta.isCover),
                };
            })
        );

        // Ensure at least one cover image is designated
        if (uploadedImages.length > 0 && !uploadedImages.some(img => img.isCover)) {
            uploadedImages[0].isCover = true;
        }

        const product = await productModel.create({
            title: title.trim(),
            description: description.trim(),
            category: category ? String(category).trim().toLowerCase() : "shirt",
            gender: gender ? String(gender).trim().toLowerCase() : "mens",
            seller: seller._id,
            price: {
                amount: Number(priceAmount),
                currency: priceCurrency || "INR",
            },
            images: uploadedImages,
            attributeKeys: cleanAttributeKeys,
            variants: parsedVariants,
        });

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product,
        });

    } catch (err) {
        console.error("Create product error:", err);
        return res.status(err.name === "ValidationError" ? 400 : 500).json({
            success: false,
            message: err.message || "Failed to create product",
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
        let product = null;

        if (mongoose.Types.ObjectId.isValid(id)) {
            product = await productModel.findById(id).populate("seller", "username email fullname name");
        }

        if (!product) {
            const cleanKey = String(id).replace(/^(velmora|snitch)-/, "").replace(/[-_]/g, " ").trim();
            if (cleanKey) {
                product = await productModel.findOne({
                    title: { $regex: cleanKey, $options: "i" }
                }).populate("seller", "username email fullname name");
            }
        }

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

        const { title, description, priceAmount, priceCurrency, category, gender } = req.body;
        if (title) product.title = title;
        if (description) product.description = description;
        if (category) product.category = String(category).trim().toLowerCase();
        if (gender) product.gender = String(gender).trim().toLowerCase();
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
                try { parsedImages = JSON.parse(parsedImages); } catch (e) { }
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
                        ...(v._id || v.id ? { _id: v._id || v.id } : {}),
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

export async function searchProducts(req, res) {
    try {
        const {
            q = "",
            category = "all",
            color = "all",
            minPrice,
            maxPrice,
            brand = "all",
            sort = "relevance",
            limit = 24,
            page = 1
        } = req.query;

        const filter = {};

        if (q && q.trim()) {
            filter.$or = [
                { title: { $regex: q.trim(), $options: "i" } },
                { description: { $regex: q.trim(), $options: "i" } },
                { category: { $regex: q.trim(), $options: "i" } },
                { "images.color": { $regex: q.trim(), $options: "i" } },
            ];
        }

        if (category && category !== "all") {
            filter.category = { $regex: category.trim(), $options: "i" };
        }

        if (color && color !== "all") {
            filter["images.color"] = { $regex: color.trim(), $options: "i" };
        }

        if (minPrice || maxPrice) {
            filter["price.amount"] = {};
            if (minPrice) filter["price.amount"].$gte = Number(minPrice);
            if (maxPrice) filter["price.amount"].$lte = Number(maxPrice);
        }

        let sortObj = { createdAt: -1 };
        if (sort === "price-low") sortObj = { "price.amount": 1 };
        else if (sort === "price-high") sortObj = { "price.amount": -1 };
        else if (sort === "rating") sortObj = { "rating.rate": -1 };

        const products = await productModel
            .find(filter)
            .sort(sortObj)
            .limit(Number(limit))
            .populate("seller", "username email name fullname");

        return res.status(200).json({
            success: true,
            total: products.length,
            products,
        });
    } catch (err) {
        console.error("search products error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to search products",
        });
    }
}

