import productModel from "../models/product.model.js";
import mongoose from "mongoose";

/**
 * Get the available stock for a specific product variant
 * @param {string|mongoose.Types.ObjectId} productId
 * @param {string|mongoose.Types.ObjectId} variantId
 * @returns {Promise<number|null>} Returns stock count, or null if product/variant is not found
 */
export const stockOfVariant = async (productId,variantId) => {
      // 1. Validate inputs
    if (!productId || !variantId) {
        return null;
    }
    if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(variantId)) {
        return null;
    }

    const product = await productModel.findOne({
        _id:productId,
        "variants._id":variantId,
    },{
        "variants.$":1,
    })

     // 3. Null-safe check
    if (!product || !product.variants || product.variants.length === 0) {
        return null;
    }


    return product.variants[0].stock??0;
}