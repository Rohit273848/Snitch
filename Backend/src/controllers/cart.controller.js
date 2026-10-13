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

export const IncrementItemCartQuantity = async (req, res) => {
    try {
        const productId = req.params.productId || req.params.productID;
        const variantId = req.params.variantId || req.params.variantID;
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

        const query = { _id: productId };
        if (variantId) {
            query["variants._id"] = variantId;
        }

        const product = await productModel.findOne(query);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const stock = await stockOfVariant(productId, variantId);

        const currentItem = cart.items.find((item) => {
            const isSameProduct = item.product.toString() === productId.toString();
            const isSameVariant = variantId
                ? item.variant && item.variant.toString() === variantId.toString()
                : !item.variant;
            return isSameProduct && isSameVariant;
        });

        if (!currentItem) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        if (stock !== null && currentItem.quantity + 1 > stock) {
            return res.status(400).json({
                success: false,
                message: `Requested quantity exceeds available stock. Only ${stock} items available.`,
            });
        }

        currentItem.quantity += 1;
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart item quantity successfully incremented",
            cart,
        });
    } catch (error) {
        console.error("IncrementItemCartQuantity error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",  
            error: error.message,
        });
    }
};

export const DecrementItemCartQuantity = async (req, res) => {
    try {
        const productId = req.params.productId || req.params.productID;
        const variantId = req.params.variantId || req.params.variantID;
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

        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const itemIndex = cart.items.findIndex((item) => {
            const isSameProduct = item.product.toString() === productId.toString();
            const isSameVariant = variantId
                ? item.variant && item.variant.toString() === variantId.toString()
                : !item.variant;
            return isSameProduct && isSameVariant;
        });

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        const currentItem = cart.items[itemIndex];
        let wasRemoved = false;

        if (currentItem.quantity > 1) {
            currentItem.quantity -= 1;
        } else {
            // Remove item from cart if quantity is reduced to 0
            cart.items.splice(itemIndex, 1);
            wasRemoved = true;
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: wasRemoved
                ? "Item removed from cart"
                : "Cart item quantity successfully decremented",
            cart,
        });
    } catch (error) {
        console.error("DecrementItemCartQuantity error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

/**
 * Controller to remove an item completely from the cart
 */
export const removeCartItem = async (req, res) => {
    try {
        const productId = req.params.productId || req.params.productID || req.body?.productId || req.query?.productId;
        const variantId = req.params.variantId || req.params.variantID || req.body?.variantId || req.query?.variantId;
        const itemId = req.params.itemId || req.params.itemID || req.body?.itemId || req.query?.itemId;
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        if (!productId && !itemId) {
            return res.status(400).json({
                success: false,
                message: "Product ID or Item ID is required",
            });
        }

        const cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        if (!Array.isArray(cart.items) || cart.items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        let itemIndex = -1;

        // 1. If itemId is provided, match by item._id
        if (itemId) {
            itemIndex = cart.items.findIndex((item) => item._id && item._id.toString() === itemId.toString());
        }

        // 2. If productId was provided and no item found yet, check if productId is actually item._id
        if (itemIndex === -1 && productId) {
            itemIndex = cart.items.findIndex((item) => item._id && item._id.toString() === productId.toString());
        }

        // 3. Match by product and variant
        if (itemIndex === -1 && productId) {
            itemIndex = cart.items.findIndex((item) => {
                const isSameProduct = item.product && item.product.toString() === productId.toString();
                const isSameVariant = variantId
                    ? item.variant && item.variant.toString() === variantId.toString()
                    : !item.variant;
                return isSameProduct && isSameVariant;
            });

            // 4. Fallback: if variantId wasn't specified and no exact match without variant, match product
            if (itemIndex === -1 && !variantId) {
                itemIndex = cart.items.findIndex((item) => item.product && item.product.toString() === productId.toString());
            }
        }

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart",
            });
        }

        // Remove item from cart
        cart.items.splice(itemIndex, 1);
        await cart.save();
        await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Item removed from cart successfully",
            cart,
        });
    } catch (error) {
        console.error("removeCartItem error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const deleteCartItem = removeCartItem;