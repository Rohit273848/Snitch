import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useChat } from "../hook/useChat.js";

// ─── Currency symbol helper ──────────────────────────────────────────────────
const currencySymbol = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function ArrowLeftIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function BagIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.125 1.007z" />
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

// ─── Simple Cart Page ────────────────────────────────────────────────────────
export default function CartPage() {
  const navigate = useNavigate();
  const { handleGetCart, cartItems, cartLoading } = useChat();
  const user = useSelector((state) => state.auth.user);

  const [error, setError] = useState(null);

  useEffect(() => {
    handleGetCart().catch((err) => {
      setError(err?.response?.data?.message || "Failed to load cart items");
    });
  }, []);

  // Safe array of items
  const items = Array.isArray(cartItems) ? cartItems : [];

  // Calculate total items count and total price
  const totalQuantity = items.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);
  const totalPrice = items.reduce((sum, item) => {
    const priceAmount = Number(item.price?.amount || item.product?.price?.amount || 0);
    const qty = Number(item.quantity || 1);
    return sum + priceAmount * qty;
  }, 0);

  const currency = items[0]?.price?.currency || items[0]?.product?.price?.currency || "INR";
  const symbol = currencySymbol[currency] || "₹";

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col selection:bg-yellow-500 selection:text-black">
      {/* ─── Top Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-zinc-900 px-6 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-yellow-500 transition-colors cursor-pointer"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Storefront</span>
          </button>

          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <Link to="/" className="inline-flex items-center gap-2.5">
            <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base shadow-lg shadow-yellow-500/20">
              S
            </span>
            <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              SNITCH
            </span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] tracking-wide text-zinc-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {user.email}
            </span>
          </div>
        )}
      </header>

      {/* ─── Main Content ──────────────────────────────────────────── */}
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-10 py-10">
        {/* Title */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-zinc-900">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Shopping Bag
            </h1>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              {totalQuantity} {totalQuantity === 1 ? "Item" : "Items"} in your bag
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0e0e0e] border border-zinc-800 text-yellow-500 text-xs font-mono">
            <BagIcon className="w-4 h-4" />
            <span>Cart Items</span>
          </div>
        </div>

        {/* Loading State */}
        {cartLoading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 space-y-4">
            <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Loading your items...</p>
          </div>
        )}

        {/* Error State */}
        {!cartLoading && error && (
          <div className="p-6 mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-mono text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!cartLoading && items.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 px-6 border border-zinc-900 bg-[#0e0e0e] text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600">
              <BagIcon className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white">Your Bag is Empty</h2>
              <p className="text-xs text-zinc-500 font-mono mt-2 max-w-sm mx-auto">
                Looks like you haven't added anything to your cart yet. Explore our newest drops!
              </p>
            </div>
            <Link
              to="/"
              className="px-8 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-widest transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Items List & Summary */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Items List (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((item, index) => {
                const product = item.product || {};
                
                // Find matching variant if variant ID exists
                const variant = product.variants?.find((v) => String(v._id) === String(item.variant));

                // Resolve image (variant image if available, else product image)
                const imgUrl =
                  variant?.images?.[0]?.url ||
                  variant?.images?.[0] ||
                  product.images?.[0]?.url ||
                  product.images?.[0] ||
                  null;

                // Resolve price
                const itemPrice = Number(item.price?.amount || variant?.price?.amount || product.price?.amount || 0);
                const itemCurrency = item.price?.currency || product.price?.currency || "INR";
                const itemSymbol = currencySymbol[itemCurrency] || "₹";
                const lineTotal = itemPrice * Number(item.quantity || 1);

                // Variant attribute entries
                const attributesObj = variant?.attributes || {};
                const attrEntries =
                  attributesObj instanceof Map
                    ? Array.from(attributesObj.entries())
                    : typeof attributesObj === "object"
                    ? Object.entries(attributesObj)
                    : [];

                return (
                  <div
                    key={item._id || index}
                    className="bg-[#0e0e0e] border border-zinc-800 p-4 sm:p-5 flex gap-4 sm:gap-6 items-center justify-between transition-colors hover:border-zinc-700"
                  >
                    {/* Item Thumbnail */}
                    <Link
                      to={product._id ? `/product/${product._id}` : "#"}
                      className="w-20 h-24 sm:w-24 sm:h-28 bg-black border border-zinc-800 flex-shrink-0 overflow-hidden group"
                    >
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={product.title || "Product"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                          <BagIcon className="w-6 h-6" />
                        </div>
                      )}
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 pr-2">
                      <Link
                        to={product._id ? `/product/${product._id}` : "#"}
                        className="text-sm sm:text-base font-bold text-white uppercase truncate hover:text-yellow-500 transition-colors block mb-1"
                      >
                        {product.title || "Product"}
                      </Link>

                      {/* Variety Attributes (Color, Size) */}
                      {attrEntries.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 my-2">
                          {attrEntries.map(([k, v], i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono bg-black border border-zinc-800 px-2 py-0.5 text-zinc-300"
                            >
                              <span className="text-zinc-500">{k}:</span> {String(v)}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Quantity & Unit Price */}
                      <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 mt-2">
                        <span>
                          Qty: <strong className="text-white font-bold">{item.quantity || 1}</strong>
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span>
                          {itemSymbol}{itemPrice.toLocaleString("en-IN")} each
                        </span>
                      </div>
                    </div>

                    {/* Total Price for this item */}
                    <div className="text-right flex-shrink-0">
                      <span
                        className="text-base sm:text-lg font-black text-yellow-500"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {itemSymbol}{lineTotal.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <div className="bg-[#0e0e0e] border border-zinc-800 p-6 space-y-6 sticky top-28">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white border-b border-zinc-800 pb-3 font-mono">
                  Order Summary
                </h3>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between text-zinc-400">
                    <span>Total Quantity</span>
                    <span className="text-white">{totalQuantity} units</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-white">{symbol}{totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-emerald-400 uppercase font-bold">FREE</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-4 flex items-baseline justify-between">
                  <span className="text-xs uppercase font-mono tracking-widest text-zinc-400">Total</span>
                  <span
                    className="text-2xl font-black text-yellow-500"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {symbol}{totalPrice.toLocaleString("en-IN")}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => alert("Checkout order flow is coming next!")}
                  className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-yellow-500/10"
                  style={{ clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))" }}
                >
                  Proceed To Checkout
                </button>

                <div className="pt-2 flex items-center gap-2 text-zinc-500 text-[11px] font-mono">
                  <ShieldCheckIcon className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  <span>Secure 256-bit encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
