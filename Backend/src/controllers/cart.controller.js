import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";

/**
 * Controller to add a product variety to cart or increase quantity if it already exists
 */
export const addToCart = async (req, res) => {
    try {
        const productId = req.params.productId || req.body.productId;
        const variantId = req.params.variantId || req.params.varietyId || req.body.variantId || req.body.varietyId;
        const quantity = Math.max(1, parseInt(req.body.quantity, 10) || 1);
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        // 1. Check if product exists using product id
        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Check if variety (variant) exists using variety id
        let variant = null;
        if (variantId) {
            variant = product.variants.id(variantId);
            if (!variant) {
                return res.status(404).json({
                    success: false,
                    message: "Product variety not found",
                });
            }
        } else if (product.variants && product.variants.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Product variety ID is required for this product",
            });
        }

        // Determine price from variant or base product
        const itemPrice = (variant && variant.price && variant.price.amount !== undefined) ? variant.price : product.price;

        // 2. Find cart if exists or create new cart
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            cart = new cartModel({
                user: userId,
                items: [],
            });
        }

        if (!Array.isArray(cart.items)) {
            cart.items = [];
        }

        // 3. Check if product (with same variant/variety) already exists in cart
        const existingItemIndex = cart.items.findIndex((item) => {
            const isSameProduct = item.product.toString() === productId.toString();
            const isSameVariant = variantId
                ? item.variant && item.variant.toString() === variantId.toString()
                : !item.variant;
            return isSameProduct && isSameVariant;
        });

        const stock = await stockOfVariant(productId, variantId);

        if (existingItemIndex > -1) {
            const quatityInCart = cart.items[existingItemIndex].quantity;
            if (quatityInCart + quantity > stock) {
                return res.status(400).json({
                    success: false,
                    message: `Requested quantity exceeds available stock. Only ${stock} items available.`,
                });
            }

            // Simply increase the quantity
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            if (stock !== null && quantity > stock) {
                return res.status(400).json({
                    success: false,
                    message: `Requested quantity exceeds available stock. Only ${stock} items available.`,
                });
            }

            // Add product to cart
            cart.items.push({
                product: productId,
                variant: variantId || null,
                quantity,
                price: itemPrice,
            });
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: existingItemIndex > -1
                ? "Product quantity increased in cart"
                : "Product added to cart successfully",
            cart,
        });
    } catch (error) {
        console.error("addToCart error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/**
 * Controller to get user's cart
 */
export const getCart = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const cart = await cartModel.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: { user: userId, items: [] },
            });
        }

        return res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        console.error("getCart error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};