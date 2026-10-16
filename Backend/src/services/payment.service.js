import Razorpay from "razorpay";
import crypto from "crypto";
import { config } from "../config/config.js";

const razorpay = new Razorpay({
    key_id: config.RAZORPAY_KEY_ID,
    key_secret: config.RAZORPAY_KEY_SECRET || config.RAZORPAY_KEY_Secret,
});

/**
 * Create a new order on Razorpay
 */
export const createOrder = async ({ amount, currency = "INR", receipt = null }) => {
    const parsedAmount = Number(amount) || 1;
    const options = {
        amount: Math.max(100, Math.round(parsedAmount * 100)), // Razorpay amount in paise
        currency,
        receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const order = await razorpay.orders.create(options);
    return order;
};

/**
 * Verify Razorpay payment signature
 */
export const verifyPaymentSignature = ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return false;
    }

    const key_secret = config.RAZORPAY_KEY_SECRET || config.RAZORPAY_KEY_Secret;
    const generatedSignature = crypto
        .createHmac("sha256", key_secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    return generatedSignature === razorpay_signature;
};

/**
 * Fetch details of a payment from Razorpay
 */
export const fetchPaymentDetails = async (paymentId) => {
    try {
        return await razorpay.payments.fetch(paymentId);
    } catch (error) {
        console.error("Error fetching payment from Razorpay:", error);
        return null;
    }
};