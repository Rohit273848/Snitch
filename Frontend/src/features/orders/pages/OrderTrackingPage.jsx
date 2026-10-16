import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder } from "../services/order.api.js";
import OrderTimeline from "../components/OrderTimeline.jsx";

function ArrowLeftIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

function CopyIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
        </svg>
    );
}

function CheckIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

function TruckIcon({ className = "w-4 h-4" }) {
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

export default function OrderTrackingPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    // Cancel modal states
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState("");

    const fetchOrder = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getOrderById(id);
            if (data?.order) {
                setOrder(data.order);
            } else {
                setError("Order details not found.");
            }
        } catch (err) {
            console.error("Failed to load order:", err);
            setError(err?.response?.data?.message || err.message || "Unable to fetch order details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchOrder();
        }
    }, [id]);

    const handleCopyTracking = () => {
        if (order?.tracking?.trackingNumber) {
            navigator.clipboard.writeText(order.tracking.trackingNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCancelOrder = async () => {
        setCancelling(true);
        setCancelError("");
        try {
            const res = await cancelOrder(order._id, cancelReason);
            if (res?.order) {
                setOrder(res.order);
                setShowCancelModal(false);
            }
        } catch (err) {
            console.error("Failed to cancel order:", err);
            setCancelError(err?.response?.data?.message || "Failed to cancel order. Please try again.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4">
                <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-mono-code text-zinc-500 uppercase tracking-widest">
                    Retrieving live tracking details...
                </p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-[70vh] max-w-xl mx-auto px-4 py-16 text-center space-y-6">
                <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                    <TruckIcon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-black uppercase tracking-tight text-zinc-900 font-mono-code">
                        Order Not Found
                    </h2>
                    <p className="text-xs text-zinc-500">{error || "Could not find any order with this ID."}</p>
                </div>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        to="/orders"
                        className="px-6 py-2.5 rounded-full border border-zinc-300 text-xs font-bold font-mono-code uppercase hover:border-black transition-all"
                    >
                        View All Orders
                    </Link>
                    <button
                        onClick={fetchOrder}
                        className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-bold font-mono-code uppercase hover:bg-zinc-800 transition-all cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const {
        orderNumber,
        createdAt,
        orderStatus,
        tracking,
        shippingAddress,
        items = [],
        pricing,
        payment,
    } = order;

    const isCancellable = ["PLACED", "CONFIRMED", "PROCESSING"].includes(orderStatus);

    const estDeliveryText = tracking?.estimatedDelivery
        ? new Date(tracking.estimatedDelivery).toLocaleDateString("en-IN", {
              weekday: "short",
              month: "short",
              day: "numeric",
          })
        : "3-4 Business Days";

    return (
        <div className="min-h-screen bg-[#fafafa] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Top Navigation Strip */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate("/orders")}
                        className="inline-flex items-center gap-2 text-xs font-bold font-mono-code uppercase text-zinc-600 hover:text-black transition-colors cursor-pointer"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        <span>All Orders</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono-code text-zinc-400 uppercase">
                            Placed on {new Date(createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                    </div>
                </div>

                {/* Order Header Card */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
                        <div>
                            <span className="text-[10px] font-mono-code uppercase tracking-widest text-zinc-400 block mb-1">
                                Tracking Order
                            </span>
                            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 font-mono-code flex items-center gap-3">
                                <span>{orderNumber}</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold font-mono-code uppercase tracking-wider ${
                                    orderStatus === "DELIVERED"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : orderStatus === "CANCELLED"
                                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                                        : "bg-black text-white"
                                }`}
                            >
                                {orderStatus.replace(/_/g, " ")}
                            </span>

                            {isCancellable && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="px-3.5 py-1 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold font-mono-code uppercase transition-colors cursor-pointer"
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Delivery & Carrier Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 sm:p-5 text-xs font-mono-code">
                        <div className="space-y-1">
                            <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">
                                Estimated Delivery
                            </span>
                            <div className="flex items-center gap-2 text-zinc-900 font-black text-sm sm:text-base">
                                <TruckIcon className="w-5 h-5 text-zinc-800" />
                                <span>{orderStatus === "DELIVERED" ? "Delivered" : estDeliveryText}</span>
                            </div>
                        </div>

                        <div className="space-y-1 sm:border-l sm:border-zinc-200 sm:pl-4">
                            <span className="text-[10px] uppercase text-zinc-400 font-bold tracking-wider">
                                Courier & Tracking No.
                            </span>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-zinc-900">
                                    {tracking?.carrier || "Snitch Express"}
                                </span>
                                {tracking?.trackingNumber && (
                                    <button
                                        onClick={handleCopyTracking}
                                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-zinc-200 text-[11px] font-bold text-zinc-700 hover:border-black transition-colors cursor-pointer"
                                        title="Copy tracking code"
                                    >
                                        {copied ? (
                                            <>
                                                <CheckIcon className="w-3 h-3 text-emerald-600" />
                                                <span className="text-emerald-600">Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <CopyIcon className="w-3 h-3 text-zinc-500" />
                                                <span>{tracking.trackingNumber}</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Visual Stepper Timeline */}
                    <div className="pt-2">
                        <OrderTimeline currentStatus={orderStatus} events={tracking?.events} />
                    </div>
                </div>

                {/* 2-Columns: Shipping Address & Payment Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Shipping Address */}
                    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 font-mono-code flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4 text-zinc-700" />
                                <span>Delivery Address</span>
                            </h3>
                            <span className="text-[10px] font-bold font-mono-code uppercase px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-600">
                                {shippingAddress?.addressType || "HOME"}
                            </span>
                        </div>

                        <div className="text-xs font-mono-code text-zinc-600 space-y-1">
                            <p className="font-bold text-zinc-950 text-sm">{shippingAddress?.fullName}</p>
                            <p className="text-zinc-500">Phone: +91 {shippingAddress?.phone}</p>
                            <p>{shippingAddress?.street}</p>
                            {shippingAddress?.landmark && <p className="text-zinc-500">Landmark: {shippingAddress?.landmark}</p>}
                            <p>{shippingAddress?.city}, {shippingAddress?.state} - {shippingAddress?.pincode}</p>
                            <p>{shippingAddress?.country || "India"}</p>
                        </div>
                    </div>

                    {/* Payment Info & Breakdown */}
                    <div className="bg-white border border-zinc-200 rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 font-mono-code">
                                Payment Details
                            </h3>
                            <span className="text-[10px] font-bold font-mono-code uppercase px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800">
                                {payment?.method === "cod" ? "Cash On Delivery" : "Online (Razorpay)"}
                            </span>
                        </div>

                        <div className="space-y-2 text-xs font-mono-code">
                            <div className="flex justify-between text-zinc-500">
                                <span>Subtotal:</span>
                                <span className="font-bold text-zinc-900">₹{(pricing?.subtotal || 0).toLocaleString("en-IN")}</span>
                            </div>
                            {pricing?.discount > 0 && (
                                <div className="flex justify-between text-emerald-600">
                                    <span>Discount / Coupon:</span>
                                    <span className="font-bold">-₹{pricing.discount.toLocaleString("en-IN")}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-zinc-500">
                                <span>Shipping:</span>
                                <span className="font-bold text-emerald-600">FREE</span>
                            </div>
                            <div className="flex justify-between text-zinc-950 pt-2 border-t border-zinc-100 text-sm font-bold">
                                <span>Total Amount:</span>
                                <span>₹{(pricing?.totalAmount || 0).toLocaleString("en-IN")}</span>
                            </div>
                            {payment?.razorpayPaymentId && (
                                <p className="text-[10px] text-zinc-400 pt-1 font-mono">
                                    Transaction ID: {payment.razorpayPaymentId}
                                </p>
                            )}
                        </div>
                    </div>

                </div>

                {/* Ordered Items List */}
                <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-950 font-mono-code border-b border-zinc-100 pb-3">
                        Items in this Shipment ({items.length})
                    </h3>

                    <div className="divide-y divide-zinc-100">
                        {items.map((item, idx) => (
                            <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-20 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 flex-shrink-0">
                                        {item.coverImage ? (
                                            <img
                                                src={item.coverImage}
                                                alt={item.title}
                                                className="w-full h-full object-cover object-top"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs">
                                                Image
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs sm:text-sm font-bold uppercase font-mono-code text-zinc-950 line-clamp-1">
                                            {item.title}
                                        </p>
                                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-code text-zinc-500">
                                            {item.variant?.size && <span>Size: <strong className="text-zinc-800">{item.variant.size}</strong></span>}
                                            {item.variant?.color && <span>• Color: <strong className="text-zinc-800">{item.variant.color}</strong></span>}
                                            <span>• Qty: <strong className="text-zinc-800">{item.quantity}</strong></span>
                                        </div>
                                        <p className="text-xs font-mono-code font-bold text-zinc-800">
                                            ₹{item.unitPrice?.toLocaleString("en-IN")} each
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right font-mono-code">
                                    <span className="text-xs sm:text-sm font-black text-zinc-950">
                                        ₹{(item.itemTotal || item.unitPrice * item.quantity).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-2">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-300 hover:border-black text-xs font-bold font-mono-code uppercase transition-all"
                    >
                        <span>Continue Shopping</span>
                        <span>→</span>
                    </Link>

                    <a
                        href="mailto:support@snitch.co.in"
                        className="text-xs font-bold font-mono-code uppercase text-zinc-500 hover:text-black underline"
                    >
                        Need Help With Your Order?
                    </a>
                </div>

            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl border border-zinc-200">
                        <div className="space-y-2">
                            <span className="text-[10px] font-bold font-mono-code uppercase tracking-wider text-rose-600">
                                Confirm Cancellation
                            </span>
                            <h3 className="text-lg font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                                Cancel Order #{orderNumber}?
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Are you sure you want to cancel this order? This action cannot be reversed. If you paid online, your refund will be processed immediately.
                            </p>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold font-mono-code text-zinc-700 uppercase">
                                Reason for cancellation (Optional)
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="E.g., Ordered by mistake, wrong size, changed my mind..."
                                rows={3}
                                className="w-full text-xs p-3 rounded-xl border border-zinc-300 focus:outline-none focus:border-black resize-none"
                            />
                        </div>

                        {cancelError && (
                            <p className="text-xs text-rose-600 font-mono-code">{cancelError}</p>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-2 font-mono-code">
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(false)}
                                disabled={cancelling}
                                className="px-5 py-2.5 rounded-full border border-zinc-200 text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                            >
                                Keep Order
                            </button>
                            <button
                                type="button"
                                onClick={handleCancelOrder}
                                disabled={cancelling}
                                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase transition-all shadow-md cursor-pointer disabled:opacity-50"
                            >
                                {cancelling ? "Cancelling..." : "Confirm Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
