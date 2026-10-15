import React, { useState, useEffect } from "react";

function XMarkIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export default function AddressModal({
    isOpen,
    onClose,
    onSave,
    initialData = null,
    isLoading = false,
}) {
    const isEdit = Boolean(initialData && initialData._id);

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        addressType: "HOME",
        isDefault: false,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || "",
                phone: initialData.phone || "",
                street: initialData.street || "",
                landmark: initialData.landmark || "",
                city: initialData.city || "",
                state: initialData.state || "",
                pincode: initialData.pincode || "",
                country: initialData.country || "India",
                addressType: initialData.addressType || "HOME",
                isDefault: Boolean(initialData.isDefault),
            });
        } else {
            setFormData({
                fullName: "",
                phone: "",
                street: "",
                landmark: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
                addressType: "HOME",
                isDefault: false,
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const validate = () => {
        const errs = {};
        if (!formData.fullName.trim()) errs.fullName = "Full name is required";
        if (!formData.phone.trim()) {
            errs.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
            errs.phone = "Enter a valid 10-digit Indian phone number";
        }
        if (!formData.street.trim()) errs.street = "Street address is required";
        if (!formData.city.trim()) errs.city = "City is required";
        if (!formData.state.trim()) errs.state = "State is required";
        if (!formData.pincode.trim()) {
            errs.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
            errs.pincode = "Pincode must be 6 digits";
        }
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        await onSave(formData, initialData?._id);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Modal Dialog Box */}
            <div
                className="bg-white border border-zinc-200 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl space-y-6 p-6 sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                    <div>
                        <span className="text-[10px] font-mono-code uppercase tracking-widest text-zinc-400">
                            Shipping Details
                        </span>
                        <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                            {isEdit ? "Edit Address" : "Add Delivery Address"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name & Phone Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700">
                                Full Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Rahul Sharma"
                                value={formData.fullName}
                                onChange={(e) => {
                                    setFormData({ ...formData, fullName: e.target.value });
                                    if (errors.fullName) setErrors({ ...errors, fullName: null });
                                }}
                                className={`w-full h-10 px-3.5 bg-zinc-50 border rounded-xl text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all ${
                                    errors.fullName ? "border-rose-400 bg-rose-50/20" : "border-zinc-200"
                                }`}
                            />
                            {errors.fullName && (
                                <p className="text-[10px] text-rose-500 font-mono-code">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700">
                                Mobile Number <span className="text-rose-500">*</span>
                            </label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-zinc-200 bg-zinc-100 text-zinc-500 text-xs font-mono-code">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    maxLength={10}
                                    placeholder="9876543210"
                                    value={formData.phone}
                                    onChange={(e) => {
                                        const clean = e.target.value.replace(/\D/g, "");
                                        setFormData({ ...formData, phone: clean });
                                        if (errors.phone) setErrors({ ...errors, phone: null });
                                    }}
                                    className={`w-full h-10 px-3.5 bg-zinc-50 border rounded-r-xl text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all ${
                                        errors.phone ? "border-rose-400 bg-rose-50/20" : "border-zinc-200"
                                    }`}
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-[10px] text-rose-500 font-mono-code">{errors.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Street Address */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700">
                            Flat / House No. / Building / Street <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. 402, Apex Residency, 12th Main, Indiranagar"
                            value={formData.street}
                            onChange={(e) => {
                                setFormData({ ...formData, street: e.target.value });
                                if (errors.street) setErrors({ ...errors, street: null });
                            }}
                            className={`w-full h-10 px-3.5 bg-zinc-50 border rounded-xl text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all ${
                                errors.street ? "border-rose-400 bg-rose-50/20" : "border-zinc-200"
                            }`}
                        />
                        {errors.street && (
                            <p className="text-[10px] text-rose-500 font-mono-code">{errors.street}</p>
                        )}
                    </div>

                    {/* Landmark */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700">
                            Landmark (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Near Metro Station / Behind City Mall"
                            value={formData.landmark}
                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                            className="w-full h-10 px-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all"
                        />
                    </div>

                    {/* Pincode, City, State Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                            <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700">
                                Pincode <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                placeholder="560038"
                                value={formData.pincode}
                                onChange={(e) => {
                                    const clean = e.target.value.replace(/\D/g, "");
                                    setFormData({ ...formData, pincode: clean });
                                    if (errors.pincode) setErrors({ ...errors, pincode: null });
                                }}
                                className={`w-full h-10 px-3.5 bg-zinc-50 border rounded-xl text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all ${
                                    errors.pincode ? "border-rose-400 bg-rose-50/20" : "border-zinc-200"
                                }`}
                            />
                            {errors.pincode && (
                                <p className="text-[10px] text-rose-500 font-mono-code">{errors.pincode}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700">
                                City <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Bengaluru"
                                value={formData.city}
                                onChange={(e) => {
                                    setFormData({ ...formData, city: e.target.value });
                                    if (errors.city) setErrors({ ...errors, city: null });
                                }}
                                className={`w-full h-10 px-3.5 bg-zinc-50 border rounded-xl text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all ${
                                    errors.city ? "border-rose-400 bg-rose-50/20" : "border-zinc-200"
                                }`}
                            />
                            {errors.city && (
                                <p className="text-[10px] text-rose-500 font-mono-code">{errors.city}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700">
                                State <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Karnataka"
                                value={formData.state}
                                onChange={(e) => {
                                    setFormData({ ...formData, state: e.target.value });
                                    if (errors.state) setErrors({ ...errors, state: null });
                                }}
                                className={`w-full h-10 px-3.5 bg-zinc-50 border rounded-xl text-xs font-mono-code text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black transition-all ${
                                    errors.state ? "border-rose-400 bg-rose-50/20" : "border-zinc-200"
                                }`}
                            />
                            {errors.state && (
                                <p className="text-[10px] text-rose-500 font-mono-code">{errors.state}</p>
                            )}
                        </div>
                    </div>

                    {/* Address Type Selection */}
                    <div className="space-y-1.5 pt-2">
                        <label className="text-[11px] font-mono-code uppercase font-semibold text-zinc-700 block">
                            Address Type
                        </label>
                        <div className="flex items-center gap-3">
                            {["HOME", "WORK", "OTHER"].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, addressType: type })}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code uppercase transition-all cursor-pointer border ${
                                        formData.addressType === type
                                            ? "bg-black text-white border-black shadow-xs"
                                            : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400"
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Default Checkbox */}
                    <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            className="w-4 h-4 rounded border-zinc-300 text-black focus:ring-black accent-black cursor-pointer"
                        />
                        <span className="text-xs text-zinc-700 font-mono-code">
                            Make this my default delivery address
                        </span>
                    </label>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3 font-mono-code">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-5 py-2.5 rounded-full border border-zinc-200 text-xs font-bold uppercase text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 rounded-full bg-black hover:bg-zinc-800 text-white text-xs font-extrabold uppercase tracking-wider transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>{isEdit ? "Update Address" : "Save & Deliver Here"}</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
