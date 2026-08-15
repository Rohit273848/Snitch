import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import { useSelector } from "react-redux";

// ─── Google Fonts loader ──────────────────────────────────────────────────────
function FontLoader() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
}

// ─── Currency symbol helper ──────────────────────────────────────────────────
const currencySymbol = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function BackArrowIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

function PackageIcon({ className = "w-8 h-8" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

function AlertIcon({ className = "w-6 h-6" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
    );
}

function UserBadgeIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function ShieldCheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
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

// ─── Standalone Product Details Page Component ────────────────────────────────
export default function ProductModal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();

    const [product, setProduct] = useState(null);
    const [selectedImg, setSelectedImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [error, setError] = useState(null);
    const [mounted, setMounted] = useState(false);

    const user = useSelector(state => state.auth.user);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!id) return;
        setLoadingProduct(true);
        setError(null);
        handleGetProductById(id)
            .then((data) => {
                setProduct(data);
            })
            .catch((err) => {
                setError(err?.response?.data?.message || "Failed to load product details.");
            })
            .finally(() => {
                setLoadingProduct(false);
            });
    }, [id]);

    const symbol = currencySymbol[product?.price?.currency] ?? product?.price?.currency ?? "₹";
    const formattedPrice = Number(product?.price?.amount || 0).toLocaleString("en-IN");
    const sellerName = product?.seller?.username || product?.seller?.name || product?.seller?.email || "Verified Seller";

    return (
        <>
            <FontLoader />

            <style>{`
                *, *::before, *::after { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }

                @keyframes contentIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .content-in { animation: contentIn 0.6s cubic-bezier(0.22,1,0.36,1) both; }
            `}</style>

            <main className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col selection:bg-yellow-500 selection:text-black">
                
                {/* ══════════════════════════════════════════════
                    1. TOP NAVIGATION BAR
                ══════════════════════════════════════════════ */}
                <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-zinc-900 px-6 sm:px-10 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        {/* Back to Products link */}
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-yellow-500 transition-colors cursor-pointer"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            <BackArrowIcon className="w-4 h-4" />
                            <span>Back</span>
                        </button>

                        <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

                        {/* Brand Logo */}
                        <Link to="/" className="inline-flex items-center gap-2.5 group">
                            <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-all">
                                S
                            </span>
                            <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                SNITCH
                            </span>
                        </Link>
                    </div>

                    {/* Navigation Actions */}
                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden md:flex items-center gap-2 text-zinc-400 text-xs font-mono">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[11px] tracking-wide text-zinc-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {user.email} <span className="text-yellow-500">({user.role})</span>
                                </span>
                            </div>
                        )}

                        {user?.role === "seller" && (
                            <Link to="/seller/dashboard" className="text-[11px] uppercase font-bold tracking-widest text-yellow-500 hover:text-yellow-400 border border-yellow-500/30 hover:border-yellow-500/60 px-4 py-2 transition-all">
                                Dashboard
                            </Link>
                        )}
                    </div>
                </header>

                {/* ══════════════════════════════════════════════
                    2. MAIN PRODUCT CONTENT
                ══════════════════════════════════════════════ */}
                <div className={`flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-10 ${mounted ? "content-in" : "opacity-0"}`}>
                    
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-8 text-[10px] uppercase tracking-[0.2em] font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <Link to="/" className="text-zinc-500 hover:text-zinc-300">Storefront</Link>
                        <span className="text-zinc-800">/</span>
                        <span className="text-zinc-500">Product</span>
                        <span className="text-zinc-800">/</span>
                        <span className="text-yellow-500 truncate max-w-[200px]">{product?.title || "Details"}</span>
                    </div>

                    {/* Loading State */}
                    {loadingProduct && (
                        <div className="flex flex-col items-center justify-center py-32 space-y-4">
                            <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Loading Product Drop...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loadingProduct && error && (
                        <div className="flex flex-col items-center justify-center py-28 px-6 border border-red-500/20 bg-red-500/5">
                            <AlertIcon className="w-8 h-8 text-red-400 mb-4" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Product Not Found</h2>
                            <p className="text-xs text-zinc-400 text-center max-w-md mb-6">{error}</p>
                            <button
                                onClick={() => navigate("/")}
                                className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-widest transition-all"
                            >
                                Return to Storefront
                            </button>
                        </div>
                    )}

                    {/* Full Product Details Layout */}
                    {!loadingProduct && !error && product && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14">
                            
                            {/* LEFT COLUMN: Gallery & Images (7 cols) */}
                            <div className="lg:col-span-7 flex flex-col gap-4">
                                
                                {/* Main Image Preview */}
                                <div className="relative aspect-square bg-[#0e0e0e] border border-zinc-800 overflow-hidden group">
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={product.images[selectedImg]?.url ?? product.images[selectedImg]}
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <PackageIcon className="w-16 h-16 text-zinc-800" />
                                        </div>
                                    )}

                                    {/* Verified Seller Badge Overlay */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/80 text-yellow-500 text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5 backdrop-blur-md border border-zinc-800"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        <UserBadgeIcon className="w-3.5 h-3.5 text-yellow-500" />
                                        <span>Listed by: {sellerName}</span>
                                    </div>
                                </div>

                                {/* Image Thumbnails Carousel */}
                                {product.images && product.images.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {product.images.map((img, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImg(i)}
                                                className={`w-20 h-20 flex-shrink-0 border transition-all cursor-pointer bg-[#0e0e0e] ${
                                                    selectedImg === i ? "border-yellow-500 scale-95" : "border-zinc-800 opacity-60 hover:opacity-100"
                                                }`}
                                            >
                                                <img src={img?.url ?? img} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Specifications & Buying Actions (5 cols) */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                                <div className="space-y-6">
                                    
                                    {/* Seller Tag */}
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[10px] font-semibold tracking-wider uppercase"
                                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        <UserBadgeIcon className="w-3.5 h-3.5" />
                                        <span>Official Seller Release</span>
                                    </div>

                                    {/* Product Title */}
                                    <div>
                                        <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-[-0.03em] leading-tight mb-3">
                                            {product.title}
                                        </h1>
                                        <div className="h-1 w-16 bg-yellow-500" />
                                    </div>

                                    {/* Price Box */}
                                    <div className="bg-[#0e0e0e] border border-zinc-900 p-5 flex items-baseline justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                Listed Price
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl sm:text-3xl font-black text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                    {symbol}{formattedPrice}
                                                </span>
                                                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
                                                    {product.price?.currency || "INR"}
                                                </span>
                                            </div>
                                        </div>

                                        <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
                                            In Stock
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <h3 className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-bold" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                            Product Overview
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-light whitespace-pre-line border-l-2 border-zinc-800 pl-4 py-1">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Quantity Counter */}
                                    <div className="flex items-center gap-4 pt-2">
                                        <span className="text-xs uppercase tracking-widest text-zinc-400 font-mono">Quantity:</span>
                                        <div className="flex items-center border border-zinc-800 bg-[#0e0e0e]">
                                            <button 
                                                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center text-xs font-bold font-mono">{quantity}</span>
                                            <button 
                                                onClick={() => setQuantity(q => q + 1)}
                                                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                {/* Purchase Action Buttons */}
                                <div className="space-y-4 pt-6 border-t border-zinc-900">
                                    <button 
                                        className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[13px] tracking-[0.14em] uppercase flex items-center justify-center gap-3 transition-all cursor-pointer group"
                                        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                                    >
                                        <span>Add To Bag</span>
                                    </button>

                                    {/* Trust & Guarantee Badges */}
                                    <div className="grid grid-cols-2 gap-3 pt-4">
                                        <div className="flex items-center gap-2 p-3 bg-[#0e0e0e] border border-zinc-900">
                                            <ShieldCheckIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">100% Authentic Drop</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-3 bg-[#0e0e0e] border border-zinc-900">
                                            <TruckIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                                            <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Direct Seller Express</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    )}

                </div>

            </main>
        </>
    );
}
