import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import SearchBar from "./SearchBar.jsx";
import { getCart } from "../../features/cart/service/cart.api.js";
import { setItem } from "../../features/cart/state/cart.slice.js";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function SearchIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function BagIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.125 1.007z" />
        </svg>
    );
}

function UserIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
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

function MenuIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
    );
}

export default function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "");
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const user = useSelector((state) => state.auth?.user);
    const cartItems = useSelector((state) => state.cart?.items || []);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            getCart()
                .then((data) => {
                    if (data?.cart) {
                        dispatch(setItem(data.cart));
                    }
                })
                .catch(() => {});
        }
    }, [user, dispatch]);

    const totalQuantity = Array.isArray(cartItems)
        ? cartItems
            .filter((item) => item && (item.product?._id || item.product) && (item._id || item.productId))
            .reduce((sum, item) => sum + (Number(item.quantity) || 1), 0)
        : 0;

    const handleSearchChange = (val) => {
        setSearchTerm(val);
        if (location.pathname === "/") {
            if (val) setSearchParams({ search: val });
            else setSearchParams({});
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (location.pathname !== "/") {
            navigate(searchTerm.trim() ? `/?search=${encodeURIComponent(searchTerm.trim())}` : "/");
        } else {
            if (searchTerm.trim()) setSearchParams({ search: searchTerm.trim() });
            else setSearchParams({});
        }
    };

    const userInitial = user?.fullname?.[0] || user?.email?.[0] || "S";

    return (
        <header className="sticky top-0 z-50 w-full bg-[#FBF9F5]/95 backdrop-blur-md border-b border-[#ECE7DD] text-[#1A1917] transition-all">
            {/* ─── SLIM SHIPPING ANNOUNCEMENT BAR ─────────────────────────── */}
            <aside aria-label="Announcement" className="w-full bg-[#F4F0E8] border-b border-[#E8E2D6] py-1.5 px-4 text-center">
                <p className="text-[10px] sm:text-[11px] font-medium tracking-[0.22em] text-[#5A564D] uppercase font-sans">
                    COMPLIMENTARY SHIPPING ON ORDERS OVER ₹1,499 / $150
                </p>
            </aside>

            {/* ─── MAIN TIDY HEADER ────────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-3.5 sm:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 sm:gap-4">

                {/* ─── LEFT: Brand Wordmark (Refined Serif) ────────────────── */}
                <div className="flex items-center gap-3 sm:gap-6 min-w-0">
                    <Link
                        to="/"
                        className="group flex items-center gap-2 select-none flex-shrink-0"
                    >
                        <span
                            className="font-serif text-lg sm:text-2xl font-normal tracking-[0.16em] sm:tracking-[0.2em] uppercase text-[#1A1917] group-hover:text-[#4A5340] transition-colors"
                            style={{ fontFamily: "'EB Garamond', 'Newsreader', 'Cormorant Garamond', serif" }}
                        >
                            VELMORA
                        </span>
                    </Link>

                    {/* ─── CENTER/LEFT: Primary Shopping Navigation ────────── */}
                    <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8 pl-4">
                        <Link
                            to="/"
                            className={`text-[11px] uppercase tracking-[0.18em] transition-colors ${
                                location.pathname === "/" && !searchParams.get("search")
                                    ? "text-[#1A1917] font-semibold border-b border-[#1A1917] pb-0.5"
                                    : "text-[#5A564D] hover:text-[#1A1917]"
                            }`}
                        >
                            SHOP
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                if (location.pathname !== "/") navigate("/?cat=new");
                                else {
                                    const el = document.getElementById("catalog-section");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="text-[11px] uppercase tracking-[0.18em] text-[#5A564D] hover:text-[#1A1917] transition-colors cursor-pointer"
                        >
                            NEW ARRIVALS
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                if (location.pathname !== "/") navigate("/?cat=all");
                                else {
                                    const el = document.getElementById("capsule-section");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="text-[11px] uppercase tracking-[0.18em] text-[#5A564D] hover:text-[#1A1917] transition-colors cursor-pointer"
                        >
                            CLOTHING
                        </button>
                        <Link
                            to="/orders"
                            className={`text-[11px] uppercase tracking-[0.18em] transition-colors ${
                                location.pathname.startsWith("/orders") || location.pathname.startsWith("/account")
                                    ? "text-[#1A1917] font-semibold border-b border-[#1A1917] pb-0.5"
                                    : "text-[#5A564D] hover:text-[#1A1917]"
                            }`}
                        >
                            JOURNAL
                        </Link>
                        {user?.role === "seller" && (
                            <Link
                                to="/seller/dashboard"
                                className="text-[11px] uppercase tracking-[0.18em] text-[#4A5340] hover:text-[#1A1917] font-semibold transition-colors"
                            >
                                SELLER PORTAL
                            </Link>
                        )}
                    </nav>
                </div>

                {/* ─── RIGHT: SEARCH, ACCOUNT, BAG, PROFILE ───────────────── */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-6 flex-shrink-0">
                    {/* Search Control (Desktop & Mobile) */}
                    {isSearchOpen ? (
                        <div className="relative w-44 sm:w-64 md:w-80 transition-all">
                            <SearchBar
                                autoFocus
                                customPlaceholder="overshirt"
                                onSearchExecuted={() => setIsSearchOpen(false)}
                            />
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    setIsMobileSearchOpen(true);
                                } else {
                                    setIsSearchOpen(true);
                                }
                            }}
                            className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#5A564D] hover:text-[#1A1917] transition-colors cursor-pointer p-1.5"
                            aria-label="Search Collection"
                        >
                            <SearchIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">SEARCH</span>
                        </button>
                    )}

                    {/* Account Control (Hidden on very small screens, accessible via drawer) */}
                    {user ? (
                        <Link
                            to="/orders"
                            className={`hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                                location.pathname.startsWith("/orders") || location.pathname.startsWith("/account")
                                    ? "text-[#1A1917] font-semibold"
                                    : "text-[#5A564D] hover:text-[#1A1917]"
                            }`}
                        >
                            <UserIcon className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">ACCOUNT</span>
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="hidden sm:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-[#5A564D] hover:text-[#1A1917] transition-colors"
                        >
                            <UserIcon className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">ACCOUNT</span>
                        </Link>
                    )}

                    {/* Shopping Bag Control */}
                    <Link
                        to="/cart"
                        title="Shopping Bag"
                        className="flex items-center gap-1 sm:gap-1.5 text-[11px] uppercase tracking-[0.16em] sm:tracking-[0.18em] text-[#1A1917] font-semibold hover:text-[#4A5340] transition-colors cursor-pointer p-1"
                    >
                        <BagIcon className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">BAG</span>
                        <span className="text-[10px] sm:text-[11px] font-bold bg-[#EAE5D9] px-1.5 py-0.2 rounded-full">
                            {totalQuantity}
                        </span>
                    </Link>

                    {/* Monogram User Pill */}
                    <Link
                        to={user ? "/orders" : "/login"}
                        title={user ? user.fullname || user.email : "Sign In"}
                        className="w-7 h-7 rounded-full border border-[#D5CEBF] hover:border-[#1A1917] bg-[#F4F0E8] text-[#1A1917] text-[10px] font-medium flex items-center justify-center uppercase tracking-widest transition-all flex-shrink-0"
                    >
                        {userInitial}
                    </Link>

                    {/* Mobile Menu Hamburger */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-1.5 text-[#1A1917] hover:text-[#4A5340] cursor-pointer"
                        aria-label="Toggle Navigation Menu"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
                    </button>
                </div>

            </div>

            {/* ─── MOBILE DRAWER ────────────────────────────────────────── */}
            {mobileMenuOpen && (
                <div className="lg:hidden border-t border-[#ECE7DD] bg-[#FBF9F5] px-5 py-5 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
                    {/* User Monogram Header if logged in */}
                    {user && (
                        <div className="flex items-center gap-3 pb-3 border-b border-[#ECE7DD]">
                            <div className="w-9 h-9 rounded-full bg-[#EAE5D9] text-[#1A1917] font-bold text-xs flex items-center justify-center uppercase">
                                {userInitial}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-[#1A1917] truncate">{user.fullname || user.email}</p>
                                <p className="text-[10px] text-[#737373] uppercase tracking-wider">{user.role === "seller" ? "Atelier Seller" : "Valued Patron"}</p>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col space-y-3 text-xs uppercase tracking-[0.18em]">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 text-[#1A1917] font-semibold flex items-center justify-between"
                        >
                            <span>Shop Storefront</span>
                            <span>→</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                setIsMobileSearchOpen(true);
                            }}
                            className="py-1.5 text-left text-[#5A564D] hover:text-black flex items-center justify-between"
                        >
                            <span>Search Pieces</span>
                            <span>🔍</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                if (location.pathname !== "/") navigate("/?cat=new");
                                else {
                                    const el = document.getElementById("capsule-section");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="py-1.5 text-left text-[#5A564D] hover:text-black"
                        >
                            Key Ensemble Pieces
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setMobileMenuOpen(false);
                                if (location.pathname !== "/") navigate("/");
                                else {
                                    const el = document.getElementById("catalog-section");
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                }
                            }}
                            className="py-1.5 text-left text-[#5A564D] hover:text-black"
                        >
                            All Collections
                        </button>
                        <Link
                            to="/orders"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 text-[#5A564D] hover:text-black flex items-center justify-between"
                        >
                            <span>My Orders &amp; Account</span>
                            <span>📦</span>
                        </Link>
                        <Link
                            to="/cart"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1.5 text-[#5A564D] hover:text-black flex items-center justify-between"
                        >
                            <span>Shopping Bag ({totalQuantity})</span>
                            <span>🛍</span>
                        </Link>
                        {user?.role === "seller" && (
                            <Link
                                to="/seller/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                className="py-2 px-3 bg-[#EAE5D9] text-[#1A1917] font-bold text-[11px] tracking-[0.2em] flex items-center justify-between"
                            >
                                <span>Seller Studio Dashboard</span>
                                <span>⚙</span>
                            </Link>
                        )}
                        {user ? (
                            <div className="pt-2 border-t border-[#ECE7DD]">
                                <Link
                                    to="/logout"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full py-2 text-center text-[11px] font-semibold tracking-wider uppercase text-[#737373] hover:text-[#9E2A2B] transition-colors block"
                                >
                                    Sign Out
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-2 border-t border-[#ECE7DD] flex gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 py-2.5 text-center bg-[#1A1917] text-[#FBF9F5] text-[11px] font-semibold tracking-wider"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex-1 py-2.5 text-center border border-[#1A1917] text-[#1A1917] text-[11px] font-semibold tracking-wider"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ─── MOBILE SEARCH MODAL (Matching Stitch Mobile Reference) ─── */}
            {isMobileSearchOpen && (
                <div className="fixed inset-0 z-50 bg-[#FBF9F5] p-4 flex flex-col overflow-y-auto animate-fadeIn">
                    <SearchBar
                        isMobileModal
                        autoFocus
                        customPlaceholder="overshirt"
                        onCloseMobile={() => setIsMobileSearchOpen(false)}
                        onSearchExecuted={() => setIsMobileSearchOpen(false)}
                    />
                </div>
            )}
        </header>
    );
}

