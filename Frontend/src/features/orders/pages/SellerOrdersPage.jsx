import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getSellerOrders, updateSellerOrderStatus } from "../services/order.api.js";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function SearchIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
    );
}

function ArrowLeftIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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

function EditIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    );
}

function ExternalLinkIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
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

const STATUS_CONFIG = {
    PLACED: { label: "Placed", color: "bg-zinc-100 text-zinc-800 border-zinc-200" },
    CONFIRMED: { label: "Confirmed", color: "bg-blue-50 text-blue-700 border-blue-200" },
    PROCESSING: { label: "Packing", color: "bg-amber-50 text-amber-800 border-amber-200" },
    SHIPPED: { label: "In Transit", color: "bg-purple-50 text-purple-700 border-purple-200" },
    OUT_FOR_DELIVERY: { label: "Out For Delivery", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
    DELIVERED: { label: "Delivered", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    CANCELLED: { label: "Cancelled", color: "bg-rose-50 text-rose-700 border-rose-200" },
};

export default function SellerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [metrics, setMetrics] = useState({
        totalOrders: 0,
        pendingFulfillment: 0,
        inTransit: 0,
        deliveredCount: 0,
        cancelledCount: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    // Tracking Update Modal State
    const [editingOrder, setEditingOrder] = useState(null);
    const [statusForm, setStatusForm] = useState({
        status: "PROCESSING",
        carrier: "Snitch Express",
        trackingNumber: "",
        location: "Bengaluru Hub",
        description: "",
        estimatedDelivery: "",
    });
    const [saving, setSaving] = useState(false);
    const [modalError, setModalError] = useState("");
    const [toastMessage, setToastMessage] = useState("");

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getSellerOrders({
                status: selectedTab,
                search: searchQuery,
            });
            if (data?.orders) {
                setOrders(data.orders);
            }
            if (data?.metrics) {
                setMetrics(data.metrics);
            }
        } catch (err) {
            console.error("Failed to load seller orders:", err);
            setError(err?.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [selectedTab]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchOrders();
    };

    const handleOpenEditModal = (order) => {
        setEditingOrder(order);
        setStatusForm({
            status: order.orderStatus || "PROCESSING",
            carrier: order.tracking?.carrier || "Snitch Express Courier",
            trackingNumber: order.tracking?.trackingNumber || "",
            location: "Seller Dispatch Facility",
            description: "",
            estimatedDelivery: order.tracking?.estimatedDelivery
                ? new Date(order.tracking.estimatedDelivery).toISOString().slice(0, 10)
                : "",
        });
        setModalError("");
    };

    const handleSaveTracking = async (e) => {
        e.preventDefault();
        if (!editingOrder) return;

        setSaving(true);
        setModalError("");
        try {
            const res = await updateSellerOrderStatus(editingOrder._id, statusForm);
            if (res?.success) {
                setToastMessage(`Order #${editingOrder.orderNumber} updated to ${statusForm.status}`);
                setTimeout(() => setToastMessage(""), 4000);
                setEditingOrder(null);
                fetchOrders();
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            setModalError(err?.response?.data?.message || "Failed to update order tracking");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] pb-24 text-zinc-900">

            {/* Studio Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
                    {/* Left: Return to Storefront */}
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-mono-code text-zinc-600 hover:text-black font-semibold transition-colors group cursor-pointer"
                    >
                        <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Return to Storefront</span>
                    </Link>

                    {/* Right: Studio Segmented Tabs */}
                    <div className="flex items-center gap-2 sm:gap-2.5 font-mono-code text-xs">
                        <Link
                            to="/seller/dashboard"
                            className="px-3.5 py-1.5 rounded-full border border-zinc-200 hover:border-black text-zinc-600 hover:text-black transition-colors font-medium cursor-pointer"
                        >
                            Products Catalog
                        </Link>
                        <span className="px-3.5 py-1.5 rounded-full bg-black text-white font-bold shadow-xs">
                            Orders & Fulfillment
                        </span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 space-y-8">

                {/* Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-6">
                    <div>
                        <div className="flex items-center gap-2 text-[11px] font-mono-code uppercase tracking-widest text-zinc-400 mb-1">
                            <span>Seller Studio</span>
                            <span>/</span>
                            <span className="text-black font-bold">Fulfillment Control</span>
                        </div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                            Manage Orders & Live Tracking
                        </h1>
                        <p className="text-xs text-zinc-500 mt-1">
                            Track incoming customer orders, manage shipments, assign couriers, and update delivery milestones.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2 rounded-full border border-zinc-300 hover:border-black text-xs font-bold font-mono-code uppercase transition-colors cursor-pointer"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="p-4 rounded-2xl bg-emerald-500 text-white font-mono-code text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top-4">
                        <span>✓ {toastMessage}</span>
                        <button onClick={() => setToastMessage("")} className="cursor-pointer">
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-xs space-y-1">
                        <span className="text-[10px] font-mono-code uppercase tracking-wider text-zinc-400 block">
                            Total Orders
                        </span>
                        <p className="text-2xl sm:text-3xl font-black font-mono-code text-zinc-950">
                            {metrics.totalOrders}
                        </p>
                        <span className="text-[11px] font-mono-code text-zinc-500">All customer drops</span>
                    </div>

                    <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-xs space-y-1">
                        <span className="text-[10px] font-mono-code uppercase tracking-wider text-amber-600 font-bold block">
                            Pending Packing
                        </span>
                        <p className="text-2xl sm:text-3xl font-black font-mono-code text-amber-600">
                            {metrics.pendingFulfillment}
                        </p>
                        <span className="text-[11px] font-mono-code text-zinc-400">Needs dispatch</span>
                    </div>

                    <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-xs space-y-1">
                        <span className="text-[10px] font-mono-code uppercase tracking-wider text-purple-600 font-bold block">
                            In Transit
                        </span>
                        <p className="text-2xl sm:text-3xl font-black font-mono-code text-purple-600">
                            {metrics.inTransit}
                        </p>
                        <span className="text-[11px] font-mono-code text-zinc-400">With courier partners</span>
                    </div>

                    <div className="p-5 bg-white border border-zinc-200 rounded-2xl shadow-xs space-y-1">
                        <span className="text-[10px] font-mono-code uppercase tracking-wider text-emerald-600 font-bold block">
                            Sales Revenue
                        </span>
                        <p className="text-2xl sm:text-3xl font-black font-mono-code text-zinc-950">
                            ₹{metrics.totalRevenue.toLocaleString("en-IN")}
                        </p>
                        <span className="text-[11px] font-mono-code text-emerald-600 font-bold">
                            {metrics.deliveredCount} Delivered
                        </span>
                    </div>
                </div>

                {/* Filter and Search Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-full font-mono-code text-xs overflow-x-auto w-full sm:w-auto">
                        {[
                            { key: "ALL", label: "All Orders" },
                            { key: "CONFIRMED", label: "Confirmed" },
                            { key: "PROCESSING", label: "Packing" },
                            { key: "SHIPPED", label: "In Transit" },
                            { key: "DELIVERED", label: "Delivered" },
                            { key: "CANCELLED", label: "Cancelled" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setSelectedTab(tab.key)}
                                className={`px-4 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer text-[11px] whitespace-nowrap ${
                                    selectedTab === tab.key
                                        ? "bg-black text-white shadow-xs"
                                        : "text-zinc-600 hover:text-black"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-72">
                        <SearchIcon className="absolute left-3.5 top-3 text-zinc-400 w-4 h-4 pointer-events-none" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search orders, names, cities..."
                            className="w-full h-10 pl-10 pr-4 bg-white border border-zinc-200 focus:border-black rounded-full text-xs font-mono-code placeholder:text-zinc-400 focus:outline-none transition-colors"
                        />
                    </form>
                </div>

                {/* Orders Content Area */}
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center space-y-4">
                        <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-mono-code text-zinc-500 uppercase tracking-widest">
                            Loading seller orders...
                        </p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center bg-white border border-rose-200 rounded-3xl space-y-3">
                        <p className="text-xs font-mono-code text-rose-600 font-bold">{error}</p>
                        <button
                            onClick={fetchOrders}
                            className="px-6 py-2 rounded-full bg-black text-white text-xs font-bold font-mono-code uppercase cursor-pointer"
                        >
                            Retry
                        </button>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-16 text-center space-y-4 max-w-lg mx-auto shadow-xs">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                            <TruckIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                            No Orders Found
                        </h3>
                        <p className="text-xs text-zinc-500 font-mono-code">
                            {selectedTab !== "ALL"
                                ? `No orders in "${selectedTab}" state.`
                                : "No customer orders have been received yet. As soon as buyers place orders, they will appear here for fulfillment."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const statusInfo = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.CONFIRMED;

                            return (
                                <div
                                    key={order._id}
                                    className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-6 shadow-xs transition-all space-y-5"
                                >
                                    {/* Top Bar: Order ID, Date, Status */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono-code font-black text-sm text-zinc-950">
                                                #{order.orderNumber}
                                            </span>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono-code uppercase border ${statusInfo.color}`}
                                            >
                                                {statusInfo.label}
                                            </span>
                                            <span className="text-[11px] font-mono-code text-zinc-400">
                                                {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 font-mono-code text-xs">
                                            <span className="text-zinc-500">
                                                Payment:{" "}
                                                <strong className="text-zinc-900 uppercase">
                                                    {order.payment?.method === "cod" ? "COD" : "Online"}
                                                </strong>
                                            </span>
                                            <span className="text-zinc-300">•</span>
                                            <span className="font-bold text-zinc-950 text-sm">
                                                ₹{(order.pricing?.totalAmount || 0).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Middle Section: Customer & Delivery Address vs Items */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-xs font-mono-code">

                                        {/* Customer Details & Destination (4 cols) */}
                                        <div className="md:col-span-4 bg-zinc-50 border border-zinc-200/80 rounded-xl p-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                                                    Shipment Destination
                                                </span>
                                                <span className="text-[9px] font-bold px-2 py-0.5 bg-white border border-zinc-200 rounded-full text-zinc-600 uppercase">
                                                    {order.shippingAddress?.addressType || "HOME"}
                                                </span>
                                            </div>
                                            <p className="font-bold text-zinc-900 text-sm">{order.shippingAddress?.fullName}</p>
                                            <p className="text-zinc-600">Phone: +91 {order.shippingAddress?.phone}</p>
                                            <p className="text-zinc-500 leading-relaxed">
                                                {order.shippingAddress?.street}
                                                {order.shippingAddress?.landmark ? `, ${order.shippingAddress.landmark}` : ""}
                                                <br />
                                                {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                                            </p>
                                        </div>

                                        {/* Items Ordered (5 cols) */}
                                        <div className="md:col-span-5 space-y-3">
                                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                                                Products in this Order ({order.items?.length || 0})
                                            </span>

                                            <div className="space-y-2.5">
                                                {order.items?.map((it, idx) => (
                                                    <div key={idx} className="flex items-center gap-3">
                                                        <div className="w-12 h-16 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0">
                                                            {it.coverImage ? (
                                                                <img
                                                                    src={it.coverImage}
                                                                    alt={it.title}
                                                                    className="w-full h-full object-cover object-top"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-[9px] text-zinc-400">
                                                                    Item
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="font-bold text-zinc-900 truncate uppercase text-[11px]">
                                                                {it.title}
                                                            </p>
                                                            <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-zinc-500">
                                                                {it.variant?.size && <span>Size: <strong className="text-zinc-800">{it.variant.size}</strong></span>}
                                                                {it.variant?.color && <span>• Color: <strong className="text-zinc-800">{it.variant.color}</strong></span>}
                                                                <span>• Qty: <strong className="text-zinc-800">{it.quantity}</strong></span>
                                                            </div>
                                                            <p className="font-bold text-zinc-800 text-[11px]">
                                                                ₹{it.unitPrice?.toLocaleString("en-IN")} × {it.quantity} = ₹{it.itemTotal?.toLocaleString("en-IN")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Carrier & Tracking Meta (3 cols) */}
                                        <div className="md:col-span-3 bg-zinc-50 border border-zinc-200/80 rounded-xl p-4 space-y-2">
                                            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider block">
                                                Courier Tracking
                                            </span>
                                            <div className="space-y-1">
                                                <p className="text-zinc-500 text-[11px]">Courier:</p>
                                                <p className="font-bold text-zinc-900">{order.tracking?.carrier || "Not Assigned"}</p>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-zinc-500 text-[11px]">AWB / Tracking No:</p>
                                                <p className="font-mono text-zinc-800 font-bold break-all">
                                                    {order.tracking?.trackingNumber || "Pending"}
                                                </p>
                                            </div>
                                            <div className="pt-1">
                                                <p className="text-[10px] text-zinc-400">
                                                    Est. Delivery:{" "}
                                                    {order.tracking?.estimatedDelivery
                                                        ? new Date(order.tracking.estimatedDelivery).toLocaleDateString("en-IN", {
                                                              month: "short",
                                                              day: "numeric",
                                                          })
                                                        : "3-4 Days"}
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Action Bar */}
                                    <div className="pt-3 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 font-mono-code text-xs">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <TruckIcon className="w-4 h-4 text-zinc-700" />
                                            <span>
                                                Latest Milestone:{" "}
                                                <strong className="text-zinc-800">
                                                    {order.tracking?.events?.[order.tracking?.events?.length - 1]?.title || order.orderStatus}
                                                </strong>
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Link
                                                to={`/orders/${order._id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-zinc-200 text-zinc-700 hover:text-black hover:border-black transition-colors cursor-pointer"
                                            >
                                                <span>Public Tracking Page</span>
                                                <ExternalLinkIcon className="w-3 h-3 text-zinc-400" />
                                            </Link>

                                            <button
                                                onClick={() => handleOpenEditModal(order)}
                                                className="inline-flex items-center gap-1.5 px-5 py-2 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-bold uppercase transition-all shadow-xs cursor-pointer"
                                            >
                                                <EditIcon className="w-3.5 h-3.5" />
                                                <span>Update Tracking & Status</span>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* Tracking Update Modal */}
            {editingOrder && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl border border-zinc-200 my-8">

                        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                            <div>
                                <span className="text-[10px] font-mono-code font-bold uppercase tracking-widest text-zinc-400 block">
                                    Seller Studio Dispatch
                                </span>
                                <h3 className="text-lg font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                                    Update Tracking • #{editingOrder.orderNumber}
                                </h3>
                            </div>
                            <button
                                onClick={() => setEditingOrder(null)}
                                className="w-8 h-8 rounded-full border border-zinc-200 hover:border-black flex items-center justify-center text-zinc-400 hover:text-black cursor-pointer transition-colors"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveTracking} className="space-y-4 font-mono-code text-xs">
                            {/* Status Selector */}
                            <div className="space-y-1.5">
                                <label className="font-bold text-zinc-800 uppercase block">
                                    Order Fulfillment Stage *
                                </label>
                                <select
                                    value={statusForm.status}
                                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                                    className="w-full p-3 rounded-xl border border-zinc-300 bg-white focus:outline-none focus:border-black cursor-pointer font-bold"
                                >
                                    <option value="CONFIRMED">CONFIRMED (Order Verified)</option>
                                    <option value="PROCESSING">PROCESSING (Packed & Ready for Courier)</option>
                                    <option value="SHIPPED">SHIPPED (Handed to Courier Partner)</option>
                                    <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY (Delivery Today)</option>
                                    <option value="DELIVERED">DELIVERED (Successfully Delivered)</option>
                                    <option value="CANCELLED">CANCELLED (Cancel Order)</option>
                                </select>
                            </div>

                            {/* Courier Partner & AWB Tracking Number */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-zinc-800 uppercase block">Courier Partner</label>
                                    <input
                                        type="text"
                                        value={statusForm.carrier}
                                        onChange={(e) => setStatusForm({ ...statusForm, carrier: e.target.value })}
                                        placeholder="E.g., BlueDart, Delhivery, DTDC"
                                        className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-bold text-zinc-800 uppercase block">Tracking / AWB No.</label>
                                    <input
                                        type="text"
                                        value={statusForm.trackingNumber}
                                        onChange={(e) => setStatusForm({ ...statusForm, trackingNumber: e.target.value })}
                                        placeholder="E.g., SNTRK-1092-4821"
                                        className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>

                            {/* Location & Estimated Delivery Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-zinc-800 uppercase block">Current Location</label>
                                    <input
                                        type="text"
                                        value={statusForm.location}
                                        onChange={(e) => setStatusForm({ ...statusForm, location: e.target.value })}
                                        placeholder="E.g., Bengaluru Hub, In Flight"
                                        className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-bold text-zinc-800 uppercase block">Estimated Delivery</label>
                                    <input
                                        type="date"
                                        value={statusForm.estimatedDelivery}
                                        onChange={(e) => setStatusForm({ ...statusForm, estimatedDelivery: e.target.value })}
                                        className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-black"
                                    />
                                </div>
                            </div>

                            {/* Status Milestone Note */}
                            <div className="space-y-1.5">
                                <label className="font-bold text-zinc-800 uppercase block">
                                    Milestone Note (Shown on Customer Tracking Page)
                                </label>
                                <textarea
                                    value={statusForm.description}
                                    onChange={(e) => setStatusForm({ ...statusForm, description: e.target.value })}
                                    placeholder="E.g., Package has cleared security and dispatched to customer's city distribution center..."
                                    rows={2}
                                    className="w-full p-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-black resize-none"
                                />
                            </div>

                            {modalError && <p className="text-rose-600 font-bold">{modalError}</p>}

                            {/* Modal Footer Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingOrder(null)}
                                    disabled={saving}
                                    className="px-5 py-2.5 rounded-full border border-zinc-200 text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2.5 rounded-full bg-black hover:bg-zinc-800 text-white font-bold uppercase transition-all shadow-md cursor-pointer disabled:opacity-50"
                                >
                                    {saving ? "Updating..." : "Save & Push Tracking Update"}
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
}
