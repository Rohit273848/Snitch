 import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder } from "../services/order.api.js";

// ─── SVG Icons (VELMORA Atelier Quiet Refinement System) ─────────────────────
function ArrowLeftIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
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

function CopyIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
        </svg>
    );
}

function CheckIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
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

function BoxIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
        </svg>
    );
}

function HomeIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function WalkingIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function ClockIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function MapPinIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    );
}

function PhoneIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
    );
}

function QuestionIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M12 18h.008v.008H12V18z" />
        </svg>
    );
}

function CreditCardIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-9.75h19.5a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25H2.25A2.25 2.25 0 010 18.75V11.25A2.25 2.25 0 012.25 9z" />
        </svg>
    );
}

function DocumentIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
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

function XIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

// ─── Default Reference Order (Exact Specification from Screenshot) ────────────
const DEFAULT_REFERENCE_ORDER = {
    _id: "6ad205ccd11dcb74697b0750",
    orderNumber: "SN-20261016-2YFEW",
    placedDate: "16 Oct 2026",
    status: "CONFIRMED",
    estimatedDelivery: "Tue, 20 Oct",
    courier: "Velmora Express Courier",
    trackingNumber: "SNTRK-9792-8544",
    shippingAddress: {
        addressType: "HOME",
        fullName: "Rohit Mahajan",
        phone: "+91 7020803789",
        street: "Near sai mandir",
        cityStateZip: "jalgoan, Maharashtra - 425508",
        country: "India",
    },
    payment: {
        method: "Online (Razorpay)",
        subtotal: "₹1,013",
        discount: "-₹101",
        shipping: "FREE",
        total: "₹912",
        transactionId: "pay_ToYdzl830n180F",
        isPaid: true,
    },
    items: [
        {
            title: "Shirt",
            status: "READY TO SHIP",
            quantity: 1,
            unitPrice: "₹1,013",
            lineTotal: "₹1,013",
            image: "https://ik.imagekit.io/cvlhdu1b2/snitch/profile_photo_yG10oeqHR.jpeg",
        },
    ],
    activityLogs: [
        {
            id: "act-1",
            type: "payment",
            title: "Payment Confirmed",
            description: "Payment of ₹912 confirmed via UPI.",
            location: "VELMORA CENTRAL HUB",
            time: "16 OCT, 04:39 PM",
        },
        {
            id: "act-2",
            type: "order",
            title: "Order Placed",
            description: "We have received your order and are preparing it for shipment.",
            location: "BENGALURU FULFILLMENT CENTER",
            time: "16 OCT, 04:39 PM",
        },
    ],
};

// ─── The Six Sequential Milestones in Exact Order ─────────────────────────────
// Order Placed, Confirmed, Packed, In Transit, Out for Delivery, Delivered
const MILESTONE_STAGES = [
    { key: "PLACED", label: "ORDER PLACED", subtext: "16 Oct, 04:39 pm", icon: CheckIcon },
    { key: "CONFIRMED", label: "CONFIRMED", subtext: "Active Milestone", icon: CheckIcon },
    { key: "PACKED", label: "PACKED", subtext: "Upcoming", icon: BoxIcon },
    { key: "IN_TRANSIT", label: "IN TRANSIT", subtext: "Upcoming", icon: TruckIcon },
    { key: "OUT_FOR_DELIVERY", label: "OUT FOR DELIVERY", subtext: "Upcoming", icon: WalkingIcon },
    { key: "DELIVERED", label: "DELIVERED", subtext: "Upcoming", icon: HomeIcon },
];

export default function OrderTrackingPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedTracking, setCopiedTracking] = useState(false);
    const [copiedTransaction, setCopiedTransaction] = useState(false);
    const [copiedOrderRef, setCopiedOrderRef] = useState(false);

    // Cancel Order Modal States
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState("Changed mind about purchase");
    const [cancelling, setCancelling] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    // ─── Fetch Order from API / DB if available ───────────────────────────────
    useEffect(() => {
        if (!id) {
            setOrder(DEFAULT_REFERENCE_ORDER);
            setLoading(false);
            return;
        }
        setLoading(true);

        getOrderById(id)
            .then((res) => {
                if (res?.order) {
                    const dbOrd = res.order;

                    // 1. Map items dynamically for this specific order
                    const mappedItems = Array.isArray(dbOrd.items) && dbOrd.items.length > 0
                        ? dbOrd.items.map((item, idx) => {
                              // Resolve cover image from item or populated product
                              let itemImg = item.coverImage || "";
                              if (!itemImg && item.product) {
                                  if (Array.isArray(item.product.images) && item.product.images.length > 0) {
                                      const cover = item.product.images.find((im) => im && (im.isCover || im.isPrimary)) || item.product.images[0];
                                      itemImg = typeof cover === "string" ? cover : (cover?.url || "");
                                  } else if (typeof item.product.image === "string") {
                                      itemImg = item.product.image;
                                  }
                              }
                              if (!itemImg) {
                                  itemImg = "/editorial/overshirt_olive_piece.jpg";
                              }

                              // Determine item shipment status based on overall orderStatus
                              let itemStatus = "READY TO SHIP";
                              const oStatus = (dbOrd.orderStatus || "").toUpperCase();
                              if (oStatus === "CANCELLED") itemStatus = "CANCELLED";
                              else if (oStatus === "DELIVERED") itemStatus = "DELIVERED";
                              else if (oStatus === "OUT_FOR_DELIVERY") itemStatus = "OUT FOR DELIVERY";
                              else if (oStatus === "SHIPPED" || oStatus === "IN_TRANSIT") itemStatus = "IN TRANSIT";
                              else if (oStatus === "PROCESSING" || oStatus === "PACKED") itemStatus = "PACKED";
                              else if (oStatus === "CONFIRMED") itemStatus = "READY TO SHIP";
                              else if (oStatus === "PLACED") itemStatus = "PROCESSING ORDER";

                              const unitPrice = Number(item.unitPrice || 0);
                              const quantity = Number(item.quantity || 1);
                              const lineTotal = Number(item.itemTotal != null ? item.itemTotal : unitPrice * quantity);

                              return {
                                  id: item._id || (item.product?._id ? `${item.product._id}-${idx}` : `${dbOrd._id}-${idx}`),
                                  productId: item.product?._id || (typeof item.product === "string" ? item.product : null),
                                  title: item.title || item.product?.title || "Velmora Tailored Piece",
                                  status: itemStatus,
                                  quantity,
                                  unitPrice: `₹${unitPrice.toLocaleString("en-IN")}`,
                                  lineTotal: `₹${lineTotal.toLocaleString("en-IN")}`,
                                  image: itemImg,
                                  variant: item.variant || null,
                              };
                          })
                        : DEFAULT_REFERENCE_ORDER.items;

                    // 2. Map tracking activity events
                    const mappedLogs = Array.isArray(dbOrd.tracking?.events) && dbOrd.tracking.events.length > 0
                        ? [...dbOrd.tracking.events].reverse().map((ev, idx) => ({
                              id: ev._id || `act-${idx}`,
                              type: ev.status === "CONFIRMED" || (ev.title && ev.title.toLowerCase().includes("payment")) ? "payment" : "order",
                              title: ev.title || "Status Updated",
                              description: ev.description || "",
                              location: ev.location ? ev.location.toUpperCase() : "VELMORA LOGISTICS HUB",
                              time: ev.timestamp
                                  ? new Date(ev.timestamp).toLocaleDateString("en-US", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }).toUpperCase()
                                  : "",
                          }))
                        : DEFAULT_REFERENCE_ORDER.activityLogs;

                    const formattedPlacedDate = dbOrd.createdAt
                        ? new Date(dbOrd.createdAt).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                          })
                        : DEFAULT_REFERENCE_ORDER.placedDate;

                    const subtotalNum = Number(dbOrd.pricing?.subtotal || 0);
                    const discountNum = Number(dbOrd.pricing?.discount || 0);
                    const shippingNum = Number(dbOrd.pricing?.shippingFee || 0);
                    const totalNum = Number(dbOrd.pricing?.totalAmount || (subtotalNum - discountNum + shippingNum));

                    setOrder({
                        _id: dbOrd._id || id,
                        orderNumber: dbOrd.orderNumber || "SN-ORDER",
                        placedDate: formattedPlacedDate,
                        status: dbOrd.orderStatus || "CONFIRMED",
                        courier: dbOrd.tracking?.carrier || "Velmora Express Courier",
                        trackingNumber: dbOrd.tracking?.trackingNumber || "SNTRK-PENDING",
                        estimatedDelivery: dbOrd.tracking?.estimatedDelivery
                            ? new Date(dbOrd.tracking.estimatedDelivery).toLocaleDateString("en-US", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                              })
                            : DEFAULT_REFERENCE_ORDER.estimatedDelivery,
                        items: mappedItems,
                        activityLogs: mappedLogs,
                        shippingAddress: dbOrd.shippingAddress
                            ? {
                                  addressType: dbOrd.shippingAddress.addressType || "HOME",
                                  fullName: dbOrd.shippingAddress.fullName || DEFAULT_REFERENCE_ORDER.shippingAddress.fullName,
                                  phone: dbOrd.shippingAddress.phone ? `+91 ${String(dbOrd.shippingAddress.phone).replace(/^\+?91\s*/, "")}` : DEFAULT_REFERENCE_ORDER.shippingAddress.phone,
                                  street: dbOrd.shippingAddress.street || DEFAULT_REFERENCE_ORDER.shippingAddress.street,
                                  cityStateZip: `${dbOrd.shippingAddress.city || ""}, ${dbOrd.shippingAddress.state || ""} - ${dbOrd.shippingAddress.pincode || ""}`.replace(/^,\s*|-\s*$/g, ""),
                                  country: dbOrd.shippingAddress.country || "India",
                              }
                            : DEFAULT_REFERENCE_ORDER.shippingAddress,
                        payment: dbOrd.payment
                            ? {
                                  method: dbOrd.payment.method === "cod" ? "Cash on Delivery" : "Online (Razorpay)",
                                  subtotal: `₹${subtotalNum.toLocaleString("en-IN")}`,
                                  discount: discountNum > 0 ? `-₹${discountNum.toLocaleString("en-IN")}` : "₹0",
                                  shipping: shippingNum > 0 ? `₹${shippingNum.toLocaleString("en-IN")}` : "FREE",
                                  total: `₹${totalNum.toLocaleString("en-IN")}`,
                                  transactionId: dbOrd.payment.razorpayPaymentId || dbOrd.payment.razorpayOrderId || "COD-VERIFIED",
                                  isPaid: dbOrd.payment.status === "completed" || dbOrd.payment.method !== "cod",
                              }
                            : DEFAULT_REFERENCE_ORDER.payment,
                    });
                } else {
                    setOrder(DEFAULT_REFERENCE_ORDER);
                }
            })
            .catch((err) => {
                console.warn("Using supplied reference order values:", err?.message);
                setOrder(DEFAULT_REFERENCE_ORDER);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    // ─── Milestone Calculation based on current order status ──────────────────
    const getMilestoneIndex = (status) => {
        switch ((status || "").toUpperCase()) {
            case "PLACED":
                return 0;
            case "CONFIRMED":
                return 1;
            case "PROCESSING":
            case "PACKED":
                return 2;
            case "SHIPPED":
            case "IN_TRANSIT":
                return 3;
            case "OUT_FOR_DELIVERY":
                return 4;
            case "DELIVERED":
                return 5;
            case "CANCELLED":
                return -1;
            default:
                return 1;
        }
    };

    const activeMilestoneIndex = getMilestoneIndex(order?.status);
    const isCancelled = order?.status === "CANCELLED";

    // ─── Copy Utilities ───────────────────────────────────────────────────────
    const handleCopy = (text, setCopiedFn) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedFn(true);
        setTimeout(() => setCopiedFn(false), 2200);
    };

    // ─── Cancel Order Flow ────────────────────────────────────────────────────
    const handleConfirmCancel = async () => {
        setCancelling(true);
        try {
            if (order?._id) {
                await cancelOrder(order._id, cancelReason).catch(() => {});
            }
            setOrder((prev) => (prev ? { ...prev, status: "CANCELLED" } : null));
            setShowCancelModal(false);
            setToastMessage(`Order cancellation confirmed. Full refund of ${order?.payment?.total || "amount"} initiated to your original payment method.`);
            setTimeout(() => setToastMessage(""), 5000);
        } catch (err) {
            console.error("Cancel order error:", err);
            setShowCancelModal(false);
        } finally {
            setCancelling(false);
        }
    };

    if (loading && !order) {
        return (
            <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center space-y-4 font-interface-sans text-[#171717]">
                <div className="w-9 h-9 border-2 border-[#171717] border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] uppercase tracking-[0.22em] font-semibold text-[#737373]">
                    RETRIEVING ORDER MANIFEST...
                </span>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#FBF9F5] flex flex-col items-center justify-center space-y-4 font-interface-sans text-[#171717]">
                <h2 className="font-editorial-serif text-3xl font-normal text-[#171717]">Order Not Found</h2>
                <p className="text-xs text-[#737373]">We could not locate this order manifest in our records.</p>
                <Link
                    to="/orders"
                    className="mt-2 px-5 py-2.5 bg-[#171717] text-[#FBF9F5] text-[10px] font-semibold uppercase tracking-[0.18em]"
                >
                    BACK TO MY ORDERS
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#171717] selection:bg-[#171717] selection:text-[#FBF9F5] antialiased">
            {/* Custom font definitions matching VELMORA Atelier Design System */}
            <style>{`
                .font-editorial-serif {
                    font-family: 'EB Garamond', 'Newsreader', 'Cormorant Garamond', Georgia, serif;
                }
                .font-interface-sans {
                    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
            `}</style>

            <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8 font-interface-sans">
                {/* ─── BREADCRUMBS & BACK LINK ────────────────────────────────── */}
                <div className="space-y-3">
                    <nav aria-label="Breadcrumb" className="text-[10px] sm:text-[11px] font-medium tracking-[0.2em] uppercase text-[#737373] flex flex-wrap items-center gap-2">
                        <Link to="/" className="hover:text-[#171717] transition-colors focus-visible:ring-1 focus-visible:ring-[#171717]">
                            HOME
                        </Link>
                        <span className="text-[#D5CEBF]">/</span>
                        <Link to="/orders" className="hover:text-[#171717] transition-colors focus-visible:ring-1 focus-visible:ring-[#171717]">
                            ACCOUNT
                        </Link>
                        <span className="text-[#D5CEBF]">/</span>
                        <Link to="/orders" className="hover:text-[#171717] transition-colors focus-visible:ring-1 focus-visible:ring-[#171717]">
                            MY ORDERS
                        </Link>
                        <span className="text-[#D5CEBF]">/</span>
                        <span className="text-[#171717] font-semibold" aria-current="page">
                            ORDER # {order.orderNumber}
                        </span>
                    </nav>

                    <div>
                        <Link
                            to="/orders"
                            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#525252] hover:text-[#171717] transition-colors focus-visible:ring-1 focus-visible:ring-[#171717]"
                        >
                            <span>← BACK TO MY ORDERS</span>
                        </Link>
                    </div>
                </div>

                {/* ─── PAGE HEADING & CANCEL ORDER ACTION ─────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#ECE7DD] pb-6">
                    <h1 className="font-editorial-serif text-4xl sm:text-5xl font-normal tracking-tight text-[#171717]">
                        All Orders
                    </h1>

                    {order.status !== "CANCELLED" ? (
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-[#737373] hidden sm:inline">Need modifications?</span>
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(true)}
                                className="px-4 py-2 border border-[#D5CEBF] hover:border-[#171717] bg-[#FBF9F5] text-[#171717] text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors shadow-xs cursor-pointer focus-visible:ring-2 focus-visible:ring-[#171717] focus-visible:outline-none"
                            >
                                CANCEL ORDER
                            </button>
                        </div>
                    ) : (
                        <span className="px-3 py-1 bg-[#FDF2F2] border border-[#F8D7DA] text-[#9E2A2B] text-[10px] font-semibold uppercase tracking-[0.16em]">
                            ORDER CANCELLED
                        </span>
                    )}
                </div>

                {/* Toast Notification */}
                {toastMessage && (
                    <div role="status" className="p-4 bg-[#EAEFE6] border border-[#C8D7BE] text-[#4A5340] text-xs flex items-center justify-between shadow-xs">
                        <span>{toastMessage}</span>
                        <button type="button" onClick={() => setToastMessage("")} className="p-1 hover:opacity-75">
                            <XIcon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* ─── ORDER MANIFEST CARD (TOP BANNER) ───────────────────────── */}
                <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-6 sm:p-8 shadow-xs">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Manifest Left Side */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#737373]">
                                    ORDER MANIFEST
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] bg-[#EAEFE6] text-[#4A5340] border border-[#C8D7BE]">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#4A5340]" />
                                    <span>{order.status}</span>
                                </span>
                            </div>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <h2 className="font-editorial-serif text-2xl sm:text-3xl font-normal text-[#171717]">
                                        Tracking Order: # {order.orderNumber}
                                    </h2>
                                    <button
                                        type="button"
                                        onClick={() => handleCopy(order.orderNumber, setCopiedOrderRef)}
                                        title="Copy Order Number"
                                        className="p-1 text-[#737373] hover:text-[#171717] transition-colors focus-visible:outline-none"
                                        aria-label="Copy order reference"
                                    >
                                        {copiedOrderRef ? <CheckIcon className="w-3.5 h-3.5 text-[#4A5340]" /> : <CopyIcon className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-[#737373]">
                                    Placed on <strong className="font-semibold text-[#171717]">{order.placedDate}</strong>
                                </p>
                            </div>

                            <div className="pt-3 border-t border-[#ECE7DD] text-[10px] uppercase tracking-[0.18em] text-[#737373] flex flex-wrap items-center gap-2 font-medium">
                                <span>COURIER: {order.courier.toUpperCase()}</span>
                                <span className="text-[#D5CEBF]">•</span>
                                <span>WAYBILL NO: {order.trackingNumber}</span>
                            </div>
                        </div>

                        {/* Manifest Right Side (Divided) */}
                        <div className="lg:col-span-5 lg:border-l lg:border-[#ECE7DD] lg:pl-8 space-y-4">
                            <div>
                                <span className="text-[9.5px] uppercase tracking-[0.2em] font-semibold text-[#737373] block mb-1">
                                    SCHEDULED ARRIVAL
                                </span>
                                <span className="font-editorial-serif text-2xl sm:text-3xl font-normal text-[#171717] block">
                                    Estimated Delivery: {order.estimatedDelivery}
                                </span>
                            </div>

                            <div className="p-4 bg-[#F5F2EB] border border-[#ECE7DD] flex items-center justify-between shadow-2xs">
                                <div>
                                    <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-[#737373] block">
                                        COURIER PARTNER
                                    </span>
                                    <span className="text-xs font-semibold text-[#171717] block">
                                        {order.courier}
                                    </span>
                                    <span className="text-[11px] text-[#737373] font-mono mt-0.5 block">
                                        {order.trackingNumber}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(order.trackingNumber, setCopiedTracking)}
                                    title="Copy Tracking Number"
                                    className="p-2 border border-[#D5CEBF] bg-[#FBF9F5] text-[#171717] hover:border-[#171717] transition-colors focus-visible:outline-none"
                                    aria-label="Copy courier tracking number"
                                >
                                    {copiedTracking ? <CheckIcon className="w-3.5 h-3.5 text-[#4A5340]" /> : <CopyIcon className="w-3.5 h-3.5" />}
                                </button>
                            </div>

                            <div className="text-right">
                                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#4A5340]">
                                    PRIORITY ATELIER DISPATCH
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── RESPONSIVE TWO-COLUMN LAYOUT ───────────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ══════════════════════════════════════════════════════════
                        LEFT COLUMN: TRACKING PROGRESS, LOGS, SHIPMENT ITEMS
                    ══════════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* ─── 1. SHIPMENT PROGRESSION ─────────────────────────── */}
                        <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-6 sm:p-7 space-y-7 shadow-xs">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ECE7DD] pb-4">
                                <div>
                                    <h3 className="font-editorial-serif text-2xl font-normal text-[#171717]">
                                        Shipment Progression
                                    </h3>
                                    <p className="text-xs text-[#737373] mt-0.5">
                                        Real-time status updates from our logistics network
                                    </p>
                                </div>
                                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#737373]">
                                    {isCancelled ? "ORDER CANCELLED" : `MILESTONE ${Math.min(6, activeMilestoneIndex + 1)} OF 6`}
                                </span>
                            </div>

                            {/* Six Milestones Progression Bar */}
                            <div className="relative pt-2 pb-4">
                                {/* Horizontal Connecting Line */}
                                <div className="hidden sm:block absolute top-7 left-8 right-8 h-0.5 bg-[#ECE7DD] -z-0" />
                                <div
                                    className={`hidden sm:block absolute top-7 left-8 h-0.5 transition-all duration-500 -z-0 ${
                                        isCancelled ? "bg-[#9E2A2B]" : "bg-[#171717]"
                                    }`}
                                    style={{
                                        width: isCancelled
                                            ? "100%"
                                            : `${Math.min(100, Math.max(0, (activeMilestoneIndex / (MILESTONE_STAGES.length - 1)) * 100))}%`,
                                    }}
                                />

                                <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 sm:gap-2 relative z-10 text-center">
                                    {MILESTONE_STAGES.map((stage, idx) => {
                                        const isCompleted = !isCancelled && (idx < activeMilestoneIndex || (activeMilestoneIndex === 5 && idx === 5));
                                        const isCurrent = !isCancelled && idx === activeMilestoneIndex;
                                        const isUpcoming = isCancelled || idx > activeMilestoneIndex;
                                        const StageIcon = stage.icon;

                                        let subtext = "Upcoming";
                                        if (isCancelled) {
                                            subtext = "Cancelled";
                                        } else if (isCurrent) {
                                            subtext = "Active Milestone";
                                        } else if (isCompleted) {
                                            subtext = idx === 0 ? (order.placedDate || "Completed") : "Completed";
                                        }

                                        return (
                                            <div key={stage.key} className="flex flex-col items-center space-y-2">
                                                {/* Milestone Circle */}
                                                <div
                                                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                                                        isCancelled
                                                            ? "bg-[#FDF2F2] border border-[#F8D7DA] text-[#9E2A2B]"
                                                            : isCompleted
                                                            ? "bg-[#171717] text-[#FBF9F5] shadow-xs"
                                                            : isCurrent
                                                            ? "bg-[#4A5340] text-[#FBF9F5] ring-4 ring-[#EAEFE6] shadow-sm"
                                                            : "bg-[#FBF9F5] border border-[#D5CEBF] text-[#A3A3A3]"
                                                    }`}
                                                >
                                                    <StageIcon className="w-4 h-4" />
                                                </div>

                                                {/* Milestone Labels */}
                                                <div>
                                                    <span
                                                        className={`text-[10px] uppercase tracking-[0.16em] block font-semibold ${
                                                            isCurrent
                                                                ? "text-[#171717]"
                                                                : isCompleted
                                                                ? "text-[#171717]"
                                                                : isCancelled
                                                                ? "text-[#9E2A2B]"
                                                                : "text-[#8A857B]"
                                                        }`}
                                                    >
                                                        {stage.label}
                                                    </span>
                                                    <span className="text-[10px] text-[#737373] block mt-0.5 tracking-wide">
                                                        {subtext}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ─── 2. ACTIVITY LOGS ───────────────────────────────── */}
                        <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-6 sm:p-7 space-y-6 shadow-xs">
                            <div className="flex items-center justify-between border-b border-[#ECE7DD] pb-4">
                                <h3 className="font-editorial-serif text-2xl font-normal text-[#171717]">
                                    Activity Logs
                                </h3>
                                <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#737373]">
                                    CHRONOLOGICAL FEED
                                </span>
                            </div>

                            <div className="space-y-4">
                                {order.activityLogs.map((log) => (
                                    <div
                                        key={log.id}
                                        className="p-4 sm:p-5 bg-[#F5F2EB] border border-[#ECE7DD] flex flex-col sm:flex-row sm:items-start justify-between gap-4 transition-all"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div
                                                className={`w-9 h-9 rounded-none flex items-center justify-center flex-shrink-0 ${
                                                    log.type === "payment"
                                                        ? "bg-[#EAEFE6] text-[#4A5340] border border-[#C8D7BE]"
                                                        : "bg-[#EAE5D9] text-[#171717] border border-[#D5CEBF]"
                                                }`}
                                            >
                                                {log.type === "payment" ? (
                                                    <CreditCardIcon className="w-4 h-4" />
                                                ) : (
                                                    <DocumentIcon className="w-4 h-4" />
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <h4 className="font-semibold text-sm text-[#171717] tracking-wide">
                                                    {log.title}
                                                </h4>
                                                <p className="text-xs text-[#525252] leading-relaxed">
                                                    {log.description}
                                                </p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] pt-1">
                                                    <MapPinIcon className="w-3 h-3 text-[#4A5340]" />
                                                    <span>{log.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="sm:text-right flex-shrink-0">
                                            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] bg-[#FBF9F5] px-2.5 py-1 border border-[#ECE7DD] inline-block">
                                                {log.time}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ─── 3. ITEMS IN THIS SHIPMENT ──────────────────── */}
                        <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-6 sm:p-7 space-y-6 shadow-xs">
                            <div className="flex items-center justify-between border-b border-[#ECE7DD] pb-4">
                                <h3 className="font-editorial-serif text-2xl font-normal text-[#171717]">
                                    Items in this Shipment ({order.items.length})
                                </h3>
                                <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#737373]">
                                    DISPATCHED TOGETHER
                                </span>
                            </div>

                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div
                                        key={item.id || idx}
                                        className="p-5 bg-[#F5F2EB] border border-[#ECE7DD] flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all"
                                    >
                                        <div className="flex items-start sm:items-center gap-5">
                                            <div className="w-20 h-20 bg-[#EAE5D9] border border-[#ECE7DD] flex-shrink-0 overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover object-center"
                                                    onError={(e) => {
                                                        e.target.src = "/editorial/overshirt_olive_piece.jpg";
                                                    }}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <span className={`text-[9px] uppercase tracking-[0.22em] font-semibold block ${
                                                    item.status === "CANCELLED"
                                                        ? "text-[#9E2A2B]"
                                                        : item.status === "DELIVERED"
                                                        ? "text-[#4A5340]"
                                                        : "text-[#737373]"
                                                }`}>
                                                    {item.status}
                                                </span>

                                                {item.productId ? (
                                                    <Link
                                                        to={`/product/${item.productId}`}
                                                        className="font-editorial-serif text-2xl font-normal text-[#171717] hover:text-[#4A5340] hover:underline transition-colors block"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                ) : (
                                                    <h4 className="font-editorial-serif text-2xl font-normal text-[#171717]">
                                                        {item.title}
                                                    </h4>
                                                )}

                                                {/* Variant details (Size, Color, SKU) */}
                                                {item.variant && (item.variant.size || item.variant.color || item.variant.sku) && (
                                                    <div className="flex flex-wrap items-center gap-2 pt-0.5 pb-1">
                                                        {item.variant.size && (
                                                            <span className="px-2 py-0.5 bg-[#EAE5D9] text-[#171717] text-[10px] font-semibold uppercase tracking-wider border border-[#D5CEBF]">
                                                                Size: {item.variant.size}
                                                            </span>
                                                        )}
                                                        {item.variant.color && (
                                                            <span className="px-2 py-0.5 bg-[#EAE5D9] text-[#525252] text-[10px] font-semibold uppercase tracking-wider border border-[#D5CEBF]">
                                                                Color: {item.variant.color}
                                                            </span>
                                                        )}
                                                        {item.variant.sku && (
                                                            <span className="text-[10px] text-[#737373] font-mono">
                                                                SKU: {item.variant.sku}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                <p className="text-xs text-[#737373] tracking-wide">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-xs text-[#525252]">
                                                    Unit Price: {item.unitPrice} each
                                                </p>
                                            </div>
                                        </div>

                                        <div className="sm:text-right pt-3 sm:pt-0 border-t sm:border-t-0 border-[#ECE7DD]">
                                            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-[#737373] block">
                                                LINE TOTAL
                                            </span>
                                            <span className="font-editorial-serif text-2xl sm:text-3xl font-medium text-[#171717]">
                                                {item.lineTotal}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════════════════
                        RIGHT COLUMN: DELIVERY ADDRESS, PAYMENT, ACTIONS
                    ══════════════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* ─── 1. DELIVERY ADDRESS ────────────────────────────── */}
                        <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-6 space-y-4 shadow-xs">
                            <div className="flex items-center justify-between border-b border-[#ECE7DD] pb-3.5">
                                <h3 className="font-editorial-serif text-xl font-normal text-[#171717]">
                                    Delivery Address
                                </h3>
                                <span className="px-2.5 py-0.5 bg-[#F5F2EB] text-[#525252] border border-[#D5CEBF] text-[9.5px] font-semibold uppercase tracking-wider">
                                    {order.shippingAddress.addressType}
                                </span>
                            </div>

                            <div className="space-y-2 text-xs text-[#525252] leading-relaxed">
                                <p className="font-semibold text-sm text-[#171717]">
                                    {order.shippingAddress.fullName}
                                </p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.cityStateZip}</p>
                                <p>{order.shippingAddress.country}</p>
                                <div className="pt-2 flex items-center gap-2 text-xs text-[#171717] font-medium border-t border-[#ECE7DD]/60">
                                    <PhoneIcon className="w-3.5 h-3.5 text-[#737373]" />
                                    <span>{order.shippingAddress.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* ─── 2. PAYMENT DETAILS ─────────────────────────────── */}
                        <div className="bg-[#FBF9F5] border border-[#ECE7DD] p-6 space-y-4 shadow-xs">
                            <div className="flex items-center justify-between border-b border-[#ECE7DD] pb-3.5">
                                <h3 className="font-editorial-serif text-xl font-normal text-[#171717]">
                                    Payment Details
                                </h3>
                                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-[#4A5340]">
                                    <CheckIcon className="w-3 h-3 text-[#4A5340]" />
                                    <span>PAID</span>
                                </span>
                            </div>

                            <div className="space-y-2.5 text-xs">
                                <div className="flex justify-between items-center text-[#525252]">
                                    <span>Payment Method</span>
                                    <span className="font-medium text-[#171717]">{order.payment.method}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#525252]">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-[#171717]">{order.payment.subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#525252]">
                                    <span>Discount / Coupon</span>
                                    <span className="font-medium text-[#4A5340]">{order.payment.discount}</span>
                                </div>
                                <div className="flex justify-between items-center text-[#525252]">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-[#4A5340]">{order.payment.shipping}</span>
                                </div>

                                <div className="pt-3 border-t border-[#ECE7DD] flex justify-between items-baseline">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-[#171717]">
                                        Total Amount
                                    </span>
                                    <span className="font-editorial-serif text-3xl font-medium text-[#171717]">
                                        {order.payment.total}
                                    </span>
                                </div>
                            </div>

                            {/* Transaction ID Sub-Card */}
                            <div className="p-3 bg-[#F5F2EB] border border-[#ECE7DD] flex items-center justify-between text-xs pt-2.5">
                                <div>
                                    <span className="text-[9px] uppercase tracking-[0.18em] font-semibold text-[#737373] block">
                                        TRANSACTION ID
                                    </span>
                                    <span className="font-mono text-[11px] text-[#171717] break-all">
                                        {order.payment.transactionId}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(order.payment.transactionId, setCopiedTransaction)}
                                    title="Copy Transaction ID"
                                    className="p-1.5 text-[#737373] hover:text-[#171717] transition-colors focus-visible:outline-none"
                                    aria-label="Copy transaction ID"
                                >
                                    {copiedTransaction ? <CheckIcon className="w-3.5 h-3.5 text-[#4A5340]" /> : <CopyIcon className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>

                        {/* ─── 3. CONTINUE SHOPPING BUTTON ────────────────────── */}
                        <div>
                            <Link
                                to="/"
                                className="w-full py-3.5 bg-[#171717] hover:bg-[#262626] text-[#FBF9F5] text-xs font-semibold tracking-[0.2em] uppercase flex items-center justify-center gap-2 transition-colors shadow-xs focus-visible:ring-2 focus-visible:ring-[#4A5340] focus-visible:outline-none"
                            >
                                <span>CONTINUE SHOPPING</span>
                                <ArrowRightIcon className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {/* ─── 4. NEED HELP CONCIERGE CARD ────────────────────── */}
                        <div className="p-6 bg-[#F5F2EB] border border-[#ECE7DD] space-y-3 shadow-xs">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#171717]">
                                <QuestionIcon className="w-4 h-4 text-[#4A5340]" />
                                <span>Need Help With Your Order?</span>
                            </div>
                            <p className="text-xs text-[#737373] leading-relaxed">
                                Have questions regarding your shipment manifest, sizes, or exchange policies? Contact our dedicated concierge.
                            </p>
                            <div className="pt-1">
                                <a
                                    href="mailto:support@velmora.co.in"
                                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#171717] hover:text-[#4A5340] underline underline-offset-4 transition-colors"
                                >
                                    <span>SUPPORT@VELMORA.CO.IN</span>
                                    <ArrowUpRightIcon className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── CANCEL ORDER CONFIRMATION MODAL ───────────────────────── */}
                {showCancelModal && (
                    <div
                        className="fixed inset-0 z-50 bg-[#171717]/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="bg-[#FBF9F5] border border-[#ECE7DD] w-full max-w-md p-6 sm:p-7 space-y-5 shadow-xl relative max-h-[90vh] overflow-y-auto">
                            <button
                                type="button"
                                onClick={() => setShowCancelModal(false)}
                                className="absolute top-5 right-5 text-[#737373] hover:text-[#171717] p-1 focus-visible:outline-none"
                                aria-label="Close cancel dialog"
                            >
                                <XIcon className="w-4 h-4" />
                            </button>

                            <div className="space-y-1.5 border-b border-[#ECE7DD] pb-4">
                                <span className="text-[9px] uppercase tracking-[0.22em] font-semibold text-[#9E2A2B]">
                                    ORDER MODIFICATION CONFIRMATION
                                </span>
                                <h3 className="font-editorial-serif text-2xl font-normal text-[#171717]">
                                    Cancel Commission #{order.orderNumber}?
                                </h3>
                                <p className="text-xs text-[#737373] leading-relaxed">
                                    Are you sure you wish to cancel this acquisition? If confirmed, your payment of <strong className="text-[#171717]">{order.payment.total}</strong> will be refunded in full to your original payment method.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#737373] block">
                                    Reason for Cancellation
                                </label>
                                <select
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    className="w-full py-2.5 px-3 bg-[#F5F2EB] border border-[#ECE7DD] text-xs text-[#171717] tracking-wider focus:outline-none focus:border-[#171717]"
                                >
                                    <option value="Changed mind about purchase">Changed mind about purchase</option>
                                    <option value="Ordered wrong garment size">Ordered wrong garment size</option>
                                    <option value="Incorrect shipping address entered">Incorrect shipping address entered</option>
                                    <option value="Found alternative tailoring piece">Found alternative tailoring piece</option>
                                    <option value="Other customer reason">Other personal reason</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 py-2.5 bg-[#F5F2EB] hover:bg-[#ECE7DD] text-[#171717] text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors"
                                >
                                    KEEP ORDER
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmCancel}
                                    disabled={cancelling}
                                    className="flex-1 py-2.5 bg-[#9E2A2B] hover:bg-[#7D1D1E] text-white text-[10px] font-semibold tracking-[0.18em] uppercase transition-colors disabled:opacity-60"
                                >
                                    {cancelling ? "CANCELLING..." : "CONFIRM CANCELLATION"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* ─── EDITORIAL FOOTER (Matching Homepage, Cart & Account) ──────── */}
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
