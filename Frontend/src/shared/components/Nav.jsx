import React, { useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function SearchIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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

function XIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export default function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(() => searchParams.get("search") || "");

    const user = useSelector((state) => state.auth?.user);
    const cartItems = useSelector((state) => state.cart?.items || []);

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

    const userInitial = user?.fullname?.[0] || user?.email?.[0] || "R";

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-zinc-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">

                {/* ─── LEFT: Snitch Brand Pill Logo ──────────────────────────── */}
                <Link
                    to="/"
                    className="flex items-center gap-2 group flex-shrink-0 cursor-pointer"
                >
                    <span className="w-8 h-8 rounded-full border border-black flex items-center justify-center font-black text-sm text-black group-hover:bg-black group-hover:text-white transition-all shadow-xs">
                        S
                    </span>
                    <span
                        className="font-extrabold text-[15px] tracking-[0.25em] uppercase text-black"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        SNITCH
                    </span>
                </Link>

                {/* ─── CENTER: Rounded Search Bar ────────────────────────────── */}
                <form
                    onSubmit={handleSearchSubmit}
                    className="flex-1 max-w-md mx-2 sm:mx-6"
                >
                    <div className="relative flex items-center">
                        <SearchIcon className="absolute left-3.5 text-zinc-400 w-4 h-4 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            placeholder="Search"
                            className="w-full h-10 pl-10 pr-9 bg-[#f4f4f5] hover:bg-[#ebebed] focus:bg-white border border-transparent focus:border-zinc-300 rounded-full text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-500 focus:outline-none transition-all"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => handleSearchChange("")}
                                className="absolute right-3 text-zinc-400 hover:text-black p-1 cursor-pointer"
                            >
                                <XIcon className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>
                </form>

                {/* ─── RIGHT: Dashboard / Cart Bag / User Avatar ────────────── */}
                <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                    {/* Orders Pill Button */}
                    <Link
                        to="/orders"
                        className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-zinc-700 hover:text-black hover:border-black border border-zinc-300 px-3 py-1.5 rounded-full transition-colors font-mono"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        ORDERS
                    </Link>

                    {/* Dashboard Pill Button */}
                    <Link
                        to="/seller/dashboard"
                        className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-black hover:bg-black hover:text-white border border-black px-3.5 py-1.5 rounded-full transition-colors font-mono"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                    >
                        DASHBOARD
                    </Link>

                    {/* Cart Circle Button with Dynamic Badge Count */}
                    <Link
                        to="/cart"
                        title="Shopping Bag"
                        className="relative w-9 h-9 rounded-full border border-zinc-300 hover:border-black flex items-center justify-center bg-white hover:bg-zinc-50 transition-all cursor-pointer shadow-xs"
                    >
                        <BagIcon className="w-4 h-4 text-zinc-900" />
                        {totalQuantity > 0 && (
                            <span
                                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-black text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1"
                                style={{ fontFamily: "'JetBrains Mono', monospace" }}
                            >
                                {totalQuantity}
                            </span>
                        )}
                    </Link>

                    {/* User Profile Avatar Circle (Solid black circle with initial) */}
                    {user ? (
                        <div
                            title={user.email || user.fullname}
                            className="w-8 h-8 rounded-full bg-[#111111] text-white text-xs font-bold flex items-center justify-center uppercase shadow-xs select-none"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            {userInitial}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            title="Login / Account"
                            className="w-8 h-8 rounded-full bg-[#111111] text-white text-xs font-bold flex items-center justify-center uppercase shadow-xs hover:opacity-90 transition-opacity"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            {userInitial}
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
}
