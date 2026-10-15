import React, { useState } from "react";

function ShieldCheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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

export default function PaymentStep({
    selectedAddress,
    items = [],
    totalPrice = 0,
    currencySymbol = "₹",
    onBackToAddress,
    onPlaceOrder,
}) {
    const [selectedMethod, setSelectedMethod] = useState("upi");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            if (onPlaceOrder) onPlaceOrder();
        }, 1200);
    };

    if (isSuccess) {
        return (
            <div className="bg-white border border-zinc-200 rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-xs animate-in zoom-in-95">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                    <ShieldCheckIcon className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <span className="text-[11px] font-mono-code uppercase tracking-widest text-emerald-600 font-bold">
                        Order Confirmed
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                        Thank You For Your Order!
                    </h2>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                        Your order will be shipped to <strong>{selectedAddress?.fullName}</strong> at{" "}
                        {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}.
                    </p>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 max-w-sm mx-auto text-left text-xs font-mono-code space-y-1">
                    <div className="flex justify-between text-zinc-500">
                        <span>Payment Method:</span>
                        <span className="font-bold text-zinc-900 uppercase">{selectedMethod}</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                        <span>Total Paid:</span>
                        <span className="font-bold text-zinc-900">{currencySymbol}{totalPrice.toLocaleString("en-IN")}</span>
                    </div>
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

            {/* Payment Method Selector */}
            <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-950 font-mono-code">
                    Select Payment Method
                </h3>

                <div className="space-y-2.5">
                    {[
                        { id: "upi", label: "UPI (Google Pay, PhonePe, Paytm, QR)", desc: "Instant contactless payment" },
                        { id: "card", label: "Credit / Debit Card", desc: "Visa, MasterCard, RuPay & American Express" },
                        { id: "netbanking", label: "Net Banking", desc: "All major Indian banks supported" },
                        { id: "cod", label: "Cash on Delivery", desc: "Pay at your doorstep with cash or QR" },
                    ].map((method) => (
                        <div
                            key={method.id}
                            onClick={() => setSelectedMethod(method.id)}
                            className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                selectedMethod === method.id
                                    ? "border-black bg-zinc-50/70 ring-1 ring-black"
                                    : "border-zinc-200 hover:border-zinc-300"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                        selectedMethod === method.id
                                            ? "border-black bg-black"
                                            : "border-zinc-300 bg-white"
                                    }`}
                                >
                                    {selectedMethod === method.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                </div>
                                <div>
                                    <p className="text-xs font-bold font-mono-code uppercase text-zinc-900">
                                        {method.label}
                                    </p>
                                    <p className="text-[11px] text-zinc-400">{method.desc}</p>
                                </div>
                            </div>
                            <CreditCardIcon className="w-4 h-4 text-zinc-400" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 font-mono-code">
                <button
                    type="button"
                    onClick={onBackToAddress}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-zinc-200 text-xs font-bold uppercase text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
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
                            <span>Processing Payment...</span>
                        </>
                    ) : (
                        <>
                            <span>Pay {currencySymbol}{totalPrice.toLocaleString("en-IN")}</span>
                            <span>→</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
