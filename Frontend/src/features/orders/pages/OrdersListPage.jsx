import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getMyOrders } from "../services/order.api.js";

function BagIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.67 0-1.19-.578-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.125 1.007z" />
        </svg>
    );
}

function ArrowRightIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
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

export default function OrdersListPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");
    const [error, setError] = useState(null);

    const fetchOrders = async (tab = "ALL") => {
        setLoading(true);
        setError(null);
        try {
            const data = await getMyOrders(tab);
            if (data?.orders) {
                setOrders(data.orders);
            }
        } catch (err) {
            console.error("Failed to load orders:", err);
            setError(err?.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(activeTab);
    }, [activeTab]);

    const filteredOrders = orders.filter((o) => {
        if (activeTab === "ACTIVE") {
            return ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY"].includes(o.orderStatus);
        }
        if (activeTab === "DELIVERED") {
            return o.orderStatus === "DELIVERED";
        }
        if (activeTab === "CANCELLED") {
            return o.orderStatus === "CANCELLED";
        }
        return true;
    });

    return (
        <div className="min-h-screen bg-[#fafafa] py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Page Title & Tabs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
                    <div>
                        <span className="text-[10px] font-mono-code uppercase tracking-widest text-zinc-400 block mb-1">
                            Account Dashboard
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                            My Orders ({orders.length})
                        </h1>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-full font-mono-code text-xs self-start sm:self-auto overflow-x-auto">
                        {[
                            { key: "ALL", label: "All" },
                            { key: "ACTIVE", label: "In Progress" },
                            { key: "DELIVERED", label: "Delivered" },
                            { key: "CANCELLED", label: "Cancelled" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 py-1.5 rounded-full font-bold uppercase transition-all cursor-pointer text-[11px] whitespace-nowrap ${
                                    activeTab === tab.key
                                        ? "bg-black text-white shadow-xs"
                                        : "text-zinc-600 hover:text-black"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono-code flex items-center justify-between">
                        <span>Notice: {error}</span>
                        <button onClick={() => fetchOrders(activeTab)} className="underline font-bold uppercase">
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs font-mono-code text-zinc-500 uppercase tracking-widest">
                            Fetching your orders...
                        </p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredOrders.length === 0 && (
                    <div className="bg-white border border-zinc-200 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-5 shadow-xs">
                        <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                            <BagIcon className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-lg font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                                No Orders Found
                            </h3>
                            <p className="text-xs text-zinc-500">
                                {activeTab === "ALL"
                                    ? "You have not placed any orders yet. Discover our exclusive drops!"
                                    : `You have no ${activeTab.toLowerCase()} orders.`}
                            </p>
                        </div>
                        <div className="pt-2">
                            <Link
                                to="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-bold font-mono-code uppercase tracking-wider transition-all shadow-md"
                            >
                                <span>Start Shopping</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* Orders List */}
                {!loading && filteredOrders.length > 0 && (
                    <div className="space-y-5">
                        {filteredOrders.map((ord) => {
                            const itemCount = ord.items?.reduce((sum, item) => sum + (item.quantity || 1), 0) || ord.items?.length || 1;
                            const statusColor =
                                ord.orderStatus === "DELIVERED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : ord.orderStatus === "CANCELLED"
                                    ? "bg-rose-50 text-rose-700 border-rose-200"
                                    : "bg-zinc-900 text-white border-zinc-900";

                            return (
                                <div
                                    key={ord._id}
                                    className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl p-5 sm:p-6 transition-all shadow-xs space-y-4"
                                >
                                    {/* Order Card Header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                                        <div className="space-y-0.5">
                                            <span className="text-[10px] font-mono-code uppercase text-zinc-400 font-bold tracking-wider">
                                                Order #{ord.orderNumber}
                                            </span>
                                            <p className="text-xs font-mono-code text-zinc-500">
                                                Placed on {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[11px] font-bold font-mono-code uppercase border ${statusColor}`}
                                            >
                                                {ord.orderStatus.replace(/_/g, " ")}
                                            </span>

                                            <span className="font-mono-code font-black text-sm text-zinc-950">
                                                ₹{(ord.pricing?.totalAmount || 0).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Items Preview Row */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 overflow-x-auto py-1">
                                            {ord.items?.slice(0, 4).map((it, i) => (
                                                <div
                                                    key={i}
                                                    title={it.title}
                                                    className="w-14 h-18 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden flex-shrink-0"
                                                >
                                                    {it.coverImage ? (
                                                        <img
                                                            src={it.coverImage}
                                                            alt={it.title}
                                                            className="w-full h-full object-cover object-top"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-400 text-[10px]">
                                                            Item
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                            {ord.items?.length > 4 && (
                                                <div className="w-14 h-18 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xs font-mono-code font-bold text-zinc-500">
                                                    +{ord.items.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1 text-xs font-mono-code text-zinc-600 sm:text-right">
                                            <p className="font-bold text-zinc-900">
                                                {itemCount} {itemCount === 1 ? "item" : "items"}
                                            </p>
                                            <div className="flex items-center sm:justify-end gap-1.5 text-[11px] text-zinc-500">
                                                <TruckIcon className="w-3.5 h-3.5 text-zinc-700" />
                                                <span>
                                                    {ord.orderStatus === "DELIVERED"
                                                        ? "Delivered"
                                                        : ord.tracking?.estimatedDelivery
                                                        ? `Est: ${new Date(ord.tracking.estimatedDelivery).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}`
                                                        : "Standard Delivery"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons Footer */}
                                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between font-mono-code">
                                        <span className="text-[11px] text-zinc-400 uppercase">
                                            {ord.payment?.method === "cod" ? "Cash On Delivery" : "Paid Online"}
                                        </span>

                                        <Link
                                            to={`/orders/${ord._id}`}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-bold uppercase transition-all shadow-xs cursor-pointer"
                                        >
                                            <span>Track Order</span>
                                            <ArrowRightIcon className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
}
