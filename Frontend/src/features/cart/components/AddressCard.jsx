import React from "react";

function HomeIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
    );
}

function BriefcaseIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v1.069m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

function PinDropIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    );
}

export default function AddressCard({
    address,
    isSelected,
    onSelect,
    onEdit,
    onDelete,
}) {
    if (!address) return null;

    const type = (address.addressType || "HOME").toUpperCase();

    return (
        <div
            onClick={() => onSelect(address._id)}
            className={`group relative rounded-2xl p-5 border transition-all cursor-pointer select-none ${
                isSelected
                    ? "border-black bg-zinc-50/70 shadow-sm ring-1 ring-black"
                    : "border-zinc-200 bg-white hover:border-zinc-400 hover:shadow-xs"
            }`}
        >
            <div className="flex items-start justify-between gap-3">
                {/* Radio & Title Info */}
                <div className="flex items-start gap-3.5">
                    {/* Custom Radio Button */}
                    <div className="pt-0.5">
                        <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                                isSelected
                                    ? "border-black bg-black"
                                    : "border-zinc-300 group-hover:border-zinc-400 bg-white"
                            }`}
                        >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>

                    {/* Address Text Content */}
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-sm text-zinc-950 uppercase tracking-tight font-mono-code">
                                {address.fullName}
                            </span>

                            {/* Type Badge */}
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-code tracking-wider uppercase bg-zinc-100 text-zinc-700 border border-zinc-200">
                                {type === "HOME" ? (
                                    <HomeIcon className="w-3 h-3 text-zinc-600" />
                                ) : type === "WORK" ? (
                                    <BriefcaseIcon className="w-3 h-3 text-zinc-600" />
                                ) : (
                                    <PinDropIcon className="w-3 h-3 text-zinc-600" />
                                )}
                                {type}
                            </span>

                            {/* Default Tag */}
                            {address.isDefault && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold font-mono-code tracking-widest uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Default
                                </span>
                            )}
                        </div>

                        {/* Formatted Street and Landmark */}
                        <p className="text-xs text-zinc-600 leading-relaxed max-w-lg">
                            {address.street}
                            {address.landmark ? `, ${address.landmark}` : ""}
                        </p>

                        {/* City, State & PIN */}
                        <p className="text-xs font-semibold text-zinc-800 font-mono-code">
                            {address.city}, {address.state} - {address.pincode}
                        </p>

                        {/* Phone Number */}
                        <div className="flex items-center gap-2 pt-1 text-xs text-zinc-500 font-mono-code">
                            <span>Mobile:</span>
                            <span className="font-bold text-zinc-900">+91 {address.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Top Right Action Pills */}
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 self-start flex-shrink-0"
                >
                    <button
                        type="button"
                        onClick={() => onEdit(address)}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase font-mono-code text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete(address._id)}
                        className="px-2.5 py-1 text-[11px] font-bold uppercase font-mono-code text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Bottom Delivery Prompt if selected */}
            {isSelected && (
                <div className="mt-4 pt-3 border-t border-zinc-200/80 flex items-center justify-between text-[11px] font-mono-code">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Selected for Delivery
                    </span>
                    <span className="text-zinc-400 text-[10px]">Standard delivery in 2-4 days</span>
                </div>
            )}
        </div>
    );
}
