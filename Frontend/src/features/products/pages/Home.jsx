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
            "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
}

// ─── Currency symbol helper ──────────────────────────────────────────────────
const currencySymbol = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function SearchIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function SortIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-3L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
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

function XIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

// ─── Product Card Component ───────────────────────────────────────────────────
function ProductCard({ product, onClick }) {
    const symbol = currencySymbol[product.price?.currency] ?? product.price?.currency ?? "₹";
    const formattedPrice = Number(product.price?.amount || 0).toLocaleString("en-IN");
    
    // Extract seller display name
    const sellerName = product.seller?.username || product.seller?.name || product.seller?.email?.split('@')[0] || "Verified Seller";

    return (
        <div 
            onClick={() => onClick(product)}
            className="group border border-zinc-900 hover:border-zinc-700 bg-[#0e0e0e] transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
            <div>
                {/* Product image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0]?.url ?? product.images[0]}
                            alt={product.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <PackageIcon className="w-10 h-10 text-zinc-700" />
                        </div>
                    )}
                    
                    {/* Seller Tag Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 text-yellow-500 text-[10px] tracking-wider uppercase px-2 py-1 backdrop-blur-md border border-zinc-800"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <UserBadgeIcon className="w-3 h-3" />
                        <span className="truncate max-w-[110px]">{sellerName}</span>
                    </div>

                    {/* Image count badge */}
                    {product.images && product.images.length > 1 && (
                        <span 
                            className="absolute bottom-2 right-2 text-[9px] tracking-widest uppercase bg-black/80 text-zinc-300 px-1.5 py-0.5 backdrop-blur-sm border border-zinc-800"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            +{product.images.length - 1} MORE
                        </span>
                    )}
                </div>

                {/* Card content */}
                <div className="p-4 space-y-2">
                    <h3 className="text-sm font-bold text-white truncate tracking-wide group-hover:text-yellow-500 transition-colors duration-200 uppercase">
                        {product.title}
                    </h3>

                    <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-2 font-light">
                        {product.description}
                    </p>

                    <div className="pt-2 flex items-baseline gap-1">
                        <span className="text-[11px] text-zinc-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {symbol}
                        </span>
                        <span className="text-base font-extrabold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {formattedPrice}
                        </span>
                        <span className="text-[9px] text-zinc-600 uppercase tracking-widest ml-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            {product.price?.currency || "INR"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-[2px] w-0 group-hover:w-full bg-yellow-500 transition-all duration-300" />
        </div>
    );
}

// ─── Product Skeleton ─────────────────────────────────────────────────────────
function ProductSkeleton() {
    return (
        <div className="border border-zinc-900 animate-pulse bg-[#0e0e0e]">
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
function EmptyProducts({ onReset }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6 border border-dashed border-zinc-900 bg-[#0c0c0c]/50">
            <div className="w-16 h-16 border border-zinc-800 flex items-center justify-center mb-6 relative">
                <PackageIcon className="w-8 h-8 text-zinc-700" />
                <div className="absolute -top-px -right-px w-3 h-3 border-t border-r border-yellow-500/50" />
                <div className="absolute -bottom-px -left-px w-3 h-3 border-b border-l border-yellow-500/50" />
            </div>

            <h2 className="text-xl font-black tracking-tight text-white uppercase mb-2">
                No Drops Found
            </h2>
            <p className="text-[12px] text-zinc-500 tracking-wide text-center max-w-[280px] mb-6">
                There are no products matching your search criteria or no listings uploaded yet.
            </p>

            {onReset && (
                <button
                    onClick={onReset}
                    className="h-10 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[11px] tracking-[0.12em] uppercase px-5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
                    style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                >
                    <span>Clear Search Filter</span>
                </button>
            )}
        </div>
    );
}

// ─── Error State ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 px-6">
            <div className="w-16 h-16 border border-red-500/20 flex items-center justify-center mb-6">
                <AlertIcon className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-2">
                Failed to Load Products
            </h2>
            <p className="text-[12px] text-zinc-500 tracking-wide text-center max-w-[280px] mb-6">
                Unable to retrieve the seller product catalog. Please verify your connection.
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs uppercase tracking-widest border border-zinc-800 transition-colors cursor-pointer"
                >
                    Retry Loading
                </button>
            )}
        </div>
    );
}

// ─── Product Quick Detail Modal ──────────────────────────────────────────────
function ProductModal({ product, onClose }) {
    const [selectedImg, setSelectedImg] = useState(0);

    if (!product) return null;

    const symbol = currencySymbol[product.price?.currency] ?? product.price?.currency ?? "₹";
    const formattedPrice = Number(product.price?.amount || 0).toLocaleString("en-IN");
    const sellerName = product.seller?.username || product.seller?.name || product.seller?.email || "Seller";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-[#0a0a0a] border border-zinc-800 overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                    <XIcon className="w-4 h-4" />
                </button>

                {/* Left: Images Showcase */}
                <div className="w-full md:w-1/2 bg-[#0e0e0e] border-b md:border-b-0 md:border-r border-zinc-900 p-6 flex flex-col justify-between">
                    <div className="relative aspect-square bg-zinc-950 overflow-hidden border border-zinc-900 mb-4">
                        {product.images && product.images.length > 0 ? (
                            <img 
                                src={product.images[selectedImg]?.url ?? product.images[selectedImg]} 
                                alt={product.title} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <PackageIcon className="w-12 h-12 text-zinc-800" />
                            </div>
                        )}
                    </div>

                    {/* Image Thumbnails */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {product.images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImg(i)}
                                    className={`w-14 h-14 flex-shrink-0 border transition-all cursor-pointer ${
                                        selectedImg === i ? "border-yellow-500 scale-95" : "border-zinc-800 opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <img src={img?.url ?? img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Meta & Purchase Info */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                    <div className="space-y-6">
                        {/* Seller Pill */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 text-[11px] font-medium tracking-wider uppercase"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                            <UserBadgeIcon className="w-3.5 h-3.5" />
                            <span>Listed by: {sellerName}</span>
                        </div>

                        {/* Title */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-2">
                                {product.title}
                            </h2>
                            <div className="h-0.5 w-12 bg-yellow-500" />
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-bold text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {symbol}{formattedPrice}
                            </span>
                            <span className="text-xs text-zinc-600 uppercase tracking-widest" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                {product.price?.currency || "INR"}
                            </span>
                        </div>

                        {/* Description */}
                        <div>
                            <h4 className="text-[10px] tracking-[0.2em] uppercase text-zinc-500 mb-2" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                Product Details
                            </h4>
                            <p className="text-xs text-zinc-400 leading-relaxed font-light whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="pt-8 space-y-3 border-t border-zinc-900 mt-6">
                        <button 
                            className="w-full h-12 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[12px] tracking-[0.12em] uppercase flex items-center justify-between px-6 transition-all cursor-pointer"
                            style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                        >
                            <span>Add To Bag</span>
                            <ArrowIcon className="w-4 h-4" />
                        </button>

                        <button 
                            onClick={onClose}
                            className="w-full h-10 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs tracking-widest uppercase transition-colors cursor-pointer"
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest"); // "newest", "price-low", "price-high", "title"
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { handleGetAllProducts } = useProduct();
    
    // Select state from Redux
    const allProducts = useSelector(state => state.product.allProducts || []);
    const loading = useSelector(state => state.product.loading);
    const user = useSelector(state => state.auth.user);

    const loadProducts = () => {
        setFetchError(null);
        handleGetAllProducts().catch((err) => {
            setFetchError(err?.response?.data?.message || "Failed to load products");
        });
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        if (!Array.isArray(allProducts)) return [];

        let result = allProducts.filter(p => {
            const query = searchTerm.toLowerCase();
            const titleMatch = p.title?.toLowerCase().includes(query);
            const descMatch = p.description?.toLowerCase().includes(query);
            const sellerMatch = 
                p.seller?.username?.toLowerCase().includes(query) ||
                p.seller?.name?.toLowerCase().includes(query) ||
                p.seller?.email?.toLowerCase().includes(query);

            return titleMatch || descMatch || sellerMatch;
        });

        // Sorting logic
        if (sortBy === "price-low") {
            result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
        } else if (sortBy === "price-high") {
            result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
        } else if (sortBy === "title") {
            result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        } else {
            // newest (default - using createdAt or array index)
            result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return result;
    }, [allProducts, searchTerm, sortBy]);

    // Unique sellers count
    const uniqueSellersCount = useMemo(() => {
        if (!Array.isArray(allProducts)) return 0;
        const set = new Set();
        allProducts.forEach(p => {
            if (p.seller?._id) set.add(p.seller._id);
            else if (typeof p.seller === 'string') set.add(p.seller);
        });
        return set.size;
    }, [allProducts]);

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

                    {/* Vertical Scrolling Marquee */}
                    <div className="absolute left-6 top-0 bottom-0 w-5 overflow-hidden pointer-events-none select-none opacity-[0.07]">
                        <div className="marquee-track flex flex-col gap-8">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <span 
                                    key={i} 
                                    className="text-[9px] tracking-[0.4em] uppercase text-white"
                                    style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    SNITCH — WEAR THE FUTURE —
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Decorative corners */}
                    <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-zinc-800 pointer-events-none" />
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-zinc-800 pointer-events-none" />

                    {/* Header Logo */}
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

                    {/* Sidebar Content */}
                    <div className="relative z-10 flex-1 flex flex-col justify-center px-8 xl:px-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="h-px w-8 bg-yellow-500" />
                            <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                01 / Store Catalog
                            </span>
                        </div>

                        <h2 className="text-4xl xl:text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white mb-6 uppercase">
                            All<br />
                            <span className="text-yellow-500">Drop</span><br />
                            s.
                        </h2>

                        <p className="text-sm text-zinc-500 leading-relaxed max-w-[220px] mb-8 font-light tracking-wide">
                            Explore high-fashion streetwear and curated releases from verified sellers.
                        </p>

                        {/* Real-time stats */}
                        <div className="space-y-3 mb-8">
                            <div className="border border-zinc-900 p-3.5 bg-[#0e0e0e]/60">
                                <p className="text-xl font-black text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {loading ? "—" : allProducts.length}
                                </p>
                                <p className="text-[9px] tracking-[0.15em] uppercase text-zinc-500 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Total Product Drops
                                </p>
                            </div>

                            <div className="border border-zinc-900 p-3.5 bg-[#0e0e0e]/60">
                                <p className="text-xl font-black text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    {loading ? "—" : uniqueSellersCount}
                                </p>
                                <p className="text-[9px] tracking-[0.15em] uppercase text-zinc-500 mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Independent Sellers
                                </p>
                            </div>
                        </div>

                        {/* Navigation link for Sellers */}
                        {user?.role === "seller" && (
                            <Link 
                                to="/seller/products"
                                className="group border border-zinc-800 hover:border-yellow-500/50 p-3 flex items-center justify-between text-xs text-zinc-300 hover:text-white transition-all bg-[#0e0e0e]"
                            >
                                <span className="font-semibold uppercase tracking-wider text-[11px]">Go To Seller Dashboard</span>
                                <ArrowIcon className="w-3.5 h-3.5 text-yellow-500 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
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
                    MAIN CONTENT — catalog & grid
                ══════════════════════════════════════════════ */}
                <div className="flex-1 min-h-screen bg-[#0e0e0e] flex flex-col overflow-y-auto">

                    {/* Mobile top header */}
                    <div className="lg:hidden flex items-center justify-between px-6 pt-8 pb-4 border-b border-zinc-900">
                        <Link to="/" className="inline-flex items-center gap-2.5">
                            <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base">
                                S
                            </span>
                            <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                SNITCH
                            </span>
                        </Link>
                        {user?.role === "seller" && (
                            <Link to="/seller/products" className="text-[10px] uppercase font-bold tracking-widest text-yellow-500 border border-yellow-500/30 px-3 py-1.5">
                                Dashboard
                            </Link>
                        )}
                    </div>

                    {/* Main Header */}
                    <div className={`px-6 sm:px-10 pt-10 pb-8 border-b border-zinc-900 ${mounted ? "content-in" : "opacity-0"}`}>

                        {/* Breadcrumbs */}
                        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    Storefront
                                </span>
                                <span className="text-zinc-800">/</span>
                                <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                    All Products
                                </span>
                            </div>

                            {/* User details badge */}
                            {user && (
                                <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px] tracking-wide text-zinc-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        {user.email} <span className="text-yellow-500">({user.role})</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Title & Tagline */}
                        <div className="flex items-start justify-between gap-6 flex-wrap mb-8">
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-[0.95] uppercase mb-4">
                                    Curated Drops
                                </h1>
                                <div className="flex items-center gap-4">
                                    <div className="h-[2px] w-10 bg-yellow-500" />
                                    <p className="text-[12px] text-zinc-500 tracking-wide">
                                        Browsing products across all independent sellers.
                                    </p>
                                </div>
                            </div>

                            {/* Quick Action Button for Sellers */}
                            {user?.role === "seller" && (
                                <Link
                                    to="/seller/create-product"
                                    className="group h-11 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-[11px] tracking-[0.12em] uppercase flex items-center gap-2 px-5 transition-all duration-200"
                                    style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                                >
                                    <span>+ Create Product</span>
                                </Link>
                            )}
                        </div>

                        {/* ── SEARCH & FILTER CONTROLS ── */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                            
                            {/* Search Bar */}
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by title, description, or seller name..."
                                    className="w-full h-11 pl-10 pr-4 bg-[#0a0a0a] border border-zinc-800 text-white text-xs placeholder-zinc-600 focus:outline-none focus:border-yellow-500 transition-colors"
                                />
                                {searchTerm && (
                                    <button 
                                        onClick={() => setSearchTerm("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 text-xs"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative flex items-center">
                                <SortIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="h-11 pl-9 pr-8 bg-[#0a0a0a] border border-zinc-800 text-white text-xs uppercase tracking-wider appearance-none focus:outline-none focus:border-yellow-500 transition-colors cursor-pointer"
                                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                                >
                                    <option value="newest">Sort: Newest First</option>
                                    <option value="price-low">Sort: Price Low → High</option>
                                    <option value="price-high">Sort: Price High → Low</option>
                                    <option value="title">Sort: Name A → Z</option>
                                </select>
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none text-[10px]">
                                    ▼
                                </span>
                            </div>

                        </div>

                    </div>

                    {/* Grid Container */}
                    <div className={`flex-1 px-6 sm:px-10 py-10 ${mounted ? "content-in" : "opacity-0"}`}>

                        {/* Loading state */}
                        {loading && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        )}

                        {/* Error state */}
                        {!loading && fetchError && <ErrorState onRetry={loadProducts} />}

                        {/* Empty state */}
                        {!loading && !fetchError && filteredProducts.length === 0 && (
                            <EmptyProducts onReset={() => setSearchTerm("")} />
                        )}

                        {/* Product Grid */}
                        {!loading && !fetchError && filteredProducts.length > 0 && (
                            <div className="space-y-6">
                                {/* Grid count bar */}
                                <div className="flex items-center gap-3">
                                    <div className="h-px flex-1 bg-zinc-900" />
                                    <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                        Showing {filteredProducts.length} of {allProducts.length} product{allProducts.length !== 1 ? "s" : ""}
                                    </span>
                                    <div className="h-px flex-1 bg-zinc-900" />
                                </div>

                                {/* Cards Grid */}
                                <div className="card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {filteredProducts.map((product, i) => (
                                        <div key={product._id || i} style={{ animationDelay: `${i * 40}ms` }}>
                                            <ProductCard 
                                                product={product} 
                                                onClick={(prod) => setSelectedProduct(prod)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            {/* Product Details Modal */}
            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                />
            )}
        </>
    );
}