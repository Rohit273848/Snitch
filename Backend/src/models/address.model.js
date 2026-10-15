import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            index: true,
        },
        fullName: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },
        street: {
            type: String,
            required: [true, "Street address is required"],
            trim: true,
        },
        landmark: {
            type: String,
            default: "",
            trim: true,
        },
        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },
        state: {
            type: String,
            required: [true, "State is required"],
            trim: true,
        },
        pincode: {
            type: String,
            required: [true, "Pincode is required"],
            trim: true,
        },
        country: {
            type: String,
            default: "India",
            trim: true,
        },
        addressType: {
            type: String,
            enum: ["HOME", "WORK", "OTHER"],
            default: "HOME",
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const addressModel = mongoose.model("address", addressSchema);
export default addressModel;
