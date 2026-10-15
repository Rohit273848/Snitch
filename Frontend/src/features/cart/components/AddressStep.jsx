import React, { useState } from "react";
import AddressCard from "./AddressCard.jsx";
import AddressModal from "./AddressModal.jsx";

function PlusIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function MapPinIcon({ className = "w-8 h-8" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
    );
}

function ShieldCheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

export default function AddressStep({
    addresses = [],
    selectedAddress = null,
    onSelectAddress,
    onCreateAddress,
    onUpdateAddress,
    onDeleteAddress,
    onBackToBag,
    onProceedToPayment,
    isLoading = false,
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const handleOpenAdd = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (addr) => {
        setEditingAddress(addr);
        setIsModalOpen(true);
    };

    const handleSaveAddress = async (formData, addressId) => {
        setActionLoading(true);
        try {
            if (addressId) {
                await onUpdateAddress(addressId, formData);
            } else {
                await onCreateAddress({ ...formData, selectForCart: true });
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Save address error:", err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (addressId) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            await onDeleteAddress(addressId);
        } catch (err) {
            console.error("Delete address error:", err);
        }
    };

    const selectedId = selectedAddress?._id || selectedAddress;

    return (
        <div className="space-y-6">
            {/* Step Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
                <div>
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950 font-mono-code flex items-center gap-2">
                        <span>Select Delivery Address</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-bold">
                            {addresses.length} Saved
                        </span>
                        {isLoading && (
                            <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        )}
                    </h2>
                    <p className="text-xs text-zinc-500 font-normal mt-0.5">
                        Choose a delivery address or add a new shipping location for your order.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-bold font-mono-code uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer self-start sm:self-auto"
                >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                </button>
            </div>

            {/* Address List */}
            {addresses.length > 0 ? (
                <div className="space-y-3.5">
                    {addresses.map((address) => (
                        <AddressCard
                            key={address._id}
                            address={address}
                            isSelected={String(address._id) === String(selectedId)}
                            onSelect={onSelectAddress}
                            onEdit={handleOpenEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                /* Empty Address State */
                <div className="bg-white border border-dashed border-zinc-300 rounded-3xl p-10 sm:p-14 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto text-zinc-400">
                        <MapPinIcon className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-base font-extrabold uppercase font-mono-code text-zinc-900">
                            No Delivery Address Found
                        </h3>
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                            Please add a shipping address to proceed with your checkout and get live delivery estimates.
                        </p>
                    </div>
                    <div>
                        <button
                            type="button"
                            onClick={handleOpenAdd}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-extrabold font-mono-code uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                            <span>Add Your First Address</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Security and Delivery Assurance */}
            <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between text-xs font-mono-code text-zinc-600">
                <div className="flex items-center gap-2">
                    <ShieldCheckIcon className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Verified Courier Partners: BlueDart, Delhivery & DTDC</span>
                </div>
                <span className="hidden sm:inline text-zinc-400 text-[11px]">Free Returns on standard orders</span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 font-mono-code">
                <button
                    type="button"
                    onClick={onBackToBag}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-zinc-200 text-xs font-bold uppercase text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors cursor-pointer"
                >
                    <span>←</span>
                    <span>Back to Bag</span>
                </button>

                {selectedAddress && (
                    <button
                        type="button"
                        onClick={onProceedToPayment}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                    >
                        <span>Continue to Payment</span>
                        <span>→</span>
                    </button>
                )}
            </div>

            {/* Add / Edit Address Modal */}
            <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveAddress}
                initialData={editingAddress}
                isLoading={actionLoading}
            />
        </div>
    );
}
