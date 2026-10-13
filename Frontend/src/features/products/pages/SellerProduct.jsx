import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import { useSelector } from "react-redux";

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
function PlusIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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

function TrashIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

function SearchIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function EditIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    );
}

// ─── Product Card (Matching Light Snitch Aesthetic) ───────────────────────────
function ProductCard({ product, onDeleteCard }) {
    const symbol = currencySymbol[product.price?.currency] ?? product.price?.currency ?? "₹";
    const formattedPrice = Number(product.price?.amount || 0).toLocaleString("en-IN");

    const coverImage =
        product.images?.find((img) => img?.isCover)?.url ||
        product.images?.[0]?.url ||
        product.images?.[0] ||
        "";

    return (
        <div className="group bg-white border border-zinc-200 hover:border-black rounded-2xl overflow-hidden transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between relative select-none">
            {/* Top Image Box */}
            <div className="relative aspect-[3/4] bg-[#f4f4f5] overflow-hidden">
                {coverImage ? (
                    <img
                        src={coverImage}
                        alt={product.title}
                        loading="lazy"
                        className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-400">
                        <PackageIcon className="w-10 h-10" />
                    </div>
                )}

                {/* Multiple Images Badge */}
                {product.images && product.images.length > 1 && (
                    <span
                        className="absolute bottom-2.5 right-2.5 text-[9px] font-mono-code tracking-wider uppercase bg-black/75 text-white px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs"
                    >
                        +{product.images.length - 1} photos
                    </span>
                )}

                {/* Quick Delete Action Button (Floating Top Right) */}
                <button
                    type="button"
                    onClick={(e) => onDeleteCard(e, product._id, product.title)}
                    title="Delete product"
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 backdrop-blur-sm shadow-xs flex items-center justify-center transition-all hover:scale-110 active:scale-95 cursor-pointer z-10"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>

                {/* Category Pill (Floating Top Left) */}
                {product.category && (
                    <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/90 text-zinc-900 text-[10px] font-mono-code font-bold uppercase tracking-wider shadow-xs backdrop-blur-sm">
                        {product.category}
                    </span>
                )}
            </div>

            {/* Card Content */}
            <div className="p-4 space-y-2">
                {/* Title */}
                <h3 className="text-sm font-bold text-zinc-950 truncate tracking-tight uppercase group-hover:text-black transition-colors">
                    {product.title}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 font-normal">
                    {product.description || "No description provided for this listing."}
                </p>

                {/* Price & Variant Pill Footer */}
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <div className="flex items-baseline gap-0.5 font-mono-code">
                        <span className="text-[11px] text-zinc-500">{symbol}</span>
                        <span className="text-base font-bold text-zinc-950 tracking-tight">
                            {formattedPrice}
                        </span>
                    </div>

                    {/* Manage Link Hint */}
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono-code font-bold uppercase tracking-wider text-zinc-500 group-hover:text-black transition-colors">
                        <EditIcon className="w-3 h-3" />
                        <span>Manage</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function ProductSkeleton() {
    return (
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden animate-pulse">
            <div className="aspect-[3/4] bg-zinc-200" />
            <div className="p-4 space-y-3">
                <div className="h-4 bg-zinc-200 rounded-sm w-3/4" />
                <div className="space-y-1.5">
                    <div className="h-2.5 bg-zinc-200 rounded-sm w-full" />
                    <div className="h-2.5 bg-zinc-200 rounded-sm w-4/5" />
                </div>
                <div className="h-4 bg-zinc-200 rounded-sm w-1/3 pt-2" />
            </div>
        </div>
    );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyProducts() {
    return (
        <div className="bg-white border border-zinc-200 rounded-3xl p-10 sm:p-16 text-center max-w-xl mx-auto space-y-5 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <PackageIcon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950">
                    No Products Listed Yet
                </h2>
                <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto font-normal leading-relaxed">
                    You haven't added any products to your seller studio catalog yet. Publish your first drop with custom variety colors and sizes.
                </p>
            </div>

            <div className="pt-2">
                <Link
                    to="/seller/create-product"
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg font-mono-code cursor-pointer"
                >
                    <PlusIcon className="w-4 h-4" />
                    <span>Create First Product</span>
                </Link>
            </div>
        </div>
    );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
    return (
        <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center max-w-md mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                <AlertIcon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-zinc-950 uppercase tracking-tight">
                Unable to Load Products
            </h2>
            <p className="text-xs text-zinc-500 font-mono-code">
                Something went wrong while retrieving your listings.
            </p>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase rounded-full font-mono-code cursor-pointer"
                >
                    Try Again
                </button>
            )}
        </div>
    );
}

// ─── Main Seller Products Dashboard Component ─────────────────────────────────
export default function SellerProduct() {
    const [fetchError, setFetchError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const { handleGetSellerProduct, handleDeleteSellerProduct } = useProduct();
    const products = useSelector((state) => state.product.sellerProduct || []);
    const loading = useSelector((state) => state.product.loading);

    const loadProducts = () => {
        setFetchError(null);
        handleGetSellerProduct().catch((err) => {
            setFetchError(err?.response?.data?.message || "Failed to load products");
        });
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleDeleteCard = async (e, productId, title) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete "${title || "this product"}"?`)) {
            return;
        }
        try {
            await handleDeleteSellerProduct(productId);
            await handleGetSellerProduct();
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete product");
        }
    };

    // Filter products by search query
    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        if (!searchQuery.trim()) return products;
        const q = searchQuery.toLowerCase().trim();
        return products.filter(
            (p) =>
                p.title?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q)
        );
    }, [products, searchQuery]);

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
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-in-entry {
                    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
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
                            <span>Return to Storefront</span>
                        </Link>

                        {/* Status Indicator */}
                        <div className="flex items-center gap-2 text-zinc-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-medium text-[11px] uppercase tracking-wider">
                                Seller Studio Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── Main Content Container ─────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12 fade-in-entry space-y-8">

                    {/* Page Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
                        <div>
                            <div className="flex items-center gap-2 text-[11px] font-mono-code uppercase tracking-widest text-zinc-500 mb-1">
                                <span>Seller Studio</span>
                                <span>/</span>
                                <span className="text-black font-bold">Catalog Management</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950">
                                My Products
                            </h1>
                            <p className="text-xs text-zinc-500 mt-1 font-normal">
                                Manage and monitor your catalog drops, update variety stock, and create new releases.
                            </p>
                        </div>

                        {/* Top Action & Create CTA */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <Link
                                to="/seller/create-product"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg font-mono-code cursor-pointer active:scale-95"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Create Product</span>
                            </Link>
                        </div>
                    </div>

                    {/* Stats Metric Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
                            <span className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 block mb-1">
                                Total Listings
                            </span>
                            <span className="text-2xl sm:text-3xl font-black text-zinc-950 font-mono-code">
                                {loading ? "—" : products.length}
                            </span>
                        </div>

                        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
                            <span className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 block mb-1">
                                Catalog Status
                            </span>
                            <div className="flex items-center gap-1.5 pt-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span className="text-sm font-bold text-zinc-950 font-mono-code uppercase">
                                    Live & Verified
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
                            <span className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 block mb-1">
                                Storefront Brand
                            </span>
                            <span className="text-sm font-bold text-zinc-950 font-mono-code uppercase pt-1 block truncate">
                                Snitch Independent
                            </span>
                        </div>

                        <div className="p-4 bg-white border border-zinc-200 rounded-2xl shadow-xs">
                            <span className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 block mb-1">
                                Fast Actions
                            </span>
                            <Link
                                to="/seller/create-product"
                                className="text-xs font-bold text-black hover:underline uppercase font-mono-code pt-1 block"
                            >
                                + Add Variety Drops →
                            </Link>
                        </div>
                    </div>

                    {/* Filter / Search Bar */}
                    {products.length > 0 && (
                        <div className="flex items-center justify-between gap-4 pt-2">
                            <div className="relative flex-1 max-w-sm">
                                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products by title or category..."
                                    className="w-full h-10 pl-10 pr-4 bg-white border border-zinc-200 rounded-full text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all"
                                />
                            </div>

                            <span className="text-xs font-mono-code text-zinc-500 hidden sm:inline">
                                Showing <strong>{filteredProducts.length}</strong> of {products.length} products
                            </span>
                        </div>
                    )}

                    {/* ── LOADING STATE ── */}
                    {loading && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <ProductSkeleton key={i} />
                            ))}
                        </div>
                    )}

                    {/* ── ERROR STATE ── */}
                    {!loading && fetchError && <ErrorState onRetry={loadProducts} />}

                    {/* ── EMPTY STATE ── */}
                    {!loading && !fetchError && products.length === 0 && <EmptyProducts />}

                    {/* ── PRODUCT GRID ── */}
                    {!loading && !fetchError && products.length > 0 && (
                        <>
                            {filteredProducts.length === 0 ? (
                                <div className="py-16 text-center border border-dashed border-zinc-300 rounded-2xl bg-zinc-50 p-6 space-y-3">
                                    <p className="text-xs font-mono-code uppercase tracking-wider text-zinc-500">
                                        No products matched "{searchQuery}"
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="text-xs font-bold underline font-mono-code uppercase cursor-pointer"
                                    >
                                        Clear Search
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {filteredProducts.map((product) => (
                                        <Link
                                            key={product._id}
                                            to={`/seller/product/${product._id}`}
                                            className="block h-full cursor-pointer"
                                        >
                                            <ProductCard product={product} onDeleteCard={handleDeleteCard} />
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    )}

                </div>

                {/* ─── Snitch Store Footer (Matching Home.jsx) ────────────────── */}
                <footer className="mt-16 border-t border-zinc-200 bg-white py-10 px-4 sm:px-8 text-center text-xs text-zinc-500 space-y-2 font-mono-code">
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-black">
                            S
                        </span>
                        <span className="font-bold text-zinc-900 tracking-widest uppercase">
                            SNITCH STUDIO
                        </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                        Seller dashboard for independent fashion creators and verified streetwear brands.
                    </p>
                </footer>

            </main>
        </>
    );
}
