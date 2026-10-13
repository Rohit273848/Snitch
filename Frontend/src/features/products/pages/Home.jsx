import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
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
function SearchIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function HeartIcon({ filled = false, className = "w-4 h-4" }) {
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

function PlusIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function ChevronLeftIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
    );
}

function ChevronRightIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    );
}

function BagIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.125 1.007z" />
        </svg>
    );
}

function XIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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

// ─── Hero Carousel Banners ("Ads with images") ────────────────────────────────
const HERO_BANNERS = [
    {
        id: "banner-1",
        tag: "AUTUMN DROP '26",
        title: "NEW STREETWEAR ARRIVALS",
        subtitle: "Luxury Boxy Cuts, Oversized Drops & Heavyweight Fabrics",
        offer: "FLAT 40% OFF",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
        cta: "EXPLORE DROP",
        category: "all",
    },
    {
        id: "banner-2",
        tag: "DENIM ARCHIVE",
        title: "THE DENIM REVOLUTION",
        subtitle: "Vintage Washes, Relaxed Straight Cuts & Baggy Fits",
        offer: "STARTING ₹899",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
        cta: "SHOP JEANS",
        category: "jeans",
    },
    {
        id: "banner-3",
        tag: "RESORT WEAR",
        title: "CUBAN COLLARS & RESORT EDIT",
        subtitle: "Signature Printed Silhouettes Designed for Sun & Night",
        offer: "TRENDING NOW",
        image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=80",
        cta: "VIEW SHIRTS",
        category: "shirt",
    },
    {
        id: "banner-4",
        tag: "SNITCH FOR HER",
        title: "GIRLS STREETWEAR EDIT",
        subtitle: "Parachute Pants, Baby Tees & Effortless Layering",
        offer: "EXCLUSIVE CAPSULE",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80",
        cta: "DISCOVER GIRLS",
        category: "girls",
    },
    {
        id: "banner-5",
        tag: "LIMITED EDITION",
        title: "WEEKEND VAULT EXCLUSIVES",
        subtitle: "Handpicked drops from our verified independent sellers",
        offer: "LIMITED STOCK",
        image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=80",
        cta: "SHOP THE VAULT",
        category: "cargo",
    },
];

// ─── Category Capsules (under ads carousel) ──────────────────────────────────
const CATEGORY_CAPSULES = [
    {
        id: "cap-shirt",
        label: "Shirt with image",
        name: "Shirts",
        category: "shirt",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "cap-pents",
        label: "pents with image",
        name: "Pants & Trousers",
        category: "trouser",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "cap-girl-1",
        label: "girl any cloths name with image",
        name: "Dresses & Tops",
        category: "dress",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=400&q=80",
    },
    {
        id: "cap-girl-2",
        label: "gitl any cloths name with image",
        name: "Co-Ords & Cargos",
        category: "cargo",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=400&q=80",
    },
];

// ─── Mens Category Row Items ──────────────────────────────────────────────────
const MENS_CATEGORIES = [
    {
        id: "mens-shirts",
        label: "SHIRTS",
        category: "shirt",
        gender: "mens",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "mens-trousers",
        label: "TROUSERS",
        category: "trouser",
        gender: "mens",
        image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "mens-tshirts",
        label: "T-SHIRTS",
        category: "tshirt",
        gender: "mens",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "mens-jeans",
        label: "JEANS",
        category: "jeans",
        gender: "mens",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "mens-cargos",
        label: "CARGOS",
        category: "cargo",
        gender: "mens",
        image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80",
    },
];

// ─── Girls Category Row Items ─────────────────────────────────────────────────
const GIRLS_CATEGORIES = [
    {
        id: "girls-shirts",
        label: "SHIRTS",
        category: "shirt",
        gender: "girls",
        image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "girls-trousers",
        label: "TROUSERS",
        category: "trouser",
        gender: "girls",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "girls-tshirts",
        label: "T-SHIRTS",
        category: "tshirt",
        gender: "girls",
        image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "girls-jeans",
        label: "JEANS",
        category: "jeans",
        gender: "girls",
        image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&w=600&q=80",
    },
    {
        id: "girls-cargos",
        label: "CARGOS",
        category: "cargo",
        gender: "girls",
        image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80",
    },
];

// ─── Curated Snitch Catalog Products (Matching Mockup Grid) ───────────────────
const CURATED_SNITCH_PRODUCTS = [
    {
        _id: "snitch-1",
        title: "Dark Purple Slim Fit Shirt",
        description: "Premium washed cotton slim fit shirt with structured spread collar and rounded cuffs.",
        category: "shirt",
        gender: "mens",
        price: { amount: 1190, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_official", name: "Snitch Official" },
        variants: [1, 2, 3],
    },
    {
        _id: "snitch-2",
        title: "Regular Fit Washed Jeans",
        description: "Classic five-pocket vintage blue denim with subtle fading and durable reinforced seams.",
        category: "jeans",
        gender: "mens",
        price: { amount: 899, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_denim", name: "Snitch Denim Studio" },
        variants: [1, 2, 3, 4],
    },
    {
        _id: "snitch-3",
        title: "Relaxed Fit Washed Jeans",
        description: "Charcoal dark-wash relaxed denim cut loose through the thigh with gentle taper.",
        category: "jeans",
        gender: "mens",
        price: { amount: 1090, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "urban_atelier", name: "Urban Atelier" },
        variants: [1, 2],
    },
    {
        _id: "snitch-4",
        title: "Straight Fit Stretch Jeans",
        description: "Versatile beige/ecru straight leg stretch denim engineered for all-day comfort.",
        category: "jeans",
        gender: "mens",
        price: { amount: 899, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_denim", name: "Snitch Denim Studio" },
        variants: [1, 2, 3],
    },
    {
        _id: "snitch-5",
        title: "Straight Fit Washed Jeans",
        description: "Medium vintage wash straight jeans with natural fading and soft hand feel.",
        category: "jeans",
        gender: "mens",
        price: { amount: 1090, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_official", name: "Snitch Official" },
        variants: [1, 2, 3, 4],
    },
    {
        _id: "snitch-6",
        title: "Dark Purple Slim Fit Shirt",
        description: "Tailored deep plum lightweight shirt, ideal for evening layers and casual styling.",
        category: "shirt",
        gender: "mens",
        price: { amount: 1190, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_official", name: "Snitch Official" },
        variants: [1, 2],
    },
    {
        _id: "snitch-7",
        title: "Pleated Olive Dress Trousers",
        description: "Tailored smart-casual olive trousers with double front pleats and side adjusters.",
        category: "trouser",
        gender: "mens",
        price: { amount: 1299, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "atelier_tailors", name: "Atelier Tailors" },
        variants: [1, 2, 3],
    },
    {
        _id: "snitch-8",
        title: "Vintage Mocha Heavyweight T-Shirt",
        description: "240 GSM combed cotton drop-shoulder streetwear tee with ribbed neckline.",
        category: "tshirt",
        gender: "mens",
        price: { amount: 799, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_official", name: "Snitch Official" },
        variants: [1, 2, 3, 4],
    },
    {
        _id: "snitch-9",
        title: "Tactical Relaxed Cargo Pants",
        description: "Multi-pocket durable cotton ripstop cargo pants with drawstring cuff toggles.",
        category: "cargo",
        gender: "mens",
        price: { amount: 1499, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "cargo_craft", name: "Cargo Craft" },
        variants: [1, 2, 3],
    },
    {
        _id: "snitch-10",
        title: "Cropped Linen Resort Shirt",
        description: "Airy relaxed cropped silhouette with breathable natural linen weave.",
        category: "shirt",
        gender: "girls",
        price: { amount: 1090, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_her", name: "Snitch For Her" },
        variants: [1, 2, 3],
    },
    {
        _id: "snitch-11",
        title: "Wide Leg Pleated Trousers",
        description: "High-waist fluid tailored trousers with front darts and sleek side slant pockets.",
        category: "trouser",
        gender: "girls",
        price: { amount: 1399, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_her", name: "Snitch For Her" },
        variants: [1, 2],
    },
    {
        _id: "snitch-12",
        title: "Parachute Utility Cargos",
        description: "Ultra-lightweight windbreaker fabric relaxed parachute pants with toggle hems.",
        category: "cargo",
        gender: "girls",
        price: { amount: 1299, currency: "INR" },
        images: [{ url: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=80", isCover: true }],
        seller: { username: "snitch_her", name: "Snitch For Her" },
        variants: [1, 2, 3, 4],
    },
];

// ─── Snitch Product Card (Mockup Style: Clean, Tall, Heart + Plus) ────────────
function ProductGridCard({ product, isWishlisted, onToggleWishlist, onClick }) {
    const symbol = currencySymbol[product.price?.currency] ?? product.price?.currency ?? "₹";
    const formattedPrice = Number(product.price?.amount || 0).toLocaleString("en-IN");

    const coverImage =
        product.images?.find((img) => img?.isCover)?.url ||
        product.images?.[0]?.url ||
        product.images?.[0] ||
        "";

    return (
        <div
            onClick={() => onClick(product)}
            className="group cursor-pointer flex flex-col justify-between bg-white border border-zinc-200 hover:border-zinc-900 transition-all duration-300 relative select-none"
        >
            <div>
                {/* Product Image Box */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#f4f4f5]">
                    {coverImage ? (
                        <img
                            src={coverImage}
                            alt={product.title}
                            loading="lazy"
                            className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center">
                            <PackageIcon className="w-10 h-10 text-zinc-400" />
                        </div>
                    )}

                    {/* Wishlist Heart Icon (Top Right, outline with clean circle or floating) */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product._id);
                        }}
                        aria-label="Wishlist"
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm shadow-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95 z-10 cursor-pointer"
                    >
                        <HeartIcon
                            filled={isWishlisted}
                            className={`w-4 h-4 transition-colors ${isWishlisted ? "text-rose-600 scale-110" : "text-zinc-700 hover:text-black"
                                }`}
                        />
                    </button>

                    {/* Variety Tag if exists */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/75 backdrop-blur-sm text-[9px] font-mono uppercase tracking-wider text-white">
                            {product.variants.length} Sizes/Colors
                        </div>
                    )}
                </div>

                {/* Card Info Footer */}
                <div className="p-3">
                    <h3 className="text-[12px] sm:text-[13px] font-medium text-zinc-900 truncate tracking-tight uppercase group-hover:text-black transition-colors">
                        {product.title}
                    </h3>

                    <div className="flex items-center justify-between mt-1 pt-1">
                        <div className="flex items-baseline gap-0.5">
                            <span className="text-[11px] font-mono text-zinc-500">{symbol}</span>
                            <span className="text-[13px] sm:text-[14px] font-bold text-zinc-900 font-mono tracking-tight">
                                {formattedPrice}
                            </span>
                        </div>

                        {/* Quick Action Plus Button (+) */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick(product);
                            }}
                            title="View product"
                            className="w-6 h-6 rounded-full border border-zinc-300 hover:border-black hover:bg-black hover:text-white flex items-center justify-center text-zinc-700 transition-all cursor-pointer"
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Main Home Component ──────────────────────────────────────────────────────
export default function Home() {
    const navigate = useNavigate();
    const productsCatalogRef = useRef(null);

    const [mounted, setMounted] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("newest"); // "newest", "price-low", "price-high", "title"
    const [activeFilter, setActiveFilter] = useState({ type: null, value: null, label: null }); // { type: 'category' | 'gender' | 'both', value, label }
    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("snitch_wishlist") || "[]");
        } catch {
            return [];
        }
    });

    // Hero Carousel Banner state
    const [activeBanner, setActiveBanner] = useState(0);
    const [isHoveringBanner, setIsHoveringBanner] = useState(false);

    const { handleGetAllProducts } = useProduct();

    // Redux selectors
    const allDbProducts = useSelector((state) => state.product.allProducts || []);
    const loading = useSelector((state) => state.product.loading);
    const user = useSelector((state) => state.auth.user);
    const cartItems = useSelector((state) => state.cart?.items || []);

    // Load DB products
    const loadProducts = () => {
        setFetchError(null);
        handleGetAllProducts().catch((err) => {
            setFetchError(err?.response?.data?.message || "Failed to load database products");
        });
    };

    useEffect(() => {
        loadProducts();
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    // Autoplay hero banner carousel
    useEffect(() => {
        if (isHoveringBanner) return;
        const interval = setInterval(() => {
            setActiveBanner((prev) => (prev + 1) % HERO_BANNERS.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [isHoveringBanner]);

    // Save wishlist in localStorage
    const handleToggleWishlist = (id) => {
        setWishlist((prev) => {
            let next;
            if (prev.includes(id)) {
                next = prev.filter((item) => item !== id);
            } else {
                next = [...prev, id];
            }
            try {
                localStorage.setItem("snitch_wishlist", JSON.stringify(next));
            } catch (e) {
                console.error("wishlist save error", e);
            }
            return next;
        });
    };

    // Combine user DB products with curated Snitch products
    const combinedProducts = useMemo(() => {
        const dbItems = Array.isArray(allDbProducts) ? allDbProducts : [];
        const seenIds = new Set(dbItems.map((p) => String(p._id)));
        const uniqueCurated = CURATED_SNITCH_PRODUCTS.filter((p) => !seenIds.has(String(p._id)));
        return [...dbItems, ...uniqueCurated];
    }, [allDbProducts]);

    // Filter and Sort Products
    const filteredProducts = useMemo(() => {
        let result = [...combinedProducts];

        // 1. Text Search query
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            result = result.filter((p) => {
                const titleMatch = p.title?.toLowerCase().includes(query);
                const descMatch = p.description?.toLowerCase().includes(query);
                const categoryMatch = p.category?.toLowerCase().includes(query);
                const sellerMatch =
                    p.seller?.username?.toLowerCase().includes(query) ||
                    p.seller?.name?.toLowerCase().includes(query) ||
                    p.seller?.email?.toLowerCase().includes(query);
                return titleMatch || descMatch || categoryMatch || sellerMatch;
            });
        }

        // 2. Active Category / Gender Filter
        if (activeFilter.type) {
            const val = String(activeFilter.value || "").toLowerCase();
            if (activeFilter.type === "category") {
                result = result.filter((p) => {
                    const title = (p.title || "").toLowerCase();
                    const desc = (p.description || "").toLowerCase();
                    const cat = (p.category || "").toLowerCase();
                    return cat.includes(val) || title.includes(val) || desc.includes(val);
                });
            } else if (activeFilter.type === "mens-cat") {
                result = result.filter((p) => {
                    const title = (p.title || "").toLowerCase();
                    const desc = (p.description || "").toLowerCase();
                    const cat = (p.category || "").toLowerCase();
                    const isGenderMatch = p.gender === "mens" || !p.gender;
                    const isCatMatch = cat.includes(val) || title.includes(val) || desc.includes(val);
                    return isGenderMatch && isCatMatch;
                });
            } else if (activeFilter.type === "girls-cat") {
                result = result.filter((p) => {
                    const title = (p.title || "").toLowerCase();
                    const desc = (p.description || "").toLowerCase();
                    const cat = (p.category || "").toLowerCase();
                    const isGenderMatch = p.gender === "girls" || !p.gender;
                    const isCatMatch = cat.includes(val) || title.includes(val) || desc.includes(val);
                    return isGenderMatch && isCatMatch;
                });
            } else if (activeFilter.type === "gender") {
                result = result.filter((p) => p.gender === val || !p.gender);
            }
        }

        // 3. Sorting
        if (sortBy === "price-low") {
            result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
        } else if (sortBy === "price-high") {
            result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
        } else if (sortBy === "title") {
            result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        } else {
            // newest
            result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return result;
    }, [combinedProducts, searchTerm, activeFilter, sortBy]);

    // Handle Category Filter Click
    const handleCategoryClick = (type, value, label) => {
        if (activeFilter.type === type && activeFilter.value === value) {
            // toggle off
            setActiveFilter({ type: null, value: null, label: null });
        } else {
            setActiveFilter({ type, value, label });
            // Smooth scroll to catalog
            if (productsCatalogRef.current) {
                productsCatalogRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }
    };

    // Clear filter
    const handleClearFilter = () => {
        setActiveFilter({ type: null, value: null, label: null });
        setSearchTerm("");
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
                    animation: fadeIn 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
                /* Hide scrollbar for category row while keeping scrolling */
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <main className="min-h-screen w-full bg-[#fcfcfd] text-zinc-900 selection:bg-black selection:text-white">

                {/* ══════════════════════════════════════════════════════════
                    2. MAIN CONTAINER: Exact Mockup Layout Hierarchy
                    - Ads with images (Carousel Banner with 5 dots)
                    - Capsule Category Pills (Shirt, Pants, Girls clothes)
                    - Mens Category Grid (SHIRTS, TROUSERS, T-SHIRTS, JEANS, CARGOS)
                    - Girls Category Grid (SHIRTS, TROUSERS, T-SHIRTS, JEANS, CARGOS)
                    - Product Catalog Grid (Tall cards, Heart, +, Title, Price)
                ══════════════════════════════════════════════════════════ */}
                <div className="max-w-screen mx-auto px-4 sm:px-8 py-6 space-y-10">

                    {/* ──────────────────────────────────────────────────────────
                        SECTION A: "Ads with images" (Hero Banner Carousel)
                    ────────────────────────────────────────────────────────── */}
                    <section
                        className="relative rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-sm"
                        onMouseEnter={() => setIsHoveringBanner(true)}
                        onMouseLeave={() => setIsHoveringBanner(false)}
                    >
                        {/* Slide Display Container */}
                        <div className="relative aspect-[16/7] sm:aspect-[21/8] md:aspect-[24/8] min-h-[220px] sm:min-h-[280px] w-full overflow-hidden bg-zinc-900">
                            {HERO_BANNERS.map((banner, index) => {
                                const isActive = activeBanner === index;
                                return (
                                    <div
                                        key={banner.id}
                                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                                            }`}
                                    >
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="w-full h-full object-cover object-center brightness-[0.78]"
                                        />

                                        {/* Gradient Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

                                        {/* Banner Content */}
                                        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white max-w-2xl space-y-2 sm:space-y-3">

                                            {/* Tag / Offer pill */}
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-full bg-white text-black text-[10px] sm:text-[11px] font-black tracking-widest uppercase font-mono-code">
                                                    {banner.tag}
                                                </span>
                                                <span className="text-[11px] sm:text-xs text-yellow-400 font-bold uppercase tracking-wider font-mono-code">
                                                    {banner.offer}
                                                </span>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[1.05]">
                                                {banner.title}
                                            </h2>

                                            {/* Subtitle */}
                                            <p className="text-xs sm:text-sm text-zinc-300 font-light line-clamp-2 max-w-lg">
                                                {banner.subtitle}
                                            </p>

                                            {/* CTA Button */}
                                            <div className="pt-2">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (banner.category !== "all") {
                                                            handleCategoryClick("category", banner.category, banner.title);
                                                        } else if (productsCatalogRef.current) {
                                                            productsCatalogRef.current.scrollIntoView({ behavior: "smooth" });
                                                        }
                                                    }}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-zinc-100 text-black font-extrabold text-[11px] sm:text-xs uppercase tracking-widest rounded-full transition-transform active:scale-95 shadow-md cursor-pointer font-mono-code"
                                                >
                                                    <span>{banner.cta}</span>
                                                    <span className="text-base leading-none">→</span>
                                                </button>
                                            </div>

                                        </div>
                                    </div>
                                );
                            })}

                            {/* Left & Right Navigation Arrows */}
                            <button
                                type="button"
                                onClick={() =>
                                    setActiveBanner((prev) => (prev - 1 + HERO_BANNERS.length) % HERO_BANNERS.length)
                                }
                                aria-label="Previous Slide"
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-black flex items-center justify-center transition-all z-20 shadow-md backdrop-blur-sm cursor-pointer"
                            >
                                <ChevronLeftIcon className="w-5 h-5" />
                            </button>

                            <button
                                type="button"
                                onClick={() => setActiveBanner((prev) => (prev + 1) % HERO_BANNERS.length)}
                                aria-label="Next Slide"
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/70 hover:bg-white text-black flex items-center justify-center transition-all z-20 shadow-md backdrop-blur-sm cursor-pointer"
                            >
                                <ChevronRightIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Pagination Dots (• • • • • as shown in wireframe mockup) */}
                        <div className="py-3 bg-white border-t border-zinc-200 flex items-center justify-center gap-2">
                            {HERO_BANNERS.map((_, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setActiveBanner(i)}
                                    aria-label={`Slide ${i + 1}`}
                                    className={`transition-all duration-300 rounded-full cursor-pointer ${activeBanner === i
                                        ? "w-6 h-2 bg-black"
                                        : "w-2 h-2 bg-zinc-300 hover:bg-zinc-500"
                                        }`}
                                />
                            ))}
                        </div>
                    </section>


                    {/* ──────────────────────────────────────────────────────────
                        SECTION B: Category Capsules Row (Directly below Banner)
                        [ Shirt with image ] [ pents with image ] [ girl any cloths name with image ] [ ... ]
                    ────────────────────────────────────────────────────────── */}
                    <section>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {CATEGORY_CAPSULES.map((item) => {
                                const isSelected =
                                    activeFilter.type === "category" && activeFilter.value === item.category;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleCategoryClick("category", item.category, item.name)}
                                        className={`group relative p-2.5 sm:p-3 rounded-full border transition-all duration-200 flex items-center gap-3 text-left cursor-pointer ${isSelected
                                            ? "bg-black text-white border-black shadow-md scale-[1.02]"
                                            : "bg-white text-zinc-800 border-zinc-300 hover:border-black hover:shadow-xs"
                                            }`}
                                    >
                                        {/* Circular Image Thumbnail */}
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-zinc-100 border border-zinc-200 flex-shrink-0 group-hover:scale-105 transition-transform">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Label Text */}
                                        <div className="flex-1 min-w-0 pr-2">
                                            <span className="block text-[11px] sm:text-xs font-bold uppercase tracking-tight truncate">
                                                {item.name}
                                            </span>
                                            <span
                                                className={`block text-[9px] sm:text-[10px] tracking-tight truncate ${isSelected ? "text-zinc-300" : "text-zinc-500"
                                                    }`}
                                            >
                                                {item.label}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </section>


                    {/* ──────────────────────────────────────────────────────────
                        SECTION C: "Mens" Category Row
                        Heading: Mens
                        5 columns: SHIRTS, TROUSERS, T-SHIRTS, JEANS, CARGOS
                    ────────────────────────────────────────────────────────── */}
                    <section className="space-y-4 pt-2">
                        {/* Heading */}
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight uppercase">
                                Mens
                            </h2>
                            <div className="w-8 h-0.5 bg-black mx-auto mt-1" />
                        </div>

                        {/* 5 Cards Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                            {MENS_CATEGORIES.map((cat) => {
                                const isSelected =
                                    activeFilter.type === "mens-cat" && activeFilter.value === cat.category;

                                return (
                                    <div
                                        key={cat.id}
                                        onClick={() => handleCategoryClick("mens-cat", cat.category, `Mens ${cat.label}`)}
                                        className={`group cursor-pointer rounded-xl bg-white border transition-all duration-300 p-3 flex flex-col items-center justify-between text-center select-none ${isSelected
                                            ? "border-black ring-2 ring-black shadow-md bg-zinc-50"
                                            : "border-zinc-200 hover:border-black hover:shadow-sm"
                                            }`}
                                    >
                                        {/* Category Label at Top */}
                                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-zinc-900 group-hover:text-black mb-2 font-mono-code">
                                            {cat.label}
                                        </span>

                                        {/* Isolated Garment Image */}
                                        <div className="w-full aspect-[4/5] overflow-hidden flex items-center justify-center p-2 bg-transparent">
                                            <img
                                                src={cat.image}
                                                alt={cat.label}
                                                className="max-h-full max-w-full object-contain filter drop-shadow-sm "
                                            />
                                        </div>

                                        {/* Subtle Filter Chip */}
                                        <span
                                            className={`text-[9px] uppercase tracking-widest font-mono-code mt-2 px-2 py-0.5 rounded-full transition-colors ${isSelected
                                                ? "bg-black text-white"
                                                : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
                                                }`}
                                        >
                                            {isSelected ? "Active" : "Shop"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>


                    {/* ──────────────────────────────────────────────────────────
                        SECTION D: "Girls" Category Row
                        Heading: Girls
                        5 columns: SHIRTS, TROUSERS, T-SHIRTS, JEANS, CARGOS
                    ────────────────────────────────────────────────────────── */}
                    <section className="space-y-4 pt-2">
                        {/* Heading */}
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight uppercase">
                                Girls
                            </h2>
                            <div className="w-8 h-0.5 bg-black mx-auto mt-1" />
                        </div>

                        {/* 5 Cards Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                            {GIRLS_CATEGORIES.map((cat) => {
                                const isSelected =
                                    activeFilter.type === "girls-cat" && activeFilter.value === cat.category;

                                return (
                                    <div
                                        key={cat.id}
                                        onClick={() => handleCategoryClick("girls-cat", cat.category, `Girls ${cat.label}`)}
                                        className={`group cursor-pointer rounded-xl bg-white border transition-all duration-300 p-3 flex flex-col items-center justify-between text-center select-none ${isSelected
                                            ? "border-black ring-2 ring-black shadow-md bg-zinc-50"
                                            : "border-zinc-200 hover:border-black hover:shadow-sm"
                                            }`}
                                    >
                                        {/* Category Label at Top */}
                                        <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-zinc-900 group-hover:text-black mb-2 font-mono-code">
                                            {cat.label}
                                        </span>

                                        {/* Isolated Garment Image */}
                                        <div className="w-full aspect-[4/5] overflow-hidden flex items-center justify-center p-2 bg-transparent">
                                            <img
                                                src={cat.image}
                                                alt={cat.label}
                                                className="max-h-full max-w-full object-contain filter drop-shadow-sm "
                                            />
                                        </div>

                                        {/* Subtle Filter Chip */}
                                        <span
                                            className={`text-[9px] uppercase tracking-widest font-mono-code mt-2 px-2 py-0.5 rounded-full transition-colors ${isSelected
                                                ? "bg-black text-white"
                                                : "bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200"
                                                }`}
                                        >
                                            {isSelected ? "Active" : "Shop"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>


                    {/* ──────────────────────────────────────────────────────────
                        SECTION E: Snitch Product Catalog Grid (Bottom of Wireframe)
                        Multi-column responsive grid matching Snitch store
                    ────────────────────────────────────────────────────────── */}
                    <section ref={productsCatalogRef} className="pt-6 space-y-6">

                        {/* Catalog Header & Filters Bar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
                            <div>
                                <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight">
                                    Curated Product Drops
                                </h3>
                                <p className="text-xs text-zinc-500 font-normal">
                                    Showing {filteredProducts.length} curated apparel pieces
                                </p>
                            </div>

                            {/* Active Filter Pill & Sort Controls */}
                            <div className="flex items-center gap-3 flex-wrap">
                                {(activeFilter.type || searchTerm) && (
                                    <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 text-white rounded-full text-xs font-mono-code">
                                        <span>
                                            Filtered:{" "}
                                            <strong>{activeFilter.label || `"${searchTerm}"`}</strong>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={handleClearFilter}
                                            className="text-zinc-400 hover:text-white p-0.5 cursor-pointer"
                                            title="Clear filter"
                                        >
                                            <XIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}

                                {/* Sort Dropdown */}
                                <div className="relative flex items-center">
                                    <SortIcon className="absolute left-3 text-zinc-500 w-3.5 h-3.5 pointer-events-none" />
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="h-9 pl-8 pr-7 bg-white border border-zinc-300 rounded-full text-xs font-medium text-zinc-800 uppercase tracking-wider appearance-none focus:outline-none focus:border-black cursor-pointer font-mono-code"
                                    >
                                        <option value="newest">Sort: Newest</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="title">Alphabetical (A-Z)</option>
                                    </select>
                                    <span className="absolute right-2.5 pointer-events-none text-[9px] text-zinc-500">
                                        ▼
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Error state */}
                        {fetchError && (
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                                <span>Note: {fetchError}. Showing catalog backup drops.</span>
                                <button
                                    onClick={loadProducts}
                                    className="underline font-bold uppercase tracking-wider font-mono-code"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {/* Loading indicator */}
                        {loading && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="animate-pulse bg-white border border-zinc-200">
                                        <div className="aspect-[3/4] bg-zinc-200" />
                                        <div className="p-3 space-y-2">
                                            <div className="h-3 bg-zinc-200 rounded w-3/4" />
                                            <div className="h-3 bg-zinc-200 rounded w-1/3" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty Products Filter State */}
                        {!loading && filteredProducts.length === 0 && (
                            <div className="py-20 text-center border border-dashed border-zinc-300 rounded-2xl bg-zinc-50 p-8 space-y-4">
                                <PackageIcon className="w-12 h-12 text-zinc-400 mx-auto" />
                                <h4 className="text-base font-bold uppercase text-zinc-800">
                                    No products found matching criteria
                                </h4>
                                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                    Try clearing your current search keywords or selecting a different category.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleClearFilter}
                                    className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-full font-mono-code cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* The Actual Product Grid: Matching Mockup Layout */}
                        {!loading && filteredProducts.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                                {filteredProducts.map((prod) => (
                                    <ProductGridCard
                                        key={prod._id}
                                        product={prod}
                                        isWishlisted={wishlist.includes(prod._id)}
                                        onToggleWishlist={handleToggleWishlist}
                                        onClick={(item) => navigate(`/product/${item._id}`)}
                                    />
                                ))}
                            </div>
                        )}

                    </section>

                </div>

                {/* ══════════════════════════════════════════════════════════
                    FOOTER
                ══════════════════════════════════════════════════════════ */}
                <footer className="mt-20 border-t border-zinc-200 bg-white py-10 px-4 sm:px-8 text-center text-xs text-zinc-500 space-y-2 font-mono-code">
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