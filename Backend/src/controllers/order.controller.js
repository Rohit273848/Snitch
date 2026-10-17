import {
    createOrderFromCart,
    getUserOrders,
    getOrderByIdOrNumber,
    cancelOrderById,
    getSellerOrders,
    updateOrderStatusBySeller,
} from "../dao/order.dao.js";
import { createOrder, verifyPaymentSignature } from "../services/payment.service.js";
import { config } from "../config/config.js";
import cartModel from "../models/cart.model.js";
import { getCartDetails } from "../dao/cart.dao.js";

/**
 * Create a Razorpay Order for Checkout
 */
export const createRazorpayOrderController = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        let amount = req.body?.amount ? Number(req.body.amount) : null;
        const currency = req.body?.currency || "INR";

        // If amount was not sent, calculate dynamically from user's live cart
        if (!amount || amount <= 0) {
            const cart = await getCartDetails(userId);
            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Cart is empty. Cannot initiate payment.",
                });
            }
            amount = cart.totalPrice || 100;
        }

        const order = await createOrder({ amount, currency });

        return res.status(200).json({
            success: true,
            message: "Razorpay order created successfully",
            order,
            key: config.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to create payment order",
        });
    }
};

/**
 * Verify Razorpay Payment Signature and Create Order in DB
 */
export const verifyPaymentAndPlaceOrderController = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            addressId,
            addressData,
            paymentMethod = "razorpay",
            discount = 0,
            shippingFee = 0,
            items = null,
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing payment verification parameters (order_id, payment_id, signature).",
            });
        }

        // 1. Cryptographically verify signature
        const isValid = verifyPaymentSignature({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed. Invalid payment signature.",
            });
        }

        // 2. Create the Order in MongoDB from Cart
        const createdOrder = await createOrderFromCart({
            userId,
            addressId,
            addressData,
            paymentMethod: paymentMethod || "razorpay",
            paymentDetails: {
                status: "completed",
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            },
            discount,
            shippingFee,
            items,
        });

        return res.status(201).json({
            success: true,
            message: "Payment verified and order placed successfully!",
            order: createdOrder,
        });
    } catch (error) {
        console.error("Error verifying payment and placing order:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Internal server error during order placement",
        });
    }
};

/**
 * Place Cash on Delivery (COD) Order
 */
export const placeCodOrderController = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { addressId, addressData, discount = 0, shippingFee = 0, items = null } = req.body;

        const createdOrder = await createOrderFromCart({
            userId,
            addressId,
            addressData,
            paymentMethod: "cod",
            paymentDetails: {
                status: "pending",
                razorpayOrderId: "",
                razorpayPaymentId: "",
                razorpaySignature: "",
            },
            discount,
            shippingFee,
            items,
        });

        return res.status(201).json({
            success: true,
            message: "Cash on delivery order placed successfully!",
            order: createdOrder,
        });
    } catch (error) {
        console.error("Error placing COD order:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to place COD order",
        });
    }
};

/**
 * Get all orders for the authenticated user
 */
export const getMyOrdersController = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { status } = req.query;

        const orders = await getUserOrders(userId, { status });

        return res.status(200).json({
            success: true,
            orders,
            count: orders.length,
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch orders",
        });
    }
};

/**
 * Get a single order by ID or orderNumber
 */
export const getOrderByIdController = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { orderId } = req.params;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const order = await getOrderByIdOrNumber(orderId, userId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Error fetching order details:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch order details",
        });
    }
};

/**
 * Cancel an order
 */
export const cancelOrderController = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;
        const { orderId } = req.params;
        const { reason } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        const updatedOrder = await cancelOrderById(orderId, userId, reason);

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Error cancelling order:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to cancel order",
        });
    }
};

/**
 * Get orders and sales metrics for the authenticated seller
 */
export const getSellerOrdersController = async (req, res) => {
    try {
        const sellerId = req.user?._id || req.user?.id;
        const { status, search } = req.query;

        const result = await getSellerOrders(sellerId, { status, search });

        return res.status(200).json({
            success: true,
            orders: result.orders,
            metrics: result.metrics,
        });
    } catch (error) {
        console.error("Error fetching seller orders:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch seller orders",
        });
    }
};

/**
 * Update order tracking status, carrier, tracking number by the seller
 */
export const updateSellerOrderStatusController = async (req, res) => {
    try {
        const sellerId = req.user?._id || req.user?.id;
        const { orderId } = req.params;
        const {
            status,
            carrier,
            trackingNumber,
            location,
            description,
            estimatedDelivery,
        } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required",
            });
        }

        const updatedOrder = await updateOrderStatusBySeller({
            orderId,
            sellerId,
            status,
            carrier,
            trackingNumber,
            location,
            description,
            estimatedDelivery,
        });

        return res.status(200).json({
            success: true,
            message: `Order status successfully updated to ${status}`,
            order: updatedOrder,
        });
    } catch (error) {
        console.error("Error updating order status by seller:", error);
        return res.status(400).json({
            success: false,
            message: error?.message || "Failed to update order status",
        });
    }
};

