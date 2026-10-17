import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getOrderById } from "../services/order.api.js";
import { clearCart } from "../../cart/state/cart.slice.js";
import { clearCartApi } from "../../cart/service/cart.api.js";

function CheckIcon({ className = "w-6 h-6" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

function TruckIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h-3.75a1.125 1.125 0 00-1.125 1.125v6.75" />
        </svg>
    );
}

function MapPinIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    );
}

export default function OrderSuccessPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Guarantee user cart is completely emptied upon reaching order success
        dispatch(clearCart());
        clearCartApi().catch(() => {});
    }, [dispatch]);

    useEffect(() => {
        let mounted = true;
        const fetchOrderDetails = async () => {
            try {
                if (id) {
                    const data = await getOrderById(id);
                    if (mounted && data?.order) {
                        setOrder(data.order);
                    }
                }
            } catch (err) {
                console.error("Failed to load order:", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchOrderDetails();
        return () => {
            mounted = false;
        };
    }, [id]);

    const orderNumber = order?.orderNumber || (id?.startsWith("SN-") ? id : `SN-ORD-${id?.slice(-6)?.toUpperCase()}`);
    const finalAmount = order?.pricing?.totalAmount || 0;
    const estDelivery = order?.tracking?.estimatedDelivery
        ? new Date(order.tracking.estimatedDelivery).toLocaleDateString("en-IN", {
              weekday: "long",
              month: "short",
              day: "numeric",
          })
        : "3-4 Business Days";

    return (
        <div className="min-h-screen bg-[#fafafa] flex items-center justify-center py-12 px-4 sm:px-6">
            <div className="max-w-xl w-full bg-white border border-zinc-200 rounded-3xl p-8 sm:p-12 shadow-sm text-center space-y-8 animate-in zoom-in-95">

                {/* Animated Badge */}
                <div className="relative mx-auto w-20 h-20">
                    <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-25" />
                    <div className="relative w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 shadow-xs">
                        <CheckIcon className="w-10 h-10" />
                    </div>
                </div>

                {/* Heading & Subtitle */}
                <div className="space-y-2">
                    <span className="text-[11px] font-mono-code uppercase tracking-widest text-emerald-600 font-extrabold">
                        Payment & Order Confirmed
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                        Thank You For Your Order!
                    </h1>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                        Your drop is locked in. We have sent a confirmation email and will update you every step of the journey.
                    </p>
                </div>

                {/* Order Information Pill Box */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 text-left text-xs font-mono-code space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-200/80 pb-2.5">
                        <span className="text-zinc-500">Order Number:</span>
                        <span className="font-black text-zinc-950 text-sm tracking-wide">
                            {orderNumber}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-zinc-600">
                        <span>Payment Method:</span>
                        <span className="font-bold text-zinc-900 uppercase">
                            {order?.payment?.method === "cod" ? "Cash on Delivery" : "Online (Razorpay)"}
                        </span>
                    </div>

                    {finalAmount > 0 && (
                        <div className="flex items-center justify-between text-zinc-600">
                            <span>Amount Paid:</span>
                            <span className="font-bold text-zinc-900">₹{finalAmount.toLocaleString("en-IN")}</span>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-zinc-600 pt-1 border-t border-zinc-200/80">
                        <div className="flex items-center gap-1.5 text-zinc-500">
                            <TruckIcon className="w-4 h-4 text-zinc-700" />
                            <span>Estimated Delivery:</span>
                        </div>
                        <span className="font-bold text-emerald-700">{estDelivery}</span>
                    </div>

                    {order?.shippingAddress && (
                        <div className="pt-2 border-t border-zinc-200/80 text-[11px] text-zinc-500 space-y-0.5">
                            <div className="flex items-center gap-1 font-bold text-zinc-800">
                                <MapPinIcon className="w-3.5 h-3.5 text-zinc-600" />
                                <span>Shipping to {order.shippingAddress.fullName}:</span>
                            </div>
                            <p className="pl-4">
                                {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                            </p>
                        </div>
                    )}
                </div>

                {/* CTAs */}
                <div className="space-y-3 font-mono-code">
                    <button
                        onClick={() => navigate(`/orders/${order?._id || id}`)}
                        className="w-full py-4 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span>Track Order Live</span>
                        <span>→</span>
                    </button>

                    <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase pt-1">
                        <Link
                            to="/orders"
                            className="text-zinc-600 hover:text-black transition-colors underline"
                        >
                            View Order History
                        </Link>
                        <span className="text-zinc-300">•</span>
                        <Link
                            to="/"
                            className="text-zinc-600 hover:text-black transition-colors underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
