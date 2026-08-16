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
function BackArrowIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    );
}

function PlusIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function TrashIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
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
            product.variants.forEach(v => {
                let entries = [];
                if (v.attributes instanceof Map) entries = Array.from(v.attributes.entries());
                else if (typeof v.attributes === 'object' && v.attributes !== null) entries = Object.entries(v.attributes);
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
            setNewVarAttributes(activeAttributeKeys.map(k => ({ key: k, value: "" })));
        }
    }, [showAddVariantModal, activeAttributeKeys]);

    const [selectedImg, setSelectedImg] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 50);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        if (!id) return;
        fetchProductDetails();
    }, [id]);

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
            const parsedVariants = (data.variants || []).map(v => {
                let attrs = v.attributes;
                if (attrs instanceof Map) {
                    attrs = Object.fromEntries(attrs);
                } else if (typeof attrs === 'string') {
                    try { attrs = JSON.parse(attrs); } catch (e) { attrs = {}; }
                } else if (typeof attrs !== 'object' || attrs === null) {
                    attrs = {};
                }
                return {
                    ...v,
                    attributes: attrs
                };
            });
            setVariants(parsedVariants);
        } catch (err) {
            setError(err?.response?.data?.message || "Failed to load product details.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to safely convert Map or stringified attributes to plain JS objects for API payload
    const serializeVariantsForApi = (variantsList) => {
        return (variantsList || []).map(v => {
            let attrsObj = v.attributes;
            if (attrsObj instanceof Map) {
                attrsObj = Object.fromEntries(attrsObj);
            } else if (typeof attrsObj === 'string') {
                try { attrsObj = JSON.parse(attrsObj); } catch (e) { attrsObj = {}; }
            } else if (typeof attrsObj !== 'object' || attrsObj === null) {
                attrsObj = {};
            }
            return {
                ...v,
                attributes: attrsObj
            };
        });
    };

    // Process uploaded main product files (Max 7)
    const handleAddImageFiles = (files) => {
        const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
        const currentCount = existingImages.length + newImageFiles.length;
        const availableSlots = 7 - currentCount;

        if (availableSlots <= 0) {
            alert("Maximum 7 product images allowed.");
            return;
        }

        const filesToAdd = validFiles.slice(0, availableSlots).map(file => ({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            url: URL.createObjectURL(file),
            file
        }));

        setNewImageFiles(prev => [...prev, ...filesToAdd]);
    };

    const handleRemoveExistingImage = (idx) => {
        setExistingImages(existingImages.filter((_, i) => i !== idx));
    };

    const handleRemoveNewImageFile = (id) => {
        setNewImageFiles(newImageFiles.filter(img => img.id !== id));
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
            newImageFiles.forEach(img => {
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
        const validFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
        const availableSlots = 7 - newVarImageFiles.length;
        if (availableSlots <= 0) {
            alert("Maximum 7 images allowed for a variety.");
            return;
        }

        const filesToAdd = validFiles.slice(0, availableSlots).map(file => ({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            url: URL.createObjectURL(file),
            file
        }));

        setNewVarImageFiles(prev => [...prev, ...filesToAdd]);
    };

    const handleRemoveVariantImageFile = (id) => {
        setNewVarImageFiles(newVarImageFiles.filter(img => img.id !== id));
    };

    // Add Attribute pair to new variant form
    const handleAddAttributePair = () => {
        setNewVarAttributes([...newVarAttributes, { key: "", value: "" }]);
    };

    const handleRemoveAttributePair = (index) => {
        setNewVarAttributes(newVarAttributes.filter((_, i) => i !== index));
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
        newVarAttributes.forEach(attr => {
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
                .filter(img => img.url && !img.url.startsWith('blob:'))
                .map(img => ({ url: img.url })),
            price: newVarPriceAmount.trim() ? {
                amount: Number(newVarPriceAmount.trim()),
                currency: newVarPriceCurrency || priceCurrency
            } : null
        };

        const updatedVariantsList = serializeVariantsForApi([...variants, newVariantObj]);

        setSaving(true);
        setSuccessMsg(null);
        try {
            const formData = new FormData();
            formData.append("variants", JSON.stringify(updatedVariantsList));

            // Append uploaded image files if any
            newVarImageFiles.forEach(img => {
                formData.append("images", img.file);
            });

            const updated = await handleUpdateSellerProduct(id, formData);
            setProduct(updated);

            const parsedVariants = (updated.variants || []).map(v => {
                let attrs = v.attributes;
                if (attrs instanceof Map) attrs = Object.fromEntries(attrs);
                else if (typeof attrs !== 'object' || attrs === null) attrs = {};
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

            const parsedVariants = (updated.variants || []).map(v => {
                let attrs = v.attributes;
                if (attrs instanceof Map) attrs = Object.fromEntries(attrs);
                else if (typeof attrs !== 'object' || attrs === null) attrs = {};
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

            const parsedVariants = (updated.variants || []).map(v => {
                let attrs = v.attributes;
                if (attrs instanceof Map) attrs = Object.fromEntries(attrs);
                else if (typeof attrs !== 'object' || attrs === null) attrs = {};
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
    const allCurrentImages = [...existingImages.map(img => img?.url ?? img), ...newImageFiles.map(img => img.url)];

    return (
        <>
            <FontLoader />

            <style>{`
                *, *::before, *::after { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }
                @keyframes contentIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .content-in { animation: contentIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
            `}</style>

            <main className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col selection:bg-yellow-500 selection:text-black">

                {/* ══════════════════════════════════════════════
                    TOP BAR / NAVIGATION
                ══════════════════════════════════════════════ */}
                <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-zinc-900 px-6 sm:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => navigate("/seller/dashboard")}
                            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-yellow-500 transition-colors cursor-pointer"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                        >
                            <BackArrowIcon className="w-4 h-4" />
                            <span>Dashboard</span>
                        </button>
                        <div className="h-4 w-px bg-zinc-800" />
                        <Link to="/" className="inline-flex items-center gap-2 group">
                            <span className="h-7 w-7 rounded bg-yellow-500 flex items-center justify-center text-black font-black text-sm">
                                S
                            </span>
                            <span className="text-xs font-bold tracking-[0.25em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                                SNITCH SELLER HUB
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest text-zinc-500 border border-zinc-800 px-3 py-1.5">
                            ID: {id?.slice(-8)}
                        </span>
                        <button
                            onClick={() => setShowAddVariantModal(true)}
                            className="h-9 px-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                            style={{ clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))" }}
                        >
                            <PlusIcon className="w-3.5 h-3.5" />
                            <span>Add New Variety</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleDeleteProduct}
                            disabled={saving}
                            className="h-9 px-3.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                            title="Delete Product"
                        >
                            <TrashIcon className="w-3.5 h-3.5 text-red-400" />
                            <span className="hidden sm:inline">Delete Product</span>
                        </button>
                    </div>
                </header>

                {/* Toast Notification */}
                {successMsg && (
                    <div className="fixed top-20 right-6 z-50 bg-emerald-500/90 text-black font-bold text-xs uppercase tracking-wider px-5 py-3 shadow-2xl flex items-center gap-2.5 backdrop-blur-md animate-bounce">
                        <CheckIcon className="w-4 h-4 text-black" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {/* ══════════════════════════════════════════════
                    MAIN CONTENT BODY
                ══════════════════════════════════════════════ */}
                <div className={`flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-8 ${mounted ? "content-in" : "opacity-0"}`}>

                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-6 text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        <Link to="/seller/dashboard" className="hover:text-yellow-500">Seller Dashboard</Link>
                        <span>/</span>
                        <span>Product Model</span>
                        <span>/</span>
                        <span className="text-yellow-500 truncate max-w-[200px]">{product?.title || "Details"}</span>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-28 space-y-4">
                            <div className="w-10 h-10 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                            <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">Loading Product Spec Sheet...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="flex flex-col items-center justify-center py-20 px-6 border border-red-500/20 bg-red-500/5">
                            <AlertIcon className="w-8 h-8 text-red-400 mb-4" />
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-2">Product Not Found</h2>
                            <p className="text-xs text-zinc-400 text-center max-w-md mb-6">{error}</p>
                            <button
                                onClick={() => navigate("/seller/dashboard")}
                                className="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-widest transition-all"
                            >
                                Back to Seller Dashboard
                            </button>
                        </div>
                    )}

                    {/* Content when product is loaded */}
                    {!loading && !error && product && (
                        <div className="space-y-10">

                            {/* SECTION 1: MAIN PRODUCT OVERVIEW & EDIT PANEL */}
                            <div className="bg-[#0e0e0e] border border-zinc-800 p-6 sm:p-8 relative">

                                <div className="flex items-center justify-between border-b border-zinc-800 pb-5 mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                        <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
                                            Main Product Information
                                        </h2>
                                    </div>

                                    <button
                                        onClick={() => setIsEditingCore(!isEditingCore)}
                                        className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-500 hover:text-yellow-400 border border-yellow-500/30 px-3 py-1.5 transition-all cursor-pointer"
                                    >
                                        <EditIcon className="w-3.5 h-3.5" />
                                        <span>{isEditingCore ? "Cancel Edit" : "Edit Base Details"}</span>
                                    </button>
                                </div>

                                {!isEditingCore ? (
                                    /* Read Only View of Base Product */
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                                        {/* Main Product Image Carousel/Preview */}
                                        <div className="lg:col-span-5 flex flex-col gap-3">
                                            <div className="aspect-[4/3] bg-black border border-zinc-800 overflow-hidden relative group">
                                                {allCurrentImages.length > 0 ? (
                                                    <img
                                                        src={allCurrentImages[selectedImg]}
                                                        alt={product.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <PackageIcon className="w-12 h-12 text-zinc-800" />
                                                    </div>
                                                )}
                                                <span className="absolute bottom-2 right-2 text-[9px] font-mono uppercase bg-black/80 px-2 py-0.5 border border-zinc-800">
                                                    Base Image {selectedImg + 1} of {allCurrentImages.length || 0}
                                                </span>
                                            </div>

                                            {allCurrentImages.length > 1 && (
                                                <div className="flex gap-2 overflow-x-auto pb-1">
                                                    {allCurrentImages.map((imgUrl, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => setSelectedImg(i)}
                                                            className={`w-16 h-16 border transition-all cursor-pointer bg-black ${selectedImg === i ? "border-yellow-500 scale-95" : "border-zinc-800 opacity-50"
                                                                }`}
                                                        >
                                                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* Main Product Meta Info */}
                                        <div className="lg:col-span-7 space-y-5">
                                            <div>
                                                <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-widest">Base Listing Title</span>
                                                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                                                    {product.title}
                                                </h1>
                                            </div>

                                            <div className="flex items-baseline gap-4 bg-black/60 border border-zinc-800/80 p-4 w-fit">
                                                <div>
                                                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Default Base Price</span>
                                                    <div className="flex items-baseline gap-2 mt-0.5">
                                                        <span className="text-2xl font-bold font-mono text-yellow-500">
                                                            {mainSymbol}{mainFormattedPrice}
                                                        </span>
                                                        <span className="text-xs font-mono text-zinc-500">
                                                            {product.price?.currency || "INR"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-widest">Description</span>
                                                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mt-1 font-light whitespace-pre-line border-l border-zinc-800 pl-3">
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap gap-4 pt-2">
                                                <div className="bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-center">
                                                    <span className="text-[9px] uppercase font-mono text-zinc-500 block">Total Varieties</span>
                                                    <span className="text-base font-bold font-mono text-white">{variants.length}</span>
                                                </div>
                                                <div className="bg-zinc-900/60 border border-zinc-800 px-4 py-2 text-center">
                                                    <span className="text-[9px] uppercase font-mono text-zinc-500 block">Total Variety Stock</span>
                                                    <span className="text-base font-bold font-mono text-emerald-400">
                                                        {variants.reduce((acc, v) => acc + Number(v.stock || 0), 0)} units
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                ) : (
                                    /* Form View to Edit Base Product Details & Upload Image Files */
                                    <div className="space-y-6 max-w-3xl">
                                        <div>
                                            <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">
                                                Product Title
                                            </label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white focus:border-yellow-500 focus:outline-none"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">
                                                    Base Price Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    value={priceAmount}
                                                    onChange={(e) => setPriceAmount(e.target.value)}
                                                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">
                                                    Currency
                                                </label>
                                                <select
                                                    value={priceCurrency}
                                                    onChange={(e) => setPriceCurrency(e.target.value)}
                                                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white font-mono focus:border-yellow-500 focus:outline-none"
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
                                            <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">
                                                Description
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white focus:border-yellow-500 focus:outline-none"
                                            />
                                        </div>

                                        {/* File Upload Section (Up to 7 Image Files) */}
                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-between">
                                                <label className="block text-xs uppercase font-mono text-zinc-400">
                                                    Product Image Files (Max 7)
                                                </label>
                                                <span className="text-[10px] font-mono text-yellow-500">
                                                    {existingImages.length + newImageFiles.length} / 7 uploaded
                                                </span>
                                            </div>

                                            {/* Dropzone File Input */}
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    if (e.dataTransfer.files) handleAddImageFiles(e.dataTransfer.files);
                                                }}
                                                className="border border-dashed border-zinc-800 hover:border-yellow-500/50 bg-black/50 p-6 text-center cursor-pointer transition-all rounded-sm flex flex-col items-center justify-center space-y-2"
                                            >
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    multiple
                                                    accept="image/png,image/jpeg,image/webp"
                                                    onChange={(e) => handleAddImageFiles(e.target.files)}
                                                    className="hidden"
                                                />
                                                <UploadIcon className="w-6 h-6 text-zinc-500" />
                                                <p className="text-xs text-zinc-300 font-medium">Click or Drag &amp; Drop Image Files</p>
                                                <p className="text-[10px] font-mono text-zinc-600 uppercase">PNG, JPG, WEBP up to 7 files</p>
                                            </div>

                                            {/* Image Thumbnails preview */}
                                            {(existingImages.length > 0 || newImageFiles.length > 0) && (
                                                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 pt-2">
                                                    {existingImages.map((img, idx) => (
                                                        <div key={`existing-${idx}`} className="relative aspect-square border border-zinc-800 bg-black group overflow-hidden">
                                                            <img src={img?.url ?? img} alt="" className="w-full h-full object-cover" />
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveExistingImage(idx)}
                                                                className="absolute top-1 right-1 bg-black/80 text-zinc-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                            >
                                                                <XIcon className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {newImageFiles.map((img) => (
                                                        <div key={img.id} className="relative aspect-square border border-yellow-500/50 bg-black group overflow-hidden">
                                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                            <span className="absolute bottom-0 left-0 right-0 text-[7px] font-mono uppercase bg-yellow-500 text-black text-center py-0.5">
                                                                New File
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveNewImageFile(img.id)}
                                                                className="absolute top-1 right-1 bg-black/80 text-zinc-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
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
                                                className="h-10 px-6 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                                            >
                                                {saving ? "Uploading & Saving..." : "Save Base Details & Images"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditingCore(false)}
                                                className="h-10 px-6 border border-zinc-800 hover:border-zinc-700 text-zinc-400 text-xs font-mono uppercase tracking-wider cursor-pointer"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* SECTION 2: PRODUCT VARIETIES / VARIANTS LIST */}
                            <div className="space-y-6">

                                <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <LayersIcon className="w-4 h-4 text-yellow-500" />
                                            <h2 className="text-lg font-black uppercase tracking-tight text-white">
                                                Product Varieties ({variants.length})
                                            </h2>
                                        </div>
                                        <p className="text-xs text-zinc-500 tracking-wide mt-0.5">
                                            Manage color options, sizes, stock inventory, and specific pricing overrides for this product.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setShowAddVariantModal(true)}
                                        className="h-9 px-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                                    >
                                        <PlusIcon className="w-3.5 h-3.5" />
                                        <span>Add Variety</span>
                                    </button>
                                </div>

                                {/* Empty state if no varieties added yet */}
                                {variants.length === 0 ? (
                                    <div className="border border-dashed border-zinc-800 bg-[#0e0e0e]/50 py-16 px-6 text-center space-y-4">
                                        <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center mx-auto text-zinc-600">
                                            <LayersIcon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                                            No Varieties Added Yet
                                        </h3>
                                        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                                            Add varieties such as different colors (e.g. Red, Black), sizes (e.g. S, M, XL), or stock levels.
                                        </p>
                                        <button
                                            onClick={() => setShowAddVariantModal(true)}
                                            className="px-5 py-2 bg-yellow-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-yellow-400 transition-all inline-flex items-center gap-2 cursor-pointer"
                                        >
                                            <PlusIcon className="w-3.5 h-3.5" />
                                            <span>Add First Variety</span>
                                        </button>
                                    </div>
                                ) : (
                                    /* Grid of Product Varieties */
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {variants.map((varItem, idx) => {
                                            let attrEntries = [];
                                            if (varItem.attributes instanceof Map) {
                                                attrEntries = Array.from(varItem.attributes.entries());
                                            } else if (typeof varItem.attributes === 'object' && varItem.attributes !== null) {
                                                attrEntries = Object.entries(varItem.attributes);
                                            }

                                            const hasExplicitPrice = Boolean(varItem.price?.amount);
                                            const varSymbol = currencySymbol[varItem.price?.currency] ?? varItem.price?.currency ?? mainSymbol;
                                            const varPriceDisplay = hasExplicitPrice
                                                ? `${varSymbol}${Number(varItem.price.amount).toLocaleString("en-IN")}`
                                                : `${mainSymbol}${mainFormattedPrice}`;

                                            const varImg = (varItem.images && varItem.images.length > 0)
                                                ? (varItem.images[0]?.url ?? varItem.images[0])
                                                : (allCurrentImages.length > 0 ? allCurrentImages[0] : null);

                                            return (
                                                <div
                                                    key={idx}
                                                    className="bg-[#0e0e0e] border border-zinc-800 hover:border-zinc-700 p-5 flex flex-col justify-between space-y-4 group transition-all"
                                                >
                                                    <div className="space-y-4">
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="w-14 h-14 bg-black border border-zinc-800 overflow-hidden flex-shrink-0">
                                                                {varImg ? (
                                                                    <img src={varImg} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                                                        <PackageIcon className="w-5 h-5" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <button
                                                                onClick={() => handleDeleteVariant(idx)}
                                                                className="text-zinc-600 hover:text-red-400 p-1 transition-colors cursor-pointer"
                                                                title="Delete Variety"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>

                                                        <div>
                                                            <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 block mb-1.5">
                                                                Variety Specifications
                                                            </span>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {attrEntries.length > 0 ? (
                                                                    attrEntries.map(([k, v], i) => (
                                                                        <span
                                                                            key={i}
                                                                            className="text-[11px] font-mono bg-black border border-zinc-800 px-2.5 py-1 text-zinc-300"
                                                                        >
                                                                            <span className="text-yellow-500 font-bold">{k}:</span> {v}
                                                                        </span>
                                                                    ))
                                                                ) : (
                                                                    <span className="text-[11px] text-zinc-500 italic">No attributes defined</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-3 border-t border-zinc-900/80 space-y-3">
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="text-[9px] uppercase font-mono text-zinc-500 block mb-0.5">Availability</span>
                                                                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 border ${Number(varItem.stock) > 0
                                                                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                                                    : "text-red-400 bg-red-500/10 border-red-500/20"
                                                                    }`}>
                                                                    {Number(varItem.stock) > 0 ? `Available (${varItem.stock})` : "Not Available (Out of Stock)"}
                                                                </span>
                                                            </div>

                                                            <div className="text-right">
                                                                <span className="text-[9px] uppercase font-mono text-zinc-500 block mb-0.5">Pricing</span>
                                                                <div className="flex items-center gap-1.5 justify-end">
                                                                    <span className="text-xs font-mono font-bold text-white">
                                                                        {varPriceDisplay}
                                                                    </span>
                                                                    {!hasExplicitPrice && (
                                                                        <span className="text-[8px] uppercase font-mono bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 px-1.5 py-0.5">
                                                                            Inherited
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Seller Quick Stock Adjuster */}
                                                        <div className="flex items-center justify-between bg-black/60 border border-zinc-800 p-2">
                                                            <span className="text-[9px] uppercase font-mono text-zinc-400">
                                                                Quick Inventory:
                                                            </span>
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuickUpdateStock(idx, Math.max(0, Number(varItem.stock || 0) - 1))}
                                                                    className="w-6 h-6 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                                                                    title="Decrease stock"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-8 text-center text-xs font-mono font-bold text-white">
                                                                    {varItem.stock || 0}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuickUpdateStock(idx, Number(varItem.stock || 0) + 1)}
                                                                    className="w-6 h-6 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-white font-mono text-xs flex items-center justify-center cursor-pointer"
                                                                    title="Increase stock"
                                                                >
                                                                    +
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleQuickUpdateStock(idx, Number(varItem.stock) > 0 ? 0 : 10)}
                                                                    className={`ml-2 text-[8px] uppercase font-mono px-2 py-1 border transition-all cursor-pointer ${Number(varItem.stock) > 0
                                                                        ? "text-red-400 border-red-500/30 hover:bg-red-500/10"
                                                                        : "text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                                                                        }`}
                                                                >
                                                                    {Number(varItem.stock) > 0 ? "Mark Out of Stock" : "Mark In Stock"}
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

                {/* ══════════════════════════════════════════════
                    ADD NEW VARIETY MODAL (WITH FILE UPLOAD UP TO 7)
                ══════════════════════════════════════════════ */}
                {showAddVariantModal && (
                    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-[#0e0e0e] border border-zinc-800 w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">

                            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 sticky top-0 bg-[#0e0e0e] z-10">
                                <div className="flex items-center gap-2">
                                    <PlusIcon className="w-4 h-4 text-yellow-500" />
                                    <h3 className="text-base font-black uppercase tracking-tight text-white">
                                        Add New Product Variety
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowAddVariantModal(false)}
                                    className="text-zinc-500 hover:text-white text-xs font-mono uppercase cursor-pointer"
                                >
                                    ✕ Close
                                </button>
                            </div>

                            <form onSubmit={handleCreateVariant} className="space-y-5">

                                {/* Fixed Product Variety Attributes Inputs */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs uppercase font-mono text-zinc-400">
                                            Variety Attributes Specification
                                        </label>
                                        <span className="text-[10px] font-mono text-zinc-500 uppercase">
                                            Fixed Product Schema
                                        </span>
                                    </div>

                                    {newVarAttributes.map((attr, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-black border border-zinc-800 p-2.5">
                                            <div className="w-1/3 bg-zinc-900 px-3 py-2 text-xs font-mono font-bold text-yellow-500 uppercase border border-zinc-800 truncate">
                                                {attr.key}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder={`Enter ${attr.key} (e.g., Navy Blue, XL)`}
                                                value={attr.value}
                                                onChange={(e) => handleAttributeChange(idx, "value", e.target.value)}
                                                className="w-2/3 bg-[#0e0e0e] border border-zinc-800 px-3 py-2 text-xs text-white focus:border-yellow-500 focus:outline-none font-mono"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Stock Quantity */}
                                <div>
                                    <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">
                                        Stock Quantity
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newVarStock}
                                        onChange={(e) => setNewVarStock(e.target.value)}
                                        className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white font-mono focus:border-yellow-500 focus:outline-none"
                                    />
                                </div>

                                {/* Optional Price Override */}
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs uppercase font-mono text-zinc-400">
                                            Variant Price (Optional)
                                        </label>
                                        <span className="text-[9px] font-mono text-yellow-500">
                                            Fallback to Base: {mainSymbol}{mainFormattedPrice}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-[1fr_auto] gap-2">
                                        <input
                                            type="number"
                                            placeholder="Leave blank to inherit base price"
                                            value={newVarPriceAmount}
                                            onChange={(e) => setNewVarPriceAmount(e.target.value)}
                                            className="w-full bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white font-mono focus:border-yellow-500 focus:outline-none"
                                        />
                                        <select
                                            value={newVarPriceCurrency}
                                            onChange={(e) => setNewVarPriceCurrency(e.target.value)}
                                            className="bg-black border border-zinc-800 px-3 py-2.5 text-xs text-white font-mono focus:border-yellow-500 focus:outline-none"
                                        >
                                            <option value="INR">INR (₹)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="JPY">JPY (¥)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Variety Image Files Upload (Up to 7) */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs uppercase font-mono text-zinc-400">
                                            Variety Image Files (Up to 7)
                                        </label>
                                        <span className="text-[10px] font-mono text-zinc-500">
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
                                        className="border border-dashed border-zinc-800 hover:border-yellow-500/50 bg-black/50 p-4 text-center cursor-pointer transition-all rounded-sm flex flex-col items-center justify-center space-y-1"
                                    >
                                        <input
                                            ref={variantFileInputRef}
                                            type="file"
                                            multiple
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={(e) => handleAddVariantImageFiles(e.target.files)}
                                            className="hidden"
                                        />
                                        <UploadIcon className="w-5 h-5 text-zinc-500" />
                                        <p className="text-xs text-zinc-300 font-medium">Click or Drag &amp; Drop Variety Image Files</p>
                                        <p className="text-[9px] font-mono text-zinc-600 uppercase">Select up to 7 images</p>
                                    </div>

                                    {newVarImageFiles.length > 0 && (
                                        <div className="grid grid-cols-5 gap-2 pt-1">
                                            {newVarImageFiles.map(img => (
                                                <div key={img.id} className="relative aspect-square border border-yellow-500/40 bg-black group overflow-hidden">
                                                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveVariantImageFile(img.id)}
                                                        className="absolute top-1 right-1 bg-black/80 text-zinc-400 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                    >
                                                        <XIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddVariantModal(false)}
                                        className="px-4 py-2 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono uppercase cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {saving ? "Saving Variety..." : "Save Variety"}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

            </main>
        </>
    );
}
