import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getMyOrders } from "../services/order.api.js";
import { setUser } from "../../auth/state/auth.slice.js";

// ─── SVG Icons (VELMORA Editorial Line Icons) ────────────────────────────────
function ScissorsIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.848 8.25a3 3 0 10-2.596 4.382 3 3 0 002.596-4.382zM16.152 8.25a3 3 0 102.596 4.382 3 3 0 00-2.596-4.382z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.6 11.4L18 19.8M14.4 11.4L6 19.8" />
        </svg>
    );
}

function ShieldCheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

function ArrowRightIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
    );
}

function CheckIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

function LogOutIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
    );
}

function BagIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.125 1.007z" />
        </svg>
    );
}

function SparklesIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
        </svg>
    );
}

function XIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

// ─── Filter Tabs (Exact Sequence as Requested) ────────────────────────────────
// "four order filters in this order: All, In Progress, Delivered, Cancelled."
const FILTER_TABS = [
    { key: "ALL", label: "All" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "DELIVERED", label: "Delivered" },
    { key: "CANCELLED", label: "Cancelled" },
];

export default function OrdersListPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth?.user);

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");
    const [activeAccountSection, setActiveAccountSection] = useState("ORDERS"); // 'ORDERS' | 'DETAILS' | 'ADDRESSES' | 'TAILORING'
    const [modalData, setModalData] = useState(null); // For Account details / Addresses / Tailoring previews
    const [toastMessage, setToastMessage] = useState("");

    // ─── Fetch User Orders From Real API ──────────────────────────────────────
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const data = await getMyOrders();
            if (data?.orders && Array.isArray(data.orders)) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("Failed to load user orders:", err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ─── Filter Orders by Status Category ─────────────────────────────────────
    const filteredOrders = useMemo(() => {
        if (!Array.isArray(orders)) return [];
        return orders.filter((order) => {
            const status = (order.orderStatus || "").toUpperCase();
            if (activeTab === "IN_PROGRESS") {
                return ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"].includes(status);
            }
            if (activeTab === "DELIVERED") {
                return status === "DELIVERED";
            }
            if (activeTab === "CANCELLED") {
                return status === "CANCELLED";
            }
            return true; // "ALL"
        });
    }, [orders, activeTab]);

    // ─── Tab Counts Derived from Real Data ────────────────────────────────────
    const tabCounts = useMemo(() => {
        if (!Array.isArray(orders)) return { ALL: 0, IN_PROGRESS: 0, DELIVERED: 0, CANCELLED: 0 };
        let inProg = 0;
        let deliv = 0;
        let canc = 0;

        orders.forEach((o) => {
            const st = (o.orderStatus || "").toUpperCase();
            if (["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"].includes(st)) inProg++;
            else if (st === "DELIVERED") deliv++;
            else if (st === "CANCELLED") canc++;
        });

        return {
            ALL: orders.length,
            IN_PROGRESS: inProg,
            DELIVERED: deliv,
            CANCELLED: canc,
        };
    }, [orders]);

    // ─── Sign Out Handler ─────────────────────────────────────────────────────
    const handleSignOut = () => {
        navigate("/logout");
    };

    // ─── Download Invoice Generator ───────────────────────────────────────────
    const handleDownloadInvoice = (order) => {
        const orderNum = order.orderNumber || order._id || "Order";
        const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—";
        const total = order.pricing?.currency === "USD" ? `$${order.pricing?.totalAmount}` : `₹${order.pricing?.totalAmount}`;

        let invoiceText = `==========================================================\n`;
        invoiceText += `              VELMORA MENSWEAR ATELIER                 \n`;
        invoiceText += `               OFFICIAL ACQUISITION RECEIPT              \n`;
        invoiceText += `==========================================================\n\n`;
        invoiceText += `Order Reference: #${orderNum}\n`;
        invoiceText += `Acquisition Date: ${dateStr}\n`;
        invoiceText += `Client Name:     ${order.shippingAddress?.fullName || user?.fullname || "Client"}\n`;
        invoiceText += `Shipping Address: ${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}\n`;
        invoiceText += `Status:           ${order.orderStatus}\n`;
        invoiceText += `Payment Method:   ${order.payment?.method || "Online Card / UPI"}\n\n`;
        invoiceText += `----------------------------------------------------------\n`;
        invoiceText += `GARMENTS / CONSIGNMENT BREAKDOWN:\n`;
        invoiceText += `----------------------------------------------------------\n`;

        if (order.items && order.items.length > 0) {
            order.items.forEach((item, idx) => {
                const title = item.title || item.product?.title || "Tailored Garment";
                const qty = item.quantity || 1;
                const unitPrice = item.unitPrice || 0;
                invoiceText += `${idx + 1}. ${title}\n`;
                invoiceText += `   Quantity: ${qty} | Unit Price: ₹${unitPrice}\n`;
            });
        } else {
            invoiceText += `1. Atelier Custom Tailoring Commission\n`;
        }

        invoiceText += `----------------------------------------------------------\n`;
        invoiceText += `TOTAL AMOUNT: ${total}\n`;
        invoiceText += `==========================================================\n`;
        invoiceText += `Thank you for commissioning VELMORA Menswear Studio.\n`;
        invoiceText += `All garments carry lifetime atelier seam repair warranty.\n`;

        const blob = new Blob([invoiceText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `VELMORA_Invoice_${orderNum}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setToastMessage(`Invoice for Order #${orderNum} downloaded.`);
        setTimeout(() => setToastMessage(""), 4000);
    };

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#171717] selection:bg-[#171717] selection:text-[#FBF9F5] antialiased">
            {/* Custom typography matching VELMORA Editorial style */}
            <style>{`
                .font-editorial-serif {
                    font-family: 'EB Garamond', 'Newsreader', 'Cormorant Garamond', Georgia, serif;
                }
                .font-interface-sans {
                    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
            `}</style>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 font-interface-sans">
                {/* ─── BREADCRUMBS ────────────────────────────────────────────── */}
                <nav aria-label="Breadcrumb" className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-[#737373] flex items-center gap-2">
                    <Link to="/" className="hover:text-[#171717] transition-colors focus-visible:ring-1 focus-visible:ring-[#171717]">
                        HOME
                    </Link>
                    <span className="text-[#D5CEBF]">/</span>
                    <Link to="/orders" className="hover:text-[#171717] transition-colors focus-visible:ring-1 focus-visible:ring-[#171717]">
                        ACCOUNT
                    </Link>
                    <span className="text-[#D5CEBF]">/</span>
                    <span className="text-[#171717] font-semibold" aria-current="page">
                        MY ORDERS
                    </span>
                </nav>

                {/* ─── PAGE HEADER & ATELIER EYEROW ───────────────────────────── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#ECE7DD] pb-8">
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.24em] font-semibold text-[#737373]">
                            <span>◆</span>
                            <span>CLIENT ATELIER</span>
                        </div>
                        {/* Heading with total count: My Orders (6) */}
                        <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#171717]">
                            My Orders{" "}
                            {!loading && (
                                <span className="font-editorial-serif text-2xl sm:text-3xl text-[#737373] font-normal ml-1">
                                    ({orders.length})
                                </span>
                            )}
                        </h1>
                        <p className="text-xs sm:text-sm text-[#737373] max-w-xl leading-relaxed">
                            Review past acquisitions, track current garment dispatches, and manage tailoring notes.
                        </p>
                    </div>

                    {/* Top Right: Atelier Complimentary Care Banner */}
                    <div className="flex items-center gap-3.5 p-3.5 px-4 bg-[#F5F2EB] border border-[#ECE7DD] shadow-xs">
                        <div className="w-9 h-9 rounded-full bg-[#EAE5D9] flex items-center justify-center text-[#4A5340] flex-shrink-0">
                            <ScissorsIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#737373] block">
                                COMPLIMENTARY CARE
                            </span>
                            <span className="text-xs font-semibold text-[#171717] block">
                                2 Complimentary Hemmings Available
                            </span>
                        </div>
                    </div>
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div role="status" className="p-3.5 bg-[#EAEFE6] border border-[#C8D7BE] text-[#4A5340] text-xs flex items-center justify-between">
                        <span>{toastMessage}</span>
                        <button type="button" onClick={() => setToastMessage("")} className="p-1 hover:opacity-75">
                            <XIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* ─── TWO-COLUMN SPLIT: ACCOUNT NAV (LEFT) + ORDERS FEED (RIGHT) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* ══════════════════════════════════════════════════════════
                        1. NEUTRAL ACCOUNT NAVIGATION AREA (LEFT COLUMN)
                    ══════════════════════════════════════════════════════════ */}
                    <aside className="lg:col-span-3 space-y-6">
                        <nav aria-label="Account Menu" className="space-y-1">
                            {/* MY ORDERS (Active) */}
                            <button
                                type="button"
                                onClick={() => setActiveAccountSection("ORDERS")}
                                className="w-full flex items-center justify-between px-4 py-3 bg-[#171717] text-[#FBF9F5] text-[11px] font-semibold tracking-[0.16em] uppercase shadow-xs text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4A5340] focus-visible:outline-none"
                            >
                                <span>MY ORDERS</span>
                                <span className="text-[10px] opacity-80">
                                    {loading ? "…" : orders.length}
                                </span>
                            </button>

                            {/* ACCOUNT DETAILS */}
                            <button
                                type="button"
                                onClick={() =>
                                    setModalData({
                                        title: "Account Details",
                                        subtitle: "Personal Atelier Profile",
                                        content: [
                                            { label: "Client Full Name", value: user?.fullname || "Atelier Patron" },
                                            { label: "Email Address", value: user?.email || "—" },
                                            { label: "Contact Phone", value: user?.contact || "—" },
                                            { label: "Account Role", value: user?.role === "seller" ? "Merchant Atelier / Seller" : "Client Patron" },
                                            { label: "Membership Tier", value: "Atelier Bespoke Privileged" },
                                        ],
                                    })
                                }
                                className="w-full text-left px-4 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#525252] hover:text-[#171717] hover:bg-[#F5F2EB] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                            >
                                ACCOUNT DETAILS
                            </button>

                            {/* SAVED ADDRESSES */}
                            <button
                                type="button"
                                onClick={() => {
                                    const latestOrder = orders.find((o) => o.shippingAddress?.street);
                                    const addr = latestOrder?.shippingAddress;
                                    setModalData({
                                        title: "Saved Addresses",
                                        subtitle: "Primary Residential Delivery Node",
                                        content: addr
                                            ? [
                                                  { label: "Recipient Name", value: addr.fullName || user?.fullname || "—" },
                                                  { label: "Street Address", value: addr.street || "—" },
                                                  { label: "City & State", value: `${addr.city || ""}, ${addr.state || ""}` },
                                                  { label: "Postal Pincode", value: addr.pincode || "—" },
                                                  { label: "Country", value: addr.country || "India" },
                                              ]
                                            : [{ label: "Address", value: "No addresses saved yet. Addresses save automatically at checkout." }],
                                    });
                                }}
                                className="w-full text-left px-4 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#525252] hover:text-[#171717] hover:bg-[#F5F2EB] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                            >
                                SAVED ADDRESSES
                            </button>

                            {/* TAILORING PREFERENCES */}
                            <button
                                type="button"
                                onClick={() =>
                                    setModalData({
                                        title: "Tailoring Preferences",
                                        subtitle: "Bespoke Measurement & Silhouette Profile",
                                        content: [
                                            { label: "Jacket Fit", value: "Relaxed Atelier Drop 6" },
                                            { label: "Trouser Break", value: "Slight Break / Cuffed" },
                                            { label: "Preferred Cloth", value: "Organic Portuguese Slub & Supima Jersey" },
                                            { label: "Hemming Benefit", value: "2 Complimentary Tailoring Hemmings Available" },
                                        ],
                                    })
                                }
                                className="w-full text-left px-4 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#525252] hover:text-[#171717] hover:bg-[#F5F2EB] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                            >
                                TAILORING PREFERENCES
                            </button>

                            {/* SIGN OUT */}
                            <button
                                type="button"
                                onClick={handleSignOut}
                                className="w-full text-left px-4 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#737373] hover:text-[#9E2A2B] hover:bg-[#FDF2F2] transition-colors flex items-center justify-between cursor-pointer focus-visible:ring-2 focus-visible:ring-[#9E2A2B] focus-visible:outline-none"
                            >
                                <span>SIGN OUT</span>
                                <LogOutIcon className="w-3.5 h-3.5" />
                            </button>
                        </nav>

                        {/* ATELIER GUARANTEE BOX */}
                        <div className="p-5 border border-[#ECE7DD] bg-[#FBF9F5] space-y-2 shadow-xs">
                            <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#171717]">
                                <ShieldCheckIcon className="w-4 h-4 text-[#4A5340]" />
                                <span>ATELIER GUARANTEE</span>
                            </div>
                            <p className="text-[11px] text-[#737373] leading-relaxed">
                                All pieces carry lifetime stitch maintenance and sustainable raw-edge repair services.
                            </p>
                        </div>
                    </aside>

                    {/* ══════════════════════════════════════════════════════════
                        2. ORDERS LIST FEED & FILTERS (RIGHT COLUMN)
                    ══════════════════════════════════════════════════════════ */}
                    <section className="lg:col-span-9 space-y-6" aria-label="Orders Feed">
                        {/* ─── FOUR ORDER FILTERS (Exact sequence: All, In Progress, Delivered, Cancelled) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#ECE7DD] pb-3.5">
                            <div className="flex flex-wrap items-center gap-1.5" role="tablist" aria-label="Order Status Filter">
                                {FILTER_TABS.map((tab) => {
                                    const count = tabCounts[tab.key] ?? 0;
                                    const isActive = activeTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            role="tab"
                                            aria-selected={isActive}
                                            onClick={() => setActiveTab(tab.key)}
                                            className={`px-4 py-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none ${
                                                isActive
                                                    ? "bg-[#171717] text-[#FBF9F5] shadow-xs"
                                                    : "bg-[#F5F2EB] text-[#525252] hover:bg-[#ECE7DD] hover:text-[#171717]"
                                            }`}
                                        >
                                            <span>
                                                {tab.label === "All" ? `ALL (${count})` : tab.label.toUpperCase()}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Filter Summary Metric */}
                            <span className="text-[11px] text-[#737373] tracking-wider uppercase font-medium">
                                Viewing {filteredOrders.length} {filteredOrders.length === 1 ? "acquisition" : "acquisitions"}
                            </span>
                        </div>

                        {/* ─── ORDERS CARDS LIST ───────────────────────────────── */}
                        {loading ? (
                            /* Polished Loading State Skeleton */
                            <div className="space-y-6">
                                {[1, 2, 3].map((n) => (
                                    <div key={n} className="bg-[#FBF9F5] border border-[#ECE7DD] p-6 sm:p-7 space-y-5 animate-pulse">
                                        <div className="flex justify-between items-center border-b border-[#ECE7DD] pb-4">
                                            <div className="h-4 bg-[#EAE5D9] w-48 rounded-none" />
                                            <div className="h-5 bg-[#EAE5D9] w-24 rounded-none" />
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="w-24 h-24 bg-[#EAE5D9] rounded-none flex-shrink-0" />
                                            <div className="space-y-2 flex-1">
                                                <div className="h-3 bg-[#EAE5D9] w-24" />
                                                <div className="h-5 bg-[#EAE5D9] w-64" />
                                                <div className="h-3 bg-[#EAE5D9] w-40" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            /* Real Order Cards List matching screenshot */
                            <div className="space-y-6">
                                {filteredOrders.map((order) => {
                                    const orderRef = order.orderNumber || order._id?.slice(-8).toUpperCase() || "—";
                                    const placedDate = order.createdAt
                                        ? new Date(order.createdAt).toLocaleDateString("en-US", {
                                              month: "long",
                                              day: "numeric",
                                              year: "numeric",
                                          })
                                        : "—";

                                    const isDelivered = order.orderStatus === "DELIVERED";
                                    const isCancelled = order.orderStatus === "CANCELLED";
                                    const isInProgress = !isDelivered && !isCancelled;

                                    const primaryItem = order.items?.[0] || {};
                                    const itemTitle = primaryItem.title || primaryItem.product?.title || "Tailored Garment";
                                    const itemImage =
                                        primaryItem.coverImage ||
                                        primaryItem.product?.images?.[0]?.url ||
                                        primaryItem.product?.images?.[0] ||
                                        "/editorial/overshirt_olive_piece.jpg";

                                    const itemCount = order.items?.length || 1;
                                    const currencySymbol = order.pricing?.currency === "USD" ? "$" : "₹";
                                    const totalAmount = Number(order.pricing?.totalAmount || 0).toLocaleString("en-IN");

                                    // Category and attributes
                                    const categoryLabel = (primaryItem.product?.category || "TAILORING").toUpperCase();
                                    const sizeLabel = primaryItem.variant?.size || "M";
                                    const colorLabel = primaryItem.variant?.color || "Washed Muted Olive";

                                    return (
                                        <article
                                            key={order._id || orderRef}
                                            className="bg-[#FBF9F5] border border-[#ECE7DD] p-6 sm:p-7 space-y-6 shadow-xs hover:border-[#D5CEBF] transition-all"
                                        >
                                            {/* Order Card Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-[#ECE7DD] pb-4">
                                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                                    <span className="font-semibold text-[#171717] tracking-wider uppercase">
                                                        Order Ref — #{orderRef}
                                                    </span>
                                                    <span className="text-[#D5CEBF] hidden sm:inline">•</span>
                                                    <span className="text-[#737373]">Placed {placedDate}</span>
                                                </div>

                                                {/* Readable Status Badge */}
                                                <div>
                                                    {isDelivered && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] bg-[#EAEFE6] text-[#4A5340] border border-[#C8D7BE]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#4A5340]" />
                                                            <span>DELIVERED</span>
                                                        </span>
                                                    )}
                                                    {isInProgress && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] bg-[#F5F2EB] text-[#525252] border border-[#D5CEBF]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#4A5340]" />
                                                            <span>IN PROGRESS</span>
                                                        </span>
                                                    )}
                                                    {isCancelled && (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.18em] bg-[#FDF2F2] text-[#9E2A2B] border border-[#F8D7DA]">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#9E2A2B]" />
                                                            <span>CANCELLED</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Order Card Body */}
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                {/* Product Info Block */}
                                                <div className="flex items-start gap-5">
                                                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F5F2EB] border border-[#ECE7DD] flex-shrink-0 overflow-hidden">
                                                        <img
                                                            src={itemImage}
                                                            alt={itemTitle}
                                                            className="w-full h-full object-cover object-center"
                                                            onError={(e) => {
                                                                e.target.src = "/editorial/overshirt_olive_piece.jpg";
                                                            }}
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#737373] block">
                                                            {categoryLabel}
                                                        </span>
                                                        <h2 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#171717] leading-snug">
                                                            {itemTitle}
                                                        </h2>
                                                        <p className="text-[11px] text-[#737373] tracking-wide">
                                                            Size: {sizeLabel} • Color: {colorLabel} • {itemCount}{" "}
                                                            {itemCount === 1 ? "Item" : "Items in parcel"}
                                                        </p>
                                                        <p className="text-[11px] text-[#525252]">
                                                            {isDelivered
                                                                ? `Delivered ${placedDate} • Signed at reception`
                                                                : isCancelled
                                                                ? "Cancelled by client request • Full refund processed"
                                                                : `Dispatched via ${order.tracking?.carrier || "Courier Atelier"} • Tracking available`}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Total & Action Button Block */}
                                                <div className="flex md:flex-col items-end justify-between md:justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-[#ECE7DD]">
                                                    <div className="text-right">
                                                        <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#737373] block">
                                                            {isCancelled ? "REFUNDED" : "TOTAL"}
                                                        </span>
                                                        <span className="font-editorial-serif text-2xl sm:text-3xl font-medium text-[#171717]">
                                                            {currencySymbol}
                                                            {totalAmount}
                                                        </span>
                                                    </div>

                                                    <Link
                                                        to={`/orders/${order._id || order.orderNumber}`}
                                                        className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-[#FBF9F5] text-[10px] font-semibold tracking-[0.18em] uppercase flex items-center gap-1.5 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-[#4A5340] focus-visible:outline-none"
                                                    >
                                                        <span>VIEW ORDER</span>
                                                        <ArrowRightIcon className="w-3.5 h-3.5" />
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Order Card Footer */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-[#ECE7DD] text-xs">
                                                <div className="flex items-center gap-2 text-[11px] text-[#737373]">
                                                    {isDelivered && (
                                                        <>
                                                            <CheckIcon className="w-3.5 h-3.5 text-[#4A5340]" />
                                                            <span>Delivered to Residence</span>
                                                        </>
                                                    )}
                                                    {isInProgress && (
                                                        <>
                                                            <SparklesIcon className="w-3.5 h-3.5 text-[#4A5340]" />
                                                            <span>
                                                                {order.tracking?.estimatedDelivery
                                                                    ? `Estimated Delivery: ${new Date(order.tracking.estimatedDelivery).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`
                                                                    : "Dispatched via atelier partner courier"}
                                                            </span>
                                                        </>
                                                    )}
                                                    {isCancelled && (
                                                        <span className="text-[#737373]">
                                                            Original payment method refunded in full ({currencySymbol}
                                                            {totalAmount})
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Supporting Document & Tailoring Actions */}
                                                <div className="flex items-center gap-4 text-[11px] tracking-wider text-[#525252]">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDownloadInvoice(order)}
                                                        className="hover:text-[#171717] underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717]"
                                                    >
                                                        Download Invoice
                                                    </button>
                                                    {isDelivered && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setToastMessage("Atelier tailoring request submitted. A specialist will reach out.");
                                                                setTimeout(() => setToastMessage(""), 4000);
                                                            }}
                                                            className="hover:text-[#171717] underline underline-offset-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#171717]"
                                                        >
                                                            Request Complimentary Hemming
                                                        </button>
                                                    )}
                                                    {isInProgress && (
                                                        <Link
                                                            to={`/orders/${order._id || order.orderNumber}`}
                                                            className="hover:text-[#171717] underline underline-offset-4"
                                                        >
                                                            Live Dispatch Tracking
                                                        </Link>
                                                    )}
                                                    {isCancelled && (
                                                        <span className="text-[#737373]">Refund Receipt Available</span>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        ) : (
                            /* Polished Empty State for Filters with No Orders */
                            <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-12 text-center space-y-4 shadow-xs" role="status">
                                <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F2EB] border border-[#ECE7DD] flex items-center justify-center text-[#737373]">
                                    <BagIcon className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h2 className="font-editorial-serif text-2xl font-normal text-[#171717]">
                                        No Orders in this Category
                                    </h2>
                                    <p className="text-xs text-[#737373] max-w-sm mx-auto leading-relaxed">
                                        You currently have no acquisitions under the “{activeTab}” filter.
                                    </p>
                                </div>
                                <div className="pt-2">
                                    <Link
                                        to="/"
                                        className="inline-block px-5 py-2.5 bg-[#171717] text-[#FBF9F5] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-[#262626] transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-[#4A5340] focus-visible:outline-none"
                                    >
                                        EXPLORE MENSWEAR COLLECTION
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ─── ATELIER CONCIERGE ASSISTANCE CARD (Bottom of feed) ─ */}
                        <div className="p-7 bg-[#F5F2EB] border border-[#ECE7DD] space-y-4 shadow-xs">
                            <div className="flex items-center gap-2 text-[9.5px] uppercase tracking-[0.22em] font-semibold text-[#737373]">
                                <span>⨀</span>
                                <span>DEDICATED ATELIER CONCIERGE</span>
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-editorial-serif text-xl sm:text-2xl font-normal text-[#171717]">
                                    Need assistance with an existing order or bespoke hemming adjustment?
                                </h3>
                                <p className="text-xs text-[#737373] leading-relaxed max-w-2xl">
                                    Our sartorial team provides private sizing consultations, cloth care advisement, and complimentary alterations on all core tailored trousers.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <a
                                    href="mailto:concierge@velmora-atelier.com"
                                    className="px-4 py-2.5 bg-[#FBF9F5] border border-[#D5CEBF] hover:border-[#171717] text-[#171717] text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors shadow-xs"
                                >
                                    EMAIL ATELIER
                                </a>
                                <Link
                                    to="/chat"
                                    className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-[#FBF9F5] text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors shadow-xs"
                                >
                                    LIVE SARTORIAL CHAT
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>

                {/* ─── MODAL DIALOG (Account Details, Addresses, Tailoring) ──────── */}
                {modalData && (
                    <div
                        className="fixed inset-0 z-50 bg-[#171717]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="bg-[#FBF9F5] border border-[#ECE7DD] w-full max-w-md p-6 sm:p-7 space-y-5 shadow-lg relative max-h-[90vh] overflow-y-auto">
                            <button
                                type="button"
                                onClick={() => setModalData(null)}
                                className="absolute top-5 right-5 text-[#737373] hover:text-[#171717] p-1 focus-visible:outline-none"
                                aria-label="Close dialog"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>

                            <div className="space-y-1 border-b border-[#ECE7DD] pb-3">
                                <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#737373]">
                                    {modalData.subtitle}
                                </span>
                                <h3 className="font-editorial-serif text-2xl font-normal text-[#171717]">
                                    {modalData.title}
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {modalData.content.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start text-xs border-b border-[#ECE7DD]/50 pb-2">
                                        <span className="text-[#737373] uppercase tracking-wider text-[10px]">
                                            {item.label}
                                        </span>
                                        <span className="font-medium text-[#171717] text-right max-w-xs">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={() => setModalData(null)}
                                    className="w-full py-2.5 bg-[#171717] text-[#FBF9F5] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-[#262626] transition-colors"
                                >
                                    CLOSE
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ─── EDITORIAL FOOTER (Matching Homepage & Cart) ───────────────── */}
            <footer className="border-t border-[#ECE7DD] bg-[#F5F2EB] pt-14 pb-12 mt-16 text-[#1A1917] font-interface-sans">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
                        {/* Column 1: Brand Manifesto */}
                        <div className="space-y-3">
                            <span className="font-editorial-serif text-xl sm:text-2xl font-normal tracking-[0.18em] uppercase block text-[#1A1917]">
                                VELMORA
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
                                    <Link to="/#capsule-section" className="hover:text-[#4A5340]">Tailored Outerwear</Link>
                                </li>
                                <li>
                                    <Link to="/#capsule-section" className="hover:text-[#4A5340]">Structured Trousers</Link>
                                </li>
                                <li>
                                    <Link to="/#catalog-section" className="hover:text-[#4A5340]">Supima Knitwear</Link>
                                </li>
                                <li>
                                    <Link to="/#catalog-section" className="hover:text-[#4A5340]">Atelier Footwear</Link>
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
                                    <Link to="/orders" className="hover:text-[#4A5340]">The Journal</Link>
                                </li>
                                <li>
                                    <Link to="/orders" className="hover:text-[#4A5340]">Material Transparency</Link>
                                </li>
                                <li>
                                    <Link to="/orders" className="hover:text-[#4A5340]">Circular Repair Care</Link>
                                </li>
                                <li>
                                    <Link to="/orders" className="hover:text-[#4A5340]">Bespoke Fitting</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Region & Currency */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#6C685F]">
                                REGION &amp; CURRENCY
                            </h4>
                            <div className="space-y-1.5 text-xs text-[#1A1917]">
                                <p className="font-semibold tracking-wider uppercase">UNITED STATES (USD $)</p>
                                <p className="text-[#5A564D] leading-relaxed">
                                    Duties &amp; local sales taxes calculated at checkout.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright Strip */}
                    <div className="pt-8 border-t border-[#ECE7DD] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#737373]">
                        <p>© 2026 VELMORA Menswear Studio. All rights reserved.</p>
                        <div className="flex items-center gap-6">
                            <span className="hover:text-[#1A1917] cursor-pointer">Sustainability Pledge</span>
                            <span className="hover:text-[#1A1917] cursor-pointer">Privacy</span>
                            <span className="hover:text-[#1A1917] cursor-pointer">Terms</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
