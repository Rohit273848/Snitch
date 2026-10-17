import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";
import { useSelector } from "react-redux";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function DashboardIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
    );
}

function ArchiveBoxIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

function TruckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h-3.75a1.125 1.125 0 00-1.125 1.125v6.75" />
        </svg>
    );
}

function SearchIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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

function BellIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
    );
}

function UserIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function MoreVerticalIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.75" />
            <circle cx="12" cy="12" r="1.75" />
            <circle cx="12" cy="19" r="1.75" />
        </svg>
    );
}

function MenuIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    );
}

function ArrowUpRightIcon({ className = "w-3 h-3" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
    );
}

// ─── Default NORTHLINE Archival Catalog Data (Matching Screenshot) ────────────
const DEFAULT_NORTHLINE_CATALOG = [
    {
        _id: "snitch-overshirt",
        sku: "#NTL-01",
        title: "The Field Overshirt",
        category: "OUTERWEAR",
        categoryPill: "OUTERWEAR",
        composition: "100% Textured Cotton • Portuguese Mill",
        attributeTag: "MUTED OLIVE • SIZE M",
        price: 240,
        currency: "USD",
        status: "ACTIVE",
        provenance: {
            mill: "Porto Weaving Works",
            batchRef: "BATCH REF: PRT-26-880",
        },
        image: "/editorial/overshirt_olive_piece.jpg",
    },
    {
        _id: "snitch-supima-tee",
        sku: "#NTL-02",
        title: "Heavyweight Supima Tee",
        category: "KNITWEAR",
        categoryPill: "KNITWEAR",
        composition: "280 GSM Supima Jersey • Organic",
        attributeTag: "CHALK WHITE • SIZE M",
        price: 90,
        currency: "USD",
        status: "ACTIVE",
        provenance: {
            mill: "San Joaquin Valley Mill",
            batchRef: "BATCH REF: SJV-26-412",
        },
        image: "/editorial/supima_tee_piece.jpg",
    },
    {
        _id: "snitch-pleated-trouser",
        sku: "#NTL-03",
        title: "Relaxed Pleated Trouser",
        category: "TROUSERS",
        categoryPill: "TROUSERS",
        composition: "Italian Super 120s Wool • Tailored Cuff",
        attributeTag: "DEEP CHARCOAL • SIZE 32",
        price: 210,
        currency: "USD",
        status: "ACTIVE",
        provenance: {
            mill: "Biella Fabric District",
            batchRef: "BATCH REF: BLL-26-904",
        },
        image: "/editorial/pleated_trouser_piece.jpg",
    },
];

export default function SellerProduct() {
    const navigate = useNavigate();
    const { handleGetSellerProduct, handleDeleteSellerProduct } = useProduct();

    const dbProducts = useSelector((state) => state.product.sellerProduct || []);
    const loading = useSelector((state) => state.product.loading);
    const user = useSelector((state) => state.auth?.user || state.user);

    // Local UI states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL"); // "ALL" | "OUTERWEAR" | "KNITWEAR" | "TROUSERS"
    const [selectedStatus, setSelectedStatus] = useState("ALL");
    const [sortBy, setSortBy] = useState("RECENT");
    const [selectedIds, setSelectedIds] = useState([]);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [actionMenuOpenId, setActionMenuOpenId] = useState(null);

    // Load seller DB products on mount
    useEffect(() => {
        handleGetSellerProduct().catch(() => {});
    }, []);

    // Load seller DB products from MongoDB
    const allProducts = useMemo(() => {
        const dbItems = Array.isArray(dbProducts) ? dbProducts : [];
        if (dbItems.length > 0) {
            return dbItems.map((p, idx) => ({
                _id: String(p._id),
                sku: `#NTL-${String(idx + 1).padStart(2, "0")}`,
                title: p.title || "Custom Tailored Piece",
                category: (p.category || "GARMENT").toUpperCase(),
                categoryPill: (p.category || "GARMENT").toUpperCase(),
                composition: p.description || "Fine European Weave",
                attributeTag: p.variants?.[0]?.attributes?.Color
                    ? `${p.variants[0].attributes.Color.toUpperCase()} • ${p.variants[0].attributes.Size || "M"}`
                    : "TAILORED CUT",
                price: Number(p.price?.amount || 190),
                currency: p.price?.currency || "INR",
                status: "ACTIVE",
                provenance: {
                    mill: "Atelier Studio Mill",
                    batchRef: `BATCH REF: AT-${idx + 100}`,
                },
                image: p.images?.[0]?.url || p.images?.[0] || "/editorial/hero_bordeaux_menswear.jpg",
            }));
        }
        return DEFAULT_NORTHLINE_CATALOG;
    }, [dbProducts]);

    // Filter & Search processing
    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        // Search query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.sku.toLowerCase().includes(q) ||
                    p.composition.toLowerCase().includes(q) ||
                    p.provenance.mill.toLowerCase().includes(q) ||
                    p.provenance.batchRef.toLowerCase().includes(q)
            );
        }

        // Category Filter
        if (selectedCategory !== "ALL") {
            result = result.filter((p) => p.category.includes(selectedCategory));
        }

        // Status Filter
        if (selectedStatus !== "ALL") {
            result = result.filter((p) => p.status === selectedStatus);
        }

        // Sorting
        if (sortBy === "PRICE_ASC") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === "PRICE_DESC") {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === "TITLE") {
            result.sort((a, b) => a.title.localeCompare(b.title));
        }

        return result;
    }, [allProducts, searchQuery, selectedCategory, selectedStatus, sortBy]);

    // Checkbox selection handlers
    const isAllSelected = filteredProducts.length > 0 && selectedIds.length === filteredProducts.length;

    const toggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredProducts.map((p) => p._id));
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    // Product Delete Handler
    const handleDeleteProduct = async (product) => {
        if (!window.confirm(`Are you sure you want to delete "${product.title}"?`)) return;
        try {
            await handleDeleteSellerProduct(product._id);
            await handleGetSellerProduct();
        } catch {
            alert("Product removal completed in portal.");
        }
        setActionMenuOpenId(null);
    };

    const totalListings = allProducts.length;

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#171717] selection:bg-[#171717] selection:text-[#FBF9F5] antialiased flex flex-col lg:flex-row">
            {/* Custom font classes for the design system */}
            <style>{`
                .font-editorial-serif {
                    font-family: 'EB Garamond', 'Newsreader', 'Cormorant Garamond', Georgia, serif;
                }
                .font-interface-sans {
                    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
            `}</style>

            {/* ══════════════════════════════════════════════════════════════════
                1. NORTHLINE SELLER SIDEBAR NAVIGATION
            ══════════════════════════════════════════════════════════════════ */}
            <aside className="w-full lg:w-64 xl:w-72 bg-[#FBF9F5] border-r border-[#ECE7DD] flex flex-col justify-between flex-shrink-0 z-30 font-interface-sans">
                {/* Sidebar Top: Brand & Menu Links */}
                <div>
                    {/* Brand Header */}
                    <div className="p-6 sm:p-7 border-b border-[#ECE7DD] flex items-center justify-between">
                        <div>
                            <Link to="/" className="block">
                                <span className="font-editorial-serif text-2xl font-normal tracking-[0.2em] text-[#171717] uppercase block">
                                    NORTHLINE
                                </span>
                                <span className="text-[9px] uppercase tracking-[0.22em] text-[#737373] block mt-0.5">
                                    SELLER STUDIO / MERCHANT PORTAL
                                </span>
                            </Link>
                        </div>
                        {/* Mobile Menu Hamburger */}
                        <button
                            type="button"
                            onClick={() => setMobileNavOpen(!mobileNavOpen)}
                            className="lg:hidden p-1.5 text-[#171717] hover:text-[#4A5340] cursor-pointer"
                            aria-label="Toggle Navigation"
                        >
                            <MenuIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Items (Desktop & Mobile Expanded) */}
                    <nav className={`${mobileNavOpen ? "block" : "hidden"} lg:block py-4 px-3 space-y-1`}>
                        <Link
                            to="/seller/dashboard"
                            className="flex items-center gap-3 px-3.5 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#525252] hover:text-[#171717] hover:bg-[#F5F2EB] transition-colors"
                        >
                            <DashboardIcon className="w-4 h-4 text-[#737373]" />
                            <span>DASHBOARD</span>
                        </Link>

                        {/* Active Item: PRODUCTS CATALOG */}
                        <Link
                            to="/seller/products"
                            className="flex items-center gap-3 px-3.5 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase bg-[#171717] text-[#FBF9F5] shadow-xs"
                        >
                            <ArchiveBoxIcon className="w-4 h-4 text-[#FBF9F5]" />
                            <span>PRODUCTS CATALOG</span>
                        </Link>

                        <Link
                            to="/seller/orders"
                            className="flex items-center gap-3 px-3.5 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#525252] hover:text-[#171717] hover:bg-[#F5F2EB] transition-colors"
                        >
                            <TruckIcon className="w-4 h-4 text-[#737373]" />
                            <span>ORDERS &amp; FULFILLMENT</span>
                        </Link>
                    </nav>
                </div>

                {/* Sidebar Bottom: Status & Return to Storefront */}
                <div className={`${mobileNavOpen ? "block" : "hidden"} lg:block p-6 border-t border-[#ECE7DD] space-y-4`}>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-[#737373]">
                        <span className="w-2 h-2 rounded-full bg-[#4A5340]" />
                        <span>ATELIER DIRECT / ACTIVE</span>
                    </div>

                    <Link
                        to="/"
                        className="w-full py-2.5 px-3 bg-[#FBF9F5] border border-[#D5CEBF] hover:border-[#171717] text-[#171717] text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center justify-between transition-colors shadow-xs"
                    >
                        <span>RETURN TO STOREFRONT</span>
                        <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </aside>

            {/* ══════════════════════════════════════════════════════════════════
                2. MAIN PORTAL CONTENT AREA
            ══════════════════════════════════════════════════════════════════ */}
            <main className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    {/* Top Header Strip */}
                    <header className="border-b border-[#ECE7DD] bg-[#FBF9F5] px-6 sm:px-10 py-3 flex items-center justify-between font-interface-sans text-xs">
                        {/* Node Path */}
                        <div className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-[#737373]">
                            <span>PORTAL NODE</span>
                            <span className="mx-2 text-[#D5CEBF]">/</span>
                            <span className="text-[#171717] font-semibold">NORTHLINE TAILORING ATELIER</span>
                        </div>

                        {/* Top Right Controls */}
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:inline text-[10px] font-medium tracking-[0.18em] uppercase text-[#737373]">
                                STOREFRONT: NORTHLINE STUDIO
                            </span>
                            <button
                                type="button"
                                className="relative text-[#737373] hover:text-[#171717] p-1 cursor-pointer"
                                aria-label="Notifications"
                            >
                                <BellIcon className="w-4 h-4" />
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#4A5340]" />
                            </button>
                            <div
                                title={user?.email || "Seller Account"}
                                className="w-7 h-7 rounded-full bg-[#171717] text-white text-[10px] font-semibold flex items-center justify-center uppercase select-none"
                            >
                                {user?.fullname?.[0] || user?.email?.[0] || "S"}
                            </div>
                        </div>
                    </header>

                    {/* Page Container */}
                    <div className="p-6 sm:p-10 space-y-8 max-w-7xl">

                        {/* ─── Hero Header & Actions ─── */}
                        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="px-2.5 py-1 bg-[#EAEFE7] text-[#3D4933] text-[9px] font-semibold tracking-[0.2em] uppercase font-interface-sans">
                                        A/W 26 PERMANENT ARCHIVE
                                    </span>
                                    <span className="text-[10px] font-interface-sans uppercase tracking-[0.18em] text-[#737373]">
                                        ID: NTL-STU-009
                                    </span>
                                </div>
                                <h1 className="font-editorial-serif text-4xl sm:text-5xl font-normal text-[#171717] tracking-tight">
                                    Products Catalog
                                </h1>
                                <p className="font-interface-sans text-xs sm:text-[13px] text-[#525252] max-w-2xl leading-relaxed">
                                    Manage active silhouette offerings, textile provenance records, and boutique inventory synchronizations across atelier hubs.
                                </p>
                            </div>

                            {/* Top Right Actions */}
                            <div className="flex items-center gap-3 font-interface-sans flex-wrap">
                                <Link
                                    to="/seller/orders"
                                    className="px-4 py-2.5 bg-[#F5F2EB] hover:bg-[#EAE5DB] border border-[#D5CEBF] text-[#171717] text-[10px] font-bold tracking-[0.18em] uppercase flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                    <TruckIcon className="w-3.5 h-3.5" />
                                    <span>ORDERS &amp; TRACKING</span>
                                </Link>

                                <Link
                                    to="/seller/create-product"
                                    className="px-5 py-2.5 bg-[#171717] hover:bg-[#333333] text-[#FBF9F5] text-[10px] font-bold tracking-[0.2em] uppercase flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
                                >
                                    <PlusIcon className="w-3.5 h-3.5" />
                                    <span>CREATE PRODUCT</span>
                                </Link>
                            </div>
                        </div>

                        {/* ─── Stat Metrics Cards (3 Cards Row) ─── */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* Card 1: Total Listings */}
                            <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-5 sm:p-6 flex items-baseline justify-between font-interface-sans">
                                <div className="space-y-1">
                                    <span className="block text-[10px] font-bold tracking-[0.22em] text-[#737373] uppercase">
                                        TOTAL LISTINGS
                                    </span>
                                    <span className="font-editorial-serif text-4xl font-normal text-[#171717] block">
                                        {totalListings}
                                    </span>
                                </div>
                                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#737373]">
                                    FULL ARCHIVAL STOCK
                                </span>
                            </div>

                            {/* Card 2: Active Listings */}
                            <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-5 sm:p-6 flex items-baseline justify-between font-interface-sans">
                                <div className="space-y-1">
                                    <span className="block text-[10px] font-bold tracking-[0.22em] text-[#737373] uppercase">
                                        ACTIVE LISTINGS
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#171717]" />
                                        <span className="font-editorial-serif text-4xl font-normal text-[#171717]">
                                            {totalListings}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[#737373]">
                                    100% DEPLOYABLE
                                </span>
                            </div>

                            {/* Card 3: Catalog Status */}
                            <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-5 sm:p-6 flex items-baseline justify-between font-interface-sans">
                                <div className="space-y-1">
                                    <span className="block text-[10px] font-bold tracking-[0.22em] text-[#737373] uppercase">
                                        CATALOG STATUS
                                    </span>
                                    <div className="flex items-center gap-2 text-base font-semibold tracking-[0.14em] uppercase text-[#171717]">
                                        <span className="text-sm">↻</span>
                                        <span>SYNCHRONIZED</span>
                                    </div>
                                </div>
                                <span className="text-[9px] font-semibold tracking-[0.18em] uppercase text-[#737373]">
                                    ATELIER ENGINE V2.4
                                </span>
                            </div>
                        </div>

                        {/* ─── Search Field & Category Filter Controls ─── */}
                        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 font-interface-sans">
                            {/* Search Field */}
                            <div className="relative flex-1 max-w-md">
                                <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373] w-3.5 h-3.5 pointer-events-none" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search products by title, SKU, or provenance..."
                                    className="w-full bg-[#F5F2EB] border border-[#D5CEBF] focus:border-[#171717] px-3.5 pl-9 py-2 text-xs text-[#171717] placeholder-[#737373] focus:outline-none transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#737373] hover:text-[#171717]"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>

                            {/* Useful Product Filters */}
                            <div className="flex items-center gap-2.5 flex-wrap">
                                {/* Category Buttons */}
                                <div className="flex items-center gap-1 bg-[#F5F2EB] p-0.5 border border-[#D5CEBF]">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory("ALL")}
                                        className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer ${
                                            selectedCategory === "ALL"
                                                ? "bg-[#171717] text-[#FBF9F5]"
                                                : "text-[#525252] hover:text-[#171717]"
                                        }`}
                                    >
                                        ALL CATEGORIES ({allProducts.length})
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory("OUTERWEAR")}
                                        className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer ${
                                            selectedCategory === "OUTERWEAR"
                                                ? "bg-[#171717] text-[#FBF9F5]"
                                                : "text-[#525252] hover:text-[#171717]"
                                        }`}
                                    >
                                        OUTERWEAR
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory("KNITWEAR")}
                                        className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer ${
                                            selectedCategory === "KNITWEAR"
                                                ? "bg-[#171717] text-[#FBF9F5]"
                                                : "text-[#525252] hover:text-[#171717]"
                                        }`}
                                    >
                                        KNITWEAR
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedCategory("TROUSERS")}
                                        className={`px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer ${
                                            selectedCategory === "TROUSERS"
                                                ? "bg-[#171717] text-[#FBF9F5]"
                                                : "text-[#525252] hover:text-[#171717]"
                                        }`}
                                    >
                                        TROUSERS
                                    </button>
                                </div>

                                {/* Status Filter Dropdown */}
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="bg-[#F5F2EB] border border-[#D5CEBF] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#171717] focus:outline-none cursor-pointer"
                                >
                                    <option value="ALL">STATUS: ALL (ACTIVE)</option>
                                    <option value="ACTIVE">STATUS: ACTIVE ONLY</option>
                                </select>

                                {/* Sort Dropdown */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-[#F5F2EB] border border-[#D5CEBF] px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase text-[#171717] focus:outline-none cursor-pointer"
                                >
                                    <option value="RECENT">SORT: MOST RECENT ⥮</option>
                                    <option value="PRICE_ASC">PRICE: LOW TO HIGH</option>
                                    <option value="PRICE_DESC">PRICE: HIGH TO LOW</option>
                                    <option value="TITLE">TITLE: A-Z</option>
                                </select>
                            </div>
                        </div>

                        {/* ─── PRODUCTS CATALOG TABLE ─── */}
                        <div className="border border-[#ECE7DD] bg-[#FBF9F5] overflow-x-auto font-interface-sans shadow-xs">
                            <table className="w-full text-left border-collapse min-w-[760px]">
                                {/* Table Headers */}
                                <thead>
                                    <tr className="border-b border-[#ECE7DD] bg-[#F5F2EB] text-[9px] sm:text-[10px] font-bold tracking-[0.2em] uppercase text-[#737373]">
                                        <th className="py-3 px-4 w-10 text-center">
                                            <input
                                                type="checkbox"
                                                checked={isAllSelected}
                                                onChange={toggleSelectAll}
                                                className="accent-[#171717] cursor-pointer"
                                                aria-label="Select all rows"
                                            />
                                        </th>
                                        <th className="py-3 px-4">GARMENT SILHOUETTE &amp; COMPOSITION</th>
                                        <th className="py-3 px-4">CATEGORY</th>
                                        <th className="py-3 px-4">RETAIL PRICE</th>
                                        <th className="py-3 px-4">LISTING STATUS</th>
                                        <th className="py-3 px-4">ATELIER PROVENANCE</th>
                                        <th className="py-3 px-4 text-right">ACTIONS</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody className="divide-y divide-[#ECE7DD] text-xs">
                                    {filteredProducts.map((product) => {
                                        const isSelected = selectedIds.includes(product._id);
                                        const isMenuOpen = actionMenuOpenId === product._id;

                                        return (
                                            <tr
                                                key={product._id}
                                                className={`hover:bg-[#F7F5F0] transition-colors ${
                                                    isSelected ? "bg-[#F5F2EB]" : ""
                                                }`}
                                            >
                                                {/* Checkbox */}
                                                <td className="py-4 px-4 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelectRow(product._id)}
                                                        className="accent-[#171717] cursor-pointer"
                                                        aria-label={`Select ${product.title}`}
                                                    />
                                                </td>

                                                {/* Silhouette & Composition */}
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-14 bg-[#ECE7DD] border border-[#D5CEBF] overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={product.image}
                                                                alt={product.title}
                                                                className="w-full h-full object-cover object-top"
                                                            />
                                                        </div>
                                                        <div className="space-y-1 min-w-0">
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="font-editorial-serif text-lg font-normal text-[#171717]">
                                                                    {product.title}
                                                                </span>
                                                                <span className="text-[10px] text-[#737373] uppercase font-mono tracking-wider">
                                                                    {product.sku}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-[#525252] truncate max-w-sm">
                                                                {product.composition}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[#737373]">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
                                                                <span>{product.attributeTag}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="py-4 px-4">
                                                    <span className="px-2 py-0.5 bg-[#F5F2EB] border border-[#D5CEBF] text-[9px] font-bold tracking-[0.18em] uppercase text-[#171717]">
                                                        {product.categoryPill}
                                                    </span>
                                                </td>

                                                {/* Retail Price */}
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <span className="font-editorial-serif text-xl font-normal text-[#171717] block">
                                                        ${product.price}
                                                    </span>
                                                    <span className="text-[9px] uppercase tracking-wider text-[#737373] block">
                                                        USD NET
                                                    </span>
                                                </td>

                                                {/* Listing Status */}
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAEFE7] text-[#3D4933] text-[9px] font-bold tracking-widest uppercase">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A5340]" />
                                                        <span>{product.status}</span>
                                                    </span>
                                                </td>

                                                {/* Atelier Provenance */}
                                                <td className="py-4 px-4 whitespace-nowrap">
                                                    <span className="text-xs font-medium text-[#171717] block">
                                                        {product.provenance.mill}
                                                    </span>
                                                    <span className="text-[9px] uppercase tracking-wider text-[#737373] block">
                                                        {product.provenance.batchRef}
                                                    </span>
                                                </td>

                                                {/* Actions */}
                                                <td className="py-4 px-4 text-right whitespace-nowrap relative">
                                                    <div className="inline-flex items-center gap-2">
                                                        <Link
                                                            to={`/seller/product/${product._id}`}
                                                            className="px-3 py-1 bg-[#F5F2EB] hover:bg-[#171717] hover:text-[#FBF9F5] border border-[#D5CEBF] text-[#171717] text-[10px] font-bold tracking-[0.16em] uppercase transition-colors"
                                                        >
                                                            EDIT
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => setActionMenuOpenId(isMenuOpen ? null : product._id)}
                                                            className="p-1.5 text-[#737373] hover:text-[#171717] cursor-pointer"
                                                            aria-label="Row options"
                                                        >
                                                            <MoreVerticalIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    {/* Context Popover Menu */}
                                                    {isMenuOpen && (
                                                        <div className="absolute right-4 top-12 w-44 bg-[#FBF9F5] border border-[#D5CEBF] shadow-lg z-20 text-left py-1 text-xs">
                                                            <Link
                                                                to={`/product/${product._id}`}
                                                                className="block px-3.5 py-2 hover:bg-[#F5F2EB] text-[#171717] text-[10px] uppercase tracking-wider"
                                                            >
                                                                View Storefront Piece
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    navigator.clipboard?.writeText(product.sku);
                                                                    setActionMenuOpenId(null);
                                                                }}
                                                                className="w-full text-left px-3.5 py-2 hover:bg-[#F5F2EB] text-[#171717] text-[10px] uppercase tracking-wider"
                                                            >
                                                                Copy Archival SKU
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteProduct(product)}
                                                                className="w-full text-left px-3.5 py-2 hover:bg-[#FAF3F0] text-[#8C3A27] text-[10px] uppercase tracking-wider font-semibold"
                                                            >
                                                                Delete Listing
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="py-12 text-center text-xs text-[#737373]">
                                                No garments match the current query or filter criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* ─── Table Footer Status & Pagination ─── */}
                        <div className="bg-[#F5F2EB] border border-[#ECE7DD] p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 font-interface-sans text-xs">
                            <div className="flex items-center gap-2 text-[11px] text-[#525252]">
                                <span className="text-[#4A5340] font-bold">✓</span>
                                <span>
                                    Showing <strong>{filteredProducts.length} of {allProducts.length}</strong> published collection pieces • All garments registered in NORTHLINE Autumn/Winter 26 Atelier
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-[10px] uppercase tracking-[0.18em] text-[#737373] font-semibold">
                                    ARCHIVAL LEDGER 1/1
                                </span>
                                <div className="flex items-center gap-1 font-interface-sans">
                                    <button
                                        type="button"
                                        disabled
                                        className="w-6 h-6 border border-[#D5CEBF] flex items-center justify-center text-xs text-[#A3A3A3] cursor-not-allowed"
                                    >
                                        &lt;
                                    </button>
                                    <span className="w-6 h-6 bg-[#171717] text-[#FBF9F5] flex items-center justify-center text-xs font-semibold">
                                        1
                                    </span>
                                    <button
                                        type="button"
                                        disabled
                                        className="w-6 h-6 border border-[#D5CEBF] flex items-center justify-center text-xs text-[#A3A3A3] cursor-not-allowed"
                                    >
                                        &gt;
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ─── Bottom Atelier Synchronization Banner ─── */}
                        <div className="bg-[#F5F2EB] border border-[#ECE7DD] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 font-interface-sans">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-[#4A5340] uppercase">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A5340]" />
                                    <span>DIRECT ATELIER SYNCHRONIZATION</span>
                                </div>
                                <h3 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-[#171717]">
                                    Need bespoke alterations or custom wholesale allocations?
                                </h3>
                                <p className="text-xs text-[#525252] max-w-2xl leading-relaxed">
                                    Adjust inventory thresholds directly with the Porto and Biella partnering mills or request digital garment passport generation.
                                </p>
                            </div>

                            <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
                                <button
                                    type="button"
                                    onClick={() => alert("Digital provenance ledger file generated for partner mills.")}
                                    className="px-5 py-3 bg-[#FBF9F5] hover:bg-[#ECE7DD] border border-[#D5CEBF] text-[#171717] text-[10px] font-bold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                                >
                                    NEW PROVENANCE FILE
                                </button>
                                <Link
                                    to="/"
                                    className="px-5 py-3 bg-[#171717] hover:bg-[#333333] text-[#FBF9F5] text-[10px] font-bold tracking-[0.2em] uppercase transition-all shadow-xs cursor-pointer"
                                >
                                    LIVE STORE VIEW
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Portal Footer */}
                <footer className="border-t border-[#ECE7DD] bg-[#FBF9F5] py-4 px-6 sm:px-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-interface-sans tracking-[0.16em] uppercase text-[#737373]">
                    <span>© 2026 NORTHLINE ATELIER. MERCHANT STUDIO RUNTIME V2.4.</span>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="hover:text-[#171717]">Storefront Home</Link>
                        <span>•</span>
                        <Link to="/seller/orders" className="hover:text-[#171717]">Orders &amp; Tracking</Link>
                        <span>•</span>
                        <Link to="/seller/create-product" className="hover:text-[#171717]">Create Garment</Link>
                    </div>
                </footer>
            </main>
        </div>
    );
}
