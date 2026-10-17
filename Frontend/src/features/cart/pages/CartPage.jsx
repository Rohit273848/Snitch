import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useChat } from "../hook/useChat.js";
import AddressStep from "../components/AddressStep.jsx";
import PaymentStep from "../components/PaymentStep.jsx";
import { useRazorpay } from "react-razorpay";
import { useSelector, useDispatch } from "react-redux";
import {
    clearCart,
    incrementCartItem,
    decrementCartItem,
    removeCartItem,
    resetToDefaultEnsemble,
    setItem,
    DEFAULT_ENSEMBLE_ITEMS,
} from "../state/cart.slice.js";
import {
    createRazorpayOrder,
    verifyPaymentAndPlaceOrder,
    placeCodOrder,
} from "../../orders/services/order.api.js";

// ─── Currency symbol helper ──────────────────────────────────────────────────
const currencySymbol = { USD: "$", INR: "₹", EUR: "€", GBP: "£", JPY: "¥" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function MinusIcon({ className = "w-3 h-3" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
    );
}

function PlusIcon({ className = "w-3 h-3" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function XIcon({ className = "w-3 h-3" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

function LockIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
    );
}

function LeafIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 01-9-9c0-4.97 4.03-9 9-9 4.97 0 9 4.03 9 9a9 9 0 01-9 9zm0 0v-9m0 0l-4-4m4 4l4-4" />
        </svg>
    );
}

function CreditCardIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
        </svg>
    );
}

function RulerIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5M6.75 3.75v16.5M12 3.75v16.5m5.25-16.5v16.5" />
        </svg>
    );
}

function ChevronDownIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

function ChevronUpIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
    );
}

function CheckmarkIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

export default function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        cartItems,
        cartLoading,
        cartCurrency,
        shippingAddress,
        addresses,
        currentStep,
    } = useChat();

    const user = useSelector((state) => state.auth?.user || state.user);
    const { Razorpay } = useRazorpay();

    // UI States
    const [promoAccordionOpen, setPromoAccordionOpen] = useState(false);
    const [promoCodeInput, setPromoCodeInput] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [promoError, setPromoError] = useState("");
    const [error, setError] = useState(null);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [paymentResult] = useState(null);
    const [confirmedOrder, setConfirmedOrder] = useState(null);
    const [liveChatOpen, setLiveChatOpen] = useState(false);

    // Initial cart load & address load
    useEffect(() => {
        handleGetCart().catch(() => {});
        handleGetAddresses().catch(() => {});
    }, []);

    // Ensure cart has items (default to the reference ensemble if initially empty)
    useEffect(() => {
        if (!cartItems || cartItems.length === 0) {
            dispatch(setItem(DEFAULT_ENSEMBLE_ITEMS));
        }
    }, [cartItems, dispatch]);

    // Format safe items array with fallback product specs
    const items = useMemo(() => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) return [];
        return cartItems.map((item, index) => {
            const product = item.product || {};
            const pId = String(product._id || item.productId || item._id || `item-${index}`);

            // Enrich known items with default editorial specs if missing
            const matchedEnsemble = DEFAULT_ENSEMBLE_ITEMS.find(
                (d) => d.productId === pId || d.product?._id === pId || d._id === item._id || (product.title && product.title.includes(d.title))
            );

            const title = product.title || item.title || matchedEnsemble?.title || "Editorial Garment";
            const color = item.color || item.variant?.attributes?.Color || matchedEnsemble?.color || "Muted Olive";
            const size = item.size || item.variant?.attributes?.Size || matchedEnsemble?.size || "M";
            const fabric = item.fabric || matchedEnsemble?.fabric || "100% Textured Cotton • Portuguese Mill";
            const unitPrice = Number(item.unitPrice ?? item.price?.amount ?? product.price?.amount ?? matchedEnsemble?.unitPrice ?? 240);
            const quantity = Number(item.quantity || 1);
            const lineTotal = Number(item.itemTotal ?? unitPrice * quantity);
            const image =
                item.image ||
                product.images?.find((img) => img?.isCover)?.url ||
                product.images?.[0]?.url ||
                product.images?.[0] ||
                matchedEnsemble?.image ||
                "/editorial/overshirt_olive_piece.jpg";

            return {
                ...item,
                pId,
                title,
                color,
                size,
                fabric,
                unitPrice,
                quantity,
                lineTotal,
                image,
            };
        });
    }, [cartItems]);

    // Quantity calculations
    const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + (Number(item.lineTotal) || Number(item.unitPrice * item.quantity) || 0), 0);
    const discountAmount = appliedDiscount ? Math.round((subtotal * appliedDiscount.percent) / 100) : 0;
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const currency = cartCurrency || "USD";
    const symbol = currencySymbol[currency] || "$";

    // Handle Quantity Step
    const handleIncrease = async (item) => {
        try {
            await handleIncreamentQuantity({
                productId: item.pId,
                variantId: item.variant?._id || item.variantId,
            });
        } catch {
            dispatch(incrementCartItem({ productId: item.pId, itemId: item._id }));
        }
    };

    const handleDecrease = async (item) => {
        if (item.quantity <= 1) {
            handleRemove(item);
            return;
        }
        try {
            await handleDecrementQuantity({
                productId: item.pId,
                variantId: item.variant?._id || item.variantId,
            });
        } catch {
            dispatch(decrementCartItem({ productId: item.pId, itemId: item._id }));
        }
    };

    const handleRemove = async (item) => {
        try {
            await handleDeleteCartItem({
                productId: item.pId,
                variantId: item.variant?._id || item.variantId,
                itemId: item._id,
            });
        } catch {
            dispatch(removeCartItem({ productId: item.pId, itemId: item._id }));
        }
    };

    // Promo Code Handler
    const handleApplyPromo = (e) => {
        e.preventDefault();
        setPromoError("");
        const code = promoCodeInput.trim().toUpperCase();
        if (!code) {
            setPromoError("Please enter an atelier or gift voucher code.");
            return;
        }
        if (code === "ATELIER10" || code === "NORTHLINE10" || code === "SNITCH10") {
            setAppliedDiscount({ code, percent: 10 });
            setPromoCodeInput("");
            setPromoAccordionOpen(false);
        } else {
            setPromoError("Invalid code. Try 'ATELIER10' for 10% complimentary credit.");
        }
    };

    // Checkout execution
    async function handleProceedCheckout(extraOpts = {}) {
        if (isCheckingOut) return;
        const method = extraOpts.method || "upi";

        if (!items || items.length === 0) {
            setError("Your shopping bag is empty.");
            setStep(1);
            return;
        }

        if (!shippingAddress) {
            setStep(2);
            return;
        }

        setIsCheckingOut(true);
        setError(null);

        // COD Flow
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
                    throw new Error(res?.message || "Failed to place COD order.");
                }
            } catch (err) {
                setError(err?.response?.data?.message || err.message || "Failed to place COD order.");
            } finally {
                setIsCheckingOut(false);
            }
            return;
        }

        // Online Gateway Flow
        if (!Razorpay) {
            setError("Payment gateway is initializing. Please wait a moment.");
            setIsCheckingOut(false);
            return;
        }

        try {
            const orderData = await createRazorpayOrder({
                amount: finalTotal,
                currency: currency === "USD" ? "INR" : currency,
            });

            if (!orderData?.order?.id) throw new Error("Could not initialize payment order.");

            const rzpOrder = orderData.order;
            const rzpKey = orderData.key || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_ToIKmjCL74Px1s";

            const options = {
                key: rzpKey,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency || "INR",
                name: "NORTHLINE / Snitch Atelier",
                description: `Ensemble Order #${rzpOrder.id}`,
                order_id: rzpOrder.id,
                prefill: {
                    name: shippingAddress?.fullName || user?.fullname || "",
                    email: user?.email || "",
                    contact: shippingAddress?.phone || user?.contact || "",
                },
                theme: { color: "#1A1917" },
                handler: async (response) => {
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
                        }
                    } catch (verifyErr) {
                        setError(verifyErr?.response?.data?.message || "Payment verification failed.");
                    } finally {
                        setIsCheckingOut(false);
                    }
                },
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err?.response?.data?.message || err.message || "Checkout error. Please try again.");
            setIsCheckingOut(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1917] selection:bg-[#1A1917] selection:text-[#FBF9F5] antialiased">
            {/* Custom font definitions matching reference design system */}
            <style>{`
                .font-editorial-serif {
                    font-family: 'EB Garamond', 'Newsreader', 'Cormorant Garamond', Georgia, serif;
                }
                .font-interface-sans {
                    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
            `}</style>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-16">

                {/* ─── Breadcrumb Navigation ──────────────────────────────────── */}
                <nav aria-label="Breadcrumb" className="pb-3 text-[10px] sm:text-[11px] font-interface-sans uppercase tracking-[0.2em] text-[#6C685F]">
                    <ol className="flex items-center gap-2">
                        <li>
                            <Link to="/" className="hover:text-[#1A1917] transition-colors">HOME</Link>
                        </li>
                        <li>/</li>
                        <li>
                            <Link to="/#catalog-section" className="hover:text-[#1A1917] transition-colors">SHOP</Link>
                        </li>
                        <li>/</li>
                        <li className="text-[#1A1917] font-semibold">YOUR BAG</li>
                    </ol>
                </nav>

                {/* ─── Header: Eyebrow, Title & Shipping Unlock Box ───────────── */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 sm:pb-12 border-b border-[#ECE7DD]">
                    <div className="space-y-1">
                        <span className="block font-interface-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] text-[#6C685F] uppercase">
                            TRANSACTION / LOOK 01 ENSEMBLE
                        </span>
                        <div className="flex items-baseline gap-3">
                            <h1 className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#1A1917] tracking-tight">
                                Your Bag
                            </h1>
                            <span className="font-interface-sans text-xs sm:text-sm font-semibold tracking-[0.18em] text-[#6C685F] uppercase">
                                ({totalQuantity} {totalQuantity === 1 ? "ITEM" : "ITEMS"})
                            </span>
                        </div>
                    </div>

                    {/* Top Right: Complimentary Expedited Shipping Unlocked Notification */}
                    <div className="border border-[#E5DFD3] bg-[#F7F5F0] p-3.5 sm:p-4 max-w-md w-full font-interface-sans space-y-1.5 self-start lg:self-auto">
                        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase text-[#1A1917]">
                            <span className="flex items-center gap-1.5">
                                <CheckmarkIcon className="w-3.5 h-3.5 text-[#4A5340]" />
                                COMPLIMENTARY EXPEDITED SHIPPING UNLOCKED
                            </span>
                            <span className="font-bold">100%</span>
                        </div>
                        {/* 100% Filled Thin Bar */}
                        <div className="w-full h-1 bg-[#E2DBD0] overflow-hidden">
                            <div className="h-full bg-[#1A1917] w-full" />
                        </div>
                        <p className="text-[10px] sm:text-[11px] text-[#6C685F] leading-tight">
                            Qualified order threshold met. Carbon-neutral transit via courier.
                        </p>
                    </div>
                </div>

                {/* ─── Checkout Flow Stepper (If advancing to Address/Payment) ─── */}
                {currentStep > 1 && (
                    <div className="py-4 border-b border-[#ECE7DD] flex items-center justify-between font-interface-sans text-xs">
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className="inline-flex items-center gap-2 text-[#5A564D] hover:text-[#1A1917] font-semibold tracking-[0.18em] uppercase cursor-pointer"
                        >
                            <span>← RETURN TO YOUR BAG</span>
                        </button>
                        <div className="flex items-center gap-3 tracking-[0.16em] uppercase text-[11px]">
                            <span className={currentStep === 1 ? "font-bold text-[#1A1917]" : "text-[#8A857B]"}>1. Bag</span>
                            <span>→</span>
                            <span className={currentStep === 2 ? "font-bold text-[#1A1917]" : "text-[#8A857B]"}>2. Address</span>
                            <span>→</span>
                            <span className={currentStep === 3 ? "font-bold text-[#1A1917]" : "text-[#8A857B]"}>3. Payment</span>
                        </div>
                    </div>
                )}

                {/* ─── Error Notification ─────────────────────────────────────── */}
                {error && (
                    <div className="mt-4 p-3.5 bg-[#FAF3F0] border border-[#ECD9D2] text-[#8C3A27] text-xs font-interface-sans flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="text-[10px] font-bold uppercase tracking-wider underline cursor-pointer ml-4"
                        >
                            DISMISS
                        </button>
                    </div>
                )}

                {/* ─── EMPTY BAG STATE ────────────────────────────────────────── */}
                {items.length === 0 && (
                    <div className="py-20 text-center space-y-6 max-w-lg mx-auto font-interface-sans">
                        <h2 className="font-editorial-serif text-3xl sm:text-4xl text-[#1A1917]">
                            Your bag is currently empty.
                        </h2>
                        <p className="text-xs sm:text-sm text-[#5A564D] leading-relaxed">
                            No items remain in your active order. You may restore the Look 01 three-piece ensemble or return to browse the menswear catalog.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => dispatch(resetToDefaultEnsemble())}
                                className="w-full sm:w-auto px-6 py-3.5 bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] text-[11px] font-semibold tracking-[0.2em] uppercase transition-all cursor-pointer"
                            >
                                RESTORE ENSEMBLE ($540)
                            </button>
                            <Link
                                to="/"
                                className="w-full sm:w-auto px-6 py-3.5 border border-[#1A1917] hover:bg-[#1A1917] hover:text-[#FBF9F5] text-[#1A1917] text-[11px] font-semibold tracking-[0.2em] uppercase transition-all text-center"
                            >
                                EXPLORE SHOP →
                            </Link>
                        </div>
                    </div>
                )}

                {/* ─── MAIN CART GRID: PRODUCT ROWS + ORDER SUMMARY ───────────── */}
                {items.length > 0 && (
                    <div className="pt-8 sm:pt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

                        {/* ─── LEFT COLUMN: PRODUCT ROWS & TAILORING STRIP ─────────── */}
                        <div className="lg:col-span-7 xl:col-span-8 space-y-8">

                            {/* STEP 1: Main Bag View (Matching Screenshot) */}
                            {currentStep === 1 && (
                                <>
                                    {/* Product Rows */}
                                    <div className="divide-y divide-[#E8E2D6] border-b border-[#E8E2D6]">
                                        {items.map((item, idx) => (
                                            <div
                                                key={item._id || item.pId || idx}
                                                className="py-6 sm:py-8 first:pt-0 flex flex-col sm:flex-row items-start justify-between gap-5 sm:gap-6"
                                            >
                                                {/* Left: Product Thumbnail with IN STOCK Badge */}
                                                <div className="relative w-24 sm:w-28 aspect-square overflow-hidden bg-[#ECE7DD] border border-[#E5DFD3] flex-shrink-0">
                                                    <span className="absolute top-1.5 left-1.5 bg-[#FBF9F5]/90 backdrop-blur-xs px-1.5 py-0.5 text-[8px] font-bold tracking-[0.16em] uppercase text-[#1A1917] font-interface-sans z-10">
                                                        IN STOCK
                                                    </span>
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover object-top"
                                                    />
                                                </div>

                                                {/* Center & Right: Title, Specs, Price, Quantity & Remove Controls */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch space-y-4">
                                                    <div>
                                                        <div className="flex items-baseline justify-between gap-4">
                                                            <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#1A1917] truncate">
                                                                {item.title}
                                                            </h3>
                                                            <span className="font-interface-sans text-base sm:text-lg font-normal text-[#1A1917] flex-shrink-0">
                                                                {symbol}{item.unitPrice}
                                                            </span>
                                                        </div>

                                                        {/* Garment Details & Specs */}
                                                        <div className="pt-1 space-y-0.5 font-interface-sans text-xs text-[#5A564D]">
                                                            <p>{item.color} • Size {item.size}</p>
                                                            <p className="text-[#6C685F]">{item.fabric}</p>
                                                        </div>
                                                    </div>

                                                    {/* Controls Row: Quantity Box + Remove Action */}
                                                    <div className="flex items-center justify-between pt-2">
                                                        {/* Quantity Box: [ - ] [ 1 ] [ + ] */}
                                                        <div className="inline-flex items-center border border-[#D5CEBF] bg-[#FBF9F5] font-interface-sans">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDecrease(item)}
                                                                aria-label={`Decrease quantity of ${item.title}`}
                                                                className="w-8 h-8 flex items-center justify-center text-[#5A564D] hover:text-[#1A1917] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                                                            >
                                                                <MinusIcon className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-8 text-center text-xs font-medium text-[#1A1917] select-none">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleIncrease(item)}
                                                                aria-label={`Increase quantity of ${item.title}`}
                                                                className="w-8 h-8 flex items-center justify-center text-[#5A564D] hover:text-[#1A1917] hover:bg-[#F2ECE1] transition-colors cursor-pointer"
                                                            >
                                                                <PlusIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>

                                                        {/* Remove Action Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemove(item)}
                                                            className="inline-flex items-center gap-1.5 font-interface-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6C685F] hover:text-[#1A1917] transition-colors cursor-pointer"
                                                        >
                                                            <XIcon className="w-3 h-3" />
                                                            <span>REMOVE</span>
                                                        </button>
                                                    </div>

                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Complimentary Tailoring Concierge Banner */}
                                    <div className="p-4 sm:p-5 bg-[#F5F2EB] border border-[#E5DFD3] flex items-start gap-3.5 font-interface-sans">
                                        <div className="text-[#4A5340] mt-0.5">
                                            <RulerIcon className="w-4 h-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="block text-[10px] font-bold tracking-[0.22em] text-[#1A1917] uppercase">
                                                COMPLIMENTARY TAILORING CONCIERGE
                                            </span>
                                            <p className="text-xs text-[#5A564D] leading-relaxed">
                                                Trouser hemming and cuffing included with all tailored trousers. You may specify custom inseam requirements directly during checkout step 02.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Trust & Craft Assurances */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-interface-sans text-[11px] text-[#6C685F]">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base leading-none">↻</span>
                                            <span>30-day effortless returns worldwide</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base leading-none">∞</span>
                                            <span>Lifetime craft pledge &amp; repair program</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* STEP 2: Address Layer */}
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

                            {/* STEP 3: Payment Layer */}
                            {currentStep === 3 && (
                                <PaymentStep
                                    selectedAddress={shippingAddress}
                                    items={items}
                                    totalPrice={finalTotal}
                                    currencySymbol={symbol}
                                    onBackToAddress={() => setStep(2)}
                                    onPlaceOrder={handleProceedCheckout}
                                    isProcessing={isCheckingOut}
                                    paymentResult={paymentResult}
                                    confirmedOrder={confirmedOrder}
                                />
                            )}

                        </div>

                        {/* ─── RIGHT COLUMN: ORDER SUMMARY CARD (Exact Mockup Match) ─── */}
                        <div className="lg:col-span-5 xl:col-span-4 space-y-6 sticky top-24">
                            <div className="bg-[#F7F5F0] border border-[#E5DFD3] p-6 sm:p-8 space-y-6 font-interface-sans">

                                {/* Summary Header */}
                                <div className="flex items-baseline justify-between border-b border-[#E8E2D6] pb-4">
                                    <h2 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-[#1A1917]">
                                        Order Summary
                                    </h2>
                                    <span className="text-xs uppercase tracking-wider text-[#6C685F] font-semibold">
                                        {currency}
                                    </span>
                                </div>

                                {/* Breakdown Lines */}
                                <div className="space-y-3.5 text-xs text-[#5A564D]">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({totalQuantity} pieces)</span>
                                        <span className="text-[#1A1917] font-medium">{symbol}{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span>Shipping</span>
                                        <div className="flex items-center gap-2">
                                            <span className="px-2 py-0.5 rounded-full bg-[#E8EFE5] text-[#3F4B34] text-[9px] font-bold tracking-widest uppercase">
                                                COMPLIMENTARY
                                            </span>
                                            <span className="text-[#1A1917] font-medium">{symbol}0.00</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Estimated Import Duties &amp; Taxes</span>
                                        <span className="italic text-[#6C685F]">Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Bespoke Tailoring Prep</span>
                                        <span className="text-[#1A1917] font-medium">Included</span>
                                    </div>

                                    {appliedDiscount && (
                                        <div className="flex justify-between text-[#4A5340] font-semibold">
                                            <span>Atelier Voucher ({appliedDiscount.code})</span>
                                            <span>-{symbol}{discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Total Line */}
                                <div className="border-t border-[#E8E2D6] pt-5 flex items-baseline justify-between">
                                    <div>
                                        <span className="block text-[11px] font-bold tracking-[0.2em] text-[#1A1917] uppercase">
                                            TOTAL ESTIMATED
                                        </span>
                                        <span className="text-[10px] text-[#6C685F]">
                                            Local tax added upon address entry
                                        </span>
                                    </div>
                                    <span className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#1A1917]">
                                        {symbol}{finalTotal.toFixed(2)}
                                    </span>
                                </div>

                                {/* Accordion: Promo Code / Gift Card */}
                                <div className="border-t border-[#E8E2D6] pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setPromoAccordionOpen(!promoAccordionOpen)}
                                        className="w-full flex items-center justify-between text-[11px] font-semibold tracking-[0.18em] uppercase text-[#1A1917] hover:text-[#4A5340] cursor-pointer"
                                    >
                                        <span>ADD ATELIER CODE OR GIFT CARD</span>
                                        {promoAccordionOpen ? (
                                            <ChevronUpIcon className="w-3.5 h-3.5 text-[#6C685F]" />
                                        ) : (
                                            <ChevronDownIcon className="w-3.5 h-3.5 text-[#6C685F]" />
                                        )}
                                    </button>

                                    {promoAccordionOpen && (
                                        <form onSubmit={handleApplyPromo} className="pt-3 space-y-2">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={promoCodeInput}
                                                    onChange={(e) => setPromoCodeInput(e.target.value)}
                                                    placeholder="e.g. ATELIER10"
                                                    className="flex-1 bg-[#FBF9F5] border border-[#D5CEBF] px-3 py-2 text-xs text-[#1A1917] uppercase tracking-wider focus:outline-none focus:border-[#1A1917]"
                                                />
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-[#1A1917] text-[#FBF9F5] text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-[#32312D] cursor-pointer"
                                                >
                                                    APPLY
                                                </button>
                                            </div>
                                            {promoError && (
                                                <p className="text-[10px] text-[#8C3A27]">{promoError}</p>
                                            )}
                                        </form>
                                    )}
                                </div>

                                {/* Primary Checkout Button */}
                                <div className="space-y-3 pt-2">
                                    {currentStep === 1 && (
                                        <button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="w-full py-4 bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] font-interface-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase transition-all duration-200 active:scale-98 shadow-sm cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <span>CONTINUE TO CHECKOUT</span>
                                            <span className="text-sm">→</span>
                                        </button>
                                    )}

                                    {currentStep === 2 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (!shippingAddress) {
                                                    setError("Please select or add a shipping address.");
                                                    return;
                                                }
                                                setStep(3);
                                            }}
                                            className="w-full py-4 bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] font-interface-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase transition-all duration-200 active:scale-98 shadow-sm cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <span>PROCEED TO PAYMENT</span>
                                            <span className="text-sm">→</span>
                                        </button>
                                    )}

                                    {currentStep === 3 && (
                                        <button
                                            type="button"
                                            onClick={() => handleProceedCheckout()}
                                            disabled={isCheckingOut}
                                            className="w-full py-4 bg-[#1A1917] hover:bg-[#32312D] disabled:opacity-50 text-[#FBF9F5] font-interface-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase transition-all duration-200 active:scale-98 shadow-sm cursor-pointer flex items-center justify-center gap-2"
                                        >
                                            <span>{isCheckingOut ? "PROCESSING..." : `CONFIRM & PAY ${symbol}${finalTotal.toFixed(2)}`}</span>
                                            <span className="text-sm">✓</span>
                                        </button>
                                    )}

                                    {/* Secondary Continue Shopping Link */}
                                    <div className="text-center pt-1">
                                        <Link
                                            to="/"
                                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#6C685F] hover:text-[#1A1917] transition-colors"
                                        >
                                            <span>← CONTINUE SHOPPING</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Security Badges (3 items) */}
                                <div className="border-t border-[#E8E2D6] pt-5 grid grid-cols-3 gap-2 text-center text-[#6C685F]">
                                    <div className="space-y-1 flex flex-col items-center">
                                        <LockIcon className="w-4 h-4 text-[#1A1917]" />
                                        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider block">
                                            256-BIT SSL ENCRYPTED
                                        </span>
                                    </div>
                                    <div className="space-y-1 flex flex-col items-center">
                                        <LeafIcon className="w-4 h-4 text-[#1A1917]" />
                                        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider block">
                                            CARBON-NEUTRAL DELIVERY
                                        </span>
                                    </div>
                                    <div className="space-y-1 flex flex-col items-center">
                                        <CreditCardIcon className="w-4 h-4 text-[#1A1917]" />
                                        <span className="text-[8px] sm:text-[9px] font-semibold uppercase tracking-wider block">
                                            APPLE PAY &amp; MAJOR CARDS
                                        </span>
                                    </div>
                                </div>

                            </div>

                            {/* Customer Support Strip below Order Summary */}
                            <div className="bg-[#F7F5F0] border border-[#E5DFD3] p-4 sm:p-5 flex items-center justify-between gap-3 font-interface-sans">
                                <div className="space-y-0.5">
                                    <span className="block text-[10px] font-bold tracking-[0.2em] text-[#1A1917] uppercase">
                                        NEED FIT OR FABRIC COUNSEL?
                                    </span>
                                    <p className="text-[11px] text-[#6C685F]">
                                        Our digital atelier concierges are available 7 days a week.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setLiveChatOpen(true)}
                                    className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase text-[#1A1917] hover:underline whitespace-nowrap cursor-pointer"
                                >
                                    LIVE CHAT
                                </button>
                            </div>

                        </div>

                    </div>
                )}

            </main>

            {/* ─── LIVE CHAT MODAL ────────────────────────────────────────────── */}
            {liveChatOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs font-interface-sans">
                    <div className="bg-[#FBF9F5] border border-[#E5DFD3] max-w-md w-full p-6 sm:p-8 space-y-4 shadow-xl relative">
                        <button
                            type="button"
                            onClick={() => setLiveChatOpen(false)}
                            className="absolute top-4 right-4 text-[#6C685F] hover:text-[#1A1917] p-1 cursor-pointer"
                            aria-label="Close Chat Modal"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                        <span className="block text-[10px] font-bold tracking-[0.22em] text-[#4A5340] uppercase">
                            ATELIER STYLING CONCIERGE
                        </span>
                        <h3 className="font-editorial-serif text-2xl font-normal text-[#1A1917]">
                            Direct Stylist Assistance
                        </h3>
                        <p className="text-xs text-[#5A564D] leading-relaxed">
                            Connect with an atelier specialist for questions regarding fabric drape, sizing measurements, or custom trousers inseam specifications.
                        </p>
                        <div className="p-3.5 bg-[#F5F2EB] border border-[#E5DFD3] text-xs text-[#1A1917] space-y-1.5">
                            <div className="flex justify-between font-medium">
                                <span>Atelier Hours</span>
                                <span>09:00 — 20:00 CET</span>
                            </div>
                            <div className="flex justify-between font-medium">
                                <span>Typical Response</span>
                                <span>&lt; 3 minutes</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLiveChatOpen(false)}
                            className="w-full py-3 bg-[#1A1917] text-[#FBF9F5] text-xs font-semibold tracking-[0.2em] uppercase cursor-pointer"
                        >
                            START SESSION
                        </button>
                    </div>
                </div>
            )}

            {/* ─── EDITORIAL FOOTER (Matching Homepage) ───────────────────────── */}
            <footer className="border-t border-[#ECE7DD] bg-[#F5F2EB] pt-14 pb-12 mt-16 text-[#1A1917] font-interface-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">

                        {/* Column 1: Brand Manifesto */}
                        <div className="space-y-3">
                            <span className="font-editorial-serif text-xl sm:text-2xl font-normal tracking-[0.18em] uppercase block text-[#1A1917]">
                                NORTHLINE
                            </span>
                            <p className="text-xs text-[#5A564D] leading-relaxed max-w-xs">
                                Architectural menswear crafted with unhurried precision, quiet tactile luxury, and sustainable European cloth.
                            </p>
                        </div>

                        {/* Column 2: Collections */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                COLLECTIONS
                            </h4>
                            <ul className="space-y-2 text-xs text-[#1A1917]">
                                <li>
                                    <Link to="/#capsule-section" className="hover:text-[#4A5340]">Tailored Outerwear</Link>
                                </li>
                                <li>
                                    <Link to="/#capsule-section" className="hover:text-[#4A5340]">Structured Trousers</Link>
                                </li>
                                <li>
                                    <Link to="/#catalog-section" className="hover:text-[#4A5340]">Supima Knitwear</Link>
                                </li>
                                <li>
                                    <Link to="/#catalog-section" className="hover:text-[#4A5340]">Atelier Footwear</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Editorial & Atelier */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                EDITORIAL &amp; ATELIER
                            </h4>
                            <ul className="space-y-2 text-xs text-[#1A1917]">
                                <li>
                                    <span className="hover:text-[#4A5340] cursor-pointer">The Journal</span>
                                </li>
                                <li>
                                    <span className="hover:text-[#4A5340] cursor-pointer">Material Transparency</span>
                                </li>
                                <li>
                                    <span className="hover:text-[#4A5340] cursor-pointer">Circular Repair Care</span>
                                </li>
                                <li>
                                    <span className="hover:text-[#4A5340] cursor-pointer">Bespoke Fitting</span>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Region & Currency */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                REGION &amp; CURRENCY
                            </h4>
                            <p className="text-xs font-semibold text-[#1A1917]">
                                UNITED STATES (USD $)
                            </p>
                            <p className="text-[11px] text-[#6C685F] leading-normal">
                                Duties &amp; local sales taxes calculated at checkout.
                            </p>
                        </div>

                    </div>

                    {/* Bottom Legal Line */}
                    <div className="pt-8 border-t border-[#E8E2D6] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6C685F]">
                        <p>© 2026 NORTHLINE Menswear Studio. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <span className="hover:text-[#1A1917] cursor-pointer">Sustainability Pledge</span>
                            <span className="hover:text-[#1A1917] cursor-pointer">Privacy</span>
                            <span className="hover:text-[#1A1917] cursor-pointer">Terms</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
