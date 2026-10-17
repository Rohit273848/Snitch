import React, { useState, useEffect, useRef, useMemo, useId } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    getAutocompleteSuggestions,
    getMatchChunks,
    getUnifiedCatalog,
    formatProductPreview,
} from "../../features/products/utils/searchEngine";
import {
    getSearchHistory,
    saveSearchHistory,
    removeSearchHistoryItem,
    clearSearchHistory,
} from "../../features/products/utils/searchHistory";

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
function SearchIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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

function HistoryClockIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function TrendingIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.5 4.5 7.5-7.5M21 8.25V3.75h-4.5" />
        </svg>
    );
}

function ArrowUpRightIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
    );
}

function ChevronRightIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    );
}

// ─── HIGHLIGHT MATCH COMPONENT ────────────────────────────────────────────────
function HighlightMatch({ text, query }) {
    const chunks = getMatchChunks(text, query) || [];
    return (
        <span>
            {(chunks || []).map((chunk, i) =>
                chunk.isMatch ? (
                    <strong key={i} className="font-bold text-[#1A1917]">
                        {chunk.text}
                    </strong>
                ) : (
                    <span key={i}>{chunk.text}</span>
                )
            )}
        </span>
    );
}

// ─── MAIN SEARCH BAR COMPONENT ────────────────────────────────────────────────
export default function SearchBar({
    isMobileModal = false,
    onCloseMobile = () => {},
    onSearchExecuted = () => {},
    autoFocus = false,
    initialQuery = "",
    customPlaceholder = "overshirt",
}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const inputId = useId();
    const listboxId = `${inputId}-listbox`;

    const allDbProducts = useSelector((state) => state.product?.allProducts || []);
    const unifiedCatalog = useMemo(() => getUnifiedCatalog(allDbProducts), [allDbProducts]);

    const [query, setQuery] = useState(() => initialQuery || searchParams.get("q") || searchParams.get("search") || "");
    const [isOpen, setIsOpen] = useState(isMobileModal);
    const [history, setHistory] = useState(() => getSearchHistory());
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const containerRef = useRef(null);
    const inputRef = useRef(null);

    // Sync input when initialQuery or URL params change
    useEffect(() => {
        if (initialQuery !== undefined) {
            setQuery(initialQuery);
        }
    }, [initialQuery]);

    // Refresh history
    const refreshHistory = () => {
        setHistory(getSearchHistory());
    };

    // Calculate suggestions matching the Stitch design
    const suggestions = useMemo(() => {
        return getAutocompleteSuggestions(query, unifiedCatalog, history);
    }, [query, unifiedCatalog, history]);

    // Selectable items for keyboard navigation
    const selectableItems = useMemo(() => {
        const items = [];

        // 1. Suggested searches
        if (suggestions.suggestedSearches?.length > 0) {
            suggestions.suggestedSearches.forEach((sugg, idx) => {
                items.push({
                    id: `sugg-${idx}`,
                    type: "search",
                    query: sugg.text,
                    label: sugg.text,
                });
            });
        }

        // 2. Matching Categories
        if (suggestions.matchingCategories?.length > 0) {
            suggestions.matchingCategories.forEach((cat, idx) => {
                items.push({
                    id: `cat-${idx}`,
                    type: "category",
                    query: query.trim() || cat.value,
                    category: cat.value,
                    label: cat.label,
                });
            });
        }

        // 3. Product Previews
        if (suggestions.productPreviews?.length > 0) {
            suggestions.productPreviews.forEach((prod) => {
                items.push({
                    id: `prod-${prod._id}`,
                    type: "product",
                    productId: prod._id,
                    product: prod,
                    label: prod.title,
                });
            });
        }

        return items;
    }, [suggestions, query]);

    // Reset selection index on query change
    useEffect(() => {
        setSelectedIndex(-1);
    }, [query]);

    // Auto-focus input when requested
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    // Click outside handler for desktop popover
    useEffect(() => {
        if (isMobileModal) return;

        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobileModal]);

    // Execute Search and navigate to `/search?q=...`
    const executeSearch = (targetQuery, extraParams = {}) => {
        const finalQuery = (targetQuery !== undefined ? targetQuery : query).trim();
        if (finalQuery) {
            saveSearchHistory(finalQuery);
            refreshHistory();
        }

        setIsOpen(false);
        if (isMobileModal) {
            onCloseMobile();
        }

        const params = new URLSearchParams();
        if (finalQuery) params.set("q", finalQuery);
        if (extraParams.category) params.set("cat", extraParams.category);
        if (extraParams.color) params.set("color", extraParams.color);

        const targetUrl = `/search?${params.toString()}`;
        onSearchExecuted(finalQuery, extraParams);
        navigate(targetUrl);
    };

    // Item selection
    const handleSelectOption = (item) => {
        if (!item) return;

        if (item.type === "product") {
            setIsOpen(false);
            if (isMobileModal) onCloseMobile();
            saveSearchHistory(item.product.title);
            refreshHistory();
            navigate(`/product/${item.productId}`);
            return;
        }

        if (item.type === "category") {
            executeSearch(item.query, { category: item.category });
            return;
        }

        executeSearch(item.query);
    };

    // Keyboard controls
    const handleKeyDown = (e) => {
        if (!isOpen && (e.key === "ArrowDown" || e.key === "Enter")) {
            setIsOpen(true);
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1 < selectableItems.length ? prev + 1 : 0));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : selectableItems.length - 1));
        } else if (e.key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
            if (isMobileModal) onCloseMobile();
        } else if (e.key === "Enter") {
            if (selectedIndex >= 0 && selectedIndex < selectableItems.length) {
                e.preventDefault();
                handleSelectOption(selectableItems[selectedIndex]);
            } else {
                executeSearch(query);
            }
        }
    };

    // Clear input
    const handleClear = () => {
        setQuery("");
        setSelectedIndex(-1);
        if (inputRef.current) inputRef.current.focus();
    };

    const activeItem = selectedIndex >= 0 ? selectableItems[selectedIndex] : null;

    // Render Icon based on suggested search type
    const renderSearchIcon = (iconType) => {
        if (iconType === "history") return <HistoryClockIcon className="w-3.5 h-3.5 text-[#6C685F]" />;
        if (iconType === "trending") return <TrendingIcon className="w-3.5 h-3.5 text-[#6C685F]" />;
        return <SearchIcon className="w-3.5 h-3.5 text-[#6C685F]" />;
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {/* ─── Search Input Bar (Matching Stitch design) ─── */}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < selectableItems.length) {
                        handleSelectOption(selectableItems[selectedIndex]);
                    } else {
                        executeSearch(query);
                    }
                }}
                role="search"
                className="relative flex items-center w-full"
            >
                <label htmlFor={inputId} className="sr-only">
                    Search overshirts, outerwear, and collections
                </label>

                {/* Input Container */}
                <div className="relative flex-1 flex items-center bg-[#F3EFE6] border border-[#DFD9CD] hover:border-[#1A1917] focus-within:border-[#1A1917] transition-all">
                    {/* Magnifier Icon */}
                    <span className="pl-3.5 pr-2.5 text-[#6C685F] pointer-events-none flex items-center justify-center">
                        <SearchIcon className="w-4 h-4" />
                    </span>

                    {/* Input */}
                    <input
                        ref={inputRef}
                        id={inputId}
                        type="text"
                        value={query}
                        autoComplete="off"
                        spellCheck="false"
                        role="combobox"
                        aria-expanded={isOpen}
                        aria-autocomplete="list"
                        aria-controls={listboxId}
                        aria-activedescendant={activeItem ? activeItem.id : undefined}
                        placeholder={customPlaceholder}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (!isOpen) setIsOpen(true);
                        }}
                        onFocus={() => {
                            refreshHistory();
                            setIsOpen(true);
                        }}
                        onKeyDown={handleKeyDown}
                        className="w-full bg-transparent text-[#1A1917] placeholder-[#8A857B] text-[13px] sm:text-sm py-2.5 sm:py-2.5 pr-8 focus:outline-none font-sans tracking-wide"
                    />

                    {/* Clear (X) Button */}
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear search input"
                            className="p-1.5 mr-1 text-[#6C685F] hover:text-[#1A1917] transition-colors cursor-pointer"
                        >
                            <XIcon className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Desktop: "ESC TO CLOSE" / Mobile: "CANCEL" */}
                {isMobileModal ? (
                    <button
                        type="button"
                        onClick={onCloseMobile}
                        className="ml-3 text-[11px] font-semibold tracking-[0.18em] uppercase text-[#1A1917] hover:text-[#4A5340] cursor-pointer whitespace-nowrap"
                    >
                        CANCEL
                    </button>
                ) : (
                    isOpen && (
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="hidden sm:flex items-center ml-2.5 px-2.5 py-2 bg-[#F3EFE6] border border-[#DFD9CD] text-[9px] font-mono tracking-widest uppercase text-[#6C685F] hover:text-[#1A1917] hover:border-[#1A1917] transition-all cursor-pointer whitespace-nowrap"
                        >
                            ESC TO CLOSE
                        </button>
                    )
                )}
            </form>

            {/* ══════════════════════════════════════════════════════════════════
                SUGGESTIONS PANEL (2-Column Desktop & 1-Column Mobile Layout)
            ══════════════════════════════════════════════════════════════════ */}
            {isOpen && (
                <div
                    id={listboxId}
                    role="listbox"
                    aria-label="Search suggestions and product previews"
                    className={`${
                        isMobileModal
                            ? "mt-4 w-full bg-[#FBF9F5] divide-y divide-[#ECE7DD]"
                            : "absolute left-0 right-0 top-full mt-1.5 bg-[#FBF9F5] border border-[#1A1917] shadow-2xl z-50 overflow-hidden divide-y divide-[#ECE7DD]"
                    }`}
                >
                    {/* Did You Mean Suggestion Bar */}
                    {suggestions.didYouMean && (
                        <div
                            onClick={() => executeSearch(suggestions.didYouMean.corrected)}
                            className="px-4 py-2 bg-[#F3EFE6] border-b border-[#DFD9CD] flex items-center justify-between text-xs cursor-pointer hover:bg-[#EAE5DB] transition-colors"
                        >
                            <span className="text-[#6C685F]">
                                Did you mean:{" "}
                                <strong className="text-[#1A1917] underline underline-offset-2">
                                    {suggestions.didYouMean.corrected}
                                </strong>
                                ? ({suggestions.didYouMean.productCount} pieces)
                            </span>
                            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#4A5340]">
                                Search →
                            </span>
                        </div>
                    )}

                    {/* ─── DESKTOP 2-COLUMN GRID (Matching Stitch Reference) ─── */}
                    <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#ECE7DD]">
                        {/* ─── LEFT COLUMN: SUGGESTED SEARCHES & CATEGORIES (7 Cols) ─── */}
                        <div className="md:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                            <div className="space-y-4">
                                {/* Section 1: SUGGESTED SEARCHES */}
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                        SUGGESTED SEARCHES
                                    </span>
                                    <div className="space-y-0.5">
                                        {(suggestions.suggestedSearches || []).map((sugg, idx) => {
                                            const itemId = `sugg-${idx}`;
                                            const isSelected = activeItem?.id === itemId;
                                            return (
                                                <div
                                                    key={sugg.text}
                                                    id={itemId}
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() => executeSearch(sugg.text)}
                                                    className={`px-3 py-2 flex items-center justify-between text-xs cursor-pointer transition-colors ${
                                                        isSelected
                                                            ? "bg-[#1A1917] text-[#FBF9F5]"
                                                            : "text-[#1A1917] hover:bg-[#F3EFE6]"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        {renderSearchIcon(sugg.iconType)}
                                                        <span className="font-normal text-xs sm:text-[13px] tracking-wide">
                                                            <HighlightMatch text={sugg.text} query={query} />
                                                        </span>
                                                    </div>
                                                    <ArrowUpRightIcon
                                                        className={`w-3.5 h-3.5 ${
                                                            isSelected ? "text-[#FBF9F5]" : "text-[#8A857B]"
                                                        }`}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Section 2: MATCHING CATEGORIES / DEPARTMENTS */}
                                <div className="space-y-2 pt-2">
                                    <span className="block text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                        {isMobileModal ? "DEPARTMENTS" : "MATCHING CATEGORIES"}
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {(suggestions.matchingCategories || []).map((cat, idx) => {
                                            const itemId = `cat-${idx}`;
                                            const isSelected = activeItem?.id === itemId;
                                            const isPrimary = idx === 0;

                                            return (
                                                <button
                                                    key={cat.label}
                                                    id={itemId}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={isSelected}
                                                    onClick={() => executeSearch(query.trim() || cat.value, { category: cat.value })}
                                                    className={`px-3.5 py-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase transition-all cursor-pointer ${
                                                        isPrimary
                                                            ? "bg-[#1A1917] text-[#FBF9F5]"
                                                            : "bg-[#EAE5DB] hover:bg-[#1A1917] text-[#1A1917] hover:text-[#FBF9F5]"
                                                    } ${isSelected ? "ring-2 ring-black" : ""}`}
                                                >
                                                    {cat.label} {cat.count ? (isMobileModal ? cat.count : `(${cat.count})`) : ""}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ─── RIGHT COLUMN: PRODUCT PREVIEWS (5 Cols) ─── */}
                        <div className="md:col-span-5 p-4 sm:p-5 bg-[#FAF7F0] space-y-3">
                            <div className="flex items-center justify-between pb-1 border-b border-[#ECE7DD]">
                                <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                    PRODUCT PREVIEWS {suggestions.productPreviews?.length ? `(${suggestions.productPreviews.length})` : ""}
                                </span>
                                <span className="text-[9px] font-semibold tracking-widest uppercase text-[#4A5340]">
                                    {isMobileModal ? `${suggestions.productPreviews?.length} Matches` : "IMMEDIATE DISPATCH"}
                                </span>
                            </div>

                            <div className="space-y-2">
                                {(suggestions.productPreviews || []).map((prod) => {
                                    const itemId = `prod-${prod._id}`;
                                    const isSelected = activeItem?.id === itemId;

                                    return (
                                        <div
                                            key={prod._id}
                                            id={itemId}
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => {
                                                setIsOpen(false);
                                                if (isMobileModal) onCloseMobile();
                                                saveSearchHistory(prod.title);
                                                refreshHistory();
                                                navigate(`/product/${prod._id}`);
                                            }}
                                            className={`group p-2.5 bg-[#FBF9F5] border border-[#E5DFD3] hover:border-[#1A1917] flex items-center gap-3 cursor-pointer transition-all ${
                                                isSelected ? "border-[#1A1917] ring-1 ring-[#1A1917] bg-[#F5F2EB]" : ""
                                            }`}
                                        >
                                            {/* Thumbnail */}
                                            <div className="w-11 h-14 bg-[#ECE7DD] overflow-hidden shrink-0">
                                                {prod.coverImage ? (
                                                    <img
                                                        src={prod.coverImage}
                                                        alt={prod.title}
                                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[9px] font-mono text-[#8A857B]">
                                                        SNITCH
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0 space-y-0.5">
                                                <h4 className="text-xs font-medium text-[#1A1917] truncate font-editorial-serif">
                                                    {prod.title}
                                                </h4>
                                                <p className="text-[10px] text-[#6C685F] truncate">
                                                    {prod.subtitle}
                                                    {prod.discountPercent && (
                                                        <span className="text-[#991B1B] font-bold ml-1.5">
                                                            • SALE
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="flex items-baseline gap-1.5 text-xs font-semibold text-[#1A1917]">
                                                    <span>
                                                        {prod.currency}{prod.priceAmount.toLocaleString()}
                                                    </span>
                                                    {prod.originalAmount && (
                                                        <span className="text-[10px] text-[#8A857B] line-through font-normal">
                                                            {prod.currency}{prod.originalAmount.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <ChevronRightIcon className="w-3.5 h-3.5 text-[#8A857B] group-hover:text-[#1A1917] shrink-0" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* ─── BOTTOM ACTION BAR (Exact match to Stitch design) ─── */}
                    <div
                        onClick={() => executeSearch(query)}
                        className="w-full bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] px-5 py-3.5 flex items-center justify-between text-xs font-semibold tracking-[0.2em] uppercase transition-colors cursor-pointer"
                    >
                        <span>
                            VIEW ALL {suggestions.totalMatches || 18} RESULTS FOR “{query.trim().toUpperCase() || "OVERSHIRT"}” →
                        </span>
                        <span className="hidden sm:inline text-[9px] font-mono tracking-widest text-[#D5CEBF]">
                            ↑ ↓ to navigate, ↵ to select
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
