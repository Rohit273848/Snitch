import mongoose from "mongoose";
import addressModel from "../models/address.model.js";
import cartModel from "../models/cart.model.js";

/**
 * Get all saved addresses for the authenticated user and cart selection status
 */
export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const addresses = await addressModel.find({ user: userId }).sort({ isDefault: -1, createdAt: -1 });

        // Check which address is currently selected on the cart
        const cart = await cartModel.findOne({ user: userId });
        const selectedAddressId = cart?.shippingAddress ? cart.shippingAddress.toString() : null;

        return res.status(200).json({
            success: true,
            addresses,
            selectedAddressId,
            selectedAddress: addresses.find((a) => a._id.toString() === selectedAddressId) || null,
        });
    } catch (error) {
        console.error("getUserAddresses error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch addresses",
            error: error.message,
        });
    }
};

/**
 * Create a new address and optionally assign it directly to the user's cart
 */
export const createAddress = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const {
            fullName,
            phone,
            street,
            landmark = "",
            city,
            state,
            pincode,
            country = "India",
            addressType = "HOME",
            isDefault = false,
            selectForCart = true,
        } = req.body;

        const existingCount = await addressModel.countDocuments({ user: userId });

        // If this is the user's first address, automatically make it default
        const makeDefault = isDefault || existingCount === 0;

        if (makeDefault) {
            await addressModel.updateMany({ user: userId }, { $set: { isDefault: false } });
        }

        const newAddress = await addressModel.create({
            user: userId,
            fullName,
            phone,
            street,
            landmark,
            city,
            state,
            pincode,
            country,
            addressType,
            isDefault: makeDefault,
        });

        // If requested to select for cart or if cart doesn't have an address yet, assign it
        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            cart = new cartModel({
                user: userId,
                items: [],
                shippingAddress: newAddress._id,
            });
            await cart.save();
        } else if (selectForCart || !cart.shippingAddress) {
            cart.shippingAddress = newAddress._id;
            await cart.save();
        }

        return res.status(201).json({
            success: true,
            message: "Address added successfully",
            address: newAddress,
            selectedAddressId: cart.shippingAddress?.toString() || newAddress._id.toString(),
        });
    } catch (error) {
        console.error("createAddress error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create address",
            error: error.message,
        });
    }
};

/**
 * Update an existing address
 */
export const updateAddress = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const address = await addressModel.findOne({ _id: addressId, user: userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        const {
            fullName,
            phone,
            street,
            landmark,
            city,
            state,
            pincode,
            country,
            addressType,
            isDefault,
        } = req.body;

        if (isDefault) {
            await addressModel.updateMany({ user: userId, _id: { $ne: addressId } }, { $set: { isDefault: false } });
            address.isDefault = true;
        } else if (isDefault === false && address.isDefault) {
            // keep default if it's the only one
            const otherCount = await addressModel.countDocuments({ user: userId, _id: { $ne: addressId } });
            address.isDefault = otherCount === 0;
        }

        if (fullName !== undefined) address.fullName = fullName;
        if (phone !== undefined) address.phone = phone;
        if (street !== undefined) address.street = street;
        if (landmark !== undefined) address.landmark = landmark;
        if (city !== undefined) address.city = city;
        if (state !== undefined) address.state = state;
        if (pincode !== undefined) address.pincode = pincode;
        if (country !== undefined) address.country = country;
        if (addressType !== undefined) address.addressType = addressType;

        await address.save();

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address,
        });
    } catch (error) {
        console.error("updateAddress error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update address",
            error: error.message,
        });
    }
};

/**
 * Delete an address and reset cart shipping address if needed
 */
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const deleted = await addressModel.findOneAndDelete({ _id: addressId, user: userId });
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Address not found",
            });
        }

        // If this address was selected on the cart, switch to default or clear
        const cart = await cartModel.findOne({ user: userId });
        let newSelectedAddressId = null;

        if (cart && cart.shippingAddress && cart.shippingAddress.toString() === addressId.toString()) {
            const fallbackAddress = await addressModel.findOne({ user: userId }).sort({ isDefault: -1, createdAt: -1 });
            cart.shippingAddress = fallbackAddress ? fallbackAddress._id : null;
            newSelectedAddressId = cart.shippingAddress ? cart.shippingAddress.toString() : null;
            await cart.save();
        } else if (cart?.shippingAddress) {
            newSelectedAddressId = cart.shippingAddress.toString();
        }

        return res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            selectedAddressId: newSelectedAddressId,
        });
    } catch (error) {
        console.error("deleteAddress error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete address",
            error: error.message,
        });
    }
};

/**
 * Select/Attach an address to the user's cart for checkout
 */
export const selectCartAddress = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const addressId = req.params.addressId || req.body.addressId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        if (!addressId) {
            return res.status(400).json({
                success: false,
                message: "Address ID is required",
            });
        }

        // Validate that the address exists and belongs to this user
        const address = await addressModel.findOne({ _id: addressId, user: userId });
        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found or unauthorized",
            });
        }

        let cart = await cartModel.findOne({ user: userId });
        if (!cart) {
            cart = new cartModel({
                user: userId,
                items: [],
                shippingAddress: address._id,
            });
        } else {
            cart.shippingAddress = address._id;
        }

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Delivery address selected successfully",
            shippingAddress: address,
            selectedAddressId: address._id.toString(),
        });
    } catch (error) {
        console.error("selectCartAddress error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to select cart address",
            error: error.message,
        });
    }
};

/**
 * Clear the selected address from user's cart
 */
export const clearCartAddress = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        const cart = await cartModel.findOne({ user: userId });
        if (cart) {
            cart.shippingAddress = null;
            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Selected address removed from cart",
            shippingAddress: null,
            selectedAddressId: null,
        });
    } catch (error) {
        console.error("clearCartAddress error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to clear cart address",
            error: error.message,
        });
    }
};


