import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import { useChat } from "../../cart/hook/useChat.js";
import ProductVarietySelector from "../components/ProductVarietySelector.jsx";

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
function ArrowLeftIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

function HeartIcon({ filled = false, className = "w-5 h-5" }) {
    if (filled) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="#e11d48" stroke="#e11d48" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        );
    }
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
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

function RefreshIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
}

function BagIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.125 1.007z" />
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

function TagIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
        </svg>
    );
}

// ─── Main Product Details Component ───────────────────────────────────────────
export default function ProductModal() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById } = useProduct();
    const { handleAddToItem } = useChat();

    const [product, setProduct] = useState(null);
    const [selectedImg, setSelectedImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [error, setError] = useState(null);

    // Variety & Cart selection states
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [cartFeedback, setCartFeedback] = useState(null);

    // Wishlist state synced with localStorage
    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("snitch_wishlist") || "[]");
        } catch {
            return [];
        }
    });

    const isWishlisted = product?._id ? wishlist.includes(product._id) : false;

    const handleToggleWishlist = (prodId) => {
        if (!prodId) return;
        setWishlist((prev) => {
            const next = prev.includes(prodId) ? prev.filter((i) => i !== prodId) : [...prev, prodId];
            try {
                localStorage.setItem("snitch_wishlist", JSON.stringify(next));
            } catch (e) {
                console.error("wishlist error", e);
            }
            return next;
        });
    };

    // Load product directly from MongoDB database via API
    useEffect(() => {
        if (!id) return;
        setLoadingProduct(true);
        setError(null);

        handleGetProductById(id)
            .then((data) => {
                if (data) {
                    setProduct(data);
                } else {
                    setError("Piece not found in collection.");
                }
            })
            .catch((err) => {
                console.error("Product API fetch error:", err);
                setError(err?.response?.data?.message || "Failed to load product details.");
            })
            .finally(() => {
                setLoadingProduct(false);
            });
    }, [id]);

    // Variety change handler
    const handleVariantSelect = ({ variant, selectedColor: col }) => {
        setSelectedVariant(variant);
        setSelectedColor(col);
    };

    // Reset gallery preview index when active color or variant changes
    useEffect(() => {
        setSelectedImg(0);
    }, [selectedColor, selectedVariant?._id]);

    // Dynamically resolve images based on variety
    const displayImages = useMemo(() => {
        // 1. If currently selected variant has specific images
        if (selectedVariant?.images && selectedVariant.images.length > 0) {
            return selectedVariant.images;
        }

        // 2. Check if product.images has images assigned to selectedColor
        if (selectedColor && product?.images && product.images.length > 0) {
            const colorImages = product.images.filter((img) => {
                const imgColor = typeof img === "object" ? img.color : "";
                return imgColor && String(imgColor).trim().toLowerCase() === String(selectedColor).trim().toLowerCase();
            });
            if (colorImages.length > 0) return colorImages;
        }

        // 3. Fallback: check if any variant with the selected color has images
        if (selectedColor && product?.variants && product.variants.length > 0) {
            const colorVariantWithImages = product.variants.find((v) => {
                let attrs = v.attributes;
                if (attrs instanceof Map) attrs = Object.fromEntries(attrs);
                else if (typeof attrs === "string") {
                    try { attrs = JSON.parse(attrs); } catch { attrs = {}; }
                }
                const colorVal = attrs?.Color || attrs?.color || attrs?.Colour || attrs?.colour;
                return (
                    String(colorVal).trim().toLowerCase() === String(selectedColor).trim().toLowerCase() &&
                    v.images && v.images.length > 0
                );
            });
            if (colorVariantWithImages) return colorVariantWithImages.images;
        }

        // 4. Fallback to product images (sorted with cover image first)
        const allImages = product?.images || [];
        return [...allImages].sort((a, b) => (b.isCover ? 1 : 0) - (a.isCover ? 1 : 0));
    }, [selectedVariant, selectedColor, product]);

    // Dynamic price based on selected variety
    const activePrice = selectedVariant?.price?.amount
        ? selectedVariant.price
        : product?.price;

    const symbol = currencySymbol[activePrice?.currency] ?? activePrice?.currency ?? "₹";
    const formattedPrice = Number(activePrice?.amount || 0).toLocaleString("en-IN");
    const sellerName = product?.seller?.username || product?.seller?.name || product?.seller?.email || "Snitch Official";

    // Dynamic stock calculations
    const currentStock = selectedVariant
        ? Number(selectedVariant.stock ?? 0)
        : (product?.variants && product.variants.length > 0 ? 0 : 10);
    const isOutOfStock = product?.variants && product.variants.length > 0 && currentStock <= 0;

    // Add to Bag action handler
    const handleAddToCart = async () => {
        if (isOutOfStock) return;

        if (product?.variants && product.variants.length > 0 && !selectedVariant) {
            setCartFeedback({ type: "error", message: "Please select an available color and size variety." });
            return;
        }

        setIsAddingToCart(true);
        setCartFeedback(null);
        try {
            await handleAddToItem({
                productId: product._id,
                variantId: selectedVariant?._id,
                quantity: quantity,
            });
            setCartFeedback({ type: "success", message: "Item added to your shopping bag!" });
            setTimeout(() => setCartFeedback(null), 5000);
        } catch (err) {
            console.error("Add to cart error:", err);
            setCartFeedback({
                type: "error",
                message: err?.response?.data?.message || "Item queued in cart.",
            });
            // If offline/curated mock, still provide friendly confirmation
            if (String(product._id).startsWith("snitch-")) {
                setCartFeedback({ type: "success", message: "Added to your shopping bag!" });
            }
        } finally {
            setIsAddingToCart(false);
        }
    };

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

                {/* ─── Top Breadcrumb Bar ───────────────────────────────────────── */}
                <div className="border-b border-zinc-200 bg-white/70 backdrop-blur-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-xs font-mono-code text-zinc-600">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 hover:text-black font-semibold transition-colors group cursor-pointer"
                        >
                            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            <span>Back to Storefront</span>
                        </Link>

                        {/* Breadcrumbs Navigation */}
                        <div className="hidden sm:flex items-center gap-2 text-zinc-400">
                            <Link to="/" className="hover:text-zinc-700">Home</Link>
                            <span>/</span>
                            <span className="uppercase text-zinc-600">{product?.category || "Apparel"}</span>
                            <span>/</span>
                            <span className="text-zinc-950 font-bold truncate max-w-[220px]">
                                {product?.title || "Product Drop"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ─── Main Content Container ──────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12 fade-in-entry space-y-10">

                    {/* Loading State */}
                    {loadingProduct && (
                        <div className="flex flex-col items-center justify-center py-36 space-y-4">
                            <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-mono-code text-zinc-500 uppercase tracking-widest">
                                Loading product drop...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loadingProduct && error && !product && (
                        <div className="bg-white border border-zinc-200 rounded-3xl p-10 sm:p-16 text-center max-w-lg mx-auto space-y-5 shadow-xs">
                            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-500">
                                <PackageIcon className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-black uppercase text-zinc-900">Product Not Found</h2>
                            <p className="text-xs text-zinc-500 leading-relaxed">{error}</p>
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="px-6 py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-full font-mono-code cursor-pointer"
                            >
                                Return to Storefront
                            </button>
                        </div>
                    )}

                    {/* Full Product Details Grid */}
                    {!loadingProduct && product && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                            {/* ─── LEFT COLUMN: Gallery & Images (7 cols) ─────────── */}
                            <div className="lg:col-span-7 flex flex-col gap-4">

                                {/* Main Image Preview Box */}
                                <div className="relative aspect-[3/4] sm:aspect-[4/5] bg-[#f4f4f5] border border-zinc-200 rounded-2xl overflow-hidden group shadow-xs">
                                    {displayImages && displayImages.length > 0 ? (
                                        <img
                                            src={displayImages[selectedImg]?.url ?? displayImages[selectedImg]}
                                            alt={product.title}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                            <PackageIcon className="w-16 h-16" />
                                        </div>
                                    )}

                                    {/* Wishlist Heart Action (Floating Top Right) */}
                                    <button
                                        type="button"
                                        onClick={() => handleToggleWishlist(product._id)}
                                        aria-label="Toggle Wishlist"
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white backdrop-blur-sm shadow-sm flex items-center justify-center transition-all hover:scale-110 active:scale-95 z-20 cursor-pointer"
                                    >
                                        <HeartIcon
                                            filled={isWishlisted}
                                            className={`w-5 h-5 transition-colors ${
                                                isWishlisted ? "text-rose-600 scale-110" : "text-zinc-700 hover:text-black"
                                            }`}
                                        />
                                    </button>

                                    {/* Verified Seller Pill (Floating Top Left) */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md border border-zinc-200 text-zinc-900 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-xs font-mono-code">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span>Listed by: {sellerName}</span>
                                    </div>
                                </div>

                                {/* Image Thumbnails Carousel */}
                                {displayImages && displayImages.length > 1 && (
                                    <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar">
                                        {displayImages.map((img, i) => (
                                            <button
                                                key={i}
                                                type="button"
                                                onClick={() => setSelectedImg(i)}
                                                className={`w-20 aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all cursor-pointer bg-[#f4f4f5] flex-shrink-0 ${
                                                    selectedImg === i
                                                        ? "border-black ring-2 ring-zinc-300 ring-offset-1 scale-95 shadow-sm"
                                                        : "border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100"
                                                }`}
                                            >
                                                <img src={img?.url ?? img} alt="" className="w-full h-full object-cover object-top" />
                                            </button>
                                        ))}
                                    </div>
                                )}

                            </div>

                            {/* ─── RIGHT COLUMN: Specifications & Buying Actions (5 cols) ─── */}
                            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">

                                <div className="space-y-6">

                                    {/* Category Pill Tag */}
                                    <div>
                                        <span className="px-3 py-1 bg-zinc-100 text-zinc-700 text-[10px] font-mono-code font-bold uppercase tracking-widest rounded-full inline-block">
                                            {product.category || "STREETWEAR DROP"}
                                        </span>
                                    </div>

                                    {/* Product Title */}
                                    <div>
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-950 uppercase tracking-tight leading-tight">
                                            {product.title}
                                        </h1>
                                    </div>

                                    {/* Price & Stock Card */}
                                    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs flex items-baseline justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase font-mono-code tracking-widest text-zinc-400 mb-0.5">
                                                {selectedVariant?.price?.amount ? "Selected Variety Price" : "Listed Price"}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl sm:text-3xl font-black font-mono-code text-zinc-950">
                                                    {symbol}{formattedPrice}
                                                </span>
                                                <span className="text-xs text-zinc-400 font-mono-code">
                                                    (All taxes included)
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stock Badge */}
                                        {isOutOfStock ? (
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full font-mono-code">
                                                Out Of Stock
                                            </span>
                                        ) : currentStock <= 5 && product?.variants && product.variants.length > 0 ? (
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full font-mono-code">
                                                Only {currentStock} Left
                                            </span>
                                        ) : (
                                            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 font-mono-code">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span>In Stock</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Variety Selector (Colors + Sizes + Size Guide) */}
                                    <ProductVarietySelector
                                        product={product}
                                        selectedVariantId={selectedVariant?._id}
                                        onVariantSelect={handleVariantSelect}
                                    />

                                    {/* Quantity Stepper */}
                                    <div className="flex items-center gap-4 pt-1">
                                        <span className="text-xs uppercase tracking-wider font-mono-code text-zinc-500 font-semibold">
                                            Quantity:
                                        </span>
                                        <div className="flex items-center border border-zinc-200 bg-white rounded-full p-0.5 shadow-2xs">
                                            <button
                                                type="button"
                                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                                disabled={isOutOfStock}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-40"
                                            >
                                                -
                                            </button>
                                            <span className="w-10 text-center text-xs font-bold font-mono-code text-zinc-950">
                                                {quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setQuantity((q) => (currentStock ? Math.min(currentStock, q + 1) : q + 1))
                                                }
                                                disabled={isOutOfStock || (currentStock && quantity >= currentStock)}
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-40"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Primary Add to Bag Action Button */}
                                    <div className="space-y-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            disabled={isOutOfStock || isAddingToCart}
                                            className={`w-full py-4 font-black text-xs uppercase tracking-widest rounded-full transition-all flex items-center justify-center gap-2 font-mono-code cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] ${
                                                isOutOfStock
                                                    ? "bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none"
                                                    : cartFeedback?.type === "success"
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-black hover:bg-zinc-800 text-white"
                                            }`}
                                        >
                                            {isAddingToCart ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    <span>Adding to Bag...</span>
                                                </span>
                                            ) : cartFeedback?.type === "success" ? (
                                                <span className="flex items-center gap-2">
                                                    <CheckIcon className="w-4 h-4 text-white" />
                                                    <span>Added to Bag!</span>
                                                </span>
                                            ) : isOutOfStock ? (
                                                <span>Out of Stock</span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    <BagIcon className="w-4 h-4" />
                                                    <span>Add To Shopping Bag</span>
                                                    <span>→</span>
                                                </span>
                                            )}
                                        </button>

                                        {/* Cart Feedback Notification */}
                                        {cartFeedback && (
                                            <div
                                                className={`p-3 rounded-xl text-xs font-mono-code flex items-center justify-between gap-2 border transition-all ${
                                                    cartFeedback.type === "success"
                                                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                                        : "bg-rose-50 text-rose-800 border-rose-200"
                                                }`}
                                            >
                                                <span>{cartFeedback.message}</span>
                                                {cartFeedback.type === "success" && (
                                                    <Link
                                                        to="/cart"
                                                        className="underline font-bold uppercase text-black hover:text-zinc-700 ml-2"
                                                    >
                                                        View Bag →
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Trust & Guarantee Strip */}
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                                            <ShieldCheckIcon className="w-4 h-4 text-zinc-800 flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase font-mono-code text-zinc-900">100% Genuine</p>
                                                <p className="text-[9px] text-zinc-400">Authentic Snitch drop</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                                            <TruckIcon className="w-4 h-4 text-zinc-800 flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase font-mono-code text-zinc-900">Express Shipping</p>
                                                <p className="text-[9px] text-zinc-400">2-4 business days</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                                            <RefreshIcon className="w-4 h-4 text-zinc-800 flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase font-mono-code text-zinc-900">7-Day Easy Return</p>
                                                <p className="text-[9px] text-zinc-400">Hassle-free exchange</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-zinc-200 shadow-2xs">
                                            <TagIcon className="w-4 h-4 text-zinc-800 flex-shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-bold uppercase font-mono-code text-zinc-900">Best Price Drop</p>
                                                <p className="text-[9px] text-zinc-400">Verified seller price</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Product Description Box */}
                                    <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs space-y-2">
                                        <h3 className="text-xs font-mono-code font-bold uppercase tracking-wider text-zinc-900">
                                            Product Overview & Details
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light whitespace-pre-line">
                                            {product.description || "Premium streetwear piece made with high-grade breathable fabric and reinforced seams for longevity and comfort."}
                                        </p>
                                        <div className="pt-2 border-t border-zinc-100 flex flex-wrap gap-4 text-[11px] font-mono-code text-zinc-500">
                                            <span>• 100% Combed Heavyweight Cotton</span>
                                            <span>• Machine Wash Cold</span>
                                            <span>• True to Size Regular Fit</span>
                                        </div>
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
