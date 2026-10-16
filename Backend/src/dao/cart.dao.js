import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

export async function getCartDetails(userId) {
    
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

        return cart;
 }
