import mongoose from "mongoose";
import priceSchema from "./price.schema.js";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
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
            },
            fileId: {
                type: String,
                default: "",
            },
            color: {
                type: String,
                default: "",
            },
            isCover: {
                type: Boolean,
                default: false,
            }
        }
    ],
    attributeKeys: [
        {
            type: String,
            trim: true,
        }
    ],
    variants: [
        {
            images: [
                {
                    url: {
                        type: String,
                        required: true,
                    },
                    fileId: {
                        type: String,
                        default: "",
                    }
                }
            ],
            stock: {
                type: Number,
                default: 0,
                min: 0,
            },
            attributes: {
                type: mongoose.Schema.Types.Mixed,
                default: {},
            },
            price: {
                type: priceSchema,
                required: false,
            }
        },
    ]
}, { timestamps: true, toJSON: { flattenMaps: true }, toObject: { flattenMaps: true } });

const productModel = mongoose.models.product || mongoose.model('product', productSchema);
export default productModel;