import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    price: {
        type: priceSchema,
        required: true,
    },
    images: [
        {
            url: {
                type: String,
                required: true,
            }
        }
    ],
    attributeKeys: [
        {
            type: String
        }
    ],
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true,
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0
            },
            attributes: {
                type: mongoose.Schema.Types.Mixed,
                default: {}
            },
            price: {
                type: priceSchema,
                required: true,
            }
        },

    ]


}, { timestamps: true, toJSON: { flattenMaps: true }, toObject: { flattenMaps: true } })

const productModel = new mongoose.model('product', productSchema);
export default productModel;