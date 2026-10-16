import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChat } from "../hook/useChat.js";
import AddressStep from "../components/AddressStep.jsx";
import PaymentStep from "../components/PaymentStep.jsx";
import { useRazorpay } from "react-razorpay";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../state/cart.slice.js";
import {
    createRazorpayOrder,
    verifyPaymentAndPlaceOrder,
    placeCodOrder,
} from "../../orders/services/order.api.js";


// ─── Google Fonts loader ──────────────────────────────────────────────────────
function FontLoader() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
}

// ─── Currency symbol helper ──────────────────────────────────────────────────
const currencySymbol = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function MapPinIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    );
}

function ArrowLeftIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

function BagIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.125 1.007z" />
        </svg>
    );
}

function ShieldCheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function TruckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h-3.75a1.125 1.125 0 00-1.125 1.125v6.75" />
        </svg>
    );
}

function RefreshIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
}

function TrashIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

function TagIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
    );
}

function PlusIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function MinusIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
    );
}

function CheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

// ─── Main Cart Page Component ─────────────────────────────────────────────────
export default function CartPage() {

    const {
        handleGetCart,
        handleIncreamentQuantity,
        handleDecrementQuantity,
        handleDeleteCartItem,
        handleGetAddresses,
        handleCreateAddress,
        handleUpdateAddress,
        handleDeleteAddress,
        handleSelectAddress,
        setStep,
        handleCreateCartOrder,
        cartItems,
        cartLoading,
        cartTotalPrice,
        cartCurrency,
        shippingAddress,
        addresses,
        currentStep,
    } = useChat();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponError, setCouponError] = useState("");
    const [updatingItemId, setUpdatingItemId] = useState(null);
    const [deletingItemId, setDeletingItemId] = useState(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [paymentResult, setPaymentResult] = useState(null);
    const [confirmedOrder, setConfirmedOrder] = useState(null);

    useEffect(() => {
        handleGetCart().catch((err) => {
            setError(err?.response?.data?.message || "Failed to load cart items");
        });
        handleGetAddresses().catch((err) => {
            console.error("Failed to load addresses", err);
        });
    }, []);

    const user = useSelector(state => state.auth?.user || state.user);

    const { error: razorpayLoadError, isLoading: isRazorpayLoading, Razorpay } = useRazorpay();

    // Safe array of items (filters out phantom or orphaned items)
    const items = useMemo(() => {
        if (!Array.isArray(cartItems)) return [];
        return cartItems.filter((item) => {
            const hasProduct = Boolean(
                item &&
                (item.product?._id || (typeof item.product === "string" && item.product.trim()) || item.productId)
            );
            const hasId = Boolean(item && (item._id || item.productId || item.product?._id));
            return hasProduct && hasId;
        });
    }, [cartItems]);

    // If bag becomes empty while on address/payment step, reset to bag step
    useEffect(() => {
        if (items.length === 0 && currentStep !== 1) {
            setStep(1);
        }
    }, [items.length, currentStep, setStep]);

    // Calculate total items count and total price
    const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const subtotalPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            const lineTotal = item.itemTotal != null
                ? Number(item.itemTotal)
                : Number(item.unitPrice ?? item.variant?.price?.amount ?? item.product?.price?.amount ?? item.price?.amount ?? 0) * (Number(item.quantity) || 1);
            return sum + lineTotal;
        }, 0);
    }, [items]);

    const currency = cartCurrency || items[0]?.currency || items[0]?.price?.currency || items[0]?.product?.price?.currency || "INR";
    const symbol = currencySymbol[currency] || "₹";

    // Discount calculation
    const discountAmount = useMemo(() => {
        if (!appliedCoupon) return 0;
        if (appliedCoupon.type === "percent") {
            return Math.round((subtotalPrice * appliedCoupon.value) / 100);
        }
        return Math.min(appliedCoupon.value, subtotalPrice);
    }, [appliedCoupon, subtotalPrice]);

    const finalTotal = Math.max(0, subtotalPrice - discountAmount);

    // Apply coupon handler
    const handleApplyCoupon = (e) => {
        if (e) e.preventDefault();
        setCouponError("");
        const code = couponCode.trim().toUpperCase();

        if (!code) {
            setCouponError("Please enter a voucher code.");
            return;
        }

        if (code === "SNITCH10" || code === "FIRST10") {
            setAppliedCoupon({ code, discountPercent: 10, type: "percent", value: 10 });
            setCouponCode("");
        } else if (code === "FLAT200") {
            if (subtotalPrice < 999) {
                setCouponError("Minimum order value of ₹999 required for FLAT200.");
                return;
            }
            setAppliedCoupon({ code, type: "flat", value: 200 });
            setCouponCode("");
        } else {
            setCouponError("Invalid promo code. Try 'SNITCH10' for 10% off!");
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponError("");
    };

    // Increase item quantity
    const handleIncreaseQuantity = async (item) => {
        const product = item.product || {};
        const productId = product._id || (typeof item.product === "string" ? item.product : item.productId);
        const variantId = item.variant?._id || (typeof item.variant === "string" ? item.variant : item.variantId);
        setUpdatingItemId(item._id || productId);
        try {
            await handleIncreamentQuantity({
                productId,
                variantId,
            });
        } catch (err) {
            console.error("Failed to increase quantity:", err);
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Decrease item quantity (calls handleDecrementQuantity)
    const handleDecreaseQuantity = async (item) => {
        const product = item.product || {};
        const productId = product._id || (typeof item.product === "string" ? item.product : item.productId);
        const variantId = item.variant?._id || (typeof item.variant === "string" ? item.variant : item.variantId);
        setUpdatingItemId(item._id || productId);
        try {
            await handleDecrementQuantity({
                productId,
                variantId,
            });
        } catch (err) {
            console.error("Failed to decrease quantity:", err);
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Remove single item from cart via API
    const handleRemoveItem = async (item, itemIndex) => {
        const product = item.product || {};
        const productId = product._id || (typeof item.product === "string" ? item.product : item.productId);
        const variantId = item.variant?._id || (typeof item.variant === "string" ? item.variant : item.variantId);
        const itemId = item._id;

        const activeId = itemId || (variantId ? `${productId}-${variantId}` : productId) || itemIndex;
        setDeletingItemId(activeId);
        setError(null);

        try {
            await handleDeleteCartItem({
                productId,
                variantId,
                itemId,
                itemIndex,
            });
        } catch (err) {
            console.error("Failed to delete item from cart:", err);
            setError(err?.response?.data?.message || "Failed to remove item from bag");
        } finally {
            setDeletingItemId(null);
        }
    };

    async function handleCheckout(extraOpts = {}) {
        if (isCheckingOut) return;

        const method = extraOpts.method || "upi";

        // 1. Pre-validation checks
        if (!items || items.length === 0) {
            setError("Your shopping bag is empty.");
            setStep(1);
            return;
        }

        if (!shippingAddress) {
            setError("Please select or add a delivery address to proceed.");
            setStep(2);
            return;
        }

        setIsCheckingOut(true);
        setError(null);

        // ─── COD Flow ────────────────────────────────────────────────────────
        if (method === "cod") {
            try {
                const res = await placeCodOrder({
                    addressId: shippingAddress._id,
                    addressData: shippingAddress,
                    discount: discountAmount,
                    shippingFee: 0,
                });

                if (res?.success && res?.order) {
                    dispatch(clearCart());
                    setConfirmedOrder(res.order);
                    navigate(`/order-success/${res.order._id}`);
                } else {
                    throw new Error(res?.message || "Failed to place Cash on Delivery order.");
                }
            } catch (err) {
                console.error("COD checkout error:", err);
                setError(err?.response?.data?.message || err.message || "Failed to place COD order. Please try again.");
            } finally {
                setIsCheckingOut(false);
            }
            return;
        }

        // ─── Online Razorpay Flow ──────────────────────────────────────────
        if (!Razorpay) {
            setError("Payment gateway is initializing. Please wait a moment and try again.");
            setIsCheckingOut(false);
            return;
        }

        try {
            // 2. Create Razorpay order on backend
            const orderData = await createRazorpayOrder({
                amount: finalTotal,
                currency: cartCurrency || "INR",
            });

            if (!orderData || !orderData.order || !orderData.order.id) {
                throw new Error("Unable to create payment order. Please try again.");
            }

            const rzpOrder = orderData.order;
            const rzpKey = orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ToIKmjCL74Px1s";

            // 3. Configure Razorpay checkout options
            const options = {
                key: rzpKey,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency || cartCurrency || "INR",
                name: "Snitch",
                description: `Payment for Order #${rzpOrder.id}`,
                order_id: rzpOrder.id,
                prefill: {
                    name: shippingAddress?.fullName || user?.fullname || "",
                    email: user?.email || "",
                    contact: shippingAddress?.phone || user?.contact || "",
                },
                theme: {
                    color: "#000000",
                },
                modal: {
                    ondismiss: () => {
                        setIsCheckingOut(false);
                        console.log("Razorpay checkout modal closed by user");
                    },
                    escape: true,
                    backdropclose: false,
                },
                handler: async (response) => {
                    console.log("Payment successful at gateway, verifying on server:", response);
                    setIsCheckingOut(true);
                    try {
                        const verifyRes = await verifyPaymentAndPlaceOrder({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            addressId: shippingAddress._id,
                            addressData: shippingAddress,
                            paymentMethod: method,
                            discount: discountAmount,
                            shippingFee: 0,
                        });

                        if (verifyRes?.success && verifyRes?.order) {
                            dispatch(clearCart());
                            setConfirmedOrder(verifyRes.order);
                            navigate(`/order-success/${verifyRes.order._id}`);
                        } else {
                            throw new Error(verifyRes?.message || "Payment verification failed.");
                        }
                    } catch (verifyErr) {
                        console.error("Payment verification failed on server:", verifyErr);
                        setError(verifyErr?.response?.data?.message || verifyErr.message || "Payment verification failed. Please contact support.");
                    } finally {
                        setIsCheckingOut(false);
                    }
                },
            };

            const razorpayInstance = new Razorpay(options);

            razorpayInstance.on("payment.failed", (failedResponse) => {
                console.error("Payment failed:", failedResponse.error);
                setError(failedResponse.error?.description || "Payment failed or was canceled. Please try again.");
                setIsCheckingOut(false);
            });

            razorpayInstance.open();
        } catch (err) {
            console.error("Failed to initiate payment:", err);
            setError(err?.response?.data?.message || err.message || "Failed to initiate payment. Please try again.");
            setIsCheckingOut(false);
        }
    }
    return (
        <>
            <FontLoader />

            <style>{`
                *, *::before, *::after {
                    font-family: 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .font-mono-code {
                    font-family: 'JetBrains Mono', monospace;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(6px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-in-entry {
                    animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
            `}</style>

            <main className="min-h-screen w-full bg-[#fcfcfd] text-zinc-900 selection:bg-black selection:text-white pb-20">

                {/* ─── Breadcrumb & Top Bar ──────────────────────────────────── */}
                <div className="border-b border-zinc-200 bg-white/70 backdrop-blur-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-xs font-mono-code text-zinc-600">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 hover:text-black font-semibold transition-colors group cursor-pointer"
                        >
                            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            <span>Continue Shopping</span>
                        </Link>

                        {/* Express Delivery Pill */}
                        <div className="hidden sm:flex items-center gap-2 text-zinc-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-medium text-[11px] uppercase tracking-wider">
                                Free Express Shipping Across India
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── Main Content Container ─────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12 fade-in-entry space-y-8">

                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
                        <div>
                            <div className="flex items-center gap-2 text-[11px] font-mono-code uppercase tracking-widest text-zinc-500 mb-1">
                                <span>Snitch Store</span>
                                <span>/</span>
                                <span className="text-black font-bold">Shopping Bag</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950">
                                Shopping Bag
                            </h1>
                        </div>

                        {/* Stepper Progress */}
                        <div className="flex items-center gap-1.5 sm:gap-2 font-mono-code text-[11px]">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer ${currentStep === 1
                                    ? "bg-black text-white shadow-xs"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                    }`}
                            >
                                1. Bag ({totalQuantity})
                            </button>
                            <span className="text-zinc-300">→</span>
                            <button
                                type="button"
                                onClick={() => items.length > 0 && setStep(2)}
                                disabled={items.length === 0}
                                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${currentStep === 2
                                    ? "bg-black text-white shadow-xs"
                                    : shippingAddress
                                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                                        : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                    }`}
                            >
                                2. Address {shippingAddress && "✓"}
                            </button>
                            <span className="text-zinc-300">→</span>
                            <button
                                type="button"
                                onClick={() => items.length > 0 && shippingAddress && setStep(3)}
                                disabled={items.length === 0 || !shippingAddress}
                                className={`px-3 py-1 rounded-full font-bold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${currentStep === 3
                                    ? "bg-black text-white shadow-xs"
                                    : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
                                    }`}
                            >
                                3. Payment
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                            <span>Notice: {error}</span>
                            <button
                                onClick={() => handleGetCart()}
                                className="underline font-bold uppercase tracking-wider font-mono-code cursor-pointer"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Loading State */}
                    {cartLoading && items.length === 0 && (
                        <div className="py-24 flex flex-col items-center justify-center space-y-4">
                            <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-mono-code text-zinc-500 uppercase tracking-widest">
                                Loading your shopping bag...
                            </p>
                        </div>
                    )}

                    {/* Empty State */}
                    {!cartLoading && items.length === 0 && (
                        <div className="bg-white border border-zinc-200 rounded-3xl p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-6 shadow-xs">
                            <div className="w-20 h-20 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                                <BagIcon className="w-9 h-9" />
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900">
                                    Your bag is empty
                                </h2>
                                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto font-normal leading-relaxed">
                                    Looks like you haven't added anything to your cart yet. Explore our latest boxy shirts, relaxed cargos, and curated drops.
                                </p>
                            </div>

                            <div className="pt-2">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg font-mono-code cursor-pointer"
                                >
                                    <span>Explore New Drops</span>
                                    <span>→</span>
                                </Link>
                            </div>

                            {/* Quick Category Capsules (just like Home page) */}
                            <div className="pt-8 border-t border-zinc-100">
                                <span className="block text-[11px] font-mono-code uppercase tracking-wider text-zinc-400 mb-3">
                                    Popular Categories
                                </span>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {["Shirts", "Jeans", "Trousers", "Cargos", "T-Shirts"].map((cat) => (
                                        <Link
                                            key={cat}
                                            to="/"
                                            className="px-4 py-1.5 rounded-full border border-zinc-200 hover:border-black bg-zinc-50 hover:bg-white text-zinc-700 hover:text-black text-xs font-semibold uppercase tracking-tight transition-all font-mono-code"
                                        >
                                            {cat}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Active Cart Layout: 2 Columns */}
                    {items.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            {/* ─── LEFT COLUMN: Dynamic step content (8 cols) ───────────────── */}
                            <div className="lg:col-span-8 space-y-4">

                                {/* STEP 1: SHOPPING BAG ITEMS */}
                                {currentStep === 1 && (
                                    <>
                                        {/* Delivery address status bar */}
                                        {shippingAddress ? (
                                            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs font-mono-code">
                                                <div className="flex items-center gap-2">
                                                    <MapPinIcon className="w-4 h-4 text-zinc-700 flex-shrink-0" />
                                                    <span className="text-zinc-700">
                                                        Deliver to: <strong className="text-zinc-950">{shippingAddress.fullName}</strong> ({shippingAddress.city} - {shippingAddress.pincode})
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-700">
                                                        {shippingAddress.addressType || "HOME"}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="text-xs font-bold uppercase underline hover:text-black cursor-pointer text-zinc-600 self-start sm:self-auto"
                                                >
                                                    Change Address
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3 text-xs font-mono-code">
                                                <div className="flex items-center gap-2 text-amber-900">
                                                    <MapPinIcon className="w-4 h-4 text-amber-600 flex-shrink-0" />
                                                    <span>Select a delivery address to calculate exact delivery timeline</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="px-3 py-1 rounded-full bg-black hover:bg-zinc-800 text-white text-[11px] font-bold uppercase cursor-pointer transition-colors"
                                                >
                                                    Choose Address
                                                </button>
                                            </div>
                                        )}

                                        {/* Free Shipping Notification Bar */}
                                        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between gap-3 text-xs">
                                            <div className="flex items-center gap-2.5">
                                                <TruckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                                                <span className="text-zinc-700 font-medium">
                                                    <strong>Free Express Shipping</strong> unlocked on your bag!
                                                </span>
                                            </div>
                                            <span className="font-mono-code text-[11px] uppercase tracking-wider text-emerald-600 font-bold hidden sm:inline">
                                                FAST DISPATCH
                                            </span>
                                        </div>

                                        {/* Items List Cards */}
                                        <div className="space-y-3">
                                            {items.map((item, index) => {
                                                const product = item.product || {};

                                                // Find variant if ID exists (prioritize pre-populated variant from aggregation)
                                                const variant =
                                                    (typeof item.variant === "object" && item.variant !== null)
                                                        ? item.variant
                                                        : product.variants?.find((v) => String(v._id) === String(item.variant)) || null;

                                                // Resolve image
                                                const coverImg =
                                                    variant?.images?.[0]?.url ||
                                                    variant?.images?.[0] ||
                                                    product.images?.find((img) => img?.isCover)?.url ||
                                                    product.images?.[0]?.url ||
                                                    product.images?.[0] ||
                                                    "";

                                                // Pricing (use precalculated unitPrice and itemTotal from backend aggregate, fallback to live prices)
                                                const itemPrice = Number(
                                                    item.unitPrice ?? variant?.price?.amount ?? product.price?.amount ?? item.price?.amount ?? 0
                                                );
                                                const itemCurrency =
                                                    item.currency || item.price?.currency || product.price?.currency || "INR";
                                                const itemSymbol = currencySymbol[itemCurrency] || "₹";
                                                const qty = Number(item.quantity || 1);
                                                const lineTotal = Number(item.itemTotal ?? (itemPrice * qty));

                                                // Variant attributes
                                                const attributesObj = variant?.attributes || {};
                                                let attrEntries = [];
                                                if (attributesObj instanceof Map) {
                                                    attrEntries = Array.from(attributesObj.entries());
                                                } else if (typeof attributesObj === "object") {
                                                    attrEntries = Object.entries(attributesObj);
                                                }

                                                return (
                                                    <div
                                                        key={item._id || `${product._id}-${index}`}
                                                        className="group bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-4 sm:p-5 transition-all shadow-xs flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
                                                    >
                                                        {/* Product Image Thumbnail */}
                                                        <Link
                                                            to={product._id ? `/product/${product._id}` : "#"}
                                                            className="w-24 sm:w-28 aspect-[3/4] rounded-xl overflow-hidden bg-[#f4f4f5] border border-zinc-100 flex-shrink-0 relative cursor-pointer"
                                                        >
                                                            {coverImg ? (
                                                                <img
                                                                    src={coverImg}
                                                                    alt={product.title || "Product"}
                                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                                    <BagIcon className="w-6 h-6" />
                                                                </div>
                                                            )}
                                                        </Link>

                                                        {/* Product Info & Controls */}
                                                        <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch space-y-3">
                                                            <div>
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div>
                                                                        {/* Category tag */}
                                                                        <span className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 font-semibold block mb-0.5">
                                                                            {product.category || "SNITCH DROP"}
                                                                        </span>

                                                                        {/* Product Title */}
                                                                        <Link
                                                                            to={product._id ? `/product/${product._id}` : "#"}
                                                                            className="text-sm sm:text-base font-bold text-zinc-950 uppercase tracking-tight hover:text-black line-clamp-1 block transition-colors"
                                                                        >
                                                                            {product.title || "Curated Snitch Item"}
                                                                        </Link>
                                                                    </div>

                                                                    {/* Remove Item Button */}
                                                                    {(() => {
                                                                        const pId = product._id || (typeof item.product === "string" ? item.product : item.productId);
                                                                        const vId = item.variant?._id || (typeof item.variant === "string" ? item.variant : item.variantId);
                                                                        const itemActiveId = item._id || (vId ? `${pId}-${vId}` : pId) || index;
                                                                        const isDeleting = deletingItemId === itemActiveId;

                                                                        return (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => handleRemoveItem(item, index)}
                                                                                disabled={isDeleting || updatingItemId === (item._id || pId)}
                                                                                className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                                                title="Remove from bag"
                                                                                aria-label="Remove item from bag"
                                                                            >
                                                                                {isDeleting ? (
                                                                                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
                                                                                ) : (
                                                                                    <TrashIcon className="w-4 h-4" />
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    })()}
                                                                </div>

                                                                {/* Variety Attributes (Color, Size) */}
                                                                {attrEntries.length > 0 && (
                                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                                        {attrEntries.map(([k, v], i) => (
                                                                            <span
                                                                                key={i}
                                                                                className="text-[10px] font-mono-code bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full text-zinc-700 uppercase"
                                                                            >
                                                                                <span className="text-zinc-400">{k}:</span> {String(v)}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}

                                                                {/* Stock Status */}
                                                                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-600 font-medium font-mono-code">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                    <span>In Stock</span>
                                                                </div>
                                                            </div>

                                                            {/* Bottom Row: Quantity Stepper & Price Calculation */}
                                                            <div className="pt-3 border-t border-zinc-100 flex items-center justify-between flex-wrap gap-3">

                                                                {/* Stepper (+ / -) */}
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-xs font-mono-code text-zinc-500 mr-1">Qty:</span>
                                                                    <div className="flex items-center border border-zinc-200 rounded-full bg-white p-0.5">
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDecreaseQuantity(item)}
                                                                            disabled={updatingItemId === (item._id || product._id) || Boolean(deletingItemId)}
                                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            title="Decrease quantity"
                                                                        >
                                                                            <MinusIcon className="w-3.5 h-3.5" />
                                                                        </button>
                                                                        <span className="w-8 text-center text-xs font-bold font-mono-code text-zinc-900">
                                                                            {qty}
                                                                        </span>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleIncreaseQuantity(item)}
                                                                            disabled={updatingItemId === (item._id || product._id) || Boolean(deletingItemId)}
                                                                            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            title="Increase quantity"
                                                                        >
                                                                            <PlusIcon className="w-3.5 h-3.5" />
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                {/* Price Block */}
                                                                <div className="text-right">
                                                                    <span className="text-[11px] font-mono-code text-zinc-400 block">
                                                                        {itemSymbol}{itemPrice.toLocaleString("en-IN")} each
                                                                    </span>
                                                                    <span className="text-base sm:text-lg font-bold font-mono-code text-zinc-950">
                                                                        {itemSymbol}{lineTotal.toLocaleString("en-IN")}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Trust & Perks Strip */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                                            <div className="p-3 bg-white border border-zinc-200 rounded-xl text-center space-y-1">
                                                <ShieldCheckIcon className="w-4 h-4 mx-auto text-zinc-700" />
                                                <p className="text-[10px] font-bold uppercase font-mono-code text-zinc-900">100% Genuine</p>
                                                <p className="text-[9px] text-zinc-400">Direct from Snitch</p>
                                            </div>
                                            <div className="p-3 bg-white border border-zinc-200 rounded-xl text-center space-y-1">
                                                <RefreshIcon className="w-4 h-4 mx-auto text-zinc-700" />
                                                <p className="text-[10px] font-bold uppercase font-mono-code text-zinc-900">7-Day Return</p>
                                                <p className="text-[9px] text-zinc-400">Easy exchanges</p>
                                            </div>
                                            <div className="p-3 bg-white border border-zinc-200 rounded-xl text-center space-y-1">
                                                <TruckIcon className="w-4 h-4 mx-auto text-zinc-700" />
                                                <p className="text-[10px] font-bold uppercase font-mono-code text-zinc-900">Fast Shipping</p>
                                                <p className="text-[9px] text-zinc-400">2-4 business days</p>
                                            </div>
                                            <div className="p-3 bg-white border border-zinc-200 rounded-xl text-center space-y-1">
                                                <TagIcon className="w-4 h-4 mx-auto text-zinc-700" />
                                                <p className="text-[10px] font-bold uppercase font-mono-code text-zinc-900">Best Price</p>
                                                <p className="text-[9px] text-zinc-400">Exclusive drops</p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* STEP 2: ADDRESS LAYER */}
                                {currentStep === 2 && (
                                    <AddressStep
                                        addresses={addresses}
                                        selectedAddress={shippingAddress}
                                        onSelectAddress={handleSelectAddress}
                                        onCreateAddress={handleCreateAddress}
                                        onUpdateAddress={handleUpdateAddress}
                                        onDeleteAddress={handleDeleteAddress}
                                        onBackToBag={() => setStep(1)}
                                        onProceedToPayment={() => setStep(3)}
                                        isLoading={cartLoading || isCheckingOut}
                                    />
                                )}

                                {/* STEP 3: PAYMENT LAYER */}
                                {currentStep === 3 && (
                                    <PaymentStep
                                        selectedAddress={shippingAddress}
                                        items={items}
                                        totalPrice={finalTotal}
                                        currencySymbol={symbol}
                                        onBackToAddress={() => setStep(2)}
                                        onPlaceOrder={handleCheckout}
                                        isProcessing={isCheckingOut}
                                        paymentResult={paymentResult}
                                        confirmedOrder={confirmedOrder}
                                    />
                                )}

                            </div>

                            {/* ─── RIGHT COLUMN: Order Summary (4 cols) ────────────── */}
                            <div className="lg:col-span-4">
                                <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-6 sticky top-24">

                                    {/* Card Header */}
                                    <div className="border-b border-zinc-100 pb-4">
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-950 font-mono-code">
                                            Order Summary
                                        </h2>
                                        <p className="text-xs text-zinc-500 mt-0.5">
                                            {totalQuantity} {totalQuantity === 1 ? "item" : "items"} in your order
                                        </p>
                                    </div>

                                    {/* Voucher / Promo Code Box */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700 flex items-center justify-between">
                                            <span>Coupons & Offers</span>
                                            {appliedCoupon && (
                                                <span className="text-emerald-600 font-bold">1 Applied</span>
                                            )}
                                        </label>

                                        {!appliedCoupon ? (
                                            <form onSubmit={handleApplyCoupon} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => {
                                                        setCouponCode(e.target.value.toUpperCase());
                                                        setCouponError("");
                                                    }}
                                                    placeholder="Enter coupon (e.g. SNITCH10)"
                                                    className="flex-1 h-9 px-3 bg-zinc-50 border border-zinc-200 rounded-full text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black uppercase transition-all"
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-4 h-9 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase font-mono-code rounded-full transition-colors cursor-pointer"
                                                >
                                                    Apply
                                                </button>
                                            </form>
                                        ) : (
                                            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-mono-code">
                                                <div className="flex items-center gap-1.5 text-emerald-800">
                                                    <CheckIcon className="w-4 h-4 text-emerald-600" />
                                                    <span><strong>{appliedCoupon.code}</strong> applied (-{symbol}{discountAmount})</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveCoupon}
                                                    className="text-xs text-rose-600 hover:text-rose-800 font-bold uppercase cursor-pointer"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}

                                        {couponError && (
                                            <p className="text-[11px] text-rose-600 font-mono-code">{couponError}</p>
                                        )}

                                        {/* Quick Suggestion Pill */}
                                        {!appliedCoupon && (
                                            <div className="flex items-center gap-1.5 pt-1">
                                                <span className="text-[10px] text-zinc-400 font-mono-code">Suggested:</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setCouponCode("SNITCH10");
                                                        setAppliedCoupon({ code: "SNITCH10", type: "percent", value: 10 });
                                                    }}
                                                    className="px-2 py-0.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[10px] font-mono-code font-bold uppercase cursor-pointer transition-colors"
                                                >
                                                    SNITCH10 (10% OFF)
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Cost Breakdown */}
                                    <div className="space-y-3 text-xs font-mono-code border-t border-zinc-100 pt-4">
                                        <div className="flex justify-between text-zinc-600">
                                            <span>Bag MRP Total</span>
                                            <span className="font-medium text-zinc-900">
                                                {symbol}{subtotalPrice.toLocaleString("en-IN")}
                                            </span>
                                        </div>

                                        {appliedCoupon && (
                                            <div className="flex justify-between text-emerald-600">
                                                <span>Coupon Savings</span>
                                                <span className="font-bold">
                                                    -{symbol}{discountAmount.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-between text-zinc-600">
                                            <span>Delivery Fee</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="line-through text-zinc-400 text-[11px]">{symbol}99</span>
                                                <span className="text-emerald-600 uppercase font-bold">FREE</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-zinc-600">
                                            <span>Estimated Taxes (GST)</span>
                                            <span className="text-zinc-500">Included</span>
                                        </div>
                                    </div>

                                    {/* Grand Total */}
                                    <div className="border-t border-zinc-200 pt-4 flex items-baseline justify-between">
                                        <div>
                                            <span className="text-xs uppercase font-mono-code tracking-widest text-zinc-500 block">
                                                Total Amount
                                            </span>
                                            <span className="text-[10px] text-zinc-400">All taxes included</span>
                                        </div>
                                        <span className="text-2xl font-black font-mono-code text-zinc-950">
                                            {symbol}{finalTotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>

                                    {/* Shipping Address Summary in Order Details */}
                                    {shippingAddress && (
                                        <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-mono-code space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] uppercase font-bold text-zinc-500">Shipping To</span>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep(2)}
                                                    className="text-[10px] uppercase text-zinc-700 underline font-bold cursor-pointer hover:text-black"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                            <p className="font-bold text-zinc-900">{shippingAddress.fullName}</p>
                                            <p className="text-zinc-500 text-[11px] truncate">
                                                {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
                                            </p>
                                        </div>
                                    )}

                                    {/* Checkout Action Button */}
                                    {currentStep === 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="w-full py-4 bg-black hover:bg-zinc-800 active:scale-[0.99] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-mono-code"
                                        >
                                            <span>Proceed To Address</span>
                                            <span className="text-sm">→</span>
                                        </button>
                                    )}

                                    {currentStep === 2 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!shippingAddress) {
                                                    setError("Please select or add a delivery address to proceed.");
                                                    return;
                                                }
                                                setStep(3);
                                            }}
                                            disabled={!shippingAddress || isCheckingOut}
                                            className="w-full py-4 bg-black hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-mono-code"
                                        >
                                            <span>Continue To Payment</span>
                                            <span className="text-sm">→</span>
                                        </button>
                                    )}

                                    {currentStep === 3 && (
                                        <button
                                            type="button"
                                            onClick={() => handleCheckout()}
                                            disabled={isCheckingOut || Boolean(paymentResult)}
                                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-mono-code"
                                        >
                                            <span>
                                                {paymentResult
                                                    ? "Order Confirmed ✓"
                                                    : isCheckingOut
                                                    ? "Opening Razorpay..."
                                                    : `Pay ${symbol}${finalTotal.toLocaleString("en-IN")}`}
                                            </span>
                                            {!paymentResult && <span className="text-sm">✓</span>}
                                        </button>
                                    )}

                                    {/* Security Guarantee Note */}
                                    <div className="pt-2 border-t border-zinc-100 flex items-center justify-center gap-2 text-zinc-500 text-[11px] font-mono-code">
                                        <ShieldCheckIcon className="w-4 h-4 text-zinc-700 flex-shrink-0" />
                                        <span>256-Bit SSL Encrypted Checkout</span>
                                    </div>

                                </div>
                            </div>

                        </div>
                    )}

                </div>

                {/* ─── Snitch Store Footer (Matching Home.jsx) ────────────────── */}
                <footer className="mt-16 border-t border-zinc-200 bg-white py-10 px-4 sm:px-8 text-center text-xs text-zinc-500 space-y-2 font-mono-code">
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-black">
                            S
                        </span>
                        <span className="font-bold text-zinc-900 tracking-widest uppercase">
                            SNITCH STORE
                        </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                        Designed for next-generation streetwear and curated lifestyle apparel.
                    </p>
                </footer>

            </main>
        </>
    );
}
