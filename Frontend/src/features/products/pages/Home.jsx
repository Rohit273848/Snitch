import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import { useSelector } from "react-redux";

// ─── Currency symbol helper ──────────────────────────────────────────────────
const currencySymbol = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function HeartIcon({ filled = false, className = "w-4 h-4" }) {
    if (filled) {
        return (
            <svg className={className} viewBox="0 0 24 24" fill="#8B263E" stroke="#8B263E" strokeWidth="1.5">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        );
    }
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
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

function ChevronLeftIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
    );
}

function ChevronRightIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    );
}

function WeaveIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5M6.75 3.75v16.5M12 3.75v16.5m5.25-16.5v16.5" />
        </svg>
    );
}

function RulerIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
        </svg>
    );
}

function ShieldIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function XIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

// ─── Editorial Looks Carousel Data (Split Hero Left Box) ─────────────────────
const EDITORIAL_LOOKS = [
    {
        lookNumber: "01",
        totalLooks: "03",
        title: "LOOK 01 / TRANSITIONAL OUTERWEAR",
        cloth: "Cloth: 100% Organic Melton & Combed Slub Cotton",
        atelier: "AUTUMN / BORDEAUX ATELIER",
        ensemblePrice: 6670,
        primaryTarget: "snitch-overshirt",
    },
    {
        lookNumber: "02",
        totalLooks: "03",
        title: "LOOK 02 / STRUCTURED MINIMALISM",
        cloth: "Cloth: 280 GSM Supima Cotton & Italian Super 120s Wool",
        atelier: "MILAN / NAVIGLI ATELIER",
        ensemblePrice: 4180,
        primaryTarget: "snitch-supima-tee",
    },
    {
        lookNumber: "03",
        totalLooks: "03",
        title: "LOOK 03 / RELAXED SARTORIAL",
        cloth: "Cloth: Double Pleated Melton Wool & Linen Blend",
        atelier: "LISBON / CHIADO ATELIER",
        ensemblePrice: 5380,
        primaryTarget: "snitch-pleated-trouser",
    },
];

// ─── Filter Pills Definition ──────────────────────────────────────────────────
const CATEGORY_TABS = [
    { id: "all", label: "All Pieces", filter: null },
    { id: "shirt", label: "Outerwear & Shirts", filter: "shirt" },
    { id: "trouser", label: "Tailored Trousers", filter: "trouser" },
    { id: "tshirt", label: "Heavyweight Knitwear", filter: "tshirt" },
    { id: "jeans", label: "Denim Archive", filter: "jeans" },
    { id: "cargo", label: "Cargo Craft", filter: "cargo" },
];

export default function Home() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const catalogSectionRef = useRef(null);
    const capsuleSectionRef = useRef(null);

    const [currentLookIdx, setCurrentLookIdx] = useState(0);
    const [activeHotspot, setActiveHotspot] = useState(null); // 'overshirt' | 'trouser' | null
    const [selectedTab, setSelectedTab] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [tailoringModalOpen, setTailoringModalOpen] = useState(false);
    const [selectedSizes, setSelectedSizes] = useState({
        "snitch-overshirt": "M",
        "snitch-supima-tee": "L",
        "snitch-pleated-trouser": "32",
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("snitch_wishlist") || "[]");
        } catch {
            return [];
        }
    });

    const { handleGetAllProducts } = useProduct();
    const allDbProducts = useSelector((state) => state.product.allProducts || []);
    const loading = useSelector((state) => state.product.loading);

    // Initial load of DB products from MongoDB
    useEffect(() => {
        handleGetAllProducts().catch(() => {});
    }, []);

    // Redirect any legacy ?search= queries to the dedicated Search Results Page
    useEffect(() => {
        const s = searchParams.get("search");
        if (s) {
            navigate(`/search?q=${encodeURIComponent(s)}`, { replace: true });
        }
    }, [searchParams, navigate]);

    // Toggle wishlist
    const handleToggleWishlist = (id) => {
        setWishlist((prev) => {
            const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
            try {
                localStorage.setItem("snitch_wishlist", JSON.stringify(next));
            } catch (e) {
                console.error("wishlist err", e);
            }
            return next;
        });
    };

    // Dynamically resolve flagship atelier piece IDs from MongoDB products
    const flagshipPieces = useMemo(() => {
        const dbItems = Array.isArray(allDbProducts) ? allDbProducts : [];
        const overshirt = dbItems.find((p) => (p.title || "").toLowerCase().includes("overshirt"));
        const supima = dbItems.find((p) => (p.title || "").toLowerCase().includes("supima"));
        const trouser = dbItems.find((p) => (p.title || "").toLowerCase().includes("trouser"));
        return {
            overshirtId: overshirt?._id || "snitch-overshirt",
            supimaId: supima?._id || "snitch-supima-tee",
            trouserId: trouser?._id || "snitch-pleated-trouser",
        };
    }, [allDbProducts]);

    // Products directly loaded from MongoDB
    const combinedProducts = useMemo(() => {
        return Array.isArray(allDbProducts) ? allDbProducts : [];
    }, [allDbProducts]);

    // Search query from URL or search box
    const searchQuery = (searchParams.get("search") || "").toLowerCase().trim();

    // Filter & Sort Products
    const filteredProducts = useMemo(() => {
        let result = [...combinedProducts];

        // Search filtering
        if (searchQuery) {
            result = result.filter((p) => {
                const titleMatch = (p.title || "").toLowerCase().includes(searchQuery);
                const descMatch = (p.description || "").toLowerCase().includes(searchQuery);
                const catMatch = (p.category || "").toLowerCase().includes(searchQuery);
                return titleMatch || descMatch || catMatch;
            });
        }

        // Category tab filter
        if (selectedTab !== "all") {
            result = result.filter((p) => {
                const cat = (p.category || "").toLowerCase();
                const title = (p.title || "").toLowerCase();
                return cat.includes(selectedTab) || title.includes(selectedTab);
            });
        }

        // Sorting
        if (sortBy === "price-low") {
            result.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
        } else if (sortBy === "price-high") {
            result.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
        } else if (sortBy === "title") {
            result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
        }

        return result;
    }, [combinedProducts, searchQuery, selectedTab, sortBy]);

    const activeLook = EDITORIAL_LOOKS[currentLookIdx];
    const activeTargetId = useMemo(() => {
        if (currentLookIdx === 0) return flagshipPieces.overshirtId;
        if (currentLookIdx === 1) return flagshipPieces.supimaId;
        return flagshipPieces.trouserId;
    }, [currentLookIdx, flagshipPieces]);

    const nextLook = () => {
        setCurrentLookIdx((prev) => (prev + 1) % EDITORIAL_LOOKS.length);
    };

    const prevLook = () => {
        setCurrentLookIdx((prev) => (prev - 1 + EDITORIAL_LOOKS.length) % EDITORIAL_LOOKS.length);
    };

    const scrollToCatalog = () => {
        if (catalogSectionRef.current) {
            catalogSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const scrollToCapsule = () => {
        if (capsuleSectionRef.current) {
            capsuleSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1917] selection:bg-[#1A1917] selection:text-[#FBF9F5] antialiased">
            {/* Custom font definitions for pure editorial aesthetic */}
            <style>{`
                .font-editorial-serif {
                    font-family: 'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
                }
                .font-interface-sans {
                    font-family: 'Plus Jakarta Sans', 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
            `}</style>

            {/* ══════════════════════════════════════════════════════════════════
                1. SPLIT HERO SECTION (Exact Reference Screenshot Layout)
            ══════════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 sm:pt-14 pb-12 sm:pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">

                    {/* ─── LEFT COLUMN: Campaign Eyebrow, Serif Headline, Copy, CTA ─── */}
                    <div className="lg:col-span-5 flex flex-col justify-between self-stretch space-y-8 sm:space-y-10">
                        <div className="space-y-5 sm:space-y-7">
                            {/* Campaign Eyebrow */}
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4A5340]" />
                                <span className="font-interface-sans text-[11px] font-semibold tracking-[0.24em] text-[#5A564D] uppercase">
                                    AUTUMN / WINTER 26
                                </span>
                            </div>

                            {/* Main Editorial Headline */}
                            <h1 className="font-editorial-serif text-5xl sm:text-6xl md:text-7xl font-normal leading-[1.04] tracking-[-0.02em] text-[#1A1917]">
                                Made for the everyday.
                            </h1>

                            {/* Supporting Copy */}
                            <p className="font-interface-sans text-sm sm:text-[15px] font-normal leading-relaxed text-[#5A564D] max-w-md">
                                Considered layers. Lasting materials. No extra noise. Tailored silhouettes built around unhurried craftsmanship and tactile slow cloth.
                            </p>

                            {/* Actions: Primary CTA + Secondary Link */}
                            <div className="flex flex-wrap items-center gap-5 pt-2">
                                <button
                                    type="button"
                                    onClick={scrollToCatalog}
                                    className="px-7 py-3.5 bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] font-interface-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 shadow-xs cursor-pointer"
                                >
                                    SHOP THE COLLECTION
                                </button>
                                <button
                                    type="button"
                                    onClick={scrollToCapsule}
                                    className="group inline-flex items-center gap-2 font-interface-sans text-[11px] font-semibold tracking-[0.18em] text-[#1A1917] hover:text-[#4A5340] uppercase transition-colors cursor-pointer"
                                >
                                    <span>EXPLORE THE LOOK</span>
                                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                                </button>
                            </div>
                        </div>

                        {/* Look Details Box (Bottom Left Box matching screenshot) */}
                        <div className="border border-[#E5DFD3] bg-[#F5F2EB]/70 p-4 sm:p-5 transition-all">
                            <div className="flex items-center justify-between pb-2 border-b border-[#E8E2D6] text-[11px] tracking-[0.18em] text-[#1A1917] font-semibold uppercase font-interface-sans">
                                <span>{activeLook.title}</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-[#6C685F] font-normal">{activeLook.lookNumber} — {activeLook.totalLooks}</span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={prevLook}
                                            aria-label="Previous Look"
                                            className="w-5 h-5 flex items-center justify-center hover:text-[#4A5340] cursor-pointer text-[#5A564D]"
                                        >
                                            <ChevronLeftIcon className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextLook}
                                            aria-label="Next Look"
                                            className="w-5 h-5 flex items-center justify-center hover:text-[#4A5340] cursor-pointer text-[#5A564D]"
                                        >
                                            <ChevronRightIcon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="pt-2 text-[11px] sm:text-xs text-[#5A564D] font-interface-sans leading-normal">
                                {activeLook.cloth}
                            </p>
                        </div>
                    </div>

                    {/* ─── RIGHT COLUMN: Strong Lifestyle Fashion Image with Hotspots ─── */}
                    <div className="lg:col-span-7 relative">
                        <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full overflow-hidden bg-[#ECE7DD] border border-[#E2DBD0] shadow-sm">
                            <img
                                src="/editorial/hero_bordeaux_menswear.jpg"
                                alt="Autumn Atelier Menswear Lifestyle"
                                className="w-full h-full object-cover object-top"
                                loading="eager"
                            />

                            {/* Top Right Floating Badge */}
                            <div className="absolute top-4 right-4 bg-[#FBF9F5]/85 backdrop-blur-md px-3 py-1.5 border border-white/60 text-[10px] font-semibold tracking-[0.2em] uppercase text-[#1A1917] font-interface-sans">
                                {activeLook.atelier}
                            </div>

                            {/* ─── Hotspot 1: Field Overshirt ─── */}
                            <div className="absolute top-[40%] left-[60%] -translate-x-1/2 -translate-y-1/2 z-20">
                                <button
                                    type="button"
                                    onClick={() => setActiveHotspot(activeHotspot === "overshirt" ? null : "overshirt")}
                                    className="relative w-7 h-7 rounded-full bg-[#FBF9F5]/90 hover:bg-[#FBF9F5] text-[#1A1917] border border-white/70 shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                    aria-label="View Field Overshirt details"
                                >
                                    <PlusIcon className="w-3.5 h-3.5" />
                                    <span className="absolute inset-0 rounded-full animate-ping bg-white/40 pointer-events-none" />
                                </button>

                                {/* Tooltip Popover */}
                                {activeHotspot === "overshirt" && (
                                    <div className="absolute top-9 left-1/2 -translate-x-1/2 w-48 bg-[#FBF9F5] border border-[#E2DBD0] shadow-xl p-3 z-30 font-interface-sans text-left space-y-1">
                                        <p className="text-[10px] tracking-[0.16em] uppercase text-[#4A5340] font-semibold">01 • OUTERWEAR</p>
                                        <p className="font-editorial-serif text-sm font-semibold text-[#1A1917]">The Field Overshirt</p>
                                        <p className="text-[11px] text-[#5A564D]">Muted Olive • ₹2,490</p>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/product/${flagshipPieces.overshirtId}`)}
                                            className="pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1A1917] hover:underline block"
                                        >
                                            INSPECT PIECE →
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* ─── Hotspot 2: Relaxed Pleated Trouser ─── */}
                            <div className="absolute top-[68%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20">
                                <button
                                    type="button"
                                    onClick={() => setActiveHotspot(activeHotspot === "trouser" ? null : "trouser")}
                                    className="relative w-7 h-7 rounded-full bg-[#FBF9F5]/90 hover:bg-[#FBF9F5] text-[#1A1917] border border-white/70 shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                    aria-label="View Pleated Trouser details"
                                >
                                    <PlusIcon className="w-3.5 h-3.5" />
                                    <span className="absolute inset-0 rounded-full animate-ping bg-white/40 pointer-events-none" />
                                </button>

                                {/* Tooltip Popover */}
                                {activeHotspot === "trouser" && (
                                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-48 bg-[#FBF9F5] border border-[#E2DBD0] shadow-xl p-3 z-30 font-interface-sans text-left space-y-1">
                                        <p className="text-[10px] tracking-[0.16em] uppercase text-[#4A5340] font-semibold">03 • BASE</p>
                                        <p className="font-editorial-serif text-sm font-semibold text-[#1A1917]">Relaxed Pleated Trouser</p>
                                        <p className="text-[11px] text-[#5A564D]">Deep Charcoal • ₹2,890</p>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/product/${flagshipPieces.trouserId}`)}
                                            className="pt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#1A1917] hover:underline block"
                                        >
                                            INSPECT PIECE →
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* ─── Bottom Overlay Card on Image (Complete Ensemble) ─── */}
                            <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 bg-[#FBF9F5]/90 backdrop-blur-md border border-white/80 p-3.5 sm:p-4 flex items-center justify-between gap-3 shadow-lg">
                                <div className="space-y-0.5 min-w-0">
                                    <span className="block font-interface-sans text-[9px] sm:text-[10px] font-semibold tracking-[0.2em] text-[#6C685F] uppercase">
                                        COMPLETE ENSEMBLE
                                    </span>
                                    <h4 className="font-editorial-serif text-sm sm:text-base font-normal text-[#1A1917] truncate">
                                        Look {activeLook.lookNumber}: Three-Piece Set — ₹{activeLook.ensemblePrice.toLocaleString("en-IN")}
                                    </h4>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => navigate(`/product/${activeTargetId}`)}
                                    className="px-4 sm:px-5 py-2 bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] font-interface-sans text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 flex-shrink-0 cursor-pointer"
                                >
                                    ACQUIRE
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                2. THREE FEATURE VALUE CARDS (Tactile Fabrication, Perpetual Fit, Quiet Luxury)
            ══════════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 border-t border-[#ECE7DD]">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

                    {/* Card 01: Fabric Origin */}
                    <div className="bg-[#F5F2EB]/70 border border-[#E5DFD3] p-7 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#1A1917]/30 transition-colors">
                        <div className="space-y-4">
                            <div className="w-9 h-9 rounded-full bg-[#EAE5DB] text-[#4A5340] flex items-center justify-center">
                                <WeaveIcon className="w-4 h-4" />
                            </div>
                            <span className="block font-interface-sans text-[10px] font-bold tracking-[0.22em] text-[#6C685F] uppercase">
                                01 / FABRIC ORIGIN
                            </span>
                            <h3 className="font-editorial-serif text-2xl font-normal text-[#1A1917]">
                                Tactile Fabrication
                            </h3>
                            <p className="font-interface-sans text-xs sm:text-[13px] leading-relaxed text-[#5A564D]">
                                Spun and finished across heritage Portuguese and Biella Italian mills using certified organic cottons, low-impact botanical dyes, and resilient melton wools.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] uppercase font-interface-sans text-[#1A1917]">
                            <span>TRACEABILITY VERIFIED</span>
                            <span>⊙</span>
                        </div>
                    </div>

                    {/* Card 02: Engineering */}
                    <div className="bg-[#F5F2EB]/70 border border-[#E5DFD3] p-7 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#1A1917]/30 transition-colors">
                        <div className="space-y-4">
                            <div className="w-9 h-9 rounded-full bg-[#EAE5DB] text-[#4A5340] flex items-center justify-center">
                                <RulerIcon className="w-4 h-4" />
                            </div>
                            <span className="block font-interface-sans text-[10px] font-bold tracking-[0.22em] text-[#6C685F] uppercase">
                                02 / ENGINEERING
                            </span>
                            <h3 className="font-editorial-serif text-2xl font-normal text-[#1A1917]">
                                Perpetual Fit
                            </h3>
                            <p className="font-interface-sans text-xs sm:text-[13px] leading-relaxed text-[#5A564D]">
                                Draped with architectural balance. Every seam, pleat, and drop is tuned for fluid movement without losing structural authority throughout daily transit.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] uppercase font-interface-sans text-[#1A1917]">
                            <span>PATTERN STUDIO GRADE</span>
                            <span>⋀</span>
                        </div>
                    </div>

                    {/* Card 03: Philosophy */}
                    <div className="bg-[#F5F2EB]/70 border border-[#E5DFD3] p-7 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#1A1917]/30 transition-colors">
                        <div className="space-y-4">
                            <div className="w-9 h-9 rounded-full bg-[#EAE5DB] text-[#4A5340] flex items-center justify-center">
                                <ShieldIcon className="w-4 h-4" />
                            </div>
                            <span className="block font-interface-sans text-[10px] font-bold tracking-[0.22em] text-[#6C685F] uppercase">
                                03 / PHILOSOPHY
                            </span>
                            <h3 className="font-editorial-serif text-2xl font-normal text-[#1A1917]">
                                Quiet Luxury
                            </h3>
                            <p className="font-interface-sans text-xs sm:text-[13px] leading-relaxed text-[#5A564D]">
                                Zero external badges or superfluous insignias. Longevity guaranteed through dual-needle bar tacks, real horn buttons, and repairable seams.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-[#E8E2D6] flex items-center justify-between text-[10px] font-semibold tracking-[0.2em] uppercase font-interface-sans text-[#1A1917]">
                            <span>LIFETIME REPAIR GUARANTEE</span>
                            <span>⛨</span>
                        </div>
                    </div>

                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                3. THE CAPSULE DECONSTRUCTED / The Key Ensemble Pieces
            ══════════════════════════════════════════════════════════════════ */}
            <section ref={capsuleSectionRef} id="capsule-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 border-t border-[#ECE7DD]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 sm:pb-12">
                    <div className="space-y-2">
                        <span className="block font-interface-sans text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#6C685F] uppercase">
                            THE CAPSULE DECONSTRUCTED
                        </span>
                        <h2 className="font-editorial-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#1A1917]">
                            The Key Ensemble Pieces
                        </h2>
                    </div>
                    <p className="font-interface-sans text-xs sm:text-sm text-[#5A564D] max-w-sm">
                        Individually articulated, designed to work as a unified tone-on-tone daily uniform.
                    </p>
                </div>

                {/* 3 Pieces Grid Matching Screenshot Reference */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">

                    {/* ─── Piece 1: The Field Overshirt ─── */}
                    <div className="group bg-[#F7F4EC] border border-[#E5DFD3] p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-[#1A1917] transition-all">
                        <div className="space-y-4">
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#ECE7DD]">
                                <span className="absolute top-3 left-3 bg-[#FBF9F5]/90 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1917] font-interface-sans z-10">
                                    FIELD READY
                                </span>
                                <img
                                    src="/editorial/overshirt_olive_piece.jpg"
                                    alt="The Field Overshirt"
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-baseline justify-between">
                                    <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#1A1917]">
                                        The Field Overshirt
                                    </h3>
                                    <span className="font-interface-sans text-sm font-semibold text-[#1A1917]">
                                        ₹2,490
                                    </span>
                                </div>
                                <p className="font-interface-sans text-[11px] text-[#6C685F]">
                                    Muted Olive • 100% Textured Cotton
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#E8E2D6] flex items-center justify-between">
                            {/* Size Chips */}
                            <div className="flex items-center gap-1.5 font-interface-sans">
                                {["S", "M", "L", "XL"].map((sz) => (
                                    <button
                                        key={sz}
                                        type="button"
                                        onClick={() => setSelectedSizes({ ...selectedSizes, "snitch-overshirt": sz })}
                                        className={`w-6 h-6 text-[10px] font-semibold border flex items-center justify-center transition-colors cursor-pointer ${
                                            selectedSizes["snitch-overshirt"] === sz
                                                ? "bg-[#1A1917] text-[#FBF9F5] border-[#1A1917]"
                                                : "border-[#D5CEBF] text-[#5A564D] hover:border-[#1A1917] hover:text-[#1A1917]"
                                        }`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(`/product/${flagshipPieces.overshirtId}`)}
                                className="font-interface-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1917] hover:text-[#4A5340] cursor-pointer"
                            >
                                INSPECT →
                            </button>
                        </div>
                    </div>

                    {/* ─── Piece 2: Heavyweight Supima Tee ─── */}
                    <div className="group bg-[#F7F4EC] border border-[#E5DFD3] p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-[#1A1917] transition-all">
                        <div className="space-y-4">
                            <div className="relative aspect-[4/5] overflow-hidden bg-[#ECE7DD]">
                                <span className="absolute top-3 left-3 bg-[#FBF9F5]/90 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1917] font-interface-sans z-10">
                                    CORE LAYER
                                </span>
                                <img
                                    src="/editorial/supima_tee_piece.jpg"
                                    alt="Heavyweight Supima Tee"
                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-baseline justify-between">
                                    <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#1A1917]">
                                        Heavyweight Supima Tee
                                    </h3>
                                    <span className="font-interface-sans text-sm font-semibold text-[#1A1917]">
                                        ₹1,290
                                    </span>
                                </div>
                                <p className="font-interface-sans text-[11px] text-[#6C685F]">
                                    Chalk White • 280 GSM Supima Jersey
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#E8E2D6] flex items-center justify-between">
                            {/* Size Chips */}
                            <div className="flex items-center gap-1.5 font-interface-sans">
                                {["S", "M", "L", "XL"].map((sz) => (
                                    <button
                                        key={sz}
                                        type="button"
                                        onClick={() => setSelectedSizes({ ...selectedSizes, "snitch-supima-tee": sz })}
                                        className={`w-6 h-6 text-[10px] font-semibold border flex items-center justify-center transition-colors cursor-pointer ${
                                            selectedSizes["snitch-supima-tee"] === sz
                                                ? "bg-[#1A1917] text-[#FBF9F5] border-[#1A1917]"
                                                : "border-[#D5CEBF] text-[#5A564D] hover:border-[#1A1917] hover:text-[#1A1917]"
                                        }`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(`/product/${flagshipPieces.supimaId}`)}
                                className="font-interface-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1917] hover:text-[#4A5340] cursor-pointer"
                            >
                                INSPECT →
                            </button>
                        </div>
                    </div>

                    {/* ─── Piece 3: Relaxed Pleated Trouser (Split Detail Images) ─── */}
                    <div className="group bg-[#F7F4EC] border border-[#E5DFD3] p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-[#1A1917] transition-all">
                        <div className="space-y-4">
                            {/* Split stacked photos matching the screenshot reference */}
                            <div className="relative aspect-[4/5] flex flex-col gap-1.5 overflow-hidden">
                                <span className="absolute top-3 left-3 bg-[#FBF9F5]/90 backdrop-blur-xs px-2.5 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-[#1A1917] font-interface-sans z-10">
                                    TAILORED BASE
                                </span>
                                <div className="h-1/2 overflow-hidden bg-[#ECE7DD]">
                                    <img
                                        src="/editorial/pleated_trouser_piece.jpg"
                                        alt="Pleated Trouser Waistband"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>
                                <div className="h-1/2 overflow-hidden bg-[#ECE7DD]">
                                    <img
                                        src="/editorial/trouser_cuff_detail.jpg"
                                        alt="Pleated Trouser Hem and Cuff Detail"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-baseline justify-between">
                                    <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#1A1917]">
                                        Relaxed Pleated Trouser
                                    </h3>
                                    <span className="font-interface-sans text-sm font-semibold text-[#1A1917]">
                                        ₹2,890
                                    </span>
                                </div>
                                <p className="font-interface-sans text-[11px] text-[#6C685F]">
                                    Deep Charcoal • Italian Super 120s Wool
                                </p>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-[#E8E2D6] flex items-center justify-between">
                            {/* Size Chips */}
                            <div className="flex items-center gap-1.5 font-interface-sans">
                                {["30", "32", "34", "36"].map((sz) => (
                                    <button
                                        key={sz}
                                        type="button"
                                        onClick={() => setSelectedSizes({ ...selectedSizes, "snitch-pleated-trouser": sz })}
                                        className={`w-6 h-6 text-[10px] font-semibold border flex items-center justify-center transition-colors cursor-pointer ${
                                            selectedSizes["snitch-pleated-trouser"] === sz
                                                ? "bg-[#1A1917] text-[#FBF9F5] border-[#1A1917]"
                                                : "border-[#D5CEBF] text-[#5A564D] hover:border-[#1A1917] hover:text-[#1A1917]"
                                        }`}
                                    >
                                        {sz}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(`/product/${flagshipPieces.trouserId}`)}
                                className="font-interface-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A1917] hover:text-[#4A5340] cursor-pointer"
                            >
                                INSPECT →
                            </button>
                        </div>
                    </div>

                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                4. COMPLIMENTARY TAILORING CONCIERGE BANNER
            ══════════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
                <div className="bg-[#EFECE5] border border-[#DFD9CD] p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div className="space-y-1.5">
                        <span className="block font-interface-sans text-[10px] font-bold tracking-[0.24em] text-[#6C685F] uppercase">
                            COMPLIMENTARY TAILORING CONCIERGE
                        </span>
                        <h3 className="font-editorial-serif text-xl sm:text-2xl md:text-3xl font-normal text-[#1A1917]">
                            Trouser hemming and cuffing included with every pair.
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setTailoringModalOpen(true)}
                        className="px-6 py-3 bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] font-interface-sans text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-200 active:scale-95 flex-shrink-0 cursor-pointer text-center"
                    >
                        EXPLORE TAILORING CARE
                    </button>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                5. COMPLETE STOREFRONT CATALOG INTEGRATION (All Apparel Pieces)
            ══════════════════════════════════════════════════════════════════ */}
            <section ref={catalogSectionRef} id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 border-t border-[#ECE7DD] space-y-8">
                {/* Catalog Controls Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[#ECE7DD]">
                    <div className="space-y-1">
                        <span className="block font-interface-sans text-[10px] font-bold tracking-[0.24em] text-[#6C685F] uppercase">
                            ATELIER ARCHIVE
                        </span>
                        <h2 className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#1A1917]">
                            The Menswear Collection
                        </h2>
                        <p className="font-interface-sans text-xs text-[#6C685F]">
                            Displaying {filteredProducts.length} curated pieces {searchQuery && `matching "${searchQuery}"`}
                        </p>
                    </div>

                    {/* Filter Pills & Sorting */}
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                            {CATEGORY_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedTab(tab.id)}
                                    className={`px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-all cursor-pointer whitespace-nowrap font-interface-sans ${
                                        selectedTab === tab.id
                                            ? "bg-[#1A1917] text-[#FBF9F5]"
                                            : "bg-[#F5F2EB] text-[#5A564D] hover:text-[#1A1917] border border-[#E5DFD3]"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Sort Selector */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-[#F5F2EB] border border-[#E5DFD3] text-[#1A1917] text-[10px] font-semibold tracking-[0.16em] uppercase px-3 py-1.5 focus:outline-none cursor-pointer font-interface-sans"
                        >
                            <option value="newest">Sort: Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="title">Alphabetical (A-Z)</option>
                        </select>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="animate-pulse bg-[#F5F2EB] aspect-[3/4]" />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredProducts.length === 0 && (
                    <div className="py-20 text-center bg-[#F5F2EB] border border-[#E5DFD3] p-8 space-y-3 font-interface-sans">
                        <h4 className="font-editorial-serif text-2xl text-[#1A1917]">No pieces found</h4>
                        <p className="text-xs text-[#6C685F]">Try clearing filters or search terms.</p>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedTab("all");
                                navigate("/");
                            }}
                            className="px-5 py-2 bg-[#1A1917] text-[#FBF9F5] text-[11px] font-semibold tracking-[0.2em] uppercase"
                        >
                            VIEW ALL PIECES
                        </button>
                    </div>
                )}

                {/* Product Grid */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
                        {filteredProducts.map((prod) => {
                            const isWish = wishlist.includes(prod._id);
                            const coverImg =
                                prod.images?.find((img) => img?.isCover)?.url ||
                                prod.images?.[0]?.url ||
                                prod.images?.[0] ||
                                "";
                            const symbol = currencySymbol[prod.price?.currency] ?? "₹";
                            const formattedPrice = Number(prod.price?.amount || 0).toLocaleString("en-IN");

                            return (
                                <div
                                    key={prod._id}
                                    onClick={() => navigate(`/product/${prod._id}`)}
                                    className="group cursor-pointer bg-[#F7F4EC] border border-[#E5DFD3] hover:border-[#1A1917] p-3 sm:p-4 flex flex-col justify-between space-y-3 transition-all duration-300"
                                >
                                    <div>
                                        {/* Image */}
                                        <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE7DD]">
                                            {coverImg && (
                                                <img
                                                    src={coverImg}
                                                    alt={prod.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                                                />
                                            )}

                                            {/* Tag */}
                                            {prod.tag && (
                                                <span className="absolute top-2.5 left-2.5 bg-[#FBF9F5]/90 backdrop-blur-xs px-2 py-0.5 text-[8px] font-bold tracking-[0.18em] uppercase text-[#1A1917] font-interface-sans">
                                                    {prod.tag}
                                                </span>
                                            )}

                                            {/* Wishlist Heart */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleToggleWishlist(prod._id);
                                                }}
                                                className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#FBF9F5]/85 hover:bg-[#FBF9F5] shadow-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                                                aria-label="Wishlist"
                                            >
                                                <HeartIcon filled={isWish} className="w-3.5 h-3.5 text-[#1A1917]" />
                                            </button>
                                        </div>

                                        {/* Info */}
                                        <div className="pt-3 space-y-1">
                                            <h3 className="font-editorial-serif text-lg font-normal text-[#1A1917] truncate group-hover:text-[#4A5340] transition-colors">
                                                {prod.title}
                                            </h3>
                                            <p className="font-interface-sans text-[11px] text-[#6C685F] truncate">
                                                {prod.subtitle || prod.category}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-2 border-t border-[#E8E2D6] flex items-center justify-between font-interface-sans">
                                        <span className="text-xs font-semibold text-[#1A1917]">
                                            {symbol}{formattedPrice}
                                        </span>
                                        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1A1917] group-hover:text-[#4A5340]">
                                            VIEW →
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* ══════════════════════════════════════════════════════════════════
                6. EDITORIAL FOOTER (Exact 4 Column Luxury Layout)
            ══════════════════════════════════════════════════════════════════ */}
            <footer className="border-t border-[#ECE7DD] bg-[#F5F2EB] pt-14 pb-12 mt-12 text-[#1A1917] font-interface-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">

                        {/* Column 1: Brand Manifesto */}
                        <div className="space-y-3">
                            <span
                                className="font-editorial-serif text-xl sm:text-2xl font-normal tracking-[0.18em] uppercase block text-[#1A1917]"
                            >
                                SNITCH
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
                                    <button onClick={scrollToCapsule} className="hover:text-[#4A5340] cursor-pointer">
                                        Tailored Outerwear
                                    </button>
                                </li>
                                <li>
                                    <button onClick={scrollToCapsule} className="hover:text-[#4A5340] cursor-pointer">
                                        Structured Trousers
                                    </button>
                                </li>
                                <li>
                                    <button onClick={scrollToCatalog} className="hover:text-[#4A5340] cursor-pointer">
                                        Supima Knitwear
                                    </button>
                                </li>
                                <li>
                                    <button onClick={scrollToCatalog} className="hover:text-[#4A5340] cursor-pointer">
                                        Atelier Footwear
                                    </button>
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
                                    <button onClick={() => setTailoringModalOpen(true)} className="hover:text-[#4A5340] cursor-pointer">
                                        Bespoke Fitting
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Region & Currency */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                REGION &amp; CURRENCY
                            </h4>
                            <p className="text-xs font-semibold text-[#1A1917]">
                                INDIA (INR ₹) / UNITED STATES (USD $)
                            </p>
                            <p className="text-[11px] text-[#6C685F] leading-normal">
                                Duties &amp; local sales taxes calculated at checkout.
                            </p>
                        </div>

                    </div>

                    {/* Bottom Legal Line */}
                    <div className="pt-8 border-t border-[#E8E2D6] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6C685F]">
                        <p>© 2026 SNITCH Menswear Studio. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <span className="hover:text-[#1A1917] cursor-pointer">Sustainability Pledge</span>
                            <span className="hover:text-[#1A1917] cursor-pointer">Privacy</span>
                            <span className="hover:text-[#1A1917] cursor-pointer">Terms</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* ══════════════════════════════════════════════════════════════════
                7. MODAL: TAILORING CONCIERGE CARE
            ══════════════════════════════════════════════════════════════════ */}
            {tailoringModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs font-interface-sans">
                    <div className="bg-[#FBF9F5] border border-[#E5DFD3] max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
                        <button
                            type="button"
                            onClick={() => setTailoringModalOpen(false)}
                            className="absolute top-5 right-5 text-[#5A564D] hover:text-[#1A1917] p-1 cursor-pointer"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                        <span className="block text-[10px] font-bold tracking-[0.24em] text-[#4A5340] uppercase">
                            ATELIER BESPOKE SERVICE
                        </span>
                        <h3 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-[#1A1917]">
                            Complimentary Tailoring Concierge
                        </h3>
                        <p className="text-xs sm:text-sm text-[#5A564D] leading-relaxed">
                            Every pair of Snitch trousers includes precision inseam hemming or 1.5” classic turn-up cuffs at zero additional charge.
                        </p>
                        <div className="p-4 bg-[#F5F2EB] border border-[#E5DFD3] space-y-2 text-xs">
                            <div className="flex justify-between font-semibold text-[#1A1917]">
                                <span>1. Select Custom Inseam</span>
                                <span>Any measurement</span>
                            </div>
                            <div className="flex justify-between font-semibold text-[#1A1917]">
                                <span>2. Turnaround Time</span>
                                <span>48 Hours at Atelier</span>
                            </div>
                            <div className="flex justify-between font-semibold text-[#1A1917]">
                                <span>3. Guaranteed Fit</span>
                                <span>Free re-alterations</span>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setTailoringModalOpen(false)}
                            className="w-full py-3 bg-[#1A1917] text-[#FBF9F5] text-xs font-semibold tracking-[0.2em] uppercase cursor-pointer"
                        >
                            UNDERSTOOD &amp; CLOSE
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}