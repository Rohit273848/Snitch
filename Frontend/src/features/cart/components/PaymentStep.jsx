import React from "react";
import { Link } from "react-router-dom";

function ShieldCheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
        </svg>
    );
}

function CreditCardIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
        </svg>
    );
}

function LockIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
    );
}

export default function PaymentStep({
    selectedAddress,
    items = [],
    totalPrice = 0,
    currencySymbol = "₹",
    onBackToAddress,
    onPlaceOrder,
    isProcessing = false,
    confirmedOrder = null,
}) {
    const handlePay = async () => {
        if (onPlaceOrder) {
            await onPlaceOrder({ method: "razorpay" });
        }
    };

    if (confirmedOrder) {
        return (
            <div className="bg-white border border-zinc-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs animate-in zoom-in-95">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                    <ShieldCheckIcon className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <span className="text-[11px] font-mono-code uppercase tracking-widest text-emerald-600 font-black">
                        Order Confirmed
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                        Thank You For Your Order!
                    </h2>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                        Your drop #{confirmedOrder.orderNumber || confirmedOrder._id} is confirmed. It will be delivered to{" "}
                        <strong>{confirmedOrder.shippingAddress?.fullName || selectedAddress?.fullName}</strong>.
                    </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 max-w-sm mx-auto text-left text-xs font-mono-code space-y-2">
                    <div className="flex justify-between text-zinc-500">
                        <span>Order Number:</span>
                        <span className="font-bold text-zinc-950">{confirmedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                        <span>Payment Method:</span>
                        <span className="font-bold text-zinc-900 uppercase">
                            {confirmedOrder.payment?.method === "cod" ? "Cash On Delivery" : "Online (Razorpay)"}
                        </span>
                    </div>
                    <div className="flex justify-between text-zinc-500 pt-1.5 border-t border-zinc-200">
                        <span>Total Paid:</span>
                        <span className="font-bold text-zinc-950 text-sm">
                            {currencySymbol}{(confirmedOrder.pricing?.totalAmount || totalPrice).toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 font-mono-code">
                    <Link
                        to={`/orders/${confirmedOrder._id}`}
                        className="w-full sm:w-auto px-8 py-3.5 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg text-center cursor-pointer"
                    >
                        <span>Track Order Live →</span>
                    </Link>
                    <Link
                        to="/"
                        className="w-full sm:w-auto px-6 py-3.5 border border-zinc-300 hover:border-black text-zinc-700 hover:text-black rounded-full text-xs font-bold uppercase tracking-wider transition-all text-center cursor-pointer"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Delivery Address Review Card */}
            {selectedAddress && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase font-mono-code text-zinc-900">
                                Delivering To:
                            </span>
                            <span className="text-[10px] font-bold font-mono-code uppercase px-2 py-0.5 bg-zinc-100 rounded-full text-zinc-600">
                                {selectedAddress.addressType || "HOME"}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onBackToAddress}
                            className="text-xs font-bold uppercase font-mono-code text-zinc-600 hover:text-black underline cursor-pointer"
                        >
                            Change Address
                        </button>
                    </div>

                    <div className="text-xs text-zinc-600 space-y-0.5 font-mono-code">
                        <p className="font-bold text-zinc-900">{selectedAddress.fullName} (+91 {selectedAddress.phone})</p>
                        <p>{selectedAddress.street}{selectedAddress.landmark ? `, ${selectedAddress.landmark}` : ""}</p>
                        <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                        {items.length > 0 && (
                            <p className="text-[11px] text-zinc-400 pt-1">
                                {items.length} {items.length === 1 ? "item" : "items"} in this shipment
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Razorpay Secure Gateway Card */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div>
                        <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-zinc-500">
                            Payment Gateway
                        </span>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 font-mono-code">
                            Razorpay Secure Checkout
                        </h3>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono-code text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        <LockIcon className="w-3.5 h-3.5" />
                        <span>100% Secure Checkout</span>
                    </div>
                </div>

                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/80 flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                        <CreditCardIcon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 text-xs font-mono-code">
                        <p className="font-bold text-zinc-900">
                            All Payment Methods Handled Securely via Razorpay
                        </p>
                        <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">
                            Razorpay provides all payment options in one encrypted popup window. You can pay using UPI (Google Pay, PhonePe, Paytm, QR), Credit &amp; Debit Cards, Net Banking, or Wallets.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] font-mono-code text-zinc-600 uppercase tracking-wider">
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-md font-semibold">UPI / QR</span>
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-md font-semibold">Credit &amp; Debit Cards</span>
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-md font-semibold">Net Banking</span>
                    <span className="px-2.5 py-1 bg-zinc-100 rounded-md font-semibold">Wallets</span>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 font-mono-code">
                <button
                    type="button"
                    onClick={onBackToAddress}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-zinc-200 text-xs font-bold uppercase text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                    <span>←</span>
                    <span>Back to Address</span>
                </button>

                <button
                    type="button"
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                >
                    {isProcessing ? (
                        <>
                            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Opening Razorpay Gateway...</span>
                        </>
                    ) : (
                        <>
                            <span>Pay {currencySymbol}{totalPrice.toLocaleString("en-IN")} via Razorpay</span>
                            <span>→</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
