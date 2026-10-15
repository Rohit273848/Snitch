import mongoose from "mongoose";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import addressModel from "../models/address.model.js";
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

        const userObjectId = new mongoose.Types.ObjectId(userId);

        const cartResult = await cartModel.aggregate([
            // 1. Filter only the logged-in user's cart
            {
                $match: {
                    user: userObjectId
                }
            },
            // 2. Unwind items (preserve empty carts)
            {
                $unwind: {
                    path: '$items',
                    preserveNullAndEmptyArrays: true
                }
            },
            // 3. Populate product details from 'products' collection
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $unwind: {
                    path: '$product',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup shippingAddress details from 'addresses' collection
            {
                $lookup: {
                    from: 'addresses',
                    localField: 'shippingAddress',
                    foreignField: '_id',
                    as: 'shippingAddress'
                }
            },
            {
                $unwind: {
                    path: '$shippingAddress',
                    preserveNullAndEmptyArrays: true
                }
            },
            // 4. Resolve variant directly from product.variants subdocument array
            {
                $addFields: {
                    variant: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ['$items.variant', null] },
                                    { $isArray: '$product.variants' }
                                ]
                            },
                            then: {
                                $arrayElemAt: [
                                    {
                                        $filter: {
                                            input: '$product.variants',
                                            as: 'v',
                                            cond: {
                                                $or: [
                                                    { $eq: ['$$v._id', '$items.variant'] },
                                                    { $eq: [{ $toString: '$$v._id' }, { $toString: '$items.variant' }] }
                                                ]
                                            }
                                        }
                                    },
                                    0
                                ]
                            },
                            else: null
                        }
                    }
                }
            },
            // 5. Determine live unit price, currency, and line total (live seller price takes precedence over saved cart snapshot)
            {
                $addFields: {
                    unitPrice: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ['$variant.price.amount', null] },
                                    { $gt: ['$variant.price.amount', 0] }
                                ]
                            },
                            then: '$variant.price.amount',
                            else: {
                                $ifNull: [
                                    '$product.price.amount',
                                    { $ifNull: ['$items.price.amount', 0] }
                                ]
                            }
                        }
                    },
                    currency: {
                        $cond: {
                            if: {
                                $and: [
                                    { $ne: ['$variant.price.currency', null] },
                                    { $ne: ['$variant.price.currency', ''] }
                                ]
                            },
                            then: '$variant.price.currency',
                            else: {
                                $ifNull: [
                                    '$product.price.currency',
                                    { $ifNull: ['$items.price.currency', 'INR'] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $addFields: {
                    itemTotal: {
                        $multiply: [
                            { $ifNull: ['$items.quantity', 0] },
                            '$unitPrice'
                        ]
                    }
                }
            },
            // 6. Re-group into single cart
            {
                $group: {
                    _id: '$_id',
                    user: { $first: '$user' },
                    shippingAddress: { $first: '$shippingAddress' },
                    createdAt: { $first: '$createdAt' },
                    updatedAt: { $first: '$updatedAt' },
                    totalPrice: { $sum: '$itemTotal' },
                    currency: { $first: '$currency' },
                    items: {
                        $push: {
                            _id: '$items._id',
                            quantity: '$items.quantity',
                            product: '$product',
                            variant: '$variant',
                            price: {
                                amount: '$unitPrice',
                                currency: '$currency'
                            },
                            unitPrice: '$unitPrice',
                            itemTotal: '$itemTotal'
                        }
                    }
                }
            },
            // 7. Remove phantom items if the cart was empty or if product was deleted
            {
                $addFields: {
                    items: {
                        $filter: {
                            input: '$items',
                            as: 'item',
                            cond: {
                                $and: [
                                    { $ne: ['$$item._id', null] },
                                    { $ne: ['$$item.product', null] }
                                ]
                            }
                        }
                    }
                }
            }
        ]);

        // aggregate returns an array; extract the first document or default to empty cart object
        const cart = cartResult.length > 0 ? cartResult[0] : {
            user: userId,
            items: [],
            totalPrice: 0,
            currency: 'INR',
            shippingAddress: null
        };

        // If cart has no shipping address selected yet, check if user has a default or saved address
        if (!cart.shippingAddress) {
            const defaultAddress = await addressModel.findOne({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
            if (defaultAddress) {
                cart.shippingAddress = defaultAddress;
                // Silently persist default address to cart
                await cartModel.updateOne({ user: userId }, { $set: { shippingAddress: defaultAddress._id } });
            }
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