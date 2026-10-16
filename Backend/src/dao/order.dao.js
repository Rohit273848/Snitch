import mongoose from "mongoose";
import orderModel from "../models/order.model.js";
import cartModel from "../models/cart.model.js";
import addressModel from "../models/address.model.js";
import productModel from "../models/product.model.js";
import { getCartDetails } from "./cart.dao.js";

/**
 * Helper to generate unique order number: SN-YYYYMMDD-XXXX
 */
function generateOrderNumber() {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomChars = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SN-${dateStr}-${randomChars}`;
}

/**
 * Helper to generate tracking number: SNTRK-XXXX-XXXX
 */
function generateTrackingNumber() {
    const part1 = Math.floor(1000 + Math.random() * 9000);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    return `SNTRK-${part1}-${part2}`;
}

/**
 * Create a new order from the user's active cart or custom payload
 */
export async function createOrderFromCart({
    userId,
    addressId = null,
    addressData = null,
    paymentMethod = "razorpay",
    paymentDetails = {},
    discount = 0,
    shippingFee = 0,
}) {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // 1. Fetch live cart items and current pricing
    const cart = await getCartDetails(userId);
    if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
        throw new Error("Your cart is empty. Please add items to proceed.");
    }

    // 2. Resolve Shipping Address
    let finalAddress = null;

    if (addressId) {
        const found = await addressModel.findOne({ _id: addressId, user: userObjectId });
        if (found) {
            finalAddress = {
                fullName: found.fullName,
                phone: found.phone,
                street: found.street,
                landmark: found.landmark || "",
                city: found.city,
                state: found.state,
                pincode: found.pincode,
                country: found.country || "India",
                addressType: found.addressType || "HOME",
            };
        }
    }

    if (!finalAddress && cart.shippingAddress) {
        finalAddress = {
            fullName: cart.shippingAddress.fullName,
            phone: cart.shippingAddress.phone,
            street: cart.shippingAddress.street,
            landmark: cart.shippingAddress.landmark || "",
            city: cart.shippingAddress.city,
            state: cart.shippingAddress.state,
            pincode: cart.shippingAddress.pincode,
            country: cart.shippingAddress.country || "India",
            addressType: cart.shippingAddress.addressType || "HOME",
        };
    }

    if (!finalAddress && addressData) {
        finalAddress = {
            fullName: addressData.fullName,
            phone: addressData.phone,
            street: addressData.street,
            landmark: addressData.landmark || "",
            city: addressData.city,
            state: addressData.state,
            pincode: addressData.pincode,
            country: addressData.country || "India",
            addressType: addressData.addressType || "HOME",
        };
    }

    if (!finalAddress) {
        throw new Error("Shipping address is required to create an order.");
    }

    // 3. Collect product IDs to lookup seller IDs in bulk if missing
    const productIds = cart.items.map((i) => i.product?._id || i.product).filter(Boolean);
    const productsInDb = await productModel.find({ _id: { $in: productIds } }).select("seller");
    const sellerMap = new Map();
    productsInDb.forEach((p) => {
        if (p.seller) sellerMap.set(p._id.toString(), p.seller);
    });

    const sellersSet = new Set();

    // Format items snapshots
    const orderItems = cart.items.map((item) => {
        const prod = item.product || {};
        const variant = item.variant || null;
        const pIdStr = (prod._id || prod).toString();

        const sellerId = prod.seller || sellerMap.get(pIdStr) || null;
        if (sellerId) {
            sellersSet.add(sellerId.toString());
        }

        // Determine cover image
        let coverImg = "";
        if (Array.isArray(prod.images) && prod.images.length > 0) {
            const coverObj = prod.images.find((img) => img.isCover) || prod.images[0];
            coverImg = coverObj?.url || "";
        }
        if (variant && Array.isArray(variant.images) && variant.images.length > 0) {
            coverImg = variant.images[0].url || coverImg;
        }

        const unitPrice = Number(item.unitPrice || item.price?.amount || 0);
        const quantity = Number(item.quantity || 1);
        const itemTotal = unitPrice * quantity;

        return {
            product: prod._id,
            seller: sellerId,
            title: prod.title || "Snitch Product",
            coverImage: coverImg,
            variant: variant
                ? {
                      _id: variant._id,
                      color: variant.color || "",
                      size: variant.size || "",
                      sku: variant.sku || "",
                  }
                : null,
            quantity,
            unitPrice,
            currency: cart.currency || "INR",
            itemTotal,
        };
    });

    // 4. Calculate final totals
    const subtotal = orderItems.reduce((acc, item) => acc + item.itemTotal, 0);
    const parsedDiscount = Number(discount) || 0;
    const parsedShipping = Number(shippingFee) || 0;
    const totalAmount = Math.max(0, subtotal - parsedDiscount + parsedShipping);

    // 5. Estimated Delivery Date (3-4 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 4);

    const orderNumber = generateOrderNumber();
    const trackingNumber = generateTrackingNumber();

    const isPaidOnline = paymentDetails.status === "completed" || paymentMethod !== "cod";

    // Initial Tracking Milestones
    const initialEvents = [
        {
            status: "PLACED",
            title: "Order Placed",
            description: "We have received your order and are preparing it for shipment.",
            location: "Bengaluru Fulfillment Center",
            timestamp: new Date(),
            completed: true,
        },
    ];

    if (isPaidOnline && paymentDetails.status === "completed") {
        initialEvents.push({
            status: "CONFIRMED",
            title: "Payment Confirmed",
            description: `Payment of ₹${totalAmount.toLocaleString("en-IN")} confirmed via ${paymentMethod.toUpperCase()}.`,
            location: "Snitch Central Hub",
            timestamp: new Date(),
            completed: true,
        });
    }

    const orderDoc = new orderModel({
        orderNumber,
        user: userObjectId,
        items: orderItems,
        sellers: Array.from(sellersSet).map((id) => new mongoose.Types.ObjectId(id)),
        shippingAddress: finalAddress,
        payment: {
            method: paymentMethod,
            status: paymentDetails.status || (paymentMethod === "cod" ? "pending" : "completed"),
            razorpayOrderId: paymentDetails.razorpayOrderId || "",
            razorpayPaymentId: paymentDetails.razorpayPaymentId || "",
            razorpaySignature: paymentDetails.razorpaySignature || "",
            paidAt: isPaidOnline ? new Date() : null,
        },
        pricing: {
            subtotal,
            discount: parsedDiscount,
            shippingFee: parsedShipping,
            tax: 0,
            totalAmount,
            currency: cart.currency || "INR",
        },
        orderStatus: isPaidOnline && paymentDetails.status === "completed" ? "CONFIRMED" : "PLACED",
        tracking: {
            carrier: "Snitch Express Courier",
            trackingNumber,
            estimatedDelivery,
            events: initialEvents,
        },
    });

    const savedOrder = await orderDoc.save();

    // 6. Clear user cart items after order is placed
    await cartModel.findOneAndUpdate(
        { user: userObjectId },
        { $set: { items: [] } }
    );

    return savedOrder;
}

/**
 * Get all orders for a user
 */
export async function getUserOrders(userId, { status = null } = {}) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const query = { user: userObjectId };

    if (status && status !== "ALL") {
        query.orderStatus = status;
    }

    const orders = await orderModel
        .find(query)
        .sort({ createdAt: -1 })
        .populate("items.product", "title images price category");

    return orders;
}

/**
 * Get a specific order by ID or orderNumber
 */
export async function getOrderByIdOrNumber(orderIdentifier, userId = null) {
    const query = {};

    if (mongoose.Types.ObjectId.isValid(orderIdentifier)) {
        query._id = orderIdentifier;
    } else {
        query.orderNumber = orderIdentifier;
    }

    if (userId) {
        query.user = new mongoose.Types.ObjectId(userId);
    }

    const order = await orderModel
        .findOne(query)
        .populate("items.product", "title images price category")
        .populate("user", "fullname email contact");

    return order;
}

/**
 * Cancel an order
 */
export async function cancelOrderById(orderId, userId, reason = "") {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const order = await orderModel.findOne({
        _id: orderId,
        user: userObjectId,
    });

    if (!order) {
        throw new Error("Order not found or unauthorized");
    }

    // Check if order can be cancelled
    const nonCancellableStatuses = ["SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (nonCancellableStatuses.includes(order.orderStatus)) {
        throw new Error(`Order cannot be cancelled because it is already ${order.orderStatus.toLowerCase()}`);
    }

    order.orderStatus = "CANCELLED";
    order.cancelledAt = new Date();
    order.cancellationReason = reason || "Cancelled by customer";

    if (order.payment && order.payment.status === "completed") {
        order.payment.status = "refunded";
    }

    order.tracking.events.push({
        status: "CANCELLED",
        title: "Order Cancelled",
        description: reason ? `Order was cancelled. Reason: ${reason}` : "Order was cancelled by the customer.",
        location: "Snitch Central Hub",
        timestamp: new Date(),
        completed: true,
    });

    await order.save();
    return order;
}

/**
 * Get all orders containing products owned by a seller
 */
export async function getSellerOrders(sellerId, { status = null, search = "" } = {}) {
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    // 1. Get all product IDs created by this seller as a fallback for older orders
    const sellerProducts = await productModel.find({ seller: sellerObjectId }).select("_id");
    const sellerProductIds = sellerProducts.map((p) => p._id);

    // 2. Query orders where seller is tagged in sellers array, or items.seller, or items.product
    const matchCriteria = {
        $or: [
            { sellers: sellerObjectId },
            { "items.seller": sellerObjectId },
            { "items.product": { $in: sellerProductIds } },
        ],
    };

    if (status && status !== "ALL") {
        matchCriteria.orderStatus = status;
    }

    if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        matchCriteria.$and = [
            {
                $or: [
                    { orderNumber: regex },
                    { "shippingAddress.fullName": regex },
                    { "shippingAddress.city": regex },
                    { "shippingAddress.phone": regex },
                    { "items.title": regex },
                ],
            },
        ];
    }

    const orders = await orderModel
        .find(matchCriteria)
        .sort({ createdAt: -1 })
        .populate("user", "fullname email contact")
        .populate("items.product", "title images price category seller");

    // 3. Compute Seller Studio Metrics
    const allSellerOrders = await orderModel.find({
        $or: [
            { sellers: sellerObjectId },
            { "items.seller": sellerObjectId },
            { "items.product": { $in: sellerProductIds } },
        ],
    });

    let totalRevenue = 0;
    let pendingFulfillment = 0;
    let inTransit = 0;
    let deliveredCount = 0;
    let cancelledCount = 0;

    allSellerOrders.forEach((ord) => {
        if (ord.orderStatus !== "CANCELLED") {
            // Calculate revenue specifically from this seller's items
            ord.items.forEach((item) => {
                const itemSellerId = item.seller ? item.seller.toString() : null;
                const isItemFromSeller =
                    itemSellerId === sellerId.toString() ||
                    sellerProductIds.some((pId) => pId.toString() === item.product?.toString());
                if (isItemFromSeller) {
                    totalRevenue += Number(item.itemTotal || 0);
                }
            });
        }

        if (["PLACED", "CONFIRMED", "PROCESSING"].includes(ord.orderStatus)) {
            pendingFulfillment += 1;
        } else if (["SHIPPED", "OUT_FOR_DELIVERY"].includes(ord.orderStatus)) {
            inTransit += 1;
        } else if (ord.orderStatus === "DELIVERED") {
            deliveredCount += 1;
        } else if (ord.orderStatus === "CANCELLED") {
            cancelledCount += 1;
        }
    });

    return {
        orders,
        metrics: {
            totalOrders: allSellerOrders.length,
            pendingFulfillment,
            inTransit,
            deliveredCount,
            cancelledCount,
            totalRevenue,
        },
    };
}

/**
 * Update order tracking status, courier info, and location by the Seller
 */
export async function updateOrderStatusBySeller({
    orderId,
    sellerId,
    status,
    carrier = "",
    trackingNumber = "",
    location = "",
    description = "",
    estimatedDelivery = null,
}) {
    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    const order = await orderModel.findById(orderId).populate("items.product");
    if (!order) {
        throw new Error("Order not found");
    }

    // Verify seller authorization for this order
    const sellerProducts = await productModel.find({ seller: sellerObjectId }).select("_id");
    const sellerProductIds = sellerProducts.map((p) => p._id.toString());

    const isAuthorized =
        (order.sellers && order.sellers.some((s) => s.toString() === sellerId.toString())) ||
        (order.items &&
            order.items.some(
                (item) =>
                    (item.seller && item.seller.toString() === sellerId.toString()) ||
                    (item.product && sellerProductIds.includes(item.product._id?.toString() || item.product.toString()))
            ));

    if (!isAuthorized) {
        throw new Error("Unauthorized: You do not have products in this order");
    }

    const validStatuses = [
        "PLACED",
        "CONFIRMED",
        "PROCESSING",
        "SHIPPED",
        "OUT_FOR_DELIVERY",
        "DELIVERED",
        "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}. Must be one of ${validStatuses.join(", ")}`);
    }

    // Update order status
    order.orderStatus = status;

    if (carrier) {
        order.tracking.carrier = carrier;
    }
    if (trackingNumber) {
        order.tracking.trackingNumber = trackingNumber;
    }
    if (estimatedDelivery) {
        order.tracking.estimatedDelivery = new Date(estimatedDelivery);
    }

    if (status === "CANCELLED") {
        order.cancelledAt = new Date();
        order.cancellationReason = description || "Cancelled by seller";
        if (order.payment && order.payment.status === "completed") {
            order.payment.status = "refunded";
        }
    }

    const titleMap = {
        PLACED: "Order Placed",
        CONFIRMED: "Order Confirmed by Seller",
        PROCESSING: "Order Packed & Quality Checked",
        SHIPPED: "Order Shipped & In Transit",
        OUT_FOR_DELIVERY: "Package Out for Delivery",
        DELIVERED: "Package Delivered to Customer",
        CANCELLED: "Order Cancelled by Seller",
    };

    const defaultDescMap = {
        PROCESSING: "Item has been packed and handed over to fulfillment.",
        SHIPPED: `Package dispatched with ${order.tracking.carrier || "Courier"}. AWB: ${order.tracking.trackingNumber || "Assigned"}.`,
        OUT_FOR_DELIVERY: "Courier partner is out to deliver your package today.",
        DELIVERED: "Shipment was successfully delivered to destination address.",
        CANCELLED: description || "Order was cancelled by the seller.",
    };

    order.tracking.events.push({
        status,
        title: titleMap[status] || `Order ${status}`,
        description: description || defaultDescMap[status] || `Status updated to ${status}.`,
        location: location || "Seller Fulfillment Center",
        timestamp: new Date(),
        completed: true,
    });

    await order.save();
    return order;
}
