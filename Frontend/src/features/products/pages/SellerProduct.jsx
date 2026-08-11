import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js"
import { useSelector } from "react-redux";

// ─── Google Fonts loader ──────────────────────────────────────────────────────
function FontLoader() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
}


// ─── Currency symbol helper — UI only ────────────────────────────────────────
const currencySymbol = { INR: "₹", USD: "$", EUR: "€" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function PlusIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function ArrowIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
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

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }) {



    // TODO: Replace these values with the real product object.
    // product.title
    // product.description
    // product.priceAmount
    // product.priceCurrency
    // product.images
    const symbol =
        currencySymbol[product.price?.currency] ??
        product.price?.currency;

    const formattedPrice =
        Number(product.price?.amount).toLocaleString("en-IN");



    return (
        <div className="group border border-zinc-900 hover:border-zinc-700 bg-[#0e0e0e] transition-all duration-300 cursor-default">
            {/* Product image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                {/* TODO: Use product.images from the API response.
                    TODO: Decide which product image should be used as the card thumbnail.
                    (e.g. product.images[0].url or product.images[0]) */}
                {product.images && product.images.length > 0 ? (
                    <img
                        src={product.images[0].url ?? product.images[0]}
                        alt={product.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    // Fallback when no image is available
                    <div className="h-full w-full flex items-center justify-center">
                        <PackageIcon className="w-10 h-10 text-zinc-700" />
                    </div>
                )}
                {/* Image count badge */}
                {product.images && product.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 text-[9px] tracking-widest uppercase bg-black/70 text-zinc-400 px-1.5 py-0.5 backdrop-blur-sm"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        +{product.images.length - 1} more
                    </span>
                )}
            </div>

            {/* Card content */}
            <div className="p-4 space-y-2">
                {/* Title */}
                {/* TODO: Replace with product.title */}
                <h3 className="text-sm font-semibold text-white truncate tracking-wide group-hover:text-yellow-500 transition-colors duration-200">
                    {product.title}
                </h3>

                {/* Description */}
                {/* TODO: Replace with product.description */}
                <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2">
                    {product.description}
                </p>

                {/* Price */}
                <div className="pt-1 flex items-baseline gap-1">
                    {/* TODO: Replace with product.priceAmount and product.priceCurrency */}
                    <span className="text-[11px] text-zinc-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {symbol}
                    </span>
                    <span className="text-base font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {formattedPrice}
                    </span>
                    <span className="text-[9px] text-zinc-700 uppercase tracking-widest ml-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        {product.price?.currency}
                    </span>
                </div>
            </div>

            {/* Bottom accent line — animates on hover */}
            <div className="h-[2px] w-0 group-hover:w-full bg-yellow-500 transition-all duration-300" />
        </div>
    );
}

// ─── Product Skeleton (loading state) ────────────────────────────────────────
// TODO: Connect this loading state to your Redux loading state.
// Example:
// const loading = useSelector((state) => state.product.loading);
// Show <ProductSkeleton /> when loading is true.
function ProductSkeleton() {
    return (
        <div className="border border-zinc-900 animate-pulse">
            <div className="aspect-[4/3] bg-zinc-900" />
            <div className="p-4 space-y-3">
                <div className="h-3 bg-zinc-800 rounded-sm w-3/4" />
                <div className="space-y-1.5">
                    <div className="h-2 bg-zinc-900 rounded-sm w-full" />
                    <div className="h-2 bg-zinc-900 rounded-sm w-5/6" />
                </div>
                <div className="h-4 bg-zinc-800 rounded-sm w-1/3 mt-2" />
            </div>
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
// TODO: Replace this mock condition with the real products array.
// Show this state when the real seller product list is empty.
function EmptyProducts() {
    return (
        <div className="flex flex-col items-center justify-center py-28 px-6">
            {/* Icon container */}
            <div className="w-20 h-20 border border-zinc-800 flex items-center justify-center mb-8 relative">
                <PackageIcon className="w-8 h-8 text-zinc-700" />
                {/* Decorative corner */}
                <div className="absolute -top-px -right-px w-4 h-4 border-t border-r border-yellow-500/50" />
                <div className="absolute -bottom-px -left-px w-4 h-4 border-b border-l border-yellow-500/50" />
            </div>

            <h2 className="text-2xl font-black tracking-[-0.03em] text-white uppercase mb-3">
                No products yet
            </h2>
            <div className="flex items-center gap-4 mb-6">
                <div className="h-[1px] w-8 bg-yellow-500" />
                <p className="text-[12px] text-zinc-500 tracking-wide text-center">
                    Create your first product to get started.
                </p>
                <div className="h-[1px] w-8 bg-yellow-500" />
            </div>

            {/* CTA button — matches Register style */}
            <Link
                to="/seller/create-product"
                className="group h-12 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-bold text-[12px] tracking-[0.12em] uppercase flex items-center justify-between px-6 transition-all duration-200"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
            >
                <span>Create Product</span>
                <ArrowIcon className="w-3.5 h-3.5 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            {/* Button reflection */}
            <div
                className="w-full max-w-[180px] h-1 bg-yellow-500/20 mt-px"
                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
            />
        </div>
    );
}

// ─── Error State ──────────────────────────────────────────────────────────────
// TODO: Replace this mock error state with your real API error state.
function ErrorState() {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-16 h-16 border border-red-500/20 flex items-center justify-center mb-6">
                <AlertIcon className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-2">
                Something went wrong
            </h2>
            <p className="text-[12px] text-zinc-500 tracking-wide text-center max-w-[240px]">
                Unable to load your products. Please try again.
            </p>
        </div>
    );
}

// ─── Seller Products Page ─────────────────────────────────────────────────────
export default function SellerProduct() {
    const [mounted, setMounted] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    const { handleGetSellerProduct } = useProduct();
    const products = useSelector(
        state => state.product.sellerProduct
    )

    const loading = useSelector(
        state => state.product.loading
    )

    useEffect(() => {
        handleGetSellerProduct().catch((err) => {
            setFetchError(
                err?.response?.data?.message ||
                "Failed to load products"
            );
        });
    }, []);


    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <FontLoader />

            <style>{`
        *, *::before, *::after { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }

        @keyframes panelIn {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes contentIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.12; }
        }

        .marquee-track { animation: marquee 22s linear infinite; }
        .s-glow        { animation: pulse-glow 5s ease-in-out infinite; }
        .panel-in      { animation: panelIn 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .content-in    { animation: contentIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
        .card-grid > * { animation: contentIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

            <main
                className="min-h-screen w-full flex bg-[#0a0a0a] selection:bg-yellow-500 selection:text-black"
                style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
                {/* ══════════════════════════════════════════════
                    LEFT PANEL — editorial sidebar
                    (matches Register and CreateProduct pages)
                ══════════════════════════════════════════════ */}
                <div className={`hidden lg:flex flex-col relative w-[28%] xl:w-[24%] min-h-screen bg-[#0a0a0a] border-r border-zinc-900 overflow-hidden flex-shrink-0 ${mounted ? "panel-in" : "opacity-0"}`}>

                    {/* Giant watermark 'S' */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <span
                            className="s-glow text-[30vw] font-black text-white leading-none tracking-tighter"
                            style={{ opacity: 0.05 }}
                        >
                            S
                        </span>
                    </div>

                    {/* Scrolling marquee */}
                    <div className="absolute left-6 top-0 bottom-0 w-5 overflow-hidden pointer-events-none select-none opacity-[0.07]">
                        <div className="marquee-track flex flex-col gap-8">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <span key={i} className="text-[9px] tracking-[0.4em] uppercase text-white"
                                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "'JetBrains Mono', monospace" }}>
                                    SNITCH — WEAR THE FUTURE —
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Decorative corners */}
                    <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-zinc-800 pointer-events-none" />
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-zinc-800 pointer-events-none" />

                    {/* Logo */}
                    <div className="relative z-10 flex items-center justify-between px-8 pt-10">
                        <Link to="/" className="inline-flex items-center gap-2.5 group">
                            <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow duration-300">
                                S
                            </span>
                            <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                SNITCH
                            </span>
                        </Link>
                    </div>

                    {/* Sidebar content */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center px-8 xl:px-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px w-8 bg-yellow-500" />
                            <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                03 / Dashboard
                            </span>
                        </div>

                        <h2 className="text-4xl xl:text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white mb-8 uppercase">
                            My<br />
                            <span className="text-yellow-500">Prod</span><br />
                            ucts.
                        </h2>

                        <p className="text-sm text-zinc-500 leading-relaxed max-w-[220px] mb-10 font-light tracking-wide">
                            Manage your listings, track your store, and keep your products fresh.
                        </p>

                        {/* Stats row — UI only */}
                        <div className="space-y-4">
                            <div className="border border-zinc-900 p-4">
                                {/* TODO: Replace with real product count from Redux state */}
                                <p className="text-2xl font-black text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {loading ? "—" : products.length}
                                </p>
                                <p className="text-[10px] tracking-[0.15em] uppercase text-zinc-600 mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Total Listings
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="relative z-10 px-8 pb-10">
                        <div className="h-px w-full bg-zinc-900 mb-6" />
                        <p className="text-[9px] tracking-[0.15em] uppercase text-zinc-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            © {new Date().getFullYear()} SNITCH Inc.
                        </p>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════
                    MAIN CONTENT — product grid
                ══════════════════════════════════════════════ */}
                <div className="flex-1 min-h-screen bg-[#0e0e0e] flex flex-col overflow-y-auto">

                    {/* Mobile logo */}
                    <div className="lg:hidden flex items-center justify-between px-6 pt-8 pb-4 border-b border-zinc-900">
                        <Link to="/" className="inline-flex items-center gap-2.5">
                            <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base">
                                S
                            </span>
                            <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                SNITCH
                            </span>
                        </Link>
                    </div>

                    {/* Page header */}
                    <div className={`px-6 sm:px-10 pt-12 pb-8 border-b border-zinc-900 ${mounted ? "content-in" : "opacity-0"}`}>

                        {/* Breadcrumb */}
                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Seller
                            </span>
                            <span className="text-zinc-800">/</span>
                            <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Products
                            </span>
                        </div>

                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            {/* Title */}
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] text-white leading-[0.95] uppercase mb-4">
                                    My Products
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="h-[2px] w-10 bg-yellow-500" />
                                    <p className="text-[12px] text-zinc-500 tracking-wide">
                                        View the products you've created.
                                    </p>
                                </div>
                            </div>

                            {/* Create Product CTA button */}
                            {/* This Link uses the existing /create route from app.routers.jsx */}
                            <Link
                                to="/seller/create-product"
                                className="group flex-shrink-0 h-12 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-bold text-[12px] tracking-[0.12em] uppercase flex items-center gap-2.5 px-5 transition-all duration-200"
                                style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                            >
                                <PlusIcon className="w-3.5 h-3.5" />
                                <span>Create Product</span>
                            </Link>
                        </div>
                    </div>

                    {/* Main body */}
                    <div className={`flex-1 px-6 sm:px-10 py-10 ${mounted ? "content-in" : "opacity-0"}`}>

                        {/* ── LOADING STATE ── */}

                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* ── ERROR STATE ── */}

                        {!loading && fetchError && <ErrorState />}

                        {/* ── EMPTY STATE ── */}
                        {/* TODO: Replace this mock condition with the real products array.
                            Show this state when the real seller product list is empty.
                            Example:
                            (!loading && !error && products.length === 0) */}
                        {!loading && !fetchError && products.length === 0 && <EmptyProducts />}

                        {/* ── PRODUCT GRID ── */}
                        {/* TODO: Replace mockProducts with the real products from Redux/API.
                            The real data should come from your useProduct() hook. */}
                        {!loading && !fetchError && products.length > 0 && (
                            <div className="space-y-6">
                                {/* Count label */}
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-zinc-900" />
                                    <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        {products.length} product{products.length !== 1 ? "s" : ""}
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-900" />
                                </div>

                                {/* Grid */}
                                <div className="card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">

                                    {products.map((product, i) => (
                                        <div key={product._id} style={{ animationDelay: `${i * 60}ms` }}>

                                            <ProductCard product={product} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
