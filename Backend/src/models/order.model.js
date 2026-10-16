import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        default: "",
    },
    variant: {
        _id: { type: mongoose.Schema.Types.ObjectId, default: null },
        color: { type: String, default: "" },
        size: { type: String, default: "" },
        sku: { type: String, default: "" },
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    unitPrice: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        default: "INR",
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: false,
        index: true,
    },
    itemTotal: {
        type: Number,
        required: true,
    },
});

const trackingEventSchema = new mongoose.Schema({
    status: {
        type: String,
        required: true,
        enum: ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    completed: {
        type: Boolean,
        default: true,
    },
});

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true,
        },
        items: [orderItemSchema],
        sellers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                index: true,
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            landmark: { type: String, default: "" },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            country: { type: String, default: "India" },
            addressType: { type: String, default: "HOME" },
        },
        payment: {
            method: {
                type: String,
                enum: ["razorpay", "cod", "upi", "card", "netbanking"],
                default: "razorpay",
            },
            status: {
                type: String,
                enum: ["pending", "completed", "failed", "refunded"],
                default: "pending",
            },
            razorpayOrderId: { type: String, default: "" },
            razorpayPaymentId: { type: String, default: "" },
            razorpaySignature: { type: String, default: "" },
            paidAt: { type: Date, default: null },
        },
        pricing: {
            subtotal: { type: Number, required: true },
            discount: { type: Number, default: 0 },
            shippingFee: { type: Number, default: 0 },
            tax: { type: Number, default: 0 },
            totalAmount: { type: Number, required: true },
            currency: { type: String, default: "INR" },
        },
        orderStatus: {
            type: String,
            enum: ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
            default: "CONFIRMED",
            index: true,
        },
        tracking: {
            carrier: { type: String, default: "Snitch Express" },
            trackingNumber: { type: String, default: "" },
            estimatedDelivery: { type: Date },
            events: [trackingEventSchema],
        },
        cancelledAt: { type: Date, default: null },
        cancellationReason: { type: String, default: "" },
    },
    { timestamps: true }
);

const orderModel = mongoose.model("order", orderSchema);
export default orderModel;
