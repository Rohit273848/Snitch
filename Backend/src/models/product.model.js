import mongoose from "mongoose";

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
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            enum: ["USD", 'EUR', 'GBP', 'JPY', 'INR'],
            default: "INR"
        }
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
                amount: {
                    type: Number,
                    required: false
                },
                currency: {
                    type: String,
                    enum: ['USD', 'EUR', 'GBP', 'JPY', 'INR'],
                    default: "INR"
                }
            }
        },

    ]


}, { timestamps: true, toJSON: { flattenMaps: true }, toObject: { flattenMaps: true } })

const productModel = new mongoose.model('product', productSchema);
export default productModel;