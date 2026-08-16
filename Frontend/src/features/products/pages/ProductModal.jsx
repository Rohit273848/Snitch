import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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

function LayersIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l10.5 5.25L21.75 12l-4.179-2.25M2.25 12l10.5 5.25L21.75 12M2.25 6.75L12 12l9.75-5.25L12 1.5 2.25 6.75z" />
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

function ShoppingBagIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
    );
}

// ─── Buyer Product Details Page ─────────────────────────────────────────────
export default function ProductModal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();

    const [product, setProduct] = useState(null);
    const [selectedImg, setSelectedImg] = useState(0);
    const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [error, setError] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [addedToBagMsg, setAddedToBagMsg] = useState(null);

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
                
                // Initialize default selected variant attributes if product has variants
                if (data.variants && data.variants.length > 0) {
                    setSelectedVariantIdx(0);
                    const firstVar = data.variants[0];
                    let attrsObj = {};
                    if (firstVar.attributes instanceof Map) {
                        attrsObj = Object.fromEntries(firstVar.attributes);
                    } else if (typeof firstVar.attributes === 'object' && firstVar.attributes !== null) {
                        attrsObj = { ...firstVar.attributes };
                    }
                    setSelectedAttributes(attrsObj);
                }
            })
            .catch((err) => {
                setError(err?.response?.data?.message || "Failed to load product details.");
            })
            .finally(() => {
                setLoadingProduct(false);
            });
    }, [id]);

    // Extract all unique attribute categories and values across all variants
    const groupedAttributes = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return {};
        
        const categories = {};
        product.variants.forEach(variant => {
            let entries = [];
            if (variant.attributes instanceof Map) {
                entries = Array.from(variant.attributes.entries());
            } else if (typeof variant.attributes === 'object' && variant.attributes !== null) {
                entries = Object.entries(variant.attributes);
            }

            entries.forEach(([key, val]) => {
                if (!categories[key]) categories[key] = new Set();
                categories[key].add(val);
            });
        });

        // Convert sets to arrays
        const result = {};
        Object.keys(categories).forEach(key => {
            result[key] = Array.from(categories[key]);
        });
        return result;
    }, [product]);

    // Determine current active variant based on selected attributes or index
    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;

        // Find variant matching selected attributes
        const found = product.variants.find(v => {
            let attrs = {};
            if (v.attributes instanceof Map) attrs = Object.fromEntries(v.attributes);
            else if (typeof v.attributes === 'object' && v.attributes !== null) attrs = v.attributes;

            return Object.keys(selectedAttributes).every(key => attrs[key] === selectedAttributes[key]);
        });

        return found || product.variants[selectedVariantIdx] || product.variants[0];
    }, [product, selectedAttributes, selectedVariantIdx]);

    // Calculate Active Display Images for selected variety
    const activeImages = useMemo(() => {
        if (!product) return [];

        // 1. If currently active variant has specific images, return ONLY its images
        if (activeVariant?.images && activeVariant.images.length > 0) {
            const varImgs = activeVariant.images.map(img => img?.url ?? img).filter(Boolean);
            if (varImgs.length > 0) return varImgs;
        }

        // 2. If active variant has no direct images, check all variants that match the selected primary attribute (e.g., Color)
        if (product.variants && product.variants.length > 0 && selectedAttributes) {
            const colorKey = Object.keys(selectedAttributes).find(k => k.toLowerCase() === "color" || k.toLowerCase() === "colour");
            const selectedColorVal = colorKey ? selectedAttributes[colorKey] : null;

            if (selectedColorVal) {
                const colorImages = [];
                product.variants.forEach(v => {
                    let attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : (v.attributes || {});
                    const vColor = colorKey ? attrs[colorKey] : null;

                    if (vColor && String(vColor).toLowerCase() === String(selectedColorVal).toLowerCase() && Array.isArray(v.images)) {
                        v.images.forEach(img => {
                            const url = img?.url ?? img;
                            if (url && typeof url === "string" && !colorImages.includes(url)) {
                                colorImages.push(url);
                            }
                        });
                    }
                });

                if (colorImages.length > 0) {
                    return colorImages;
                }
            }
        }

        // 3. Fallback to main product images
        return (product.images || []).map(img => img?.url ?? img).filter(Boolean);
    }, [product, activeVariant, selectedAttributes]);

    // Calculate Active Display Price & Currency
    const activePriceAmount = useMemo(() => {
        if (activeVariant?.price?.amount) {
            return Number(activeVariant.price.amount);
        }
        return Number(product?.price?.amount || 0);
    }, [product, activeVariant]);

    const activeCurrency = useMemo(() => {
        if (activeVariant?.price?.currency) {
            return activeVariant.price.currency;
        }
        return product?.price?.currency || "INR";
    }, [product, activeVariant]);

    // Calculate Active Stock Status
    const activeStock = useMemo(() => {
        if (activeVariant) {
            return Number(activeVariant.stock || 0);
        }
        // Total stock across all variants or in-stock by default
        if (product?.variants && product.variants.length > 0) {
            return product.variants.reduce((acc, v) => acc + Number(v.stock || 0), 0);
        }
        return 99; // Default available stock if no variants
    }, [product, activeVariant]);

    const handleSelectAttributeVal = (category, value) => {
        const updated = { ...selectedAttributes, [category]: value };
        setSelectedAttributes(updated);
        setSelectedImg(0); // Reset image index on variety change
    };

    const handleSelectDirectVariant = (idx) => {
        setSelectedVariantIdx(idx);
        const targetVar = product?.variants[idx];
        if (targetVar) {
            let attrsObj = {};
            if (targetVar.attributes instanceof Map) attrsObj = Object.fromEntries(targetVar.attributes);
            else if (typeof targetVar.attributes === 'object' && targetVar.attributes !== null) attrsObj = { ...targetVar.attributes };
            setSelectedAttributes(attrsObj);
        }
        setSelectedImg(0);
    };

    const handleAddToCart = () => {
        let varSummary = "";
        if (Object.keys(selectedAttributes).length > 0) {
            varSummary = Object.entries(selectedAttributes).map(([k, v]) => `${k}: ${v}`).join(" | ");
        }
        setAddedToBagMsg(`Added ${quantity}x "${product.title}" ${varSummary ? `(${varSummary})` : ""} to your shopping bag!`);
        setTimeout(() => setAddedToBagMsg(null), 4000);
    };

    const symbol = currencySymbol[activeCurrency] ?? activeCurrency;
    const formattedPrice = activePriceAmount.toLocaleString("en-IN");
    const sellerName = product?.seller?.username || product?.seller?.name || product?.seller?.email?.split('@')[0] || "Verified Seller";

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
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-yellow-500 transition-colors cursor-pointer"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            <BackArrowIcon className="w-4 h-4" />
                            <span>Back</span>
                        </button>

                        <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

                        <Link to="/" className="inline-flex items-center gap-2.5 group">
                            <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-all">
                                S
                            </span>
                            <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                SNITCH
                            </span>
                        </Link>
                    </div>

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

                {/* Toast Notification */}
                {addedToBagMsg && (
                    <div className="fixed top-20 right-6 z-50 bg-yellow-500 text-black font-bold text-xs uppercase tracking-wider px-5 py-3.5 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
                        <ShoppingBagIcon className="w-4 h-4 text-black" />
                        <span>{addedToBagMsg}</span>
                    </div>
                )}

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
                                className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
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
                                    {activeImages.length > 0 ? (
                                        <img
                                            src={activeImages[selectedImg] ?? activeImages[0]}
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
                                        <span>Seller: {sellerName}</span>
                                    </div>

                                    {/* Variety Indicator Badge */}
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-yellow-500 text-black text-[9px] font-mono font-bold uppercase px-2.5 py-1 tracking-widest">
                                            <LayersIcon className="w-3 h-3 text-black" />
                                            <span>{product.variants.length} Variety Options</span>
                                        </div>
                                    )}
                                </div>

                                {/* Image Thumbnails Carousel */}
                                {activeImages.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2">
                                        {activeImages.map((imgUrl, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedImg(i)}
                                                className={`w-20 h-20 flex-shrink-0 border transition-all cursor-pointer bg-[#0e0e0e] ${
                                                    selectedImg === i ? "border-yellow-500 scale-95" : "border-zinc-800 opacity-60 hover:opacity-100"
                                                }`}
                                            >
                                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT COLUMN: Specifications, Varieties & Buying Actions (5 cols) */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
                                <div className="space-y-6">
                                    
                                    {/* Seller Release Tag */}
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

                                    {/* Price & Stock Status Box */}
                                    <div className="bg-[#0e0e0e] border border-zinc-900 p-5 flex items-baseline justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                {activeVariant?.price?.amount ? "Variety Price" : "Base Price"}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl sm:text-3xl font-black text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                                    {symbol}{formattedPrice}
                                                </span>
                                                <span className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
                                                    {activeCurrency}
                                                </span>
                                            </div>
                                        </div>

                                        <span className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 border ${
                                            activeStock > 0
                                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                : "text-red-400 bg-red-500/10 border-red-500/20"
                                        }`}>
                                            {activeStock > 0 ? `In Stock (${activeStock})` : "Out of Stock"}
                                        </span>
                                    </div>

                                    {/* ══════════════════════════════════════════════
                                        PRODUCT VARIETIES / ATTRIBUTES SELECTOR SECTION
                                    ══════════════════════════════════════════════ */}
                                    {product.variants && product.variants.length > 0 && (
                                        <div className="space-y-5 bg-[#0e0e0e] border border-zinc-900 p-5">
                                            
                                            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                                                <div className="flex items-center gap-2">
                                                    <LayersIcon className="w-4 h-4 text-yellow-500" />
                                                    <h3 className="text-xs uppercase font-mono tracking-[0.15em] font-bold text-zinc-300">
                                                        Select Product Variety ({product.variants.length})
                                                    </h3>
                                                </div>
                                                <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5">
                                                    In Stock Options Available
                                                </span>
                                            </div>

                                            {/* 1. Attribute Category Pills (if structured attributes exist) */}
                                            {Object.keys(groupedAttributes).length > 0 && (
                                                <div className="space-y-4 border-b border-zinc-900 pb-4">
                                                    {Object.entries(groupedAttributes).map(([category, values]) => (
                                                        <div key={category} className="space-y-2">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-[10px] uppercase font-mono text-zinc-400 font-semibold tracking-wider">
                                                                    {category}:
                                                                </span>
                                                                <span className="text-[10px] font-mono text-yellow-500 font-bold">
                                                                    {selectedAttributes[category] || "Select"}
                                                                </span>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2">
                                                                {values.map(val => {
                                                                    const isSelected = selectedAttributes[category] === val;
                                                                    
                                                                    // Check stock availability for this attribute value
                                                                    const matchingVar = product.variants.find(v => {
                                                                        let attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : (v.attributes || {});
                                                                        return attrs[category] === val;
                                                                    });
                                                                    const isAvailable = matchingVar ? Number(matchingVar.stock || 0) > 0 : true;

                                                                    return (
                                                                        <button
                                                                            key={val}
                                                                            type="button"
                                                                            onClick={() => handleSelectAttributeVal(category, val)}
                                                                            className={`px-3 py-2 text-xs font-mono border transition-all cursor-pointer relative ${
                                                                                isSelected
                                                                                    ? "bg-yellow-500 text-black border-yellow-500 font-bold shadow-lg shadow-yellow-500/20 scale-105"
                                                                                    : isAvailable
                                                                                        ? "bg-black text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:text-white"
                                                                                        : "bg-zinc-950 text-zinc-600 border-zinc-900 line-through"
                                                                            }`}
                                                                            title={isAvailable ? "Available" : "Not Available (Out of Stock)"}
                                                                        >
                                                                            <span>{val}</span>
                                                                            {!isAvailable && (
                                                                                <span className="ml-1 text-[8px] text-red-500 no-underline font-mono">
                                                                                    (Out)
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* 2. Direct Variety Cards Grid (Buyer can click any variety directly) */}
                                            <div className="space-y-2">
                                                <span className="text-[10px] uppercase font-mono text-zinc-500 block">
                                                    All Variety Packages:
                                                </span>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                                                    {product.variants.map((v, idx) => {
                                                        const isSelected = activeVariant === v;

                                                        let attrEntries = [];
                                                        if (v.attributes instanceof Map) attrEntries = Array.from(v.attributes.entries());
                                                        else if (typeof v.attributes === 'object' && v.attributes !== null) attrEntries = Object.entries(v.attributes);

                                                        const vPrice = v.price?.amount ? Number(v.price.amount) : Number(product.price?.amount || 0);
                                                        const vCurrency = v.price?.currency || product.price?.currency || "INR";
                                                        const vSymbol = currencySymbol[vCurrency] ?? vCurrency;

                                                        return (
                                                            <button
                                                                key={idx}
                                                                type="button"
                                                                onClick={() => handleSelectDirectVariant(idx)}
                                                                className={`p-3 border text-left flex flex-col justify-between space-y-2 transition-all cursor-pointer ${
                                                                    isSelected
                                                                        ? "border-yellow-500 bg-yellow-500/10 text-white"
                                                                        : "border-zinc-900 bg-black/60 text-zinc-400 hover:border-zinc-800 hover:text-zinc-200"
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-mono font-bold uppercase text-yellow-500">
                                                                        Option #{idx + 1}
                                                                    </span>
                                                                    <span className={`text-[9px] font-mono font-bold ${Number(v.stock || 0) > 0 ? "text-emerald-400" : "text-red-400"}`}>
                                                                        {v.stock || 0} in stock
                                                                    </span>
                                                                </div>

                                                                <div className="flex flex-wrap gap-1">
                                                                    {attrEntries.length > 0 ? (
                                                                        attrEntries.map(([k, val], i) => (
                                                                            <span key={i} className="text-[9px] font-mono bg-zinc-900 px-1.5 py-0.5 text-zinc-300 border border-zinc-800">
                                                                                <span className="text-zinc-500">{k}:</span> {val}
                                                                            </span>
                                                                        ))
                                                                    ) : (
                                                                        <span className="text-[9px] font-mono italic text-zinc-500">Standard Variety</span>
                                                                    )}
                                                                </div>

                                                                <div className="text-[11px] font-mono font-bold text-white pt-1">
                                                                    {vSymbol}{vPrice.toLocaleString("en-IN")}
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Variety Selected Summary Bar */}
                                            <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                                                <span>Active Variety:</span>
                                                <span className="text-yellow-500 font-bold">
                                                    {Object.entries(selectedAttributes).map(([k, v]) => `${k}: ${v}`).join(" | ") || `Option #${selectedVariantIdx + 1}`}
                                                </span>
                                            </div>

                                        </div>
                                    )}

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
                                                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                                            >
                                                -
                                            </button>
                                            <span className="w-12 text-center text-xs font-bold font-mono">{quantity}</span>
                                            <button 
                                                onClick={() => setQuantity(q => q + 1)}
                                                className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                </div>

                                {/* Purchase Action Buttons */}
                                <div className="space-y-4 pt-6 border-t border-zinc-900">
                                    <button 
                                        disabled={activeStock <= 0}
                                        onClick={handleAddToCart}
                                        className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold text-[13px] tracking-[0.14em] uppercase flex items-center justify-center gap-3 transition-all cursor-pointer group"
                                        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                                    >
                                        <ShoppingBagIcon className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                                        <span>{activeStock > 0 ? "Add Variety To Bag" : "Variety Out of Stock"}</span>
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
