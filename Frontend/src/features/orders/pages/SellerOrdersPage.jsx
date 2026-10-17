import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSellerOrders, updateSellerOrderStatus } from "../services/order.api.js";

// ─── Refined SVG Line Icons (VELMORA Atelier Design System) ──────────────────
function DashboardIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
        </svg>
    );
}

function ArchiveBoxIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

function TruckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25h-3.75a1.125 1.125 0 00-1.125 1.125v6.75" />
        </svg>
    );
}

function SearchIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
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

function SlidersIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
    );
}

function ManifestIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
    );
}

function BellIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
    );
}

function UserIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function CheckCircleIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function PrinterIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.656h10.5z" />
        </svg>
    );
}

function BoxIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
    );
}

function CubeIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3.75h.008v.008H12v-.008z" />
        </svg>
    );
}

function CalendarIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
        </svg>
    );
}

function ChevronDownIcon({ className = "w-3 h-3" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

function ChevronLeftIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
    );
}

function ChevronRightIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
    );
}

function ArrowUpRightIcon({ className = "w-3 h-3" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
        </svg>
    );
}

function MenuIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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

// ─── Constants & Milestone Definitions ────────────────────────────────────────
const MILESTONES = [
    { key: "PLACED", label: "ORDER PLACED", display: "Order Placed" },
    { key: "CONFIRMED", label: "ORDER CONFIRMED", display: "Order Confirmed" },
    { key: "PROCESSING", label: "PACKING", display: "Packing" },
    { key: "SHIPPED", label: "IN TRANSIT", display: "In Transit" },
    { key: "DELIVERED", label: "DELIVERED", display: "Delivered" },
];

const STATUS_FILTERS = [
    { key: "ALL", label: "ALL ORDERS" },
    { key: "PLACED", label: "PLACED / NEW" },
    { key: "CONFIRMED", label: "CONFIRMED" },
    { key: "PROCESSING", label: "PACKING" },
    { key: "SHIPPED", label: "IN TRANSIT" },
    { key: "DELIVERED", label: "DELIVERED" },
    { key: "CANCELLED", label: "CANCELLED" },
];

const COURIER_OPTIONS = [
    "BlueDart Atelier Express",
    "Delhivery Private Fleet",
    "DHL Express Priority",
    "FedEx International",
    "Shadowfax Atelier Dispatch",
    "Velmora Express Courier",
];

// Helper to determine status badge styling
function getStatusBadge(status) {
    const s = (status || "").toUpperCase();
    switch (s) {
        case "PLACED":
            return {
                bg: "bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]",
                dot: "bg-[#CA8A04]",
                label: "PLACED",
            };
        case "CONFIRMED":
            return {
                bg: "bg-[#E0E7FF] text-[#3730A3] border-[#C7D2FE]",
                dot: "bg-[#4F46E5]",
                label: "CONFIRMED",
            };
        case "PROCESSING":
            return {
                bg: "bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]",
                dot: "bg-[#9333EA]",
                label: "PACKING",
            };
        case "SHIPPED":
        case "OUT_FOR_DELIVERY":
            return {
                bg: "bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]",
                dot: "bg-[#EA580C]",
                label: "IN TRANSIT",
            };
        case "DELIVERED":
            return {
                bg: "bg-[#EAEFE6] text-[#4A5340] border-[#C8D7BE]",
                dot: "bg-[#4A5340]",
                label: "DELIVERED",
            };
        case "CANCELLED":
            return {
                bg: "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]",
                dot: "bg-[#DC2626]",
                label: "CANCELLED",
            };
        default:
            return {
                bg: "bg-[#F5F2EB] text-[#525252] border-[#ECE7DD]",
                dot: "bg-[#737373]",
                label: s || "PLACED",
            };
    }
}

export default function SellerOrdersPage() {
    const user = useSelector((state) => state.auth?.user);
    const navigate = useNavigate();

    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCourierFilter, setSelectedCourierFilter] = useState("ALL");
    const [selectedDateFilter, setSelectedDateFilter] = useState("ALL");

    // Live Orders & Metrics Data
    const [orders, setOrders] = useState([]);
    const [serverMetrics, setServerMetrics] = useState(null);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [selectedRowIds, setSelectedRowIds] = useState(new Set());

    // Live API & Refresh states
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [shippingSettingsOpen, setShippingSettingsOpen] = useState(false);

    // Inspector states
    const [inspectorSelectedMilestone, setInspectorSelectedMilestone] = useState("PLACED");
    const [inspectorSelectedCourier, setInspectorSelectedCourier] = useState("");
    const [inspectorTrackingNumber, setInspectorTrackingNumber] = useState("");

    // ─── Fetch Orders from Backend API ────────────────────────────────────────
    const fetchOrders = async (isManualRefresh = false) => {
        if (isManualRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        setFeedback(null);

        try {
            const res = await getSellerOrders();
            if (res && Array.isArray(res.orders)) {
                setOrders(res.orders);
                if (res.metrics) {
                    setServerMetrics(res.metrics);
                }

                // If currently selected order is still in response, preserve it; otherwise select first
                if (res.orders.length > 0) {
                    setSelectedOrderId((currentId) => {
                        const exists = res.orders.some((o) => o._id === currentId);
                        return exists ? currentId : res.orders[0]._id;
                    });
                } else {
                    setSelectedOrderId(null);
                }
            }

            if (isManualRefresh) {
                setFeedback({
                    type: "success",
                    message: "Atelier consignment records refreshed with live dispatch database.",
                });
            }
        } catch (err) {
            console.warn("Backend orders sync:", err?.message || err);
            if (isManualRefresh) {
                setFeedback({
                    type: "error",
                    message: `Unable to sync with dispatch server: ${err?.response?.data?.message || err?.message || "Network error"}.`,
                });
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders(false);
    }, []);

    // ─── Selected Order Details for Active Inspector ──────────────────────────
    const selectedOrder = useMemo(() => {
        if (!orders || orders.length === 0) return null;
        return orders.find((o) => o._id === selectedOrderId) || orders[0] || null;
    }, [orders, selectedOrderId]);

    // Keep inspector form in sync with currently selected order
    useEffect(() => {
        if (selectedOrder) {
            setInspectorSelectedMilestone(selectedOrder.orderStatus || "PLACED");
            setInspectorSelectedCourier(selectedOrder.tracking?.carrier || "");
            setInspectorTrackingNumber(selectedOrder.tracking?.trackingNumber || "");
        }
    }, [selectedOrder]);

    // ─── Dynamic Tab Counts ───────────────────────────────────────────────────
    const tabCounts = useMemo(() => {
        const counts = {
            ALL: orders.length,
            PLACED: 0,
            CONFIRMED: 0,
            PROCESSING: 0,
            SHIPPED: 0,
            DELIVERED: 0,
            CANCELLED: 0,
        };

        orders.forEach((o) => {
            const st = (o.orderStatus || "").toUpperCase();
            if (st === "OUT_FOR_DELIVERY") {
                counts.SHIPPED = (counts.SHIPPED || 0) + 1;
            } else if (counts[st] !== undefined) {
                counts[st] += 1;
            }
        });

        return counts;
    }, [orders]);

    // ─── Top Studio Metrics Calculation ──────────────────────────────────────
    const metrics = useMemo(() => {
        const total = serverMetrics?.totalOrders ?? orders.length;
        const pending =
            serverMetrics?.pendingFulfillment ??
            (tabCounts.PLACED + tabCounts.CONFIRMED + tabCounts.PROCESSING);
        const transit = serverMetrics?.inTransit ?? tabCounts.SHIPPED;
        const delivered = serverMetrics?.deliveredCount ?? tabCounts.DELIVERED;
        const rev =
            serverMetrics?.totalRevenue ??
            orders.reduce((acc, o) => {
                return o.orderStatus !== "CANCELLED" ? acc + Number(o.pricing?.totalAmount || 0) : acc;
            }, 0);

        return {
            totalOrders: total,
            totalSubtext: "All customer drops",
            pendingPacking: pending,
            pendingSubtext: `${pending} need fulfillment`,
            inTransit: transit,
            inTransitSubtext: "With courier partners",
            salesRevenue: `₹${rev.toLocaleString("en-IN")}`,
            revenueSubtext: `${delivered} Delivered`,
        };
    }, [serverMetrics, orders, tabCounts]);

    // ─── Filter & Search Logic ────────────────────────────────────────────────
    const filteredOrders = useMemo(() => {
        return orders.filter((o) => {
            // 1. Status Filter
            if (selectedTab !== "ALL") {
                const st = (o.orderStatus || "").toUpperCase();
                if (selectedTab === "SHIPPED") {
                    if (st !== "SHIPPED" && st !== "OUT_FOR_DELIVERY") return false;
                } else if (st !== selectedTab) {
                    return false;
                }
            }

            // 2. Courier Filter
            if (selectedCourierFilter !== "ALL") {
                const carrier = (o.tracking?.carrier || "").toLowerCase();
                if (selectedCourierFilter === "UNASSIGNED") {
                    if (carrier) return false;
                } else if (!carrier.includes(selectedCourierFilter.toLowerCase())) {
                    return false;
                }
            }

            // 3. Date Filter
            if (selectedDateFilter !== "ALL" && o.createdAt) {
                const orderDate = new Date(o.createdAt);
                const now = new Date();
                if (selectedDateFilter === "TODAY") {
                    if (orderDate.toDateString() !== now.toDateString()) return false;
                } else if (selectedDateFilter === "WEEK") {
                    const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
                    if (diffDays > 7) return false;
                } else if (selectedDateFilter === "MONTH") {
                    const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
                    if (diffDays > 30) return false;
                }
            }

            // 4. Search Query Match
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim();
                const num = (o.orderNumber || "").toLowerCase();
                const custName = (o.user?.fullname || o.shippingAddress?.fullName || "").toLowerCase();
                const custEmail = (o.user?.email || "").toLowerCase();
                const city = (o.shippingAddress?.city || "").toLowerCase();
                const phone = (o.shippingAddress?.phone || "").toLowerCase();
                const trk = (o.tracking?.trackingNumber || "").toLowerCase();
                const carrier = (o.tracking?.carrier || "").toLowerCase();
                const hasItem =
                    Array.isArray(o.items) &&
                    o.items.some((it) => (it.title || "").toLowerCase().includes(q));

                if (
                    !num.includes(q) &&
                    !custName.includes(q) &&
                    !custEmail.includes(q) &&
                    !city.includes(q) &&
                    !phone.includes(q) &&
                    !trk.includes(q) &&
                    !carrier.includes(q) &&
                    !hasItem
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [orders, selectedTab, selectedCourierFilter, selectedDateFilter, searchQuery]);

    // ─── Milestone Steps for Inspector Progress Bar ───────────────────────────
    const MILESTONE_STEPS = ["PLACED", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
    const currentMilestoneIndex = Math.max(
        0,
        MILESTONE_STEPS.indexOf(inspectorSelectedMilestone || selectedOrder?.orderStatus || "PLACED")
    );
    const progressPercent = Math.min(
        100,
        Math.round(((currentMilestoneIndex + 1) / MILESTONE_STEPS.length) * 100)
    );

    // ─── Multi-select Checkbox Handling ───────────────────────────────────────
    const allFilteredSelected =
        filteredOrders.length > 0 &&
        filteredOrders.every((o) => selectedRowIds.has(o._id));

    const handleSelectAllToggle = () => {
        if (allFilteredSelected) {
            setSelectedRowIds(new Set());
        } else {
            setSelectedRowIds(new Set(filteredOrders.map((o) => o._id)));
        }
    };

    const handleRowCheckboxToggle = (orderId) => {
        setSelectedRowIds((prev) => {
            const next = new Set(prev);
            if (next.has(orderId)) {
                next.delete(orderId);
            } else {
                next.add(orderId);
            }
            return next;
        });
    };

    // ─── Save Milestone Updates Handler ──────────────────────────────────────
    const handleSaveMilestones = async () => {
        if (!selectedOrder?._id) {
            setFeedback({
                type: "error",
                message: "Please select an order from the list to update its consignment milestone.",
            });
            return;
        }

        setSaving(true);
        setFeedback(null);

        try {
            const updatePayload = {
                status: inspectorSelectedMilestone,
                carrier: inspectorSelectedCourier || "",
                trackingNumber: inspectorTrackingNumber || "",
            };

            const res = await updateSellerOrderStatus(selectedOrder._id, updatePayload);
            if (res && res.success) {
                // Update local orders list state
                setOrders((prev) =>
                    prev.map((ord) =>
                        ord._id === selectedOrder._id
                            ? {
                                  ...ord,
                                  orderStatus: inspectorSelectedMilestone,
                                  tracking: {
                                      ...ord.tracking,
                                      carrier: inspectorSelectedCourier,
                                      trackingNumber: inspectorTrackingNumber || ord.tracking?.trackingNumber,
                                  },
                              }
                            : ord
                    )
                );

                setFeedback({
                    type: "success",
                    message: `Consignment #${selectedOrder.orderNumber} milestone updated to ${inspectorSelectedMilestone}.`,
                });
            } else {
                setFeedback({
                    type: "error",
                    message: res?.message || "Failed to update order milestone.",
                });
            }
        } catch (err) {
            console.error("Save milestone error:", err);
            setFeedback({
                type: "error",
                message: `Update failed: ${err?.response?.data?.message || err?.message || "Network error"}.`,
            });
        } finally {
            setSaving(false);
        }
    };

    // ─── Print Consignment Note ──────────────────────────────────────────────
    const handlePrintConsignment = () => {
        window.print();
    };

    // ─── Export Manifest Handler (CSV) ───────────────────────────────────────
    const handleExportManifest = () => {
        const rowsToExport =
            selectedRowIds.size > 0
                ? filteredOrders.filter((o) => selectedRowIds.has(o._id))
                : filteredOrders.length > 0
                ? filteredOrders
                : orders;

        if (rowsToExport.length === 0) {
            setFeedback({
                type: "info",
                message: "No consignment records found to export.",
            });
            return;
        }

        const headers = [
            "Consignment ID",
            "Order Date",
            "Status",
            "Customer",
            "Contact Phone",
            "City",
            "State",
            "Pieces",
            "Courier Partner",
            "Tracking Reference",
            "Payment Method",
            "Total Value",
        ];

        const rows = rowsToExport.map((o) => {
            const dateStr = o.createdAt
                ? new Date(o.createdAt).toLocaleDateString("en-IN")
                : "—";
            const cust = o.user?.fullname || o.shippingAddress?.fullName || "—";
            const phone = o.shippingAddress?.phone || o.user?.contact || "—";
            const city = o.shippingAddress?.city || "—";
            const state = o.shippingAddress?.state || "—";
            const garments = o.items?.length ? `${o.items.length} pcs` : "1 pc";
            const courier = o.tracking?.carrier || "Unassigned";
            const trk = o.tracking?.trackingNumber || "—";
            const payMethod = (o.payment?.method || "COD").toUpperCase();
            const val = `₹${(o.pricing?.totalAmount || 0).toLocaleString("en-IN")}`;

            return [
                `"${o.orderNumber || o._id}"`,
                `"${dateStr}"`,
                `"${o.orderStatus}"`,
                `"${cust}"`,
                `"${phone}"`,
                `"${city}"`,
                `"${state}"`,
                `"${garments}"`,
                `"${courier}"`,
                `"${trk}"`,
                `"${payMethod}"`,
                `"${val}"`,
            ].join(",");
        });

        const csvContent =
            "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
            "download",
            `VELMORA_Consignments_${new Date().toISOString().slice(0, 10)}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#171717] selection:bg-[#171717] selection:text-[#FBF9F5] antialiased flex flex-col lg:flex-row">
            {/* Custom font definitions matching VELMORA Atelier Design System */}
            <style>{`
                .font-editorial-serif {
                    font-family: 'EB Garamond', 'Newsreader', 'Cormorant Garamond', Georgia, serif;
                }
                .font-interface-sans {
                    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                @media print {
                    aside, header, nav, .no-print {
                        display: none !important;
                    }
                    body, main {
                        background: #ffffff !important;
                        color: #000000 !important;
                    }
                    .print-only {
                        display: block !important;
                    }
                }
            `}</style>

            {/* ══════════════════════════════════════════════════════════════════
                1. VELMORA SELLER SIDEBAR NAVIGATION
            ══════════════════════════════════════════════════════════════════ */}
            <aside className="w-full lg:w-64 xl:w-72 bg-[#FBF9F5] border-r border-[#ECE7DD] flex flex-col justify-between flex-shrink-0 z-30 font-interface-sans no-print">
                {/* Sidebar Top: Brand & Menu Links */}
                <div>
                    {/* Brand Header */}
                    <div className="p-6 sm:p-7 border-b border-[#ECE7DD] flex items-center justify-between">
                        <div>
                            <Link to="/" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717]">
                                <span className="font-editorial-serif text-2xl font-normal tracking-[0.2em] text-[#171717] uppercase block">
                                    VELMORA
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
                            className="lg:hidden p-2 text-[#171717] hover:text-[#4A5340] cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                            aria-label="Toggle Navigation Menu"
                            aria-expanded={mobileNavOpen}
                        >
                            <MenuIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation Items (Desktop & Mobile Expanded) */}
                    <nav className={`${mobileNavOpen ? "block" : "hidden"} lg:block py-4 px-3 space-y-1`} aria-label="Portal Navigation">
                        <Link
                            to="/seller/dashboard"
                            onClick={() => setMobileNavOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#525252] hover:text-[#171717] hover:bg-[#F5F2EB] transition-colors focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                        >
                            <DashboardIcon className="w-4 h-4 text-[#737373]" />
                            <span>DASHBOARD</span>
                        </Link>

                        <Link
                            to="/seller/products"
                            onClick={() => setMobileNavOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#525252] hover:text-[#171717] hover:bg-[#F5F2EB] transition-colors focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                        >
                            <ArchiveBoxIcon className="w-4 h-4 text-[#737373]" />
                            <span>PRODUCTS CATALOG</span>
                        </Link>

                        {/* Active Item: ORDERS & FULFILLMENT */}
                        <Link
                            to="/seller/orders"
                            onClick={() => setMobileNavOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-3 text-[11px] font-semibold tracking-[0.16em] uppercase bg-[#171717] text-[#FBF9F5] shadow-xs focus-visible:ring-2 focus-visible:ring-[#4A5340] focus-visible:outline-none"
                            aria-current="page"
                        >
                            <TruckIcon className="w-4 h-4 text-[#FBF9F5]" />
                            <span>ORDERS &amp; FULFILLMENT</span>
                        </Link>
                    </nav>
                </div>

                {/* Sidebar Bottom: Status & Return to Storefront */}
                <div className={`${mobileNavOpen ? "block" : "hidden"} lg:block p-6 border-t border-[#ECE7DD] space-y-4`}>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-[#737373]">
                        <span className="w-2 h-2 rounded-full bg-[#4A5340]" aria-hidden="true" />
                        <span>ATELIER DIRECT / ACTIVE</span>
                    </div>

                    <Link
                        to="/"
                        onClick={() => setMobileNavOpen(false)}
                        className="w-full py-2.5 px-3 bg-[#FBF9F5] border border-[#D5CEBF] hover:border-[#171717] text-[#171717] text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center justify-between transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                    >
                        <span>RETURN TO STOREFRONT</span>
                        <ArrowUpRightIcon className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                        to="/logout"
                        onClick={() => setMobileNavOpen(false)}
                        className="w-full py-2 px-3 text-[#737373] hover:text-[#171717] text-[10px] font-semibold tracking-[0.2em] uppercase flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                    >
                        <span>SIGN OUT</span>
                        <span className="text-xs">→</span>
                    </Link>
                </div>
            </aside>

            {/* ══════════════════════════════════════════════════════════════════
                2. MAIN PORTAL CONTENT AREA
            ══════════════════════════════════════════════════════════════════ */}
            <main className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    {/* Top Header Strip */}
                    <header className="border-b border-[#ECE7DD] bg-[#FBF9F5] px-6 sm:px-10 py-3.5 flex items-center justify-between font-interface-sans text-xs no-print">
                        {/* Breadcrumb Node Path */}
                        <div className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-[#737373] flex items-center">
                            <span>PORTAL NODE</span>
                            <span className="mx-2 text-[#D5CEBF]">/</span>
                            <span className="text-[#171717] font-semibold">VELMORA TAILORING ATELIER</span>
                        </div>

                        {/* Top Right Controls */}
                        <div className="flex items-center gap-4">
                            <span className="hidden sm:inline text-[10px] font-medium tracking-[0.18em] uppercase text-[#737373]">
                                STOREFRONT: VELMORA STUDIO
                            </span>
                            <button
                                type="button"
                                className="relative text-[#737373] hover:text-[#171717] p-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                                aria-label="Notifications"
                            >
                                <BellIcon className="w-4 h-4" />
                                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#4A5340]" />
                            </button>
                            <div
                                title={user?.email || "Seller Atelier Account"}
                                className="w-7 h-7 rounded-full bg-[#171717] text-[#FBF9F5] flex items-center justify-center text-[11px] font-semibold tracking-wider cursor-default"
                                aria-label="Seller Account Profile"
                            >
                                {user?.fullname ? user.fullname.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
                            </div>
                        </div>
                    </header>

                    {/* Main Fulfillment Control Body */}
                    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 font-interface-sans">
                        {/* ─── Feedback Banner (Toast / Alert) ────────────────── */}
                        {feedback && (
                            <div
                                role="alert"
                                className={`p-4 border text-xs tracking-wider flex items-center justify-between transition-all ${
                                    feedback.type === "success"
                                        ? "bg-[#EAEFE6] border-[#C8D7BE] text-[#4A5340]"
                                        : feedback.type === "error"
                                        ? "bg-[#FDF2F2] border-[#F8D7DA] text-[#9E2A2B]"
                                        : "bg-[#F5F2EB] border-[#ECE7DD] text-[#171717]"
                                }`}
                            >
                                <span>{feedback.message}</span>
                                <button
                                    type="button"
                                    onClick={() => setFeedback(null)}
                                    className="p-1 hover:opacity-75 focus-visible:outline-none"
                                    aria-label="Dismiss Notification"
                                >
                                    <XIcon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        {/* ─── Fulfillment Control Heading & Subtitle ─────────── */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 no-print">
                            <div className="space-y-1.5">
                                <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#171717]">
                                    Fulfillment Control
                                </h1>
                                <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="text-xs sm:text-sm font-semibold tracking-[0.16em] uppercase text-[#171717]">
                                        Manage Orders &amp; Live Tracking
                                    </span>
                                    <span className="text-[#D5CEBF]">•</span>
                                    <span className="text-[10px] tracking-[0.18em] uppercase font-semibold text-[#4A5340]">
                                        ACTIVE ATELIER DISPATCH
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#737373] max-w-2xl leading-relaxed pt-0.5">
                                    Track incoming customer orders, manage shipments, assign couriers, and update delivery milestones.
                                </p>
                            </div>

                            {/* Top Action Controls */}
                            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 flex-shrink-0">
                                {/* Refresh Control */}
                                <button
                                    type="button"
                                    onClick={() => fetchOrders(true)}
                                    disabled={refreshing || loading}
                                    className="px-4 py-2.5 bg-[#FBF9F5] border border-[#D5CEBF] hover:border-[#171717] text-[#171717] text-[10px] font-semibold tracking-[0.18em] uppercase flex items-center gap-2 transition-colors shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none disabled:opacity-50"
                                    aria-label="Refresh fulfillment records"
                                >
                                    <RefreshIcon className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#4A5340]" : ""}`} />
                                    <span>REFRESH</span>
                                </button>

                                {/* Shipping Settings Control */}
                                <button
                                    type="button"
                                    onClick={() => setShippingSettingsOpen(!shippingSettingsOpen)}
                                    className="px-4 py-2.5 bg-[#FBF9F5] border border-[#D5CEBF] hover:border-[#171717] text-[#171717] text-[10px] font-semibold tracking-[0.18em] uppercase flex items-center gap-2 transition-colors shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                                    aria-label="Open shipping settings"
                                    aria-expanded={shippingSettingsOpen}
                                >
                                    <SlidersIcon className="w-3.5 h-3.5 text-[#737373]" />
                                    <span>SHIPPING SETTINGS</span>
                                </button>

                                {/* Export Manifest Control */}
                                <button
                                    type="button"
                                    onClick={handleExportManifest}
                                    className="px-4 py-2.5 bg-[#171717] hover:bg-[#262626] text-[#FBF9F5] text-[10px] font-semibold tracking-[0.18em] uppercase flex items-center gap-2 transition-colors shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4A5340] focus-visible:outline-none"
                                    aria-label="Export consignment manifest"
                                >
                                    <ManifestIcon className="w-3.5 h-3.5 text-[#FBF9F5]" />
                                    <span>EXPORT MANIFEST</span>
                                </button>
                            </div>
                        </div>

                        {/* Shipping Settings Drawer (Collapsible) */}
                        {shippingSettingsOpen && (
                            <div className="p-5 border border-[#ECE7DD] bg-[#F5F2EB] space-y-3 transition-all no-print" role="region" aria-label="Shipping Settings">
                                <div className="flex items-center justify-between border-b border-[#ECE7DD] pb-2">
                                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#171717]">
                                        Atelier Fulfillment &amp; Dispatch SLA
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setShippingSettingsOpen(false)}
                                        className="text-[#737373] hover:text-[#171717] p-1"
                                        aria-label="Close settings"
                                    >
                                        <XIcon className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#525252]">
                                    <div>
                                        <span className="block text-[10px] uppercase font-semibold text-[#737373] tracking-wider mb-1">
                                            Dispatch Atelier
                                        </span>
                                        <p className="font-medium text-[#171717]">VELMORA Tailoring Node 01</p>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-semibold text-[#737373] tracking-wider mb-1">
                                            Default Carrier
                                        </span>
                                        <p className="font-medium text-[#171717]">BlueDart Atelier Express</p>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] uppercase font-semibold text-[#737373] tracking-wider mb-1">
                                            Dispatch Cutoff
                                        </span>
                                        <p className="font-medium text-[#171717]">16:00 IST • Same Day Guarantee</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ─── Exact Metrics Grid ─────────────────────────────── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 no-print">
                            {/* Card 1: TOTAL ORDERS */}
                            <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-5 flex flex-col justify-between shadow-xs border-b-2 border-b-[#171717]">
                                <div className="flex items-center justify-between text-[#737373]">
                                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">TOTAL ORDERS</span>
                                    <BoxIcon className="w-4 h-4 text-[#737373]" />
                                </div>
                                <div className="mt-4">
                                    <span className="font-editorial-serif text-3xl sm:text-4xl text-[#171717] block leading-none font-normal">
                                        {metrics.totalOrders}
                                    </span>
                                    <span className="text-[11px] text-[#737373] block mt-1.5 tracking-wide">
                                        {metrics.totalSubtext}
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: PENDING FULFILLMENT */}
                            <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-5 flex flex-col justify-between shadow-xs">
                                <div className="flex items-center justify-between text-[#737373]">
                                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">PENDING PACKING</span>
                                    <CubeIcon className="w-4 h-4 text-[#737373]" />
                                </div>
                                <div className="mt-4">
                                    <span className="font-editorial-serif text-3xl sm:text-4xl text-[#171717] block leading-none font-normal">
                                        {metrics.pendingPacking}
                                    </span>
                                    <span className="text-[11px] text-[#737373] block mt-1.5 tracking-wide">
                                        {metrics.pendingSubtext}
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: IN TRANSIT */}
                            <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-5 flex flex-col justify-between shadow-xs">
                                <div className="flex items-center justify-between text-[#737373]">
                                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">IN TRANSIT</span>
                                    <TruckIcon className="w-4 h-4 text-[#737373]" />
                                </div>
                                <div className="mt-4">
                                    <span className="font-editorial-serif text-3xl sm:text-4xl text-[#171717] block leading-none font-normal">
                                        {metrics.inTransit}
                                    </span>
                                    <span className="text-[11px] text-[#737373] block mt-1.5 tracking-wide">
                                        {metrics.inTransitSubtext}
                                    </span>
                                </div>
                            </div>

                            {/* Card 4: SALES REVENUE */}
                            <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-5 flex flex-col justify-between shadow-xs">
                                <div className="flex items-center justify-between text-[#737373]">
                                    <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">SALES REVENUE</span>
                                    <CheckCircleIcon className="w-4 h-4 text-[#4A5340]" />
                                </div>
                                <div className="mt-4">
                                    <span className="font-editorial-serif text-3xl sm:text-4xl text-[#171717] block leading-none font-normal">
                                        {metrics.salesRevenue}
                                    </span>
                                    <span className="text-[11px] text-[#737373] block mt-1.5 tracking-wide">
                                        {metrics.revenueSubtext}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ─── Status Filter Tabs ─────────────────────────────── */}
                        <div className="space-y-4 no-print">
                            <div className="flex flex-wrap items-center gap-1.5 border-b border-[#ECE7DD] pb-3" role="tablist" aria-label="Order Status Filters">
                                {STATUS_FILTERS.map((tab) => {
                                    const count = tabCounts[tab.key] ?? 0;
                                    const isActive = selectedTab === tab.key;
                                    return (
                                        <button
                                            key={tab.key}
                                            type="button"
                                            role="tab"
                                            aria-selected={isActive}
                                            onClick={() => setSelectedTab(tab.key)}
                                            className={`px-3.5 py-2 text-[10px] sm:text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none ${
                                                isActive
                                                    ? "bg-[#171717] text-[#FBF9F5] shadow-xs"
                                                    : "bg-[#F5F2EB] text-[#525252] hover:bg-[#ECE7DD] hover:text-[#171717]"
                                            }`}
                                        >
                                            <span>{tab.label}</span>
                                            <span className="ml-1.5 opacity-80">({count})</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Sub-Filters: Search input, Courier filter, Date filter */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                                {/* Search input */}
                                <div className="md:col-span-6 relative">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#737373]">
                                        <SearchIcon className="w-3.5 h-3.5" />
                                    </span>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search by order ID, customer name, destination, product..."
                                        className="w-full pl-9 pr-3.5 py-2.5 bg-[#FBF9F5] border border-[#ECE7DD] text-xs text-[#171717] placeholder:text-[#737373] tracking-wide focus:border-[#171717] focus-visible:ring-2 focus-visible:ring-[#171717] focus:outline-none shadow-xs"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery("")}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#737373] hover:text-[#171717]"
                                            aria-label="Clear Search"
                                        >
                                            <XIcon className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>

                                {/* Courier Select Filter */}
                                <div className="md:col-span-3 relative">
                                    <select
                                        value={selectedCourierFilter}
                                        onChange={(e) => setSelectedCourierFilter(e.target.value)}
                                        className="w-full px-3.5 py-2.5 bg-[#F5F2EB] border border-[#ECE7DD] text-xs font-medium text-[#171717] tracking-wider uppercase focus:border-[#171717] focus-visible:ring-2 focus-visible:ring-[#171717] focus:outline-none appearance-none cursor-pointer shadow-xs"
                                        aria-label="Filter by courier partner"
                                    >
                                        <option value="ALL">ALL COURIERS</option>
                                        <option value="BlueDart">BLUEDART</option>
                                        <option value="Delhivery">DELHIVERY</option>
                                        <option value="DHL">DHL EXPRESS</option>
                                        <option value="FedEx">FEDEX</option>
                                        <option value="Shadowfax">SHADOWFAX</option>
                                        <option value="Velmora">VELMORA EXPRESS</option>
                                        <option value="UNASSIGNED">UNASSIGNED</option>
                                    </select>
                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#737373]">
                                        <ChevronDownIcon className="w-3 h-3" />
                                    </span>
                                </div>

                                {/* Date Select Filter */}
                                <div className="md:col-span-3 relative">
                                    <select
                                        value={selectedDateFilter}
                                        onChange={(e) => setSelectedDateFilter(e.target.value)}
                                        className="w-full pl-8 pr-3.5 py-2.5 bg-[#F5F2EB] border border-[#ECE7DD] text-xs font-medium text-[#171717] tracking-wider uppercase focus:border-[#171717] focus-visible:ring-2 focus-visible:ring-[#171717] focus:outline-none appearance-none cursor-pointer shadow-xs"
                                        aria-label="Filter by dispatch date"
                                    >
                                        <option value="ALL">ALL DATES</option>
                                        <option value="TODAY">TODAY</option>
                                        <option value="WEEK">THIS WEEK</option>
                                        <option value="MONTH">THIS MONTH</option>
                                    </select>
                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#737373]">
                                        <CalendarIcon className="w-3.5 h-3.5" />
                                    </span>
                                    <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#737373]">
                                        <ChevronDownIcon className="w-3 h-3" />
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ─── Two-Column Split Layout: Table (Left) + Inspector (Right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* ─── LEFT COLUMN: Order List Table ───────────────── */}
                            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                                {loading && orders.length === 0 ? (
                                    <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-12 text-center space-y-3">
                                        <div className="w-8 h-8 border-2 border-[#171717] border-t-transparent rounded-full animate-spin mx-auto" />
                                        <p className="text-xs uppercase tracking-widest text-[#737373]">
                                            Loading atelier consignment records...
                                        </p>
                                    </div>
                                ) : filteredOrders.length > 0 ? (
                                    <div className="bg-[#FBF9F5] border border-[#ECE7DD] shadow-xs overflow-hidden">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse font-interface-sans text-xs">
                                                <thead>
                                                    <tr className="border-b border-[#ECE7DD] bg-[#F5F2EB] text-[#737373] text-[9.5px] uppercase font-semibold tracking-[0.18em]">
                                                        <th className="py-3 px-3.5 w-10 text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={allFilteredSelected}
                                                                onChange={handleSelectAllToggle}
                                                                className="rounded-none border-[#ECE7DD] text-[#171717] focus:ring-[#171717] cursor-pointer"
                                                                aria-label="Select all consignments"
                                                            />
                                                        </th>
                                                        <th className="py-3 px-3.5 font-semibold">CONSIGNMENT / ORDER</th>
                                                        <th className="py-3 px-3.5 font-semibold">DESTINATION</th>
                                                        <th className="py-3 px-3.5 font-semibold">GARMENTS</th>
                                                        <th className="py-3 px-3.5 font-semibold">COURIER &amp; TRACKING</th>
                                                        <th className="py-3 px-3.5 font-semibold text-right">VALUE</th>
                                                        <th className="py-3 px-3.5 font-semibold text-center">STATUS</th>
                                                        <th className="py-3 px-3.5 font-semibold text-center">ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-[#ECE7DD]">
                                                    {filteredOrders.map((ord) => {
                                                        const isInspected = selectedOrder?._id === ord._id;
                                                        const isChecked = selectedRowIds.has(ord._id);
                                                        const badge = getStatusBadge(ord.orderStatus);

                                                        const dateFormatted = ord.createdAt
                                                            ? new Date(ord.createdAt).toLocaleDateString("en-IN", {
                                                                  day: "2-digit",
                                                                  month: "short",
                                                                  year: "numeric",
                                                              })
                                                            : "—";

                                                        const destination = ord.shippingAddress?.city
                                                            ? `${ord.shippingAddress.city}${
                                                                  ord.shippingAddress.state ? `, ${ord.shippingAddress.state}` : ""
                                                              }`
                                                            : "—";

                                                        const customerName =
                                                            ord.shippingAddress?.fullName ||
                                                            ord.user?.fullname ||
                                                            "Customer";

                                                        const garmentsCount = ord.items?.length
                                                            ? `${ord.items.length} ${ord.items.length === 1 ? "Piece" : "Pieces"}`
                                                            : "1 Piece";

                                                        const courier = ord.tracking?.carrier || "—";
                                                        const trackingNumber = ord.tracking?.trackingNumber || "—";
                                                        const valFormatted = `₹${Number(ord.pricing?.totalAmount || 0).toLocaleString("en-IN")}`;

                                                        return (
                                                            <tr
                                                                key={ord._id}
                                                                onClick={() => setSelectedOrderId(ord._id)}
                                                                className={`transition-colors cursor-pointer ${
                                                                    isInspected
                                                                        ? "bg-[#F5F2EB] border-l-4 border-l-[#171717]"
                                                                        : "hover:bg-[#F5F2EB]/60"
                                                                }`}
                                                            >
                                                                {/* Checkbox */}
                                                                <td
                                                                    className="py-4 px-3.5 text-center"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChecked}
                                                                        onChange={() => handleRowCheckboxToggle(ord._id)}
                                                                        className="rounded-none border-[#ECE7DD] text-[#171717] focus:ring-[#171717] cursor-pointer"
                                                                        aria-label={`Select consignment ${ord.orderNumber}`}
                                                                    />
                                                                </td>

                                                                {/* Consignment / Order */}
                                                                <td className="py-4 px-3.5">
                                                                    <div className="font-semibold text-[#171717] tracking-wider uppercase text-xs">
                                                                        {ord.orderNumber || ord._id}
                                                                    </div>
                                                                    <div className="text-[10px] text-[#737373] tracking-wide mt-0.5">
                                                                        {dateFormatted}
                                                                    </div>
                                                                </td>

                                                                {/* Destination */}
                                                                <td className="py-4 px-3.5 text-[#525252] text-xs">
                                                                    <div className="font-medium text-[#171717] truncate max-w-[140px]">
                                                                        {customerName}
                                                                    </div>
                                                                    <div className="text-[10px] text-[#737373] mt-0.5 truncate max-w-[140px]">
                                                                        {destination}
                                                                    </div>
                                                                </td>

                                                                {/* Garments */}
                                                                <td className="py-4 px-3.5 text-[#525252] text-xs">
                                                                    <div className="font-medium text-[#171717]">
                                                                        {garmentsCount}
                                                                    </div>
                                                                    {ord.items && ord.items[0] && (
                                                                        <div className="text-[10px] text-[#737373] truncate max-w-[120px] mt-0.5">
                                                                            {ord.items[0].title}
                                                                        </div>
                                                                    )}
                                                                </td>

                                                                {/* Courier & Tracking */}
                                                                <td className="py-4 px-3.5">
                                                                    <div className="text-[#171717] font-medium text-xs truncate max-w-[130px]">
                                                                        {courier}
                                                                    </div>
                                                                    <div className="text-[10px] text-[#737373] tracking-wide mt-0.5 truncate max-w-[130px]">
                                                                        {trackingNumber}
                                                                    </div>
                                                                </td>

                                                                {/* Value */}
                                                                <td className="py-4 px-3.5 text-right font-medium text-[#171717] text-xs font-interface-sans">
                                                                    {valFormatted}
                                                                </td>

                                                                {/* Status Badge */}
                                                                <td className="py-4 px-3.5 text-center">
                                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] border ${badge.bg}`}>
                                                                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                                                                        <span>{badge.label}</span>
                                                                    </span>
                                                                </td>

                                                                {/* Action Button */}
                                                                <td className="py-4 px-3.5 text-center">
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSelectedOrderId(ord._id);
                                                                        }}
                                                                        className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none ${
                                                                            isInspected
                                                                                ? "bg-[#171717] text-[#FBF9F5] border-[#171717]"
                                                                                : "bg-[#FBF9F5] text-[#171717] border-[#D5CEBF] hover:border-[#171717] hover:bg-[#171717] hover:text-[#FBF9F5]"
                                                                        }`}
                                                                        aria-label={`Inspect consignment ${ord.orderNumber}`}
                                                                    >
                                                                        {isInspected ? "ACTIVE" : "INSPECT"}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Pagination / Count Footer */}
                                        <div className="px-5 py-3.5 border-t border-[#ECE7DD] bg-[#FBF9F5] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] font-medium tracking-[0.18em] uppercase text-[#737373]">
                                            <span>
                                                SHOWING {filteredOrders.length} OF {orders.length} ATELIER CONSIGNMENTS
                                                {selectedRowIds.size > 0 && ` (${selectedRowIds.size} SELECTED)`}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="p-1.5 border border-[#ECE7DD] text-[#A3A3A3] cursor-not-allowed"
                                                    aria-label="Previous Page"
                                                >
                                                    <ChevronLeftIcon className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="px-3 py-1 bg-[#171717] text-[#FBF9F5] font-semibold">
                                                    1
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled
                                                    className="p-1.5 border border-[#ECE7DD] text-[#A3A3A3] cursor-not-allowed"
                                                    aria-label="Next Page"
                                                >
                                                    <ChevronRightIcon className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Empty State for Filters with No Matching Orders */
                                    <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-12 text-center space-y-4 shadow-xs" role="status">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-[#F5F2EB] border border-[#ECE7DD] flex items-center justify-center text-[#737373]">
                                            <ArchiveBoxIcon className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <h2 className="font-editorial-serif text-2xl font-normal text-[#171717]">
                                                No Consignments In This View
                                            </h2>
                                            <p className="text-xs text-[#737373] max-w-sm mx-auto leading-relaxed">
                                                {orders.length === 0
                                                    ? "There are currently no customer orders placed for your catalog. When buyers checkout, their orders will appear here automatically."
                                                    : `There are currently no atelier consignments matching the filter (${selectedTab}).`}
                                            </p>
                                        </div>
                                        {orders.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedTab("ALL");
                                                    setSearchQuery("");
                                                    setSelectedCourierFilter("ALL");
                                                    setSelectedDateFilter("ALL");
                                                }}
                                                className="px-5 py-2.5 bg-[#171717] text-[#FBF9F5] text-[10px] font-semibold tracking-[0.2em] uppercase hover:bg-[#262626] transition-colors shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4A5340] focus-visible:outline-none"
                                            >
                                                VIEW ALL ORDERS
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ─── RIGHT COLUMN: Active Inspector Panel ────────── */}
                            <div className="lg:col-span-5 xl:col-span-4 bg-[#FBF9F5] border border-[#ECE7DD] p-6 sm:p-7 space-y-6 shadow-xs">
                                {/* Header */}
                                <div className="space-y-1 border-b border-[#ECE7DD] pb-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#737373]">
                                            ACTIVE INSPECTOR
                                        </span>
                                        {selectedOrder && (
                                            <span className="text-[10px] font-semibold text-[#171717] uppercase tracking-wider bg-[#F5F2EB] px-2 py-0.5 border border-[#ECE7DD]">
                                                #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-[#171717] tracking-tight">
                                        Consignment &amp; Delivery Milestones
                                    </h2>
                                </div>

                                {selectedOrder ? (
                                    <>
                                        {/* Visual Progress Bar */}
                                        <div className="space-y-3">
                                            {/* Olive Bar */}
                                            <div className="w-full bg-[#E5DFD3] h-2.5 overflow-hidden">
                                                <div
                                                    className="bg-[#4A5340] h-full transition-all duration-500 ease-out"
                                                    style={{ width: `${progressPercent}%` }}
                                                    role="progressbar"
                                                    aria-valuenow={progressPercent}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                />
                                            </div>

                                            {/* Timeline Steps */}
                                            <div className="pt-2">
                                                <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-3">
                                                    <span>CONSIGNMENT PROGRESS</span>
                                                    <span className="text-[#4A5340]">{progressPercent}%</span>
                                                </div>
                                                <div className="space-y-2.5">
                                                    {MILESTONES.map((step, idx) => {
                                                        const isCompleted = idx <= currentMilestoneIndex;
                                                        const isCurrent = idx === currentMilestoneIndex;
                                                        return (
                                                            <div key={step.key} className="flex items-center gap-3 text-xs">
                                                                <span
                                                                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                                                        isCompleted
                                                                            ? "bg-[#4A5340] text-white"
                                                                            : "border border-[#D5CEBF] bg-[#FBF9F5]"
                                                                    }`}
                                                                >
                                                                    {isCompleted && (
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                                    )}
                                                                </span>
                                                                <span
                                                                    className={`tracking-[0.14em] uppercase text-[11px] font-medium ${
                                                                        isCurrent
                                                                            ? "text-[#171717] font-semibold"
                                                                            : isCompleted
                                                                            ? "text-[#4A5340]"
                                                                            : "text-[#A3A3A3]"
                                                                    }`}
                                                                >
                                                                    {step.label}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Items in Consignment */}
                                        <div className="border-t border-[#ECE7DD] pt-4 space-y-2.5">
                                            <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-[0.18em] text-[#737373]">
                                                <span>ITEMS IN ORDER</span>
                                                <span>
                                                    {selectedOrder.items?.length || 0}{" "}
                                                    {selectedOrder.items?.length === 1 ? "PIECE" : "PIECES"}
                                                </span>
                                            </div>
                                            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                                                {selectedOrder.items?.map((item, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center gap-3 p-2.5 bg-[#F5F2EB] border border-[#ECE7DD] text-xs"
                                                    >
                                                        {item.coverImage ? (
                                                            <img
                                                                src={item.coverImage}
                                                                alt={item.title}
                                                                className="w-10 h-12 object-cover border border-[#ECE7DD] bg-white flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-12 bg-[#ECE7DD] flex items-center justify-center text-[9px] text-[#737373] flex-shrink-0">
                                                                ATELIER
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-[#171717] truncate text-xs">
                                                                {item.title}
                                                            </p>
                                                            <p className="text-[10px] text-[#737373] tracking-wider uppercase mt-0.5">
                                                                {item.variant?.size ? `SIZE: ${item.variant.size}` : ""}{" "}
                                                                {item.variant?.color ? `• ${item.variant.color}` : ""}{" "}
                                                                • QTY: {item.quantity || 1}
                                                            </p>
                                                        </div>
                                                        <div className="text-right text-xs font-semibold text-[#171717]">
                                                            ₹
                                                            {(
                                                                item.itemTotal ||
                                                                (item.unitPrice || 0) * (item.quantity || 1)
                                                            ).toLocaleString("en-IN")}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Shipping Destination & Contact */}
                                        <div className="border-t border-[#ECE7DD] pt-4 space-y-1.5 text-xs">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#737373] block">
                                                SHIPPING DESTINATION &amp; RECIPIENT
                                            </span>
                                            <p className="font-semibold text-[#171717]">
                                                {selectedOrder.shippingAddress?.fullName ||
                                                    selectedOrder.user?.fullname ||
                                                    "—"}
                                            </p>
                                            <p className="text-[#525252] text-[11px] leading-relaxed">
                                                {selectedOrder.shippingAddress?.street}
                                                {selectedOrder.shippingAddress?.landmark
                                                    ? `, ${selectedOrder.shippingAddress.landmark}`
                                                    : ""}
                                            </p>
                                            <p className="text-[#525252] text-[11px]">
                                                {selectedOrder.shippingAddress?.city},{" "}
                                                {selectedOrder.shippingAddress?.state} -{" "}
                                                {selectedOrder.shippingAddress?.pincode}
                                            </p>
                                            <div className="text-[10px] text-[#737373] pt-1 flex flex-wrap items-center gap-3 tracking-wider uppercase">
                                                <span>
                                                    TEL:{" "}
                                                    {selectedOrder.shippingAddress?.phone ||
                                                        selectedOrder.user?.contact ||
                                                        "—"}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    PAY: {(selectedOrder.payment?.method || "COD").toUpperCase()} (
                                                    {(selectedOrder.payment?.status || "pending").toUpperCase()})
                                                </span>
                                                <span>•</span>
                                                <span className="font-semibold text-[#171717]">
                                                    TOTAL: ₹
                                                    {Number(selectedOrder.pricing?.totalAmount || 0).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Courier Partner & Tracking Number Inputs */}
                                        <div className="space-y-3 border-t border-[#ECE7DD] pt-4">
                                            <div>
                                                <label
                                                    htmlFor="courier-partner-select"
                                                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#737373] block mb-1"
                                                >
                                                    COURIER PARTNER
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        id="courier-partner-select"
                                                        value={inspectorSelectedCourier}
                                                        onChange={(e) => setInspectorSelectedCourier(e.target.value)}
                                                        className="w-full py-2.5 px-3.5 bg-[#F5F2EB] border border-[#ECE7DD] text-xs text-[#171717] tracking-wider appearance-none cursor-pointer focus:border-[#171717] focus-visible:ring-2 focus-visible:ring-[#171717] focus:outline-none shadow-xs"
                                                    >
                                                        <option value="">Select courier partner</option>
                                                        {COURIER_OPTIONS.map((courier) => (
                                                            <option key={courier} value={courier}>
                                                                {courier}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#737373]">
                                                        <ChevronDownIcon className="w-3.5 h-3.5" />
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="tracking-ref-input"
                                                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#737373] block mb-1"
                                                >
                                                    TRACKING NUMBER / AWB
                                                </label>
                                                <input
                                                    id="tracking-ref-input"
                                                    type="text"
                                                    value={inspectorTrackingNumber}
                                                    onChange={(e) => setInspectorTrackingNumber(e.target.value)}
                                                    placeholder="e.g. SNTRK-8821-4412"
                                                    className="w-full py-2 px-3.5 bg-[#F5F2EB] border border-[#ECE7DD] text-xs text-[#171717] tracking-wider focus:border-[#171717] focus:outline-none shadow-xs"
                                                />
                                            </div>
                                        </div>

                                        {/* Update Consignment Milestone Buttons */}
                                        <div className="space-y-2.5 border-t border-[#ECE7DD] pt-4">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#737373] block">
                                                UPDATE CONSIGNMENT MILESTONE
                                            </span>
                                            <div className="grid grid-cols-2 gap-2" role="group" aria-label="Select Milestone">
                                                {MILESTONES.map((milestone) => {
                                                    const isSelected = inspectorSelectedMilestone === milestone.key;
                                                    return (
                                                        <button
                                                            key={milestone.key}
                                                            type="button"
                                                            onClick={() => setInspectorSelectedMilestone(milestone.key)}
                                                            className={`py-2.5 px-3 text-[10px] font-semibold tracking-[0.14em] uppercase text-center transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none ${
                                                                isSelected
                                                                    ? "bg-[#171717] text-[#FBF9F5] shadow-xs"
                                                                    : "bg-[#F5F2EB] text-[#525252] hover:bg-[#ECE7DD] hover:text-[#171717]"
                                                            }`}
                                                        >
                                                            {milestone.label}
                                                        </button>
                                                    );
                                                })}
                                                <button
                                                    type="button"
                                                    onClick={() => setInspectorSelectedMilestone("CANCELLED")}
                                                    className={`py-2.5 px-3 text-[10px] font-semibold tracking-[0.14em] uppercase text-center transition-colors cursor-pointer border col-span-2 ${
                                                        inspectorSelectedMilestone === "CANCELLED"
                                                            ? "bg-[#9E2A2B] text-white border-[#9E2A2B]"
                                                            : "bg-transparent text-[#9E2A2B] border-[#F8D7DA] hover:bg-[#FDF2F2]"
                                                    }`}
                                                >
                                                    MARK ORDER CANCELLED
                                                </button>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="space-y-2.5 pt-2">
                                            {/* Primary Save Action */}
                                            <button
                                                type="button"
                                                onClick={handleSaveMilestones}
                                                disabled={saving}
                                                className="w-full py-3 bg-[#171717] hover:bg-[#262626] text-[#FBF9F5] text-[11px] font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#4A5340] focus-visible:outline-none disabled:opacity-60"
                                            >
                                                <CheckCircleIcon className="w-4 h-4 text-[#FBF9F5]" />
                                                <span>{saving ? "SAVING..." : "SAVE MILESTONE UPDATES"}</span>
                                            </button>

                                            {/* Print Consignment Note Action */}
                                            <button
                                                type="button"
                                                onClick={handlePrintConsignment}
                                                className="w-full py-3 bg-[#F5F2EB] hover:bg-[#ECE7DD] border border-[#ECE7DD] text-[#171717] text-[11px] font-semibold tracking-[0.18em] uppercase flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                                            >
                                                <PrinterIcon className="w-4 h-4 text-[#171717]" />
                                                <span>PRINT CONSIGNMENT NOTE</span>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="py-12 text-center text-xs text-[#737373] space-y-2">
                                        <ArchiveBoxIcon className="w-8 h-8 mx-auto text-[#A3A3A3]" />
                                        <p>Select any order from the table to view details and update milestones.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Print-Only Consignment Note Slip */}
                {selectedOrder && (
                    <div className="hidden print-only p-8 max-w-2xl mx-auto space-y-6 bg-white text-black font-interface-sans">
                        <div className="border-b-2 border-black pb-4 flex justify-between items-start">
                            <div>
                                <h1 className="font-editorial-serif text-3xl font-bold uppercase tracking-wider">
                                    VELMORA ATELIER
                                </h1>
                                <p className="text-xs uppercase tracking-widest text-gray-600">
                                    Consignment Dispatch &amp; Packing Slip
                                </p>
                            </div>
                            <div className="text-right text-xs">
                                <p className="font-bold text-sm">#{selectedOrder.orderNumber}</p>
                                <p>{new Date(selectedOrder.createdAt).toLocaleDateString("en-IN")}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs border-b border-gray-300 pb-4">
                            <div>
                                <h3 className="font-bold uppercase tracking-wider text-gray-600 text-[10px] mb-1">
                                    DELIVER TO:
                                </h3>
                                <p className="font-semibold text-sm">
                                    {selectedOrder.shippingAddress?.fullName || selectedOrder.user?.fullname}
                                </p>
                                <p>{selectedOrder.shippingAddress?.street}</p>
                                {selectedOrder.shippingAddress?.landmark && (
                                    <p>{selectedOrder.shippingAddress.landmark}</p>
                                )}
                                <p>
                                    {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{" "}
                                    {selectedOrder.shippingAddress?.pincode}
                                </p>
                                <p className="mt-1">TEL: {selectedOrder.shippingAddress?.phone || selectedOrder.user?.contact}</p>
                            </div>
                            <div>
                                <h3 className="font-bold uppercase tracking-wider text-gray-600 text-[10px] mb-1">
                                    LOGISTICS DETAILS:
                                </h3>
                                <p>CARRIER: {selectedOrder.tracking?.carrier || "Standard Dispatch"}</p>
                                <p>AWB REF: {selectedOrder.tracking?.trackingNumber || "—"}</p>
                                <p>PAYMENT METHOD: {(selectedOrder.payment?.method || "COD").toUpperCase()}</p>
                                <p>PAYMENT STATUS: {(selectedOrder.payment?.status || "pending").toUpperCase()}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold uppercase tracking-wider text-gray-600 text-[10px] mb-2">
                                ORDER ITEMS:
                            </h3>
                            <table className="w-full text-xs text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-black">
                                        <th className="py-1">ITEM</th>
                                        <th className="py-1">SIZE</th>
                                        <th className="py-1 text-center">QTY</th>
                                        <th className="py-1 text-right">TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map((it, idx) => (
                                        <tr key={idx} className="border-b border-gray-200">
                                            <td className="py-2">{it.title}</td>
                                            <td className="py-2">{it.variant?.size || "Standard"}</td>
                                            <td className="py-2 text-center">{it.quantity || 1}</td>
                                            <td className="py-2 text-right">
                                                ₹{(it.itemTotal || it.unitPrice * (it.quantity || 1)).toLocaleString("en-IN")}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-right pt-3 font-bold text-sm">
                                TOTAL AMOUNT: ₹{Number(selectedOrder.pricing?.totalAmount || 0).toLocaleString("en-IN")}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-300 text-[10px] text-gray-500 flex justify-between">
                            <span>VELMORA TAILORING ATELIER • ALL RIGHTS RESERVED</span>
                            <span>DISPATCH AGENT SIGNATURE: _______________________</span>
                        </div>
                    </div>
                )}

                {/* Bottom Footer Note */}
                <footer className="border-t border-[#ECE7DD] bg-[#FBF9F5] px-6 sm:px-10 py-5 text-[10px] sm:text-[11px] text-[#737373] tracking-[0.18em] uppercase flex flex-col sm:flex-row items-center justify-between gap-3 font-interface-sans no-print">
                    <span>VELMORA ATELIER FULFILLMENT &amp; LOGISTICS PORTAL • SYSTEM VERSION 2.4</span>
                    <span>ALL DATA PROTECTED &amp; LOGGED</span>
                </footer>
            </main>
        </div>
    );
}
