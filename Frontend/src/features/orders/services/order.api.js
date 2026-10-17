import axios from "axios";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").trim().replace(/\/+$/, "");

const orderApiInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/orders`,
    withCredentials: true,
});

/**
 * Create a new Razorpay payment order
 */
export async function createRazorpayOrder({ amount, currency = "INR" }) {
    const response = await orderApiInstance.post("/create-payment-order", {
        amount,
        currency,
    });
    return response.data;
}

/**
 * Verify Razorpay payment signature and place online order in DB
 */
export async function verifyPaymentAndPlaceOrder({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    addressId,
    addressData,
    paymentMethod = "razorpay",
    discount = 0,
    shippingFee = 0,
    items = null,
}) {
    const response = await orderApiInstance.post("/verify-payment", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        addressId,
        addressData,
        paymentMethod,
        discount,
        shippingFee,
        items,
    });
    return response.data;
}

/**
 * Place a Cash on Delivery (COD) order
 */
export async function placeCodOrder({
    addressId,
    addressData,
    discount = 0,
    shippingFee = 0,
    items = null,
}) {
    const response = await orderApiInstance.post("/checkout/cod", {
        addressId,
        addressData,
        discount,
        shippingFee,
        items,
    });
    return response.data;
}

/**
 * Fetch all orders for the current logged-in user
 */
export async function getMyOrders(status = null) {
    const response = await orderApiInstance.get("/my-orders", {
        params: status && status !== "ALL" ? { status } : {},
    });
    return response.data;
}

/**
 * Fetch a single order by ID or orderNumber for full tracking & details
 */
export async function getOrderById(orderId) {
    const response = await orderApiInstance.get(`/${orderId}`);
    return response.data;
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId, reason = "") {
    const response = await orderApiInstance.patch(`/${orderId}/cancel`, { reason });
    return response.data;
}

// ─── Seller Studio APIs ───────────────────────────────────────────────────────

/**
 * Fetch orders containing products from the logged-in seller
 */
export async function getSellerOrders({ status = null, search = "" } = {}) {
    const response = await orderApiInstance.get("/seller/orders", {
        params: {
            status: status && status !== "ALL" ? status : undefined,
            search: search && search.trim() ? search.trim() : undefined,
        },
    });
    return response.data;
}

/**
 * Update order tracking status, courier info, and location by the Seller
 */
export async function updateSellerOrderStatus(orderId, updateData) {
    const response = await orderApiInstance.patch(`/seller/orders/${orderId}/status`, updateData);
    return response.data;
}
