import Razorpay from "razorpay";
import { config } from "../config/config.js";


const razorpay = new Razorpay({
  key_id: config.RAZORPAY_KEY_ID,
  key_secret: config.RAZORPAY_KEY_SECRET || config.RAZORPAY_KEY_Secret,
});


export const createOrder = async ({ amount, currency = "INR" }) => {
    const parsedAmount = Number(amount) || 1;
    const option = {
        amount: Math.max(100, Math.round(parsedAmount * 100)),
        currency,
    };
    const order = await razorpay.orders.create(option);

    return order;
};