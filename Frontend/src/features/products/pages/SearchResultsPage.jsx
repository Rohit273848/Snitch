import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import SearchBar from "../../../shared/components/SearchBar";
import {
    getUnifiedCatalog,
    filterAndSortProducts,
    formatProductPreview,
    findSpellingCorrection,
    buildCatalogDictionary,
    getProductSizes,
} from "../utils/searchEngine";
import { useProduct } from "../hook/useProduct";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
function SlidersIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
    );
}

function ChevronDownIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

function HeartIcon({ filled = false, className = "w-3.5 h-3.5" }) {
    return (
        <svg
            className={className}
            fill={filled ? "#1A1917" : "none"}
            stroke="currentColor"
            strokeWidth="1.6"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
        </svg>
    );
}

function StarIcon({ className = "w-3 h-3 text-[#B45309]" }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

function RefreshIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
    );
}

function XIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

// ─── CONSTANTS & OPTIONS ──────────────────────────────────────────────────────
const CATEGORIES_OPTIONS = [
    { id: "overshirt", label: "Overshirts" },
    { id: "outerwear", label: "Outerwear" },
    { id: "knitwear", label: "Knitwear" },
    { id: "casual-jackets", label: "Casual Jackets" },
    { id: "trouser", label: "Trousers" },
    { id: "jeans", label: "Denim" },
];

const COLLECTION_OPTIONS = [
    { id: "NORTHLINE Atelier", label: "NORTHLINE Atelier" },
    { id: "NORTHLINE Essentials", label: "NORTHLINE Essentials" },
    { id: "Edition Sartorial", label: "Edition Sartorial" },
];

const SIZES_OPTIONS = ["S", "M", "L", "XL", "XXL"];

const COLORWAY_OPTIONS = [
    { id: "Olive", label: "Olive", hex: "#555A43" },
    { id: "Black", label: "Black", hex: "#1C1C1C" },
    { id: "Cream", label: "Cream / Sand", hex: "#ECE5D8" },
    { id: "Brown", label: "Brown", hex: "#4A3B32" },
    { id: "Navy", label: "Navy / Indigo", hex: "#222D3D" },
];

const SORT_OPTIONS = [
    { id: "relevance", label: "SORT: RELEVANCE" },
    { id: "price-low", label: "PRICE: LOW TO HIGH" },
    { id: "price-high", label: "PRICE: HIGH TO LOW" },
    { id: "rating", label: "TOP RATED" },
    { id: "newest", label: "NEWEST ARRIVALS" },
];

export default function SearchResultsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Query params
    const searchQuery = searchParams.get("q") || searchParams.get("search") || "";
    const activeCategoryParam = searchParams.get("cat") || "";
    const activeColorParam = searchParams.get("color") || "";

    const { handleGetAllProducts } = useProduct();
    const allDbProducts = useSelector((state) => state.product?.allProducts || []);
    const loading = useSelector((state) => state.product?.loading);

    // Initial load
    useEffect(() => {
        handleGetAllProducts().catch(() => {});
    }, []);

    // Catalog merging DB products with Stitch reference sample pieces
    const catalog = useMemo(() => getUnifiedCatalog(allDbProducts), [allDbProducts]);

    // ─── FILTER STATES ────────────────────────────────────────────────────────
    const [selectedCategories, setSelectedCategories] = useState(() =>
        activeCategoryParam ? [activeCategoryParam] : ["overshirt"]
    );
    const [priceRange, setPriceRange] = useState({ min: 150, max: 650 });
    const [selectedCollections, setSelectedCollections] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState(["M", "L"]);
    const [selectedColors, setSelectedColors] = useState(() =>
        activeColorParam ? [activeColorParam] : ["Olive"]
    );
    const [selectedRating, setSelectedRating] = useState(null); // 5 | 4 | null
    const [inStockOnly, setInStockOnly] = useState(true);
    const [madeToOrder, setMadeToOrder] = useState(false);
    const [sortBy, setSortBy] = useState("relevance");

    // Pagination / Load more state
    const [itemsToShow, setItemsToShow] = useState(6);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Mobile Bottom Sheet Filter Drawer state
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Wishlist stored in localStorage
    const [wishlist, setWishlist] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("snitch_wishlist") || "[]");
        } catch {
            return [];
        }
    });

    const handleToggleWishlist = (id) => {
        setWishlist((prev) => {
            const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
            try {
                localStorage.setItem("snitch_wishlist", JSON.stringify(next));
            } catch (e) {
                console.error("wishlist err", e);
            }
            return next;
        });
    };

    // Keep state in sync with URL params
    useEffect(() => {
        if (activeCategoryParam && !selectedCategories.includes(activeCategoryParam)) {
            setSelectedCategories([activeCategoryParam]);
        }
    }, [activeCategoryParam]);

    // ─── COMPUTE FILTERED RESULTS ─────────────────────────────────────────────
    const filteredResults = useMemo(() => {
        let results = [...catalog];

        // 1. Text Search & NLP
        if (searchQuery.trim()) {
            results = filterAndSortProducts(results, {
                searchQuery: searchQuery.trim(),
                sortBy: "relevance",
            });
        }

        // 2. Category Filter
        if (selectedCategories.length > 0) {
            results = results.filter((p) => {
                const pCat = (p.category || "").toLowerCase();
                const pTitle = (p.title || "").toLowerCase();
                return selectedCategories.some((cat) => {
                    const cLower = cat.toLowerCase();
                    return pCat.includes(cLower) || pTitle.includes(cLower);
                });
            });
        }

        // 3. Price Filter
        results = results.filter((p) => {
            const amt = Number(p.price?.amount || 0);
            return amt >= priceRange.min && amt <= priceRange.max;
        });

        // 4. Collection / Brand Filter
        if (selectedCollections.length > 0) {
            results = results.filter((p) => {
                const b = p.collectionLabel || p.brand || "";
                return selectedCollections.some((c) => b.toLowerCase().includes(c.toLowerCase()));
            });
        }

        // 5. Size Filter
        if (selectedSizes.length > 0) {
            results = results.filter((p) => {
                const pSizes = (p.sizes || getProductSizes(p) || []).map((s) => (s ? String(s).toUpperCase() : ""));
                return selectedSizes.some((sz) => pSizes.includes(sz));
            });
        }

        // 6. Colorway Filter
        if (selectedColors.length > 0) {
            results = results.filter((p) => {
                const pColor = (p.colorway || p.color || "").toLowerCase();
                return selectedColors.some((c) => pColor.includes(c.toLowerCase()));
            });
        }

        // 7. Rating Filter
        if (selectedRating !== null) {
            results = results.filter((p) => {
                const r = p.rating?.rate || 0;
                return r >= selectedRating;
            });
        }

        // 8. In Stock Only
        if (inStockOnly) {
            results = results.filter((p) => p.stockStatus !== "sold_out" && p.stock !== 0);
        }

        // 9. Sorting
        if (sortBy === "price-low") {
            results.sort((a, b) => (a.price?.amount || 0) - (b.price?.amount || 0));
        } else if (sortBy === "price-high") {
            results.sort((a, b) => (b.price?.amount || 0) - (a.price?.amount || 0));
        } else if (sortBy === "rating") {
            results.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        } else if (sortBy === "newest") {
            results.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        return (results || []).map(formatProductPreview);
    }, [
        catalog,
        searchQuery,
        selectedCategories,
        priceRange,
        selectedCollections,
        selectedSizes,
        selectedColors,
        selectedRating,
        inStockOnly,
        sortBy,
    ]);

    // Visible pieces (pagination / load more)
    const visibleProducts = useMemo(() => {
        return filteredResults.slice(0, itemsToShow);
    }, [filteredResults, itemsToShow]);

    // Active filter count for badge
    const activeFiltersCount = useMemo(() => {
        let count = 0;
        if (selectedCategories.length > 0) count += selectedCategories.length;
        if (selectedCollections.length > 0) count += selectedCollections.length;
        if (selectedSizes.length > 0) count += selectedSizes.length;
        if (selectedColors.length > 0) count += selectedColors.length;
        if (selectedRating !== null) count += 1;
        if (inStockOnly) count += 1;
        return count;
    }, [selectedCategories, selectedCollections, selectedSizes, selectedColors, selectedRating, inStockOnly]);

    // Clear all filters
    const handleClearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedCollections([]);
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedRating(null);
        setInStockOnly(false);
        setPriceRange({ min: 100, max: 800 });
        setSearchParams(searchQuery ? { q: searchQuery } : {});
    };

    // Load more handler with simulated loading
    const handleLoadMore = () => {
        setIsLoadingMore(true);
        setTimeout(() => {
            setItemsToShow((prev) => prev + 6);
            setIsLoadingMore(false);
        }, 350);
    };

    // Spell check recommendation for zero or low results
    const spellSuggestion = useMemo(() => {
        if (!searchQuery.trim()) return null;
        const dict = buildCatalogDictionary(catalog);
        const corrected = findSpellingCorrection(searchQuery.trim(), dict);
        if (corrected && corrected.toLowerCase() !== searchQuery.toLowerCase().trim()) {
            return corrected;
        }
        return null;
    }, [searchQuery, catalog]);

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1917] font-interface-sans antialiased selection:bg-[#1A1917] selection:text-[#FBF9F5]">
            {/* Custom font definitions */}
            <style>{`
                .font-editorial-serif {
                    font-family: 'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
                }
                .font-interface-sans {
                    font-family: 'Plus Jakarta Sans', 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
            `}</style>

            {/* ══════════════════════════════════════════════════════════════════
                1. PROMINENT SEARCH BAR (Matching Stitch Header Section)
            ══════════════════════════════════════════════════════════════════ */}
            <div className="border-b border-[#ECE7DD] bg-[#FAF8F3] py-4 px-4 sm:px-8">
                <div className="max-w-2xl mx-auto">
                    <SearchBar
                        initialQuery={searchQuery}
                        customPlaceholder="overshirt"
                        onSearchExecuted={(q) => {
                            setItemsToShow(6);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                2. MOBILE CONTROLS BAR: FILTERS BADGE & SORT
            ══════════════════════════════════════════════════════════════════ */}
            <div className="lg:hidden border-b border-[#ECE7DD] bg-[#F7F4EC] px-4 py-2.5 flex items-center justify-between">
                {/* Mobile Filter Button */}
                <button
                    type="button"
                    onClick={() => setMobileFilterOpen(true)}
                    className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase text-[#1A1917] cursor-pointer"
                >
                    <SlidersIcon className="w-4 h-4 text-[#1A1917]" />
                    <span>FILTERS</span>
                    {activeFiltersCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[#1A1917] text-[#FBF9F5] text-[10px] font-bold flex items-center justify-center">
                            {activeFiltersCount}
                        </span>
                    )}
                </button>

                {/* Mobile Sort Dropdown */}
                <div className="relative flex items-center">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-xs font-semibold tracking-[0.16em] uppercase text-[#1A1917] pr-5 focus:outline-none cursor-pointer appearance-none"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDownIcon className="w-3.5 h-3.5 text-[#1A1917] pointer-events-none -ml-3.5" />
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                3. MAIN SEARCH RESULTS CONTAINER
            ══════════════════════════════════════════════════════════════════ */}
            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
                {/* Header: Results Title, Active Chips & Sort */}
                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-[#ECE7DD]">
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-3">
                            <h1 className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#1A1917]">
                                Results for “{searchQuery || "overshirt"}”
                            </h1>
                            <span className="text-xs font-medium tracking-widest uppercase text-[#8A857B]">
                                {filteredResults.length} PIECES
                            </span>
                        </div>

                        {/* Active Filter Chips */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                            {(selectedCategories || []).map((cat) => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== cat))}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DB] hover:bg-[#1A1917] hover:text-[#FBF9F5] text-[10px] font-semibold tracking-[0.14em] uppercase text-[#1A1917] transition-all cursor-pointer"
                                >
                                    CATEGORY: {cat}
                                    <XIcon className="w-3 h-3" />
                                </button>
                            ))}

                            {(selectedColors || []).map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColors(selectedColors.filter((c) => c !== color))}
                                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAE5DB] hover:bg-[#1A1917] hover:text-[#FBF9F5] text-[10px] font-semibold tracking-[0.14em] uppercase text-[#1A1917] transition-all cursor-pointer"
                                >
                                    COLOR: {color}
                                    <XIcon className="w-3 h-3" />
                                </button>
                            ))}

                            {activeFiltersCount > 0 && (
                                <button
                                    type="button"
                                    onClick={handleClearAllFilters}
                                    className="text-[10px] font-medium tracking-[0.16em] uppercase text-[#8A857B] hover:text-[#1A1917] underline underline-offset-2 ml-2 transition-colors cursor-pointer"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Desktop Sort Dropdown */}
                    <div className="hidden lg:flex items-center gap-2">
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[#F5F2EB] border border-[#DFD9CD] hover:border-[#1A1917] text-[#1A1917] text-[11px] font-semibold tracking-[0.16em] uppercase px-4 py-2 pr-8 focus:outline-none cursor-pointer appearance-none transition-colors"
                            >
                                {SORT_OPTIONS.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDownIcon className="w-3.5 h-3.5 text-[#1A1917] pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>

                {/* ─── DESKTOP 2-COLUMN LAYOUT: SIDEBAR + PRODUCT GRID ─── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ══════════════════════════════════════════════════════════
                        LEFT SIDEBAR: FILTERS (Matching Stitch Reference)
                    ══════════════════════════════════════════════════════════ */}
                    <aside className="hidden lg:block lg:col-span-3 space-y-6 divide-y divide-[#ECE7DD] text-xs">
                        {/* 1. CATEGORY */}
                        <div className="space-y-3 pt-1">
                            <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                CATEGORY
                            </h3>
                            <div className="space-y-2">
                                {CATEGORIES_OPTIONS.map((cat) => {
                                    const isChecked = selectedCategories.includes(cat.id);
                                    return (
                                        <label
                                            key={cat.id}
                                            className="flex items-center gap-2.5 text-xs text-[#1A1917] hover:text-black cursor-pointer select-none"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    setSelectedCategories((prev) =>
                                                        isChecked ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                                                    );
                                                }}
                                                className="w-3.5 h-3.5 accent-[#1A1917] rounded-none cursor-pointer"
                                            />
                                            <span className={isChecked ? "font-semibold" : ""}>{cat.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. PRICE RANGE */}
                        <div className="space-y-3 pt-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                    PRICE RANGE
                                </h3>
                                <span className="font-mono text-[11px] text-[#1A1917]">
                                    ${priceRange.min} — ${priceRange.max}
                                </span>
                            </div>

                            {/* Range slider visual */}
                            <div className="relative pt-1 pb-2">
                                <input
                                    type="range"
                                    min="100"
                                    max="800"
                                    step="10"
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                    className="w-full accent-[#1A1917] cursor-pointer"
                                />
                            </div>

                            {/* Min / Max inputs */}
                            <div className="flex items-center gap-2 text-[11px]">
                                <div className="flex-1 bg-[#F5F2EB] border border-[#DFD9CD] px-2.5 py-1.5 flex items-center justify-between">
                                    <span className="text-[#8A857B] font-mono text-[10px]">MIN</span>
                                    <span className="font-semibold">${priceRange.min}</span>
                                </div>
                                <span className="text-[#8A857B]">—</span>
                                <div className="flex-1 bg-[#F5F2EB] border border-[#DFD9CD] px-2.5 py-1.5 flex items-center justify-between">
                                    <span className="text-[#8A857B] font-mono text-[10px]">MAX</span>
                                    <span className="font-semibold">${priceRange.max}</span>
                                </div>
                            </div>
                        </div>

                        {/* 3. COLLECTION LABEL */}
                        <div className="space-y-3 pt-5">
                            <div className="flex items-center justify-between">
                                <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                    COLLECTION LABEL
                                </h3>
                                <span className="text-xs text-[#8A857B]">−</span>
                            </div>
                            <div className="space-y-2">
                                {COLLECTION_OPTIONS.map((col) => {
                                    const isChecked = selectedCollections.includes(col.id);
                                    return (
                                        <label
                                            key={col.id}
                                            className="flex items-center gap-2.5 text-xs text-[#1A1917] hover:text-black cursor-pointer select-none"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => {
                                                    setSelectedCollections((prev) =>
                                                        isChecked ? prev.filter((c) => c !== col.id) : [...prev, col.id]
                                                    );
                                                }}
                                                className="w-3.5 h-3.5 accent-[#1A1917] rounded-none cursor-pointer"
                                            />
                                            <span className={isChecked ? "font-semibold" : ""}>{col.label}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 4. SIZING */}
                        <div className="space-y-3 pt-5">
                            <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                SIZING
                            </h3>
                            <div className="flex items-center gap-1.5">
                                {SIZES_OPTIONS.map((sz) => {
                                    const isSelected = selectedSizes.includes(sz);
                                    const isDisabled = sz === "XXL";

                                    return (
                                        <button
                                            key={sz}
                                            type="button"
                                            disabled={isDisabled}
                                            onClick={() => {
                                                setSelectedSizes((prev) =>
                                                    isSelected ? prev.filter((s) => s !== sz) : [...prev, sz]
                                                );
                                            }}
                                            className={`relative w-8 h-8 text-[11px] font-semibold border flex items-center justify-center transition-all cursor-pointer ${
                                                isDisabled
                                                    ? "opacity-35 cursor-not-allowed border-[#DFD9CD] text-[#8A857B]"
                                                    : isSelected
                                                    ? "bg-[#1A1917] text-[#FBF9F5] border-[#1A1917]"
                                                    : "border-[#DFD9CD] text-[#1A1917] hover:border-[#1A1917]"
                                            }`}
                                        >
                                            {sz}
                                            {isDisabled && (
                                                <span className="absolute inset-0 border-t border-[#8A857B] rotate-45 top-1/2" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 5. COLORWAY */}
                        <div className="space-y-3 pt-5">
                            <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                COLORWAY
                            </h3>
                            <div className="flex items-center gap-2">
                                {COLORWAY_OPTIONS.map((color) => {
                                    const isSelected = selectedColors.includes(color.id);
                                    return (
                                        <button
                                            key={color.id}
                                            type="button"
                                            title={color.label}
                                            onClick={() => {
                                                setSelectedColors((prev) =>
                                                    isSelected ? prev.filter((c) => c !== color.id) : [...prev, color.id]
                                                );
                                            }}
                                            style={{ backgroundColor: color.hex }}
                                            className={`w-6 h-6 border flex items-center justify-center transition-all cursor-pointer ${
                                                isSelected
                                                    ? "ring-2 ring-offset-2 ring-[#1A1917] border-white"
                                                    : "border-black/10 hover:scale-105"
                                            }`}
                                        >
                                            {isSelected && (
                                                <span className={`text-[10px] font-bold ${color.id === "Cream" ? "text-black" : "text-white"}`}>
                                                    ✓
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 6. CLIENT RATING */}
                        <div className="space-y-3 pt-5">
                            <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                CLIENT RATING
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2.5 text-xs text-[#1A1917] hover:text-black cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedRating === 5}
                                        onChange={() => setSelectedRating(selectedRating === 5 ? null : 5)}
                                        className="w-3.5 h-3.5 accent-[#1A1917] rounded-none cursor-pointer"
                                    />
                                    <div className="flex items-center gap-0.5 text-[#1A1917]">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <StarIcon key={i} className="w-2.5 h-2.5 text-[#1A1917]" />
                                        ))}
                                    </div>
                                    <span className="text-[11px] text-[#6C685F]">5 above</span>
                                </label>

                                <label className="flex items-center gap-2.5 text-xs text-[#1A1917] hover:text-black cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={selectedRating === 4}
                                        onChange={() => setSelectedRating(selectedRating === 4 ? null : 4)}
                                        className="w-3.5 h-3.5 accent-[#1A1917] rounded-none cursor-pointer"
                                    />
                                    <div className="flex items-center gap-0.5 text-[#1A1917]">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <StarIcon key={i} className="w-2.5 h-2.5 text-[#1A1917]" />
                                        ))}
                                        <StarIcon className="w-2.5 h-2.5 text-[#D5CEBF]" />
                                    </div>
                                    <span className="text-[11px] text-[#6C685F]">4 above</span>
                                </label>
                            </div>
                        </div>

                        {/* 7. AVAILABILITY */}
                        <div className="space-y-3 pt-5">
                            <h3 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                AVAILABILITY
                            </h3>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2.5 text-xs text-[#1A1917] hover:text-black cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="w-3.5 h-3.5 accent-[#1A1917] rounded-none cursor-pointer"
                                    />
                                    <span>In Stock only</span>
                                </label>

                                <label className="flex items-center gap-2.5 text-xs text-[#1A1917] hover:text-black cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={madeToOrder}
                                        onChange={(e) => setMadeToOrder(e.target.checked)}
                                        className="w-3.5 h-3.5 accent-[#1A1917] rounded-none cursor-pointer"
                                    />
                                    <span>Made to Order</span>
                                </label>
                            </div>
                        </div>
                    </aside>

                    {/* ══════════════════════════════════════════════════════════
                        RIGHT MAIN AREA: PRODUCT GRID (3 Cols Desktop / 2 Mobile)
                    ══════════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-9 space-y-8">
                        {/* Loading State */}
                        {loading && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7">
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <div key={idx} className="animate-pulse bg-[#F3EFE6] aspect-[3/4] p-4 space-y-3">
                                        <div className="w-full h-4/5 bg-[#EAE5DB]" />
                                        <div className="w-2/3 h-4 bg-[#EAE5DB]" />
                                        <div className="w-1/3 h-3 bg-[#EAE5DB]" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Empty / No Results Guidance State */}
                        {!loading && filteredResults.length === 0 && (
                            <div className="py-16 text-center bg-[#F7F4EC] border border-[#E5DFD3] p-8 space-y-4 font-interface-sans">
                                <span className="w-12 h-12 rounded-full bg-[#EAE5DB] text-[#4A5340] inline-flex items-center justify-center text-xl">
                                    ⊙
                                </span>
                                <h3 className="font-editorial-serif text-3xl font-normal text-[#1A1917]">
                                    No pieces found for “{searchQuery}”
                                </h3>
                                <p className="text-xs text-[#6C685F] max-w-md mx-auto">
                                    We couldn't find exact matches with your current filter selection. Try adjusting your
                                    filters or search terms below.
                                </p>

                                {spellSuggestion && (
                                    <div className="pt-2">
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/search?q=${encodeURIComponent(spellSuggestion)}`)}
                                            className="px-4 py-2 bg-[#1A1917] text-[#FBF9F5] text-xs font-semibold tracking-wider uppercase cursor-pointer"
                                        >
                                            Search for “{spellSuggestion}” instead →
                                        </button>
                                    </div>
                                )}

                                <div className="pt-4 flex flex-wrap justify-center gap-2">
                                    <button
                                        type="button"
                                        onClick={handleClearAllFilters}
                                        className="px-5 py-2.5 bg-[#1A1917] text-[#FBF9F5] text-[10px] font-semibold tracking-[0.2em] uppercase cursor-pointer"
                                    >
                                        RESET ALL FILTERS
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Product Cards Grid */}
                        {!loading && visibleProducts.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7">
                                {(visibleProducts || []).map((prod) => {
                                    const isWish = wishlist.includes(prod._id);

                                    return (
                                        <div
                                            key={prod._id}
                                            onClick={() => navigate(`/product/${prod._id}`)}
                                            className="group cursor-pointer bg-[#FBF9F5] border border-[#E5DFD3] hover:border-[#1A1917] p-3 sm:p-4 flex flex-col justify-between space-y-3 transition-all duration-300"
                                        >
                                            <div className="space-y-3">
                                                {/* Portrait Image Container */}
                                                <div className="relative aspect-[3/4] overflow-hidden bg-[#ECE7DD]">
                                                    {prod.coverImage ? (
                                                        <img
                                                            src={prod.coverImage}
                                                            alt={prod.title}
                                                            loading="lazy"
                                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center font-mono text-xs text-[#8A857B]">
                                                            NORTHLINE
                                                        </div>
                                                    )}

                                                    {/* Top Tag (e.g. NEW ATELIER or -20%) */}
                                                    {prod.tag && (
                                                        <span
                                                            className={`absolute top-2.5 left-2.5 px-2 py-0.5 text-[8px] font-bold tracking-[0.2em] uppercase font-interface-sans z-10 ${
                                                                prod.tag.startsWith("-")
                                                                    ? "bg-[#D97706] text-white"
                                                                    : "bg-[#FBF9F5]/90 backdrop-blur-xs text-[#1A1917]"
                                                            }`}
                                                        >
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
                                                        aria-label="Save to wishlist"
                                                        className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-[#FBF9F5]/85 hover:bg-[#FBF9F5] shadow-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                                                    >
                                                        <HeartIcon filled={isWish} className="w-3.5 h-3.5 text-[#1A1917]" />
                                                    </button>
                                                </div>

                                                {/* Card Metadata */}
                                                <div className="space-y-1.5 font-interface-sans">
                                                    {/* Availability & Star Rating */}
                                                    <div className="flex items-center justify-between text-[10px]">
                                                        <span
                                                            className={`font-semibold tracking-wider uppercase ${
                                                                prod.stockLabel.includes("REMAINING")
                                                                    ? "text-[#DC2626]"
                                                                    : "text-[#6C685F]"
                                                            }`}
                                                        >
                                                            {prod.stockLabel}
                                                        </span>
                                                        <div className="flex items-center gap-1 font-semibold text-[#1A1917]">
                                                            <StarIcon className="w-2.5 h-2.5 text-[#1A1917]" />
                                                            <span>{prod.ratingRate}</span>
                                                            <span className="text-[#8A857B]">({prod.ratingCount})</span>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="font-editorial-serif text-lg sm:text-xl font-normal text-[#1A1917] truncate group-hover:text-[#4A5340] transition-colors">
                                                        {prod.title}
                                                    </h3>

                                                    {/* Fabric / Subtitle */}
                                                    <p className="text-[11px] text-[#6C685F] truncate">
                                                        {prod.subtitle}
                                                    </p>

                                                    {/* Pricing */}
                                                    <div className="flex items-baseline gap-2 pt-1">
                                                        <span className="text-sm font-semibold text-[#1A1917]">
                                                            {prod.currency}{prod.priceAmount.toLocaleString()}
                                                        </span>
                                                        {prod.originalAmount && (
                                                            <span className="text-xs text-[#8A857B] line-through">
                                                                {prod.currency}{prod.originalAmount.toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Sizing list */}
                                                    {Array.isArray(prod.sizes) && prod.sizes.length > 0 && (
                                                        <p className="text-[9px] font-mono tracking-wider text-[#8A857B] pt-0.5">
                                                            SIZES: {prod.sizes.join(", ")}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* ─── BOTTOM ACTIONS: LOAD MORE & PAGINATION ─── */}
                        {!loading && filteredResults.length > 0 && (
                            <div className="pt-8 pb-4 border-t border-[#ECE7DD] flex flex-col items-center space-y-6">
                                {/* Load More Button (Matching Stitch Design) */}
                                {visibleProducts.length < filteredResults.length && (
                                    <button
                                        type="button"
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        className="px-8 py-3 bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] text-xs font-semibold tracking-[0.2em] uppercase transition-all flex items-center gap-2 cursor-pointer"
                                    >
                                        <span>
                                            LOAD MORE PIECES ({visibleProducts.length} OF {filteredResults.length})
                                        </span>
                                        <RefreshIcon className={`w-3.5 h-3.5 ${isLoadingMore ? "animate-spin" : ""}`} />
                                    </button>
                                )}

                                {/* Pagination Controls */}
                                <div className="flex items-center gap-1.5 font-interface-sans text-xs">
                                    <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center border border-[#DFD9CD] hover:border-[#1A1917] text-[#1A1917] cursor-pointer"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center bg-[#1A1917] text-[#FBF9F5] font-semibold"
                                    >
                                        1
                                    </button>
                                    <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center border border-[#DFD9CD] hover:border-[#1A1917] text-[#1A1917] cursor-pointer"
                                    >
                                        2
                                    </button>
                                    <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center border border-[#DFD9CD] hover:border-[#1A1917] text-[#1A1917] cursor-pointer"
                                    >
                                        3
                                    </button>
                                    <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center border border-[#DFD9CD] hover:border-[#1A1917] text-[#1A1917] cursor-pointer"
                                    >
                                        ›
                                    </button>
                                </div>

                                {/* Design Preview Badge (Matching exact reference screenshot) */}
                                <div className="pt-2">
                                    <span className="px-3 py-1 bg-[#EAE5DB] text-[9px] font-mono tracking-widest uppercase text-[#6C685F]">
                                        SAMPLE CATALOG DATA FOR DESIGN PREVIEW
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* ══════════════════════════════════════════════════════════════════
                4. MOBILE FILTER BOTTOM SHEET / DRAWER (Matching Reference)
            ══════════════════════════════════════════════════════════════════ */}
            {mobileFilterOpen && (
                <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs">
                    <div className="bg-[#FBF9F5] w-full max-h-[85vh] rounded-t-xl p-6 overflow-y-auto space-y-6 animate-slideUp">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-[#ECE7DD]">
                            <h3 className="font-editorial-serif text-2xl font-normal text-[#1A1917]">
                                Filters ({activeFiltersCount})
                            </h3>
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={handleClearAllFilters}
                                    className="text-xs uppercase tracking-widest text-[#8A857B] hover:text-[#1A1917]"
                                >
                                    Clear All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMobileFilterOpen(false)}
                                    className="p-1 text-[#1A1917]"
                                >
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Category Checklist */}
                        <div className="space-y-2">
                            <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#6C685F]">
                                CATEGORY
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                                {CATEGORIES_OPTIONS.map((cat) => {
                                    const isChecked = selectedCategories.includes(cat.id);
                                    return (
                                        <button
                                            key={cat.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCategories((prev) =>
                                                    isChecked ? prev.filter((c) => c !== cat.id) : [...prev, cat.id]
                                                );
                                            }}
                                            className={`p-2.5 text-xs text-left border ${
                                                isChecked
                                                    ? "bg-[#1A1917] text-[#FBF9F5] border-[#1A1917]"
                                                    : "bg-[#F5F2EB] border-[#DFD9CD] text-[#1A1917]"
                                            }`}
                                        >
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div className="space-y-2">
                            <span className="block text-[10px] font-bold tracking-[0.2em] uppercase text-[#6C685F]">
                                SIZES
                            </span>
                            <div className="flex items-center gap-2">
                                {SIZES_OPTIONS.map((sz) => {
                                    const isSelected = selectedSizes.includes(sz);
                                    return (
                                        <button
                                            key={sz}
                                            type="button"
                                            onClick={() => {
                                                setSelectedSizes((prev) =>
                                                    isSelected ? prev.filter((s) => s !== sz) : [...prev, sz]
                                                );
                                            }}
                                            className={`w-10 h-10 text-xs font-semibold border ${
                                                isSelected
                                                    ? "bg-[#1A1917] text-[#FBF9F5] border-[#1A1917]"
                                                    : "border-[#DFD9CD] bg-[#F5F2EB] text-[#1A1917]"
                                            }`}
                                        >
                                            {sz}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Apply Button */}
                        <button
                            type="button"
                            onClick={() => setMobileFilterOpen(false)}
                            className="w-full py-3.5 bg-[#1A1917] text-[#FBF9F5] text-xs font-semibold tracking-[0.2em] uppercase"
                        >
                            APPLY FILTERS ({filteredResults.length} PIECES)
                        </button>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                5. MOBILE BOTTOM NAVIGATION (Matching Stitch Mobile Reference)
            ══════════════════════════════════════════════════════════════════ */}
            <nav
                aria-label="Mobile Bottom Navigation"
                className="lg:hidden sticky bottom-0 z-40 bg-[#FBF9F5] border-t border-[#ECE7DD] grid grid-cols-4 py-2 px-1 text-center text-[9px] font-bold tracking-[0.18em] uppercase text-[#6C685F]"
            >
                <Link to="/" className="flex flex-col items-center gap-1 hover:text-[#1A1917]">
                    <span className="text-base">⌂</span>
                    <span>ATELIER</span>
                </Link>
                <button
                    type="button"
                    onClick={() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex flex-col items-center gap-1 text-[#1A1917]"
                >
                    <span className="text-base">⋈</span>
                    <span>COLLECTION</span>
                </button>
                <Link to="/" className="flex flex-col items-center gap-1 hover:text-[#1A1917]">
                    <span className="text-base">📖</span>
                    <span>LOOKBOOK</span>
                </Link>
                <Link to="/orders" className="flex flex-col items-center gap-1 hover:text-[#1A1917]">
                    <span className="text-base">👤</span>
                    <span>CLIENT</span>
                </Link>
            </nav>
        </div>
    );
}
