import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useSelector } from "react-redux";

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

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function ArrowLeftIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

function UploadIcon({ className = "w-6 h-6" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
  );
}

function LayersIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M6.429 9.75L2.25 12l10.5 5.25L21.75 12l-4.179-2.25M2.25 12l10.5 5.25L21.75 12M2.25 6.75L12 12l9.75-5.25L12 1.5 2.25 6.75z" />
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

function XIcon({ className = "w-3.5 h-3.5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ─── Image Upload Component ───────────────────────────────────────────────────
function ImageUpload({ images, onImagesChange, availableColors = [] }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const processFiles = (files) => {
    setUploadError(null);
    const fileList = Array.from(files);
    const validMimes = ["image/png", "image/jpeg", "image/webp", "image/jpg"];

    const validFiles = [];
    for (const f of fileList) {
      if (!validMimes.includes(f.type)) {
        setUploadError(`Unsupported format for "${f.name}". Only PNG, JPG, and WEBP are supported.`);
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setUploadError(`File "${f.name}" is larger than 5MB limit.`);
        return;
      }
      validFiles.push(f);
    }

    if (validFiles.length === 0) return;

    onImagesChange((prev) => {
      const willBeFirst = prev.length === 0;
      const newImages = validFiles.map((file, idx) => ({
        id: Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
        url: URL.createObjectURL(file),
        file,
        color: "",
        isCover: willBeFirst && idx === 0,
      }));
      return [...prev, ...newImages];
    });
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (id) => {
    onImagesChange((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.url) URL.revokeObjectURL(target.url);
      const remaining = prev.filter((img) => img.id !== id);
      if (target?.isCover && remaining.length > 0) {
        remaining[0].isCover = true;
      }
      return remaining;
    });
  };

  const setCoverImage = (id) => {
    onImagesChange((prev) =>
      prev.map((img) => ({
        ...img,
        isCover: img.id === id,
      }))
    );
  };

  const setImageColor = (id, colorVal) => {
    onImagesChange((prev) =>
      prev.map((img) => (img.id === id ? { ...img, color: colorVal } : img))
    );
  };

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-2.5 cursor-pointer transition-all duration-300 ${
          isDragging
            ? "border-black bg-zinc-100 scale-[1.01]"
            : "border-zinc-300 hover:border-black bg-zinc-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id="images"
          name="images"
          multiple
          accept="image/png,image/jpeg,image/webp,image/jpg"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="w-12 h-12 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-600 shadow-2xs">
          <UploadIcon className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-xs sm:text-sm font-bold text-zinc-900">
            Upload product photos
          </p>
          <p className="text-[10px] text-zinc-500 mt-0.5 tracking-wider uppercase font-mono-code">
            Drag and drop or click to browse (PNG, JPG, WEBP up to 5MB)
          </p>
        </div>
      </div>

      {uploadError && (
        <div className="border border-rose-200 bg-rose-50 p-3 rounded-xl text-rose-700 text-xs font-mono-code flex items-center justify-between">
          <span>{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="text-rose-700 hover:text-black">
            ✕
          </button>
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-zinc-500 font-semibold">
              {images.length} photo{images.length !== 1 ? "s" : ""} selected
            </span>
            <span className="text-[10px] font-mono-code text-zinc-400">
              Select cover photo and assign colorways
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={`group relative bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-2xs ${
                  img.isCover ? "border-black ring-2 ring-zinc-300 ring-offset-1" : "border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] overflow-hidden bg-[#f4f4f5] relative">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Cover badge / selector */}
                  {img.isCover ? (
                    <span className="absolute top-2 left-2 text-[8px] font-mono-code tracking-wider uppercase bg-black text-white px-2 py-0.5 rounded-full font-bold shadow-xs">
                      ★ COVER
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCoverImage(img.id);
                      }}
                      className="absolute top-2 left-2 text-[8px] font-mono-code tracking-wider uppercase bg-white/90 hover:bg-black hover:text-white text-zinc-700 px-2 py-0.5 rounded-full border border-zinc-200 transition-colors shadow-xs cursor-pointer"
                    >
                      Set Cover
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(img.id);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:text-rose-600 transition-colors cursor-pointer shadow-xs"
                    title="Remove image"
                  >
                    <XIcon className="w-3 h-3" />
                  </button>

                  {/* Color tag on image */}
                  {img.color && (
                    <span className="absolute bottom-2 left-2 text-[8px] font-mono-code uppercase tracking-wider bg-black/80 text-white px-2 py-0.5 rounded-full backdrop-blur-xs">
                      {img.color}
                    </span>
                  )}
                </div>

                {/* Details & Color Assignment Dropdown */}
                <div className="p-2.5 space-y-2 border-t border-zinc-100">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono-code">
                    <span className="truncate max-w-[120px]" title={img.name}>
                      {img.name}
                    </span>
                    <span>{img.size} MB</span>
                  </div>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[9px] font-mono-code uppercase text-zinc-400">
                      Color:
                    </span>
                    <select
                      value={img.color || ""}
                      onChange={(e) => setImageColor(img.id, e.target.value)}
                      className="flex-1 bg-zinc-50 border border-zinc-200 text-[10px] font-mono-code text-zinc-800 py-1 px-1.5 rounded-lg focus:border-black outline-none cursor-pointer"
                    >
                      <option value="">All Colors</option>
                      {availableColors.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Create Product Component ─────────────────────────────────────────────
export default function CreateProduct() {
  const navigate = useNavigate();
  const { handleProductCreation } = useProduct();
  const reduxLoading = useSelector((state) => state.product.loading);

  const [images, setImages] = useState([]);
  const [attributeKeys, setAttributeKeys] = useState(["Color", "Size"]);
  const [initialVariants, setInitialVariants] = useState([
    { attributes: { Color: "Black", Size: "M" }, stock: 12 },
    { attributes: { Color: "Black", Size: "L" }, stock: 8 },
    { attributes: { Color: "Olive", Size: "M" }, stock: 15 },
    { attributes: { Color: "Olive", Size: "L" }, stock: 10 },
  ]);
  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "shirt",
    gender: "mens",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Available colors extracted from variants
  const availableColors = useMemo(() => {
    const colors = new Set();
    initialVariants.forEach((v) => {
      const col = v.attributes?.Color || v.attributes?.color || v.attributes?.Colour;
      if (col && String(col).trim()) {
        colors.add(String(col).trim());
      }
    });
    return Array.from(colors);
  }, [initialVariants]);

  // Attribute keys handlers
  const handleAddAttributeKey = () => {
    const newKey = `Attr${attributeKeys.length + 1}`;
    setAttributeKeys([...attributeKeys, newKey]);
    setInitialVariants((prev) =>
      prev.map((v) => ({
        ...v,
        attributes: { ...v.attributes, [newKey]: "" },
      }))
    );
  };

  const handleRemoveAttributeKey = (index) => {
    const keyToRemove = attributeKeys[index];
    const updatedKeys = attributeKeys.filter((_, i) => i !== index);
    setAttributeKeys(updatedKeys);
    setInitialVariants((prev) =>
      prev.map((v) => {
        const nextAttrs = { ...v.attributes };
        delete nextAttrs[keyToRemove];
        return { ...v, attributes: nextAttrs };
      })
    );
  };

  const handleAttributeKeyChange = (index, newKeyVal) => {
    const oldKey = attributeKeys[index];
    const updatedKeys = [...attributeKeys];
    updatedKeys[index] = newKeyVal;
    setAttributeKeys(updatedKeys);

    if (newKeyVal.trim() && newKeyVal !== oldKey) {
      setInitialVariants((prev) =>
        prev.map((v) => {
          const nextAttrs = { ...v.attributes };
          const existingVal = nextAttrs[oldKey] || "";
          delete nextAttrs[oldKey];
          nextAttrs[newKeyVal.trim()] = existingVal;
          return { ...v, attributes: nextAttrs };
        })
      );
    }
  };

  // Variants handlers
  const handleAddInitialVariant = () => {
    const defaultAttrs = {};
    attributeKeys.forEach((k) => {
      if (k.trim()) defaultAttrs[k.trim()] = "";
    });
    setInitialVariants([...initialVariants, { attributes: defaultAttrs, stock: 10 }]);
  };

  const handleRemoveInitialVariant = (idx) => {
    if (initialVariants.length <= 1) return;
    setInitialVariants(initialVariants.filter((_, i) => i !== idx));
  };

  const handleVariantAttrChange = (variantIdx, attrKey, val) => {
    const updated = [...initialVariants];
    updated[variantIdx] = {
      ...updated[variantIdx],
      attributes: {
        ...updated[variantIdx].attributes,
        [attrKey]: val,
      },
    };
    setInitialVariants(updated);
  };

  const handleVariantStockChange = (variantIdx, stockVal) => {
    const updated = [...initialVariants];
    const parsed = stockVal === "" ? 0 : Math.max(0, parseInt(stockVal, 10) || 0);
    updated[variantIdx] = {
      ...updated[variantIdx],
      stock: parsed,
    };
    setInitialVariants(updated);
  };

  // Generate Matrix
  const handleGenerateAllCombinations = () => {
    const valuesByKey = {};
    attributeKeys.forEach((k) => {
      const keyName = k.trim();
      if (!keyName) return;
      const uniqueVals = new Set();
      initialVariants.forEach((v) => {
        const val = v.attributes?.[keyName];
        if (val && String(val).trim()) {
          uniqueVals.add(String(val).trim());
        }
      });
      valuesByKey[keyName] = Array.from(uniqueVals);
    });

    const validKeyNames = Object.keys(valuesByKey).filter((k) => valuesByKey[k].length > 0);
    if (validKeyNames.length === 0) {
      alert("Please enter at least one value for your attribute keys first.");
      return;
    }

    const combinations = validKeyNames.reduce((acc, key) => {
      const vals = valuesByKey[key];
      if (acc.length === 0) {
        return vals.map((v) => ({ [key]: v }));
      }
      const next = [];
      acc.forEach((combo) => {
        vals.forEach((v) => {
          next.push({ ...combo, [key]: v });
        });
      });
      return next;
    }, []);

    if (combinations.length > 0) {
      const newVariants = combinations.map((combo) => {
        const existing = initialVariants.find((v) =>
          Object.entries(combo).every(([k, val]) => v.attributes?.[k] === val)
        );
        return {
          attributes: combo,
          stock: existing !== undefined ? existing.stock : 10,
        };
      });
      setInitialVariants(newVariants);
    }
  };

  // Duplicate combination check
  const duplicateIndices = useMemo(() => {
    const duplicates = new Set();
    const map = new Map();

    initialVariants.forEach((v, idx) => {
      const comboKey = Object.entries(v.attributes || {})
        .filter(([k, val]) => k.trim() && val !== undefined && val !== null && String(val).trim())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, val]) => `${k.toLowerCase().trim()}:${String(val).toLowerCase().trim()}`)
        .join("|");

      if (!comboKey) return;

      if (map.has(comboKey)) {
        duplicates.add(idx);
        duplicates.add(map.get(comboKey));
      } else {
        map.set(comboKey, idx);
      }
    });

    return duplicates;
  }, [initialVariants]);

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);
    setValidationErrors({});

    const errors = {};
    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errors.title = "Product title must be at least 3 characters long";
    }
    if (!formData.description.trim() || formData.description.trim().length < 5) {
      errors.description = "Product description must be at least 5 characters long";
    }
    if (!formData.priceAmount || Number(formData.priceAmount) < 0) {
      errors.priceAmount = "Please enter a valid price (greater than or equal to 0)";
    }
    if (images.length === 0) {
      errors.images = "At least one product image is required";
    }

    // Validate variants
    const validKeys = attributeKeys.map((k) => k.trim()).filter(Boolean);
    if (initialVariants.length > 0 && validKeys.length > 0) {
      for (let i = 0; i < initialVariants.length; i++) {
        const v = initialVariants[i];
        for (const k of validKeys) {
          if (!v.attributes?.[k] || !String(v.attributes[k]).trim()) {
            errors.variants = `Please fill in all attribute values for Variety #${i + 1} (${k} is empty)`;
            break;
          }
        }
        if (errors.variants) break;
        if (Number(v.stock) < 0 || !Number.isInteger(Number(v.stock))) {
          errors.variants = `Variety #${i + 1} stock must be a non-negative integer`;
          break;
        }
      }
    }

    if (duplicateIndices.size > 0) {
      errors.variants = "Duplicate variant combinations detected.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      if (errors.images) setApiError(errors.images);
      else if (errors.variants) setApiError(errors.variants);
      else setApiError("Please correct the form fields before publishing.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("description", formData.description.trim());
    data.append("category", formData.category);
    data.append("gender", formData.gender);
    data.append("priceAmount", formData.priceAmount);
    data.append("priceCurrency", formData.priceCurrency);
    data.append("attributeKeys", JSON.stringify(validKeys));

    const cleanVariants = initialVariants.map((v) => ({
      attributes: v.attributes,
      stock: Math.max(0, parseInt(v.stock, 10) || 0),
    }));
    data.append("variants", JSON.stringify(cleanVariants));

    images.forEach((img) => {
      data.append("images", img.file);
    });

    const imageMetadata = images.map((img, idx) => ({
      name: img.name,
      color: img.color || "",
      isCover: Boolean(img.isCover || (idx === 0 && !images.some((i) => i.isCover))),
    }));
    data.append("imageMetadata", JSON.stringify(imageMetadata));

    setIsSubmitting(true);

    try {
      await handleProductCreation(data);
      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Product creation error:", error);
      const errMsg =
        error.response?.data?.message ||
        (error.response?.data?.errors ? error.response.data.errors[0]?.msg : null) ||
        "Failed to create product. Please check the form and try again.";
      setApiError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isButtonLoading = reduxLoading || isSubmitting;

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
              <span>Back to Seller Studio</span>
            </Link>

            <div className="flex items-center gap-2 text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-[11px] uppercase tracking-wider">
                Product Publishing Studio
              </span>
            </div>
          </div>
        </div>

        {/* ─── Main Form Container ───────────────────────────────────── */}
        <div className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 pb-12 fade-in-entry space-y-8">

          {/* Header */}
          <div className="border-b border-zinc-200 pb-6">
            <div className="flex items-center gap-2 text-[11px] font-mono-code uppercase tracking-widest text-zinc-500 mb-1">
              <span>Seller Studio</span>
              <span>/</span>
              <span className="text-black font-bold">New Drop</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950">
              Create New Product
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-normal">
              List next-generation apparel with custom varieties, stock matrix, and high-res imagery.
            </p>
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono-code flex items-start justify-between gap-3 shadow-xs">
              <div>
                <p className="font-bold uppercase tracking-wider mb-0.5">Publishing Error</p>
                <p className="text-rose-700">{apiError}</p>
              </div>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="text-rose-700 hover:text-black text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-8">

            {/* ── SECTION 1: Basic Information ── */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span className="text-xs font-mono-code uppercase font-bold text-zinc-950">
                  01 / Basic Information
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                  Product Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Vintage Oversized Heavyweight Boxy Tee"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                />
                {validationErrors.title && (
                  <p className="mt-1 text-[11px] text-rose-600 font-mono-code">{validationErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                  Product Description *
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe fabric composition, fit guidelines, washing instructions, and styling tips..."
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-black focus:outline-none transition-all resize-none"
                />
                {validationErrors.description && (
                  <p className="mt-1 text-[11px] text-rose-600 font-mono-code">{validationErrors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono-code focus:bg-white focus:border-black focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="shirt">Outerwear & Shirts</option>
                    <option value="trouser">Tailored Trousers</option>
                    <option value="tshirt">Heavyweight Knitwear</option>
                    <option value="jeans">Denim Archive</option>
                    <option value="cargo">Cargo Craft</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                    Department / Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono-code focus:bg-white focus:border-black focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="mens">Men's Collection</option>
                    <option value="girls">Women's Collection</option>
                    <option value="unisex">Unisex Atelier</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── SECTION 2: Pricing ── */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span className="text-xs font-mono-code uppercase font-bold text-zinc-950">
                  02 / Base Pricing
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                    Listing Price Amount *
                  </label>
                  <input
                    type="number"
                    name="priceAmount"
                    min="0"
                    value={formData.priceAmount}
                    onChange={handleChange}
                    placeholder="e.g. 1190"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono-code placeholder:text-zinc-400 focus:bg-white focus:border-black focus:outline-none transition-all"
                  />
                  {validationErrors.priceAmount && (
                    <p className="mt-1 text-[11px] text-rose-600 font-mono-code">{validationErrors.priceAmount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono-code text-zinc-600 mb-1.5 font-semibold">
                    Currency
                  </label>
                  <select
                    name="priceCurrency"
                    value={formData.priceCurrency}
                    onChange={handleChange}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-900 font-mono-code focus:bg-white focus:border-black focus:outline-none transition-all cursor-pointer"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="JPY">JPY (¥)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ── SECTION 3: Attribute Schema ── */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code uppercase font-bold text-zinc-950">
                    03 / Attribute Schema
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleAddAttributeKey}
                  className="inline-flex items-center gap-1.5 text-xs font-mono-code uppercase tracking-wider text-black hover:underline font-bold cursor-pointer"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Add Key</span>
                </button>
              </div>

              <p className="text-xs text-zinc-500 font-normal">
                Define the variety parameters (e.g. Color, Size). Each combination will create a separate variety.
              </p>

              <div className="flex flex-wrap gap-2.5 pt-1">
                {attributeKeys.map((keyVal, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 rounded-full px-3 py-1 shadow-2xs"
                  >
                    <input
                      type="text"
                      value={keyVal}
                      onChange={(e) => handleAttributeKeyChange(idx, e.target.value)}
                      className="bg-transparent text-xs font-mono-code font-bold text-zinc-900 outline-none w-20"
                    />
                    {attributeKeys.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttributeKey(idx)}
                        className="text-zinc-400 hover:text-rose-600 cursor-pointer p-0.5"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECTION 4: Varieties & Stock Matrix ── */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <LayersIcon className="w-4 h-4 text-zinc-800" />
                  <span className="text-xs font-mono-code uppercase font-bold text-zinc-950">
                    04 / Varieties Matrix ({initialVariants.length})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleGenerateAllCombinations}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-zinc-300 hover:border-black rounded-full text-xs font-mono-code uppercase tracking-wider text-zinc-700 hover:text-black cursor-pointer transition-colors"
                  >
                    <SparklesIcon className="w-3.5 h-3.5" />
                    <span>Generate Matrix</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddInitialVariant}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black hover:bg-zinc-800 text-white rounded-full text-xs font-mono-code uppercase tracking-wider font-bold cursor-pointer transition-colors"
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                    <span>Add Variant</span>
                  </button>
                </div>
              </div>

              {validationErrors.variants && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-mono-code">
                  {validationErrors.variants}
                </div>
              )}

              {/* Variant Rows */}
              <div className="space-y-3 pt-1">
                {initialVariants.map((varItem, vIdx) => {
                  const isDuplicate = duplicateIndices.has(vIdx);
                  const stockVal = Number(varItem.stock);

                  return (
                    <div
                      key={vIdx}
                      className={`p-4 rounded-2xl border transition-all space-y-3 ${ "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono-code font-bold uppercase text-zinc-900">
                            Variety #{vIdx + 1}
                          </span>
                          
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`text-[10px] font-mono-code font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                              stockVal > 0
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                : "text-rose-700 bg-rose-50 border-rose-200"
                            }`}
                          >
                            {stockVal > 0 ? `In Stock (${stockVal})` : "Out of Stock"}
                          </span>

                          {initialVariants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveInitialVariant(vIdx)}
                              className="text-zinc-400 hover:text-rose-600 p-1 cursor-pointer"
                              title="Delete variant"
                            >
                              <XIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Attribute Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {attributeKeys.map((attrKey, kIdx) => {
                          const keyName = attrKey.trim();
                          if (!keyName) return null;
                          return (
                            <div
                              key={kIdx}
                              className="flex items-center gap-2 bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs"
                            >
                              <span className="text-[10px] font-mono-code text-zinc-500 font-bold uppercase w-14 truncate">
                                {keyName}:
                              </span>
                              <input
                                type="text"
                                placeholder={`e.g. ${
                                  keyName.toLowerCase() === "color"
                                    ? "Black"
                                    : keyName.toLowerCase() === "size"
                                    ? "M"
                                    : "Value"
                                }`}
                                value={varItem.attributes[keyName] || ""}
                                onChange={(e) =>
                                  handleVariantAttrChange(vIdx, keyName, e.target.value)
                                }
                                className="w-full bg-transparent text-xs text-zinc-900 focus:outline-none font-mono-code"
                              />
                            </div>
                          );
                        })}

                        {/* Stock Input */}
                        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-zinc-200 shadow-2xs">
                          <span className="text-[10px] font-mono-code text-zinc-500 font-bold uppercase w-14">
                            Stock:
                          </span>
                          <input
                            type="number"
                            min="0"
                            value={varItem.stock}
                            onChange={(e) => handleVariantStockChange(vIdx, e.target.value)}
                            className="w-full bg-transparent text-xs text-zinc-900 font-mono-code focus:outline-none text-right pr-1"
                          />
                          <span className="text-[10px] font-mono-code text-zinc-400">pcs</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── SECTION 5: Product Imagery ── */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs">
              <div className="flex items-center gap-2 border-b border-zinc-100 pb-3">
                <span className="text-xs font-mono-code uppercase font-bold text-zinc-950">
                  05 / Product Photography *
                </span>
              </div>

              <ImageUpload
                images={images}
                onImagesChange={setImages}
                availableColors={availableColors}
              />
              {validationErrors.images && (
                <p className="text-[11px] text-rose-600 font-mono-code">{validationErrors.images}</p>
              )}
            </div>

            {/* ── ACTION BUTTON ── */}
            <div className="pt-2 space-y-4">
              <button
                type="submit"
                disabled={isButtonLoading}
                className="w-full py-4 bg-black hover:bg-zinc-800 active:scale-[0.99] text-white font-extrabold text-xs uppercase tracking-widest rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 font-mono-code cursor-pointer disabled:opacity-50"
              >
                {isButtonLoading ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    <span>Publishing Product...</span>
                  </span>
                ) : (
                  <span>Create &amp; Publish Product Drop →</span>
                )}
              </button>

              <div className="text-center">
                <Link
                  to="/seller/dashboard"
                  className="text-xs font-mono-code uppercase tracking-wider text-zinc-500 hover:text-black font-semibold"
                >
                  Cancel &amp; Return to Dashboard
                </Link>
              </div>
            </div>

          </form>

        </div>

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
