import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct.js";

// ─── Google Fonts loader ──────────────────────────────────────────────────────
function FontLoader() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
            "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
}

// ─── Currency Helper ────────────────────────────────────────────────────────
const currencySymbol = { INR: "₹", USD: "$", EUR: "€", GBP: "£", JPY: "¥" };

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function ArrowLeftIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

function PlusIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
    );
}

function TrashIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
    );
}

function EditIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
    );
}

function PackageIcon({ className = "w-8 h-8" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
        </svg>
    );
}

function CheckIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
    );
}

function AlertIcon({ className = "w-6 h-6" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
    );
}

function LayersIcon({ className = "w-5 h-5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l10.5 5.25L21.75 12l-4.179-2.25M2.25 12l10.5 5.25L21.75 12M2.25 6.75L12 12l9.75-5.25L12 1.5 2.25 6.75z" />
        </svg>
    );
}

function UploadIcon({ className = "w-6 h-6" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
        </svg>
    );
}

function XIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
    );
}

export default function SellerProductModel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleGetProductById, handleUpdateSellerProduct, handleDeleteSellerProduct } = useProduct();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [successMsg, setSuccessMsg] = useState(null);

    // Edit Core Details state
    const [isEditingCore, setIsEditingCore] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priceAmount, setPriceAmount] = useState("");
    const [priceCurrency, setPriceCurrency] = useState("INR");

    // Existing & New Image files state (up to 7)
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const fileInputRef = useRef(null);

    // Variants state
    const [variants, setVariants] = useState([]);
    const [showAddVariantModal, setShowAddVariantModal] = useState(false);

    // Extract product's fixed attribute keys (defined at creation or from existing variants)
    const activeAttributeKeys = useMemo(() => {
        if (product?.attributeKeys && product.attributeKeys.length > 0) {
            return product.attributeKeys;
        }
        if (product?.variants && product.variants.length > 0) {
            const keySet = new Set();
            product.variants.forEach((v) => {
                let entries = [];
                if (v.attributes instanceof Map) entries = Array.from(v.attributes.entries());
                else if (typeof v.attributes === "object" && v.attributes !== null) entries = Object.entries(v.attributes);
                entries.forEach(([k]) => keySet.add(k));
            });
            if (keySet.size > 0) return Array.from(keySet);
        }
        return ["Color", "Size"];
    }, [product]);

    // New Variant Form State
    const [newVarAttributes, setNewVarAttributes] = useState([]);
    const [newVarStock, setNewVarStock] = useState(0);
    const [newVarPriceAmount, setNewVarPriceAmount] = useState("");
    const [newVarPriceCurrency, setNewVarPriceCurrency] = useState("INR");
    const [newVarImageFiles, setNewVarImageFiles] = useState([]);
    const variantFileInputRef = useRef(null);

    // Synchronize fixed attribute keys when opening the Add Variety modal
    useEffect(() => {
        if (showAddVariantModal) {
            setNewVarAttributes(activeAttributeKeys.map((k) => ({ key: k, value: "" })));
        }
    }, [showAddVariantModal, activeAttributeKeys]);

    const [selectedImg, setSelectedImg] = useState(0);

    const fetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await handleGetProductById(id);
            setProduct(data);
            setTitle(data.title || "");
            setDescription(data.description || "");
            setPriceAmount(data.price?.amount || "");
            setPriceCurrency(data.price?.currency || "INR");

            setExistingImages(data.images || []);
            setNewImageFiles([]);

            // Normalize variants attributes as plain JS objects so JSON.stringify won't wipe them
            const parsedVariants = (data.variants || []).map((v) => {
                let attrs = v.attributes;
                if (attrs instanceof Map) {
                    attrs = Object.fromEntries(attrs);
                } else if (typeof attrs === "string") {
                    try {
                        attrs = JSON.parse(attrs);
                    } catch {
                        attrs = {};
                    }
                } else if (typeof attrs !== "object" || attrs === null) {
                    attrs = {};
                }
                return {
                    ...v,
                    attributes: attrs,
                };
            });
            setVariants(parsedVariants);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load product details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!id) return;
        fetchProductDetails();
    }, [id]);

    // Helper to safely convert Map or stringified attributes to plain JS objects for API payload
    const serializeVariantsForApi = (variantsList) => {
        return (variantsList || []).map((v) => {
            let attrsObj = v.attributes;
            if (attrsObj instanceof Map) {
                attrsObj = Object.fromEntries(attrsObj);
            } else if (typeof attrsObj === "string") {
                try {
                    attrsObj = JSON.parse(attrsObj);
                } catch {
                    attrsObj = {};
                }
            } else if (typeof attrsObj !== "object" || attrsObj === null) {
                attrsObj = {};
            }
            return {
                ...v,
                attributes: attrsObj,
            };
        });
    };

    // Process uploaded main product files (Max 7)
    const handleAddImageFiles = (files) => {
        const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
        const currentCount = existingImages.length + newImageFiles.length;
        const availableSlots = 7 - currentCount;

        if (availableSlots <= 0) {
            alert("Maximum 7 product images allowed.");
            return;
        }

        const filesToAdd = validFiles.slice(0, availableSlots).map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            url: URL.createObjectURL(file),
            file,
        }));

        setNewImageFiles((prev) => [...prev, ...filesToAdd]);
    };

    const handleRemoveExistingImage = (idx) => {
        setExistingImages(existingImages.filter((_, i) => i !== idx));
    };

    const handleRemoveNewImageFile = (fileId) => {
        setNewImageFiles(newImageFiles.filter((img) => img.id !== fileId));
    };

    // Save core product edits (Title, Description, Price, Image Files up to 7)
    const handleSaveCoreDetails = async () => {
        if (!title.trim() || !description.trim() || !priceAmount) {
            alert("Title, description, and price amount are required.");
            return;
        }

        if (existingImages.length + newImageFiles.length > 7) {
            alert("You can upload a maximum of 7 images.");
            return;
        }

        setSaving(true);
        setSuccessMsg(null);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            formData.append("priceAmount", priceAmount);
            formData.append("priceCurrency", priceCurrency);

            // Send existing images as JSON array
            formData.append("images", JSON.stringify(existingImages));

            // Append uploaded image files (up to 7)
            newImageFiles.forEach((img) => {
                formData.append("images", img.file);
            });

            const updated = await handleUpdateSellerProduct(id, formData);
            setProduct(updated);
            setExistingImages(updated.images || []);
            setNewImageFiles([]);
            setIsEditingCore(false);
            setSuccessMsg("Product details and images updated successfully!");
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update product details.");
        } finally {
            setSaving(false);
        }
    };

    // Variant image selection (up to 7 files)
    const handleAddVariantImageFiles = (files) => {
        const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
        const availableSlots = 7 - newVarImageFiles.length;
        if (availableSlots <= 0) {
            alert("Maximum 7 images allowed for a variety.");
            return;
        }

        const filesToAdd = validFiles.slice(0, availableSlots).map((file) => ({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            url: URL.createObjectURL(file),
            file,
        }));

        setNewVarImageFiles((prev) => [...prev, ...filesToAdd]);
    };

    const handleRemoveVariantImageFile = (fileId) => {
        setNewVarImageFiles(newVarImageFiles.filter((img) => img.id !== fileId));
    };

    const handleAttributeChange = (index, field, val) => {
        const updated = [...newVarAttributes];
        updated[index][field] = val;
        setNewVarAttributes(updated);
    };

    // Submit New Variant to backend
    const handleCreateVariant = async (e) => {
        e.preventDefault();

        const attributesObj = {};
        newVarAttributes.forEach((attr) => {
            if (attr.key.trim() && attr.value.trim()) {
                attributesObj[attr.key.trim()] = attr.value.trim();
            }
        });

        if (Object.keys(attributesObj).length === 0) {
            alert("Please provide at least one variant attribute (e.g. Color: Red, Size: M).");
            return;
        }

        const newVariantObj = {
            stock: Number(newVarStock) || 0,
            attributes: attributesObj,
            images: newVarImageFiles
                .filter((img) => img.url && !img.url.startsWith("blob:"))
                .map((img) => ({ url: img.url })),
            price: newVarPriceAmount.trim()
                ? {
                      amount: Number(newVarPriceAmount.trim()),
                      currency: newVarPriceCurrency || priceCurrency,
                  }
                : null,
        };

        const updatedVariantsList = serializeVariantsForApi([...variants, newVariantObj]);

        setSaving(true);
        setSuccessMsg(null);
        try {
            const formData = new FormData();
            formData.append("variants", JSON.stringify(updatedVariantsList));

            // Append uploaded image files if any
            newVarImageFiles.forEach((img) => {
                formData.append("images", img.file);
            });

            const updated = await handleUpdateSellerProduct(id, formData);
            setProduct(updated);

            const parsedVariants = (updated.variants || []).map((v) => {
                let attrs = v.attributes;
                if (attrs instanceof Map) attrs = Object.fromEntries(attrs);
                else if (typeof attrs !== "object" || attrs === null) attrs = {};
                return { ...v, attributes: attrs };
            });
            setVariants(parsedVariants);
            setShowAddVariantModal(false);

            // Reset Variant Form
            setNewVarAttributes([{ key: "Color", value: "" }, { key: "Size", value: "" }]);
            setNewVarStock(0);
            setNewVarPriceAmount("");
            setNewVarImageFiles([]);

            setSuccessMsg("New product variety added successfully!");
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to add product variety.");
        } finally {
            setSaving(false);
        }
    };

    // Delete a variant
    const handleDeleteVariant = async (variantIdx) => {
        if (!window.confirm("Are you sure you want to remove this variety?")) return;

        const updatedVariantsList = serializeVariantsForApi(variants.filter((_, idx) => idx !== variantIdx));
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("variants", JSON.stringify(updatedVariantsList));

            const updated = await handleUpdateSellerProduct(id, formData);
            setProduct(updated);

            const parsedVariants = (updated.variants || []).map((v) => {
                let attrs = v.attributes;
                if (attrs instanceof Map) attrs = Object.fromEntries(attrs);
                else if (typeof attrs !== "object" || attrs === null) attrs = {};
                return { ...v, attributes: attrs };
            });
            setVariants(parsedVariants);
            setSuccessMsg("Variety removed.");
            setTimeout(() => setSuccessMsg(null), 4000);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete variety.");
        } finally {
            setSaving(false);
        }
    };

    // Quick Update Stock Availability for a specific variant
    const handleQuickUpdateStock = async (variantIdx, newStockVal) => {
        const updatedVariantsList = serializeVariantsForApi(variants).map((v, idx) => {
            if (idx === variantIdx) {
                return { ...v, stock: Math.max(0, Number(newStockVal) || 0) };
            }
            return v;
        });

        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("variants", JSON.stringify(updatedVariantsList));
            const updated = await handleUpdateSellerProduct(id, formData);
            setProduct(updated);

            const parsedVariants = (updated.variants || []).map((v) => {
                let attrs = v.attributes;
                if (attrs instanceof Map) attrs = Object.fromEntries(attrs);
                else if (typeof attrs !== "object" || attrs === null) attrs = {};
                return { ...v, attributes: attrs };
            });
            setVariants(parsedVariants);
            setSuccessMsg("Stock availability updated!");
            setTimeout(() => setSuccessMsg(null), 3000);
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to update stock.");
        } finally {
            setSaving(false);
        }
    };

    // Delete Entire Product
    const handleDeleteProduct = async () => {
        if (!window.confirm(`Are you sure you want to delete "${product?.title || "this product"}"? This action cannot be undone.`)) {
            return;
        }

        setSaving(true);
        try {
            await handleDeleteSellerProduct(id);
            alert("Product deleted successfully!");
            navigate("/seller/dashboard");
        } catch (err) {
            alert(err?.response?.data?.message || "Failed to delete product.");
        } finally {
            setSaving(false);
        }
    };

    const mainSymbol = currencySymbol[product?.price?.currency] ?? product?.price?.currency ?? "₹";
    const mainFormattedPrice = Number(product?.price?.amount || 0).toLocaleString("en-IN");
    const allCurrentImages = [...existingImages.map((img) => img?.url ?? img), ...newImageFiles.map((img) => img.url)];

    return (
        <>
            <FontLoader />

            <style>{`
                *, *::before, *::after {
                    font-family: 'Hanken Grotesk', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .font-mono-code {
                    font-family: 'JetBrains Mono', monospace;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-in-entry {
                    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
                }
            `}</style>

            <main className="min-h-screen w-full bg-[#fcfcfd] text-zinc-900 selection:bg-black selection:text-white pb-20">

                {/* ─── Breadcrumb & Top Bar ──────────────────────────────────── */}
                <div className="border-b border-zinc-200 bg-white/70 backdrop-blur-xs">
                    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between text-xs font-mono-code text-zinc-600">
                        <Link
                            to="/seller/dashboard"
                            className="inline-flex items-center gap-2 hover:text-black font-semibold transition-colors group cursor-pointer"
                        >
                            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            <span>Back to Seller Dashboard</span>
                        </Link>

                        <div className="flex items-center gap-2 text-zinc-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="font-medium text-[11px] uppercase tracking-wider">
                                Product Editor Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Toast Notification */}
                {successMsg && (
                    <div className="fixed top-20 right-6 z-50 bg-black text-white font-mono-code font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
                        <CheckIcon className="w-4 h-4 text-emerald-400" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* ─── Main Content Container ─────────────────────────────────── */}
                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 pb-12 fade-in-entry space-y-8">

                    {/* Header with Title and Primary Actions */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-200">
                        <div>
                            <div className="flex items-center gap-2 text-[11px] font-mono-code uppercase tracking-widest text-zinc-500 mb-1">
                                <span>Seller Studio</span>
                                <span>/</span>
                                <span>Catalog</span>
                                <span>/</span>
                                <span className="text-black font-bold">Manage Drop</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950">
                                {product?.title || "Product Management"}
                            </h1>
                            <p className="text-xs text-zinc-500 mt-1 font-normal font-mono-code">
                                ID: {id}
                            </p>
                        </div>

                        {/* Top Actions: Add Variety & Delete Product */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                type="button"
                                onClick={() => setShowAddVariantModal(true)}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-zinc-800 text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all shadow-md font-mono-code cursor-pointer active:scale-95"
                            >
                                <PlusIcon className="w-4 h-4" />
                                <span>Add New Variety</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleDeleteProduct}
                                disabled={saving}
                                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs uppercase tracking-widest rounded-full transition-all font-mono-code cursor-pointer disabled:opacity-50"
                                title="Delete entire product"
                            >
                                <TrashIcon className="w-3.5 h-3.5" />
                                <span>Delete Listing</span>
                            </button>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-28 space-y-4">
                            <div className="w-9 h-9 border-2 border-black border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs font-mono-code text-zinc-500 uppercase tracking-widest">
                                Loading product specifications...
                            </p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="bg-white border border-rose-200 rounded-3xl p-10 text-center max-w-md mx-auto space-y-4 shadow-xs">
                            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                                <AlertIcon className="w-6 h-6" />
                            </div>
                            <h2 className="text-xl font-bold text-zinc-950 uppercase tracking-tight">
                                Product Not Found
                            </h2>
                            <p className="text-xs text-zinc-500 font-mono-code">{error}</p>
                            <button
                                type="button"
                                onClick={() => navigate("/seller/dashboard")}
                                className="px-6 py-2.5 bg-black text-white text-xs font-bold uppercase rounded-full font-mono-code cursor-pointer"
                            >
                                Back to Dashboard
                            </button>
                        </div>
                    )}

                    {/* Content when product is loaded */}
                    {!loading && !error && product && (
                        <div className="space-y-10">

                            {/* ── SECTION 1: CORE PRODUCT DETAILS & EDIT CARD ── */}
                            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-xs relative">
                                <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                        <h2 className="text-xs font-mono-code font-bold uppercase tracking-wider text-zinc-950">
                                            Base Product Specifications
                                        </h2>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsEditingCore(!isEditingCore)}
                                        className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-zinc-700 hover:text-black border border-zinc-300 hover:border-black px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-semibold"
                                    >
                                        <EditIcon className="w-3.5 h-3.5" />
                                        <span>{isEditingCore ? "Cancel Editing" : "Edit Base Details"}</span>
                                    </button>
                                </div>

                                {!isEditingCore ? (
                                    /* Read-Only Base View */
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                        {/* Gallery Preview */}
                                        <div className="lg:col-span-5 flex flex-col gap-3">
                                            <div className="aspect-[4/3] bg-[#f4f4f5] border border-zinc-200 rounded-2xl overflow-hidden relative group">
                                                {allCurrentImages.length > 0 ? (
                                                    <img
                                                        src={allCurrentImages[selectedImg]}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                        <PackageIcon className="w-12 h-12" />
                                                    </div>
                                                )}
                                                <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono-code uppercase bg-black/75 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                                                    Photo {selectedImg + 1} of {allCurrentImages.length || 0}
                                                </span>
                                            </div>

                                            {allCurrentImages.length > 1 && (
                                                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                                                    {allCurrentImages.map((imgUrl, i) => (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            onClick={() => setSelectedImg(i)}
                                                            className={`w-16 h-16 rounded-xl border-2 transition-all cursor-pointer bg-[#f4f4f5] flex-shrink-0 overflow-hidden ${
                                                                selectedImg === i
                                                                    ? "border-black ring-2 ring-zinc-300 scale-95"
                                                                    : "border-zinc-200 hover:border-zinc-400 opacity-60 hover:opacity-100"
                                                            }`}
                                                        >
                                                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div className="lg:col-span-7 space-y-5">
                                            <div>
                                                <span className="text-[10px] uppercase font-mono-code text-zinc-400 tracking-widest block mb-0.5">
                                                    Listing Title
                                                </span>
                                                <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950">
                                                    {product.title}
                                                </h2>
                                            </div>

                                            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl w-fit">
                                                <span className="text-[10px] font-mono-code uppercase tracking-widest text-zinc-400 block mb-0.5">
                                                    Base Price
                                                </span>
                                                <div className="flex items-baseline gap-2 font-mono-code">
                                                    <span className="text-2xl font-bold text-zinc-950">
                                                        {mainSymbol}{mainFormattedPrice}
                                                    </span>
                                                    <span className="text-xs text-zinc-500 uppercase">
                                                        {product.price?.currency || "INR"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] uppercase font-mono-code text-zinc-400 tracking-widest block mb-0.5">
                                                    Description
                                                </span>
                                                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-light whitespace-pre-line border-l-2 border-zinc-200 pl-3">
                                                    {product.description || "No description provided."}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-3 pt-2">
                                                <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-center">
                                                    <span className="text-[9px] uppercase font-mono-code text-zinc-400 block">
                                                        Total Varieties
                                                    </span>
                                                    <span className="text-base font-bold font-mono-code text-zinc-950">
                                                        {variants.length}
                                                    </span>
                                                </div>
                                                <div className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-center">
                                                    <span className="text-[9px] uppercase font-mono-code text-zinc-400 block">
                                                        Total Stock
                                                    </span>
                                                    <span className="text-base font-bold font-mono-code text-emerald-600">
                                                        {variants.reduce((acc, v) => acc + Number(v.stock || 0), 0)} units
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Edit Form */
                                    <div className="space-y-6 max-w-3xl">
                                        <div>
                                            <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                                                Product Title
                                            </label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:border-black focus:outline-none transition-all"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                                                    Base Price Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    value={priceAmount}
                                                    onChange={(e) => setPriceAmount(e.target.value)}
                                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono-code focus:bg-white focus:border-black focus:outline-none transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                                                    Currency
                                                </label>
                                                <select
                                                    value={priceCurrency}
                                                    onChange={(e) => setPriceCurrency(e.target.value)}
                                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono-code focus:bg-white focus:border-black focus:outline-none transition-all"
                                                >
                                                    <option value="INR">INR (₹)</option>
                                                    <option value="USD">USD ($)</option>
                                                    <option value="EUR">EUR (€)</option>
                                                    <option value="GBP">GBP (£)</option>
                                                    <option value="JPY">JPY (¥)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                                                Description
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:bg-white focus:border-black focus:outline-none transition-all"
                                            />
                                        </div>

                                        {/* File Upload Section */}
                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-xs uppercase font-mono-code text-zinc-600 font-semibold">
                                                    Product Image Files (Max 7)
                                                </label>
                                                <span className="text-[10px] font-mono-code text-zinc-500">
                                                    {existingImages.length + newImageFiles.length} / 7 uploaded
                                                </span>
                                            </div>

                                            {/* Dropzone */}
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    if (e.dataTransfer.files) handleAddImageFiles(e.dataTransfer.files);
                                                }}
                                                className="border-2 border-dashed border-zinc-200 hover:border-black bg-zinc-50 p-6 text-center cursor-pointer transition-all rounded-2xl flex flex-col items-center justify-center space-y-2"
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    multiple
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={(e) => handleAddImageFiles(e.target.files)}
                                                    className="hidden"
                                                />
                                                <UploadIcon className="w-6 h-6 text-zinc-400" />
                                                <p className="text-xs text-zinc-800 font-semibold">Click or Drag &amp; Drop Image Files</p>
                                                <p className="text-[10px] font-mono-code text-zinc-400 uppercase">PNG, JPG, WEBP up to 7 photos</p>
                                            </div>

                                            {/* Thumbnails preview */}
                                            {(existingImages.length > 0 || newImageFiles.length > 0) && (
                                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-2">
                                                    {existingImages.map((img, idx) => (
                                                        <div key={`existing-${idx}`} className="relative aspect-square border border-zinc-200 bg-zinc-100 rounded-xl group overflow-hidden">
                                                            <img src={img?.url ?? img} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveExistingImage(idx)}
                                                                className="absolute top-1 right-1 bg-white/90 text-zinc-700 hover:text-rose-600 p-1 rounded-full shadow-xs cursor-pointer"
                                                            >
                                                                <XIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {newImageFiles.map((img) => (
                                                        <div key={img.id} className="relative aspect-square border-2 border-black bg-zinc-100 rounded-xl group overflow-hidden">
                                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                            <span className="absolute bottom-0 left-0 right-0 text-[8px] font-mono-code uppercase bg-black text-white text-center py-0.5">
                                                                New
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveNewImageFile(img.id)}
                                                                className="absolute top-1 right-1 bg-white/90 text-zinc-700 hover:text-rose-600 p-1 rounded-full shadow-xs cursor-pointer"
                                                            >
                                                                <XIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 pt-4">
                                            <button
                                                type="button"
                                                disabled={saving}
                                                onClick={handleSaveCoreDetails}
                                                className="px-6 py-3 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all disabled:opacity-50 font-mono-code cursor-pointer shadow-md"
                                            >
                                                {saving ? "Saving..." : "Save Base Details & Images"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingCore(false)}
                                                className="px-6 py-3 border border-zinc-300 hover:border-black text-zinc-700 text-xs font-mono-code uppercase tracking-wider rounded-full cursor-pointer transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── SECTION 2: PRODUCT VARIETIES LIST ── */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <LayersIcon className="w-4 h-4 text-zinc-800" />
                                            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950">
                                                Product Varieties ({variants.length})
                                            </h2>
                                        </div>
                                        <p className="text-xs text-zinc-500 tracking-wide mt-0.5">
                                            Manage color drops, sizing, inventory availability, and individual pricing overrides.
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setShowAddVariantModal(true)}
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all shadow-xs font-mono-code cursor-pointer"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5" />
                                        <span>Add Variety</span>
                                    </button>
                                </div>

                                {/* Empty State if no varieties */}
                                {variants.length === 0 ? (
                                    <div className="border border-dashed border-zinc-300 bg-zinc-50/50 rounded-3xl py-14 px-6 text-center space-y-4">
                                        <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mx-auto text-zinc-500">
                                            <LayersIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-950 font-mono-code">
                                            No Varieties Added Yet
                                        </h3>
                                        <p className="text-xs text-zinc-500 max-w-sm mx-auto font-normal">
                                            Add varieties such as different colorways, sizes, or stock inventory levels.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddVariantModal(true)}
                                            className="px-5 py-2.5 bg-black text-white font-bold text-xs uppercase tracking-wider rounded-full hover:bg-zinc-800 transition-all inline-flex items-center gap-2 cursor-pointer font-mono-code"
                                        >
                                            <PlusIcon className="w-3.5 h-3.5" />
                                            <span>Add First Variety</span>
                                        </button>
                                    </div>
                                ) : (
                                    /* Grid of Varieties */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {variants.map((varItem, idx) => {
                                            let attrEntries = [];
                                            if (varItem.attributes instanceof Map) {
                                                attrEntries = Array.from(varItem.attributes.entries());
                                            } else if (typeof varItem.attributes === "object" && varItem.attributes !== null) {
                                                attrEntries = Object.entries(varItem.attributes);
                                            }

                                            const hasExplicitPrice = Boolean(varItem.price?.amount);
                                            const varSymbol = currencySymbol[varItem.price?.currency] ?? varItem.price?.currency ?? mainSymbol;
                                            const varPriceDisplay = hasExplicitPrice
                                                ? `${varSymbol}${Number(varItem.price.amount).toLocaleString("en-IN")}`
                                                : `${mainSymbol}${mainFormattedPrice}`;

                                            const varImg =
                                                varItem.images && varItem.images.length > 0
                                                    ? varItem.images[0]?.url ?? varItem.images[0]
                                                    : allCurrentImages.length > 0
                                                    ? allCurrentImages[0]
                                                    : null;

                                            return (
                                                <div
                                                    key={idx}
                                                    className="bg-white border border-zinc-200 hover:border-black rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs transition-all"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="w-14 h-14 bg-[#f4f4f5] border border-zinc-200 rounded-xl overflow-hidden flex-shrink-0">
                                                                {varImg ? (
                                                                    <img src={varImg} alt="" className="w-full h-full object-cover object-top" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-zinc-400">
                                                                        <PackageIcon className="w-5 h-5" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteVariant(idx)}
                                                                className="text-zinc-400 hover:text-rose-600 p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
                                                                title="Delete Variety"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div>
                                                            <span className="text-[10px] uppercase font-mono-code tracking-widest text-zinc-400 block mb-1.5">
                                                                Specifications
                                                            </span>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {attrEntries.length > 0 ? (
                                                                    attrEntries.map(([k, v], i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="text-[11px] font-mono-code bg-zinc-100 border border-zinc-200 rounded-full px-2.5 py-0.5 text-zinc-800"
                                                                        >
                                                                            <span className="text-zinc-500 font-semibold">{k}:</span> {v}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-[11px] text-zinc-400 italic">No attributes defined</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-3 border-t border-zinc-100 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="text-[9px] uppercase font-mono-code text-zinc-400 block mb-0.5">Availability</span>
                                                                <span
                                                                    className={`text-[10px] font-mono-code font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                                                                        Number(varItem.stock) > 0
                                                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                                                            : "text-rose-700 bg-rose-50 border-rose-200"
                                                                    }`}
                                                                >
                                                                    {Number(varItem.stock) > 0 ? `In Stock (${varItem.stock})` : "Out of Stock"}
                                                                </span>
                                                            </div>

                                                            <div className="text-right">
                                                                <span className="text-[9px] uppercase font-mono-code text-zinc-400 block mb-0.5">Pricing</span>
                                                                <div className="flex items-center gap-1.5 justify-end">
                                                                    <span className="text-xs font-mono-code font-bold text-zinc-950">
                                                                        {varPriceDisplay}
                                                                    </span>
                                                                    {!hasExplicitPrice && (
                                                                        <span className="text-[8px] uppercase font-mono-code bg-zinc-100 text-zinc-500 border border-zinc-200 px-1.5 py-0.5 rounded-full">
                                                                            Base
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quick Stock Adjuster */}
                                                        <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-xl p-2">
                                                            <span className="text-[9px] uppercase font-mono-code text-zinc-500 font-semibold">
                                                                Inventory:
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuickUpdateStock(idx, Math.max(0, Number(varItem.stock || 0) - 1))}
                                                                    className="w-6 h-6 bg-white border border-zinc-300 rounded-full text-zinc-700 hover:text-black hover:border-black font-mono-code text-xs flex items-center justify-center cursor-pointer"
                                                                    title="Decrease stock"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center text-xs font-mono-code font-bold text-zinc-950">
                                                                    {varItem.stock || 0}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuickUpdateStock(idx, Number(varItem.stock || 0) + 1)}
                                                                    className="w-6 h-6 bg-white border border-zinc-300 rounded-full text-zinc-700 hover:text-black hover:border-black font-mono-code text-xs flex items-center justify-center cursor-pointer"
                                                                    title="Increase stock"
                                                                >
                                                                    +
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuickUpdateStock(idx, Number(varItem.stock) > 0 ? 0 : 10)}
                                                                    className={`ml-2 text-[8px] uppercase font-mono-code px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                                                                        Number(varItem.stock) > 0
                                                                            ? "text-rose-700 border-rose-200 hover:bg-rose-50"
                                                                            : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                                                    }`}
                                                                >
                                                                    {Number(varItem.stock) > 0 ? "Set Out" : "Set In"}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>
                    )}

                </div>

                {/* ─── ADD NEW VARIETY MODAL ──────────────────────────────────── */}
                {showAddVariantModal && (
                    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white border border-zinc-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">

                            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 sticky top-0 bg-white z-10">
                                <div className="flex items-center gap-2">
                                    <PlusIcon className="w-4 h-4 text-black" />
                                    <h3 className="text-base font-black uppercase tracking-tight text-zinc-950 font-mono-code">
                                        Add New Product Variety
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowAddVariantModal(false)}
                                    className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer text-xs"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleCreateVariant} className="space-y-5">
                                {/* Variety Attributes Inputs */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs uppercase font-mono-code text-zinc-600 font-semibold">
                                            Variety Attributes
                                        </label>
                                        <span className="text-[10px] font-mono-code text-zinc-400 uppercase">
                                            Fixed Schema
                                        </span>
                                    </div>

                                    {newVarAttributes.map((attr, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-zinc-50 border border-zinc-200 rounded-xl p-2.5">
                                            <div className="w-1/3 bg-white px-3 py-2 text-xs font-mono-code font-bold text-zinc-900 uppercase border border-zinc-200 rounded-lg truncate">
                                                {attr.key}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder={`Enter ${attr.key} (e.g. Olive, L)`}
                                                value={attr.value}
                                                onChange={(e) => handleAttributeChange(idx, "value", e.target.value)}
                                                className="w-2/3 bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 focus:border-black focus:outline-none font-mono-code"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Stock Quantity */}
                                <div>
                                    <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newVarStock}
                                        onChange={(e) => setNewVarStock(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 font-mono-code focus:bg-white focus:border-black focus:outline-none"
                                    />
                                </div>

                                {/* Optional Price Override */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs uppercase font-mono-code text-zinc-600 font-semibold">
                                            Variety Price (Optional)
                                        </label>
                                        <span className="text-[9px] font-mono-code text-zinc-400">
                                            Base: {mainSymbol}{mainFormattedPrice}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[1fr_auto] gap-2">
                                        <input
                                            type="number"
                                            placeholder="Leave blank to inherit base price"
                                            value={newVarPriceAmount}
                                            onChange={(e) => setNewVarPriceAmount(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 font-mono-code focus:bg-white focus:border-black focus:outline-none"
                                        />
                                        <select
                                            value={newVarPriceCurrency}
                                            onChange={(e) => setNewVarPriceCurrency(e.target.value)}
                                            className="bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2.5 text-xs text-zinc-900 font-mono-code focus:bg-white focus:border-black focus:outline-none"
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="JPY">JPY (¥)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Variety Image Upload */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs uppercase font-mono-code text-zinc-600 font-semibold">
                                            Variety Images (Up to 7)
                                        </label>
                                        <span className="text-[10px] font-mono-code text-zinc-400">
                                            {newVarImageFiles.length} / 7
                                        </span>
                                    </div>

                                    <div
                                        onClick={() => variantFileInputRef.current?.click()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            if (e.dataTransfer.files) handleAddVariantImageFiles(e.dataTransfer.files);
                                        }}
                                        className="border-2 border-dashed border-zinc-200 hover:border-black bg-zinc-50 p-4 text-center cursor-pointer transition-all rounded-2xl flex flex-col items-center justify-center space-y-1"
                                    >
                                        <input
                                            ref={variantFileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(e) => handleAddVariantImageFiles(e.target.files)}
                                            className="hidden"
                                        />
                                        <UploadIcon className="w-5 h-5 text-zinc-400" />
                                        <p className="text-xs text-zinc-800 font-semibold">Click or Drag &amp; Drop Variety Images</p>
                                        <p className="text-[9px] font-mono-code text-zinc-400 uppercase">Select up to 7 photos</p>
                                    </div>

                                    {newVarImageFiles.length > 0 && (
                                        <div className="grid grid-cols-5 gap-2 pt-1">
                                            {newVarImageFiles.map((img) => (
                                                <div key={img.id} className="relative aspect-square border-2 border-black bg-zinc-100 rounded-xl group overflow-hidden">
                                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariantImageFile(img.id)}
                                                        className="absolute top-1 right-1 bg-white/90 text-zinc-700 hover:text-rose-600 p-1 rounded-full shadow-xs cursor-pointer"
                                                    >
                                                        <XIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddVariantModal(false)}
                                        className="px-5 py-2.5 border border-zinc-300 hover:border-black text-zinc-700 text-xs font-mono-code uppercase rounded-full cursor-pointer transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-black hover:bg-zinc-800 text-white font-bold text-xs uppercase tracking-widest rounded-full transition-all disabled:opacity-50 cursor-pointer shadow-md font-mono-code"
                                    >
                                        {saving ? "Saving..." : "Save Variety"}
                                    </button>
                                </div>
                            </form>

                        </div>
                    </div>
                )}

                {/* ─── Snitch Store Footer (Matching Home.jsx) ────────────────── */}
                <footer className="mt-16 border-t border-zinc-200 bg-white py-10 px-4 sm:px-8 text-center text-xs text-zinc-500 space-y-2 font-mono-code">
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 rounded-full border border-black flex items-center justify-center text-[10px] font-bold text-black">
                            S
                        </span>
                        <span className="font-bold text-zinc-900 tracking-widest uppercase">
                            SNITCH STUDIO
                        </span>
                    </div>
                    <p className="text-[11px] text-zinc-400">
                        Seller dashboard for independent fashion creators and verified streetwear brands.
                    </p>
                </footer>

            </main>
        </>
    );
}
