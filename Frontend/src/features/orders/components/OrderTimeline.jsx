import React from "react";

// Standard sequential stages
const STAGES = [
    { key: "PLACED", label: "Order Placed", step: 1 },
    { key: "CONFIRMED", label: "Confirmed", step: 2 },
    { key: "PROCESSING", label: "Packed", step: 3 },
    { key: "SHIPPED", label: "In Transit", step: 4 },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery", step: 5 },
    { key: "DELIVERED", label: "Delivered", step: 6 },
];

const STAGE_RANK = {
    PLACED: 1,
    CONFIRMED: 2,
    PROCESSING: 3,
    SHIPPED: 4,
    OUT_FOR_DELIVERY: 5,
    DELIVERED: 6,
    CANCELLED: -1,
};

function CheckIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

function ClockIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

function XCircleIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );
}

export default function OrderTimeline({ currentStatus = "CONFIRMED", events = [] }) {
    const isCancelled = currentStatus === "CANCELLED";
    const currentRank = STAGE_RANK[currentStatus] || 1;

    if (isCancelled) {
        return (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 flex-shrink-0 mt-0.5">
                    <XCircleIcon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-xs font-bold uppercase font-mono-code text-rose-900 tracking-wider">
                        Order Cancelled
                    </h4>
                    <p className="text-xs text-rose-700 mt-0.5 font-normal">
                        This order has been cancelled and will not be delivered. If you were charged, a full refund has been initiated to your original payment method.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-2">
            {/* Desktop / Tablet Horizontal Timeline */}
            <div className="hidden sm:block">
                <div className="relative flex items-center justify-between">
                    {/* Background Progress Track */}
                    <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 -z-0" />

                    {/* Active Filled Progress Bar */}
                    <div
                        className="absolute top-4 left-6 h-0.5 bg-black transition-all duration-700 -z-0"
                        style={{
                            width: `${Math.min(
                                100,
                                Math.max(0, ((currentRank - 1) / (STAGES.length - 1)) * 100)
                            )}%`,
                        }}
                    />

                    {STAGES.map((stage) => {
                        const isDone = currentRank > stage.step;
                        const isCurrent = currentRank === stage.step;
                        const isPending = currentRank < stage.step;

                        return (
                            <div key={stage.key} className="flex flex-col items-center relative z-10">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                        isDone
                                            ? "bg-black text-white shadow-xs"
                                            : isCurrent
                                            ? "bg-black text-white ring-4 ring-black/15 shadow-sm"
                                            : "bg-white border-2 border-zinc-300 text-zinc-400"
                                    }`}
                                >
                                    {isDone ? (
                                        <CheckIcon className="w-4 h-4" />
                                    ) : isCurrent ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                    ) : (
                                        <span className="text-[10px] font-mono-code font-bold">{stage.step}</span>
                                    )}
                                </div>

                                <span
                                    className={`mt-2.5 text-[11px] font-mono-code uppercase tracking-tight text-center max-w-[85px] leading-tight ${
                                        isCurrent
                                            ? "font-black text-black"
                                            : isDone
                                            ? "font-bold text-zinc-700"
                                            : "font-medium text-zinc-400"
                                    }`}
                                >
                                    {stage.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Vertical Timeline */}
            <div className="sm:hidden space-y-4">
                {STAGES.map((stage, idx) => {
                    const isDone = currentRank > stage.step;
                    const isCurrent = currentRank === stage.step;
                    const isPending = currentRank < stage.step;

                    return (
                        <div key={stage.key} className="flex items-start gap-3 relative">
                            {/* Connecting Line */}
                            {idx < STAGES.length - 1 && (
                                <div
                                    className={`absolute left-3.5 top-7 bottom-0 w-0.5 -ml-[1px] ${
                                        currentRank > stage.step ? "bg-black" : "bg-zinc-200"
                                    }`}
                                />
                            )}

                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                                    isDone
                                        ? "bg-black text-white"
                                        : isCurrent
                                            ? "bg-black text-white ring-4 ring-black/15"
                                            : "bg-white border-2 border-zinc-300 text-zinc-400"
                                }`}
                            >
                                {isDone ? (
                                    <CheckIcon className="w-3.5 h-3.5" />
                                ) : isCurrent ? (
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                ) : (
                                    <span className="text-[10px] font-mono-code font-bold">{stage.step}</span>
                                )}
                            </div>

                            <div className="pb-3 flex-1 min-w-0">
                                <p
                                    className={`text-xs font-mono-code uppercase tracking-tight ${
                                        isCurrent
                                            ? "font-black text-black"
                                            : isDone
                                            ? "font-bold text-zinc-800"
                                            : "font-medium text-zinc-400"
                                    }`}
                                >
                                    {stage.label}
                                    {isCurrent && (
                                        <span className="ml-2 px-2 py-0.5 bg-black text-white text-[9px] rounded-full uppercase tracking-wider">
                                            Current
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Event History Logs if any */}
            {Array.isArray(events) && events.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-100">
                    <h5 className="text-[11px] font-bold font-mono-code uppercase tracking-wider text-zinc-400 mb-4">
                        Activity Logs
                    </h5>
                    <div className="space-y-3 font-mono-code">
                        {events
                            .slice()
                            .reverse()
                            .map((ev, i) => (
                                <div key={i} className="flex items-start justify-between gap-3 text-xs">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-zinc-900">{ev.title}</p>
                                        {ev.description && <p className="text-zinc-500 text-[11px]">{ev.description}</p>}
                                        {ev.location && <p className="text-zinc-400 text-[10px]">📍 {ev.location}</p>}
                                    </div>
                                    <span className="text-[10px] text-zinc-400 flex-shrink-0 text-right">
                                        {new Date(ev.timestamp).toLocaleDateString("en-IN", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                </div>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
}
