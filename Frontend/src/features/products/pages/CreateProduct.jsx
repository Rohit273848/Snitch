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
      "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const icons = {
  tag: (
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 7h.01M7 3h5a1.99 1.99 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
  ),
  text: (
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M4 6h16M4 12h16M4 18h7" />
  ),
  currency: (
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  arrow: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
  ),
  x: (
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  ),
  upload: (
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  ),
  layers: (
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M6.429 9.75L2.25 12l10.5 5.25L21.75 12l-4.179-2.25M2.25 12l10.5 5.25L21.75 12M2.25 6.75L12 12l9.75-5.25L12 1.5 2.25 6.75z" />
  ),
  sparkles: (
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  ),
  star: (
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
  ),
};

function Icon({ name, className = "w-4 h-4", strokeWidth = "1.5" }) {
  return (
    <svg className={className} fill="none" stroke="currentColor"
      strokeWidth={strokeWidth} viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg"
      fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

// ─── Reusable Input Field ─────────────────────────────────────────────────────
function InputField({
  id, name, label, type = "text", icon, value, onChange,
  onFocus, onBlur, placeholder, error, focused, autoFocus,
}) {
  const isActive = focused === name;
  return (
    <div className="group">
      <label htmlFor={id}
        className={`block text-[10px] font-medium tracking-[0.15em] uppercase mb-3 transition-colors duration-200 ${isActive ? "text-yellow-500" : error ? "text-red-400" : "text-zinc-500"}`}>
        {label}
      </label>
      <div className="relative">
        <span className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isActive ? "text-yellow-500" : "text-zinc-600"}`}>
          <Icon name={icon} className="w-[15px] h-[15px]" />
        </span>
        <input
          id={id}
          name={name}
          type={type}
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full h-12 pl-6 pr-0 bg-transparent text-white text-sm placeholder-zinc-700 outline-none border-b transition-all duration-300 ${error
            ? "border-red-500/60"
            : isActive
              ? "border-yellow-500"
              : "border-zinc-800 hover:border-zinc-600"
            }`}
        />
      </div>
      <div className={`h-px bg-yellow-500 transition-all duration-300 origin-left ${isActive && !error ? "scale-x-100" : "scale-x-0"}`} />
      {error && (
        <p className="mt-2 text-[11px] text-red-400 tracking-wide flex items-center gap-1.5"
          style={{ animation: "slideDown 0.15s ease-out" }}>
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Textarea Field ───────────────────────────────────────────────────────────
function TextareaField({
  id, name, label, icon, value, onChange,
  onFocus, onBlur, placeholder, error, focused,
}) {
  const isActive = focused === name;
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-3">
        <label htmlFor={id}
          className={`block text-[10px] font-medium tracking-[0.15em] uppercase transition-colors duration-200 ${isActive ? "text-yellow-500" : error ? "text-red-400" : "text-zinc-500"}`}>
          {label}
        </label>
        <span className="font-mono text-[9px] text-zinc-700 tracking-widest">
          {value.length} / 500
        </span>
      </div>
      <div className="relative">
        <span className={`absolute left-0 top-4 transition-colors duration-200 ${isActive ? "text-yellow-500" : "text-zinc-600"}`}>
          <Icon name={icon} className="w-[15px] h-[15px]" />
        </span>
        <textarea
          id={id}
          name={name}
          rows={4}
          maxLength={500}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full pl-6 pr-0 pt-3 pb-2 bg-transparent text-white text-sm placeholder-zinc-700 outline-none border-b resize-none transition-all duration-300 ${error
            ? "border-red-500/60"
            : isActive
              ? "border-yellow-500"
              : "border-zinc-800 hover:border-zinc-600"
            }`}
        />
      </div>
      <div className={`h-px bg-yellow-500 transition-all duration-300 origin-left ${isActive && !error ? "scale-x-100" : "scale-x-0"}`} />
      {error && (
        <p className="mt-2 text-[11px] text-red-400 tracking-wide flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Select Field ─────────────────────────────────────────────────────────────
function SelectField({
  id, name, label, icon, value, onChange,
  onFocus, onBlur, error, focused, children,
}) {
  const isActive = focused === name;
  return (
    <div className="group">
      <label htmlFor={id}
        className={`block text-[10px] font-medium tracking-[0.15em] uppercase mb-3 transition-colors duration-200 ${isActive ? "text-yellow-500" : error ? "text-red-400" : "text-zinc-500"}`}>
        {label}
      </label>
      <div className="relative">
        <span className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isActive ? "text-yellow-500" : "text-zinc-600"}`}>
          <Icon name={icon} className="w-[15px] h-[15px]" />
        </span>
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full h-12 pl-6 pr-4 bg-transparent text-white text-sm outline-none border-b transition-all duration-300 appearance-none cursor-pointer ${error
            ? "border-red-500/60"
            : isActive
              ? "border-yellow-500"
              : "border-zinc-800 hover:border-zinc-600"
            }`}
          style={{ colorScheme: "dark" }}
        >
          {children}
        </select>
        <svg className={`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 w-3.5 h-3.5 transition-colors duration-200 ${isActive ? "text-yellow-500" : "text-zinc-600"}`}
          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      <div className={`h-px bg-yellow-500 transition-all duration-300 origin-left ${isActive && !error ? "scale-x-100" : "scale-x-0"}`} />
      {error && (
        <p className="mt-2 text-[11px] text-red-400 tracking-wide flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-red-400 inline-block flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Image Upload Area ────────────────────────────────────────────────────────
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
        setUploadError(`File "${f.name}" is larger than the 5MB size limit.`);
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
        color: "", // General or assigned to color
        isCover: willBeFirst && idx === 0, // First uploaded image becomes cover by default
      }));
      return [...prev, ...newImages];
    });
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = ""; // Reset file input
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
      const target = prev.find(i => i.id === id);
      if (target?.url) {
        URL.revokeObjectURL(target.url);
      }
      const remaining = prev.filter((img) => img.id !== id);
      // If the removed image was cover, make the first remaining image cover
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
      prev.map((img) =>
        img.id === id ? { ...img, color: colorVal } : img
      )
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
        className={`relative border border-dashed rounded-sm p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 ${isDragging
          ? "border-yellow-500 bg-yellow-500/5 scale-[1.01]"
          : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/30"
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

        {/* Upload icon */}
        <div className={`p-3 border rounded-sm transition-all duration-300 ${isDragging ? "border-yellow-500/40 text-yellow-500" : "border-zinc-800 text-zinc-600"}`}>
          <Icon name="upload" className="w-6 h-6" />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-zinc-300">
            Upload product images
          </p>
          <p className="text-[11px] text-zinc-600 mt-1 tracking-widest uppercase font-mono">
            PNG, JPG or WEBP (Max 5MB each)
          </p>
        </div>

        <p className="text-[10px] text-zinc-700 tracking-[0.15em] uppercase font-mono">
          Drag &amp; drop or click to browse
        </p>
      </div>

      {uploadError && (
        <div className="border border-red-500/30 bg-red-500/10 p-3 text-red-400 text-xs font-mono flex items-center justify-between">
          <span>{uploadError}</span>
          <button type="button" onClick={() => setUploadError(null)} className="text-red-400 hover:text-white ml-2">✕</button>
        </div>
      )}

      {/* Image previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-900" />
            <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-500 font-mono">
              {images.length} image{images.length !== 1 ? "s" : ""} selected • Select cover image &amp; assign colors
            </span>
            <div className="h-px flex-1 bg-zinc-900" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className={`group relative border transition-all duration-200 bg-[#0e0e0e] ${
                  img.isCover ? "border-yellow-500 ring-1 ring-yellow-500/30" : "border-zinc-900 hover:border-zinc-700"
                }`}
              >
                {/* Thumbnail */}
                <div className="aspect-[4/3] overflow-hidden bg-zinc-900 relative">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Cover badge / selector */}
                  {img.isCover ? (
                    <span className="absolute top-2 left-2 text-[8px] font-mono tracking-[0.15em] uppercase bg-yellow-500 text-black px-2 py-0.5 font-bold flex items-center gap-1 shadow-md">
                      ★ COVER IMAGE
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setCoverImage(img.id); }}
                      className="absolute top-2 left-2 text-[8px] font-mono tracking-[0.15em] uppercase bg-black/80 hover:bg-yellow-500 hover:text-black text-zinc-400 px-2 py-0.5 border border-zinc-700 transition-colors opacity-90 group-hover:opacity-100 cursor-pointer"
                    >
                      Set as Cover
                    </button>
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/80 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-400/50 transition-colors duration-150 cursor-pointer"
                    title="Remove image"
                  >
                    <Icon name="x" className="w-3 h-3" strokeWidth="2.5" />
                  </button>

                  {/* Color tag preview on top of image if assigned */}
                  {img.color && (
                    <span className="absolute bottom-2 left-2 text-[8px] font-mono tracking-widest uppercase bg-black/80 text-yellow-400 border border-zinc-800 px-2 py-0.5">
                      Color: {img.color}
                    </span>
                  )}
                </div>

                {/* Details & Color Assignment Dropdown */}
                <div className="p-2.5 border-t border-zinc-900 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                    <span className="truncate max-w-[140px]" title={img.name}>{img.name}</span>
                    <span>{img.size} MB</span>
                  </div>

                  {/* Color Assignment Selector */}
                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-900/60">
                    <span className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider">
                      Assign:
                    </span>
                    <select
                      value={img.color || ""}
                      onChange={(e) => setImageColor(img.id, e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 text-[9px] font-mono text-zinc-300 py-1 px-1 focus:border-yellow-500 outline-none cursor-pointer"
                      style={{ colorScheme: "dark" }}
                    >
                      <option value="">General (All Colors)</option>
                      {availableColors.map((col) => (
                        <option key={col} value={col}>
                          {col} Variant
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

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ index, label }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="h-px w-8 bg-yellow-500" />
      <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500 font-mono">
        {index} / {label}
      </span>
    </div>
  );
}

// ─── Create Product Page ──────────────────────────────────────────────────────
export default function CreateProduct() {
  const [mounted, setMounted] = useState(false);
  const [focused, setFocused] = useState(null);
  const [images, setImages] = useState([]);
  const [attributeKeys, setAttributeKeys] = useState(["Color", "Size"]);
  const [initialVariants, setInitialVariants] = useState([
    { attributes: { Color: "Red", Size: "S" }, stock: 10 },
    { attributes: { Color: "Red", Size: "M" }, stock: 0 },
    { attributes: { Color: "Red", Size: "L" }, stock: 15 },
    { attributes: { Color: "Blue", Size: "S" }, stock: 10 }
  ]);
  const [apiError, setApiError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { handleProductCreation } = useProduct();
  const reduxLoading = useSelector((state) => state.product.loading);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // UI form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
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

  const field = (name) => ({
    name,
    id: name,
    value: formData[name],
    onChange: handleChange,
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
    focused,
    error: validationErrors[name],
  });

  // Extract unique colors defined across variants for image assignment
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
    // Initialize key in all variants
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
    // Clean key from all variants
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

    // Update key in all variants preserving values
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
    // Keep as non-negative integer or empty string during typing
    const parsed = stockVal === "" ? 0 : Math.max(0, parseInt(stockVal, 10) || 0);
    updated[variantIdx] = {
      ...updated[variantIdx],
      stock: parsed,
    };
    setInitialVariants(updated);
  };

  // Helper to generate combinations matrix if seller explicitly clicks
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
      alert("Please enter at least one value for your attribute keys first (e.g. Color: Red, Size: S).");
      return;
    }

    // Cartesian product
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
        // Retain existing stock if already matched
        const existing = initialVariants.find((v) => {
          return Object.entries(combo).every(([k, val]) => v.attributes?.[k] === val);
        });
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
      errors.variants = "Duplicate variant combinations detected. Each variant must have a unique combination of attributes.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      if (errors.images) setApiError(errors.images);
      else if (errors.variants) setApiError(errors.variants);
      else setApiError("Please correct the errors in the form before submitting.");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title.trim());
    data.append("description", formData.description.trim());
    data.append("priceAmount", formData.priceAmount);
    data.append("priceCurrency", formData.priceCurrency);
    data.append("attributeKeys", JSON.stringify(validKeys));

    // Clean variants for submission
    const cleanVariants = initialVariants.map((v) => ({
      attributes: v.attributes,
      stock: Math.max(0, parseInt(v.stock, 10) || 0),
    }));
    data.append("variants", JSON.stringify(cleanVariants));

    // Append image files
    images.forEach((img) => {
      data.append("images", img.file);
    });

    // Append image metadata for color assignment and cover image
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
        *, *::before, *::after { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }

        @keyframes panelIn {
          from { opacity: 0; transform: translateX(-32px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes formIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes marquee {
          from { transform: translateY(0); }
          to   { transform: translateY(-50%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.06; }
          50%       { opacity: 0.12; }
        }

        .marquee-track { animation: marquee 22s linear infinite; }
        .s-glow        { animation: pulse-glow 5s ease-in-out infinite; }
        .panel-in      { animation: panelIn 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .form-in       { animation: formIn 0.65s cubic-bezier(0.22,1,0.36,1) 0.15s both; }

        select option { background-color: #0e0e0e; color: #fff; }
      `}</style>

      <main
        className="min-h-screen w-full flex bg-[#0a0a0a] selection:bg-yellow-500 selection:text-black overflow-hidden"
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        {/* ══════════════════════════════════════════════
            LEFT PANEL — editorial brand story
        ══════════════════════════════════════════════ */}
        <div className={`hidden lg:flex flex-col relative w-[40%] xl:w-[38%] min-h-screen bg-[#0a0a0a] border-r border-zinc-900 overflow-hidden ${mounted ? "panel-in" : "opacity-0"}`}>
          {/* Giant watermark 'S' */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span
              className="s-glow text-[28vw] font-black text-white leading-none tracking-tighter"
              style={{ opacity: 0.06 }}
            >
              S
            </span>
          </div>

          {/* Scrolling marquee */}
          <div className="absolute left-6 top-0 bottom-0 w-5 overflow-hidden pointer-events-none select-none opacity-[0.07]">
            <div className="marquee-track flex flex-col gap-8">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="text-[9px] tracking-[0.4em] uppercase text-white font-mono"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  SNITCH — WEAR THE FUTURE —
                </span>
              ))}
            </div>
          </div>

          {/* Decorative corner lines */}
          <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-zinc-800 pointer-events-none" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-zinc-800 pointer-events-none" />

          {/* Top nav */}
          <div className="relative z-10 flex items-center justify-between px-10 pt-10">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow duration-300">
                S
              </span>
              <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white font-mono">
                SNITCH
              </span>
            </Link>
            <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-600 font-mono">
              SS / 2025
            </span>
          </div>

          {/* Editorial content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-14">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px w-8 bg-yellow-500" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500 font-mono">
                02 / Seller Studio
              </span>
            </div>

            <h2 className="text-5xl xl:text-6xl font-black leading-[0.95] tracking-[-0.04em] text-white mb-10 uppercase">
              List<br />
              <span className="text-yellow-500">Your</span><br />
              Product.
            </h2>

            <p className="text-sm text-zinc-500 leading-relaxed max-w-[280px] mb-12 font-light tracking-wide">
              Reach thousands of buyers. Configure sizing varieties, assign colorways, manage real-time inventory, and go live instantly.
            </p>

            <div className="space-y-4">
              {[
                { label: "Variant Inventory", desc: "Independent stock quantities per color and size" },
                { label: "Colorway Galleries", desc: "Assign images to specific color groups" },
                { label: "Instant Sync", desc: "Live storefront availability and cart validation" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-4 group cursor-default">
                  <div className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-500 group-hover:scale-150 transition-transform duration-300" />
                  <div>
                    <p className="text-[12px] font-semibold text-zinc-200 group-hover:text-white transition-colors tracking-wide">
                      {label}
                    </p>
                    <p className="text-[11px] text-zinc-600 mt-0.5 tracking-wide">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom strip */}
          <div className="relative z-10 px-10 pb-10">
            <div className="h-px w-full bg-zinc-900 mb-6" />
            <p className="text-[9px] tracking-[0.15em] uppercase text-zinc-700 font-mono">
              © {new Date().getFullYear()} SNITCH Inc. — All rights reserved
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            RIGHT PANEL — product creation form
        ══════════════════════════════════════════════ */}
        <div className="flex-1 min-h-screen bg-[#0e0e0e] flex flex-col overflow-y-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-between px-6 pt-8 pb-4 border-b border-zinc-900">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base">
                S
              </span>
              <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white font-mono">
                SNITCH
              </span>
            </Link>
          </div>

          {/* Form wrapper */}
          <div className={`flex-1 flex items-start justify-center px-6 py-14 ${mounted ? "form-in" : "opacity-0"}`}>
            <div className="w-full max-w-[540px]">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-10 font-mono">
                <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-700">
                  Seller
                </span>
                <span className="text-zinc-800">/</span>
                <Link to="/seller/dashboard"
                  className="text-[9px] tracking-[0.2em] uppercase text-zinc-700 hover:text-zinc-400 transition-colors">
                  Products
                </Link>
                <span className="text-zinc-800">/</span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500">
                  Create Product
                </span>
              </div>

              {/* Page title */}
              <div className="mb-10">
                <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] text-white leading-[0.95] uppercase mb-5">
                  Create<br />Product
                </h1>
                <div className="flex items-center gap-4">
                  <div className="h-[2px] w-10 bg-yellow-500" />
                  <p className="text-[12px] text-zinc-500 tracking-wide">
                    Add a new product with custom variants, stock, and colorway galleries.
                  </p>
                </div>
              </div>

              {/* API / Validation Error Banner */}
              {apiError && (
                <div className="mb-8 border border-red-500/30 bg-red-500/10 p-4 text-red-400 text-xs font-mono flex items-start gap-3">
                  <span className="w-2 h-2 rounded-full bg-red-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-bold uppercase tracking-wider mb-1">Creation Failed</p>
                    <p className="text-zinc-300 font-normal">{apiError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApiError(null)}
                    className="text-red-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* ── FORM ── */}
              <form onSubmit={handleSubmit} noValidate className="space-y-10">
                {/* ── SECTION 1: Product Details ── */}
                <div>
                  <SectionLabel index="01" label="Basic Information" />
                  <div className="space-y-6 pt-2">
                    <InputField
                      {...field("title")}
                      label="Product Title"
                      icon="tag"
                      placeholder="e.g. Vintage Oversized Boxy Shirt"
                      autoFocus
                    />
                    <TextareaField
                      {...field("description")}
                      label="Description"
                      icon="text"
                      placeholder="Describe fit, fabric composition, wash care, and styling..."
                    />
                  </div>
                </div>

                {/* ── SECTION 2: Pricing ── */}
                <div>
                  <SectionLabel index="02" label="Pricing" />
                  <div className="grid grid-cols-[1fr_auto] gap-6 items-start pt-2">
                    <InputField
                      {...field("priceAmount")}
                      label="Price Amount"
                      type="number"
                      icon="currency"
                      placeholder="e.g. 1999"
                    />
                    <div className="w-32">
                      <SelectField
                        {...field("priceCurrency")}
                        label="Currency"
                        icon="currency"
                      >
                        <option value="INR">INR (₹)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </SelectField>
                    </div>
                  </div>
                </div>

                {/* ── SECTION 3: Variant Attributes ── */}
                <div>
                  <SectionLabel index="03" label="Variant Attributes Schema" />
                  <div className="space-y-4 bg-[#0a0a0a] border border-zinc-900 p-5 rounded-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono font-bold uppercase text-zinc-300">
                          Define Product Attributes
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          Keys such as Color, Size, Fit. All sellable variants combine values from these keys.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddAttributeKey}
                        className="text-[10px] uppercase font-mono text-yellow-500 hover:text-yellow-400 font-bold transition-colors cursor-pointer"
                      >
                        + Add Key
                      </button>
                    </div>

                    <div className="space-y-2.5 pt-1">
                      {attributeKeys.map((keyVal, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-zinc-600 w-6">#{idx + 1}</span>
                          <input
                            type="text"
                            placeholder="Attribute Key (e.g. Color, Size)"
                            value={keyVal}
                            onChange={(e) => handleAttributeKeyChange(idx, e.target.value)}
                            className="flex-1 bg-[#0e0e0e] border border-zinc-800 px-3.5 py-2 text-xs text-white focus:border-yellow-500 focus:outline-none font-mono"
                          />
                          {attributeKeys.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAttributeKey(idx)}
                              className="text-zinc-600 hover:text-red-400 p-1 text-xs font-mono cursor-pointer"
                              title="Remove attribute key"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* ── SECTION 4: Variants and Inventory ── */}
                <div>
                  <SectionLabel index="04" label="Variants and Inventory" />
                  <div className="space-y-4 bg-[#0a0a0a] border border-zinc-900 p-5 rounded-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-mono font-bold uppercase text-zinc-300">
                          Configure Combinations &amp; Stock
                        </p>
                        <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                          Each variant has a unique combination and its own stock count. Stock = 0 marks it out of stock.
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleGenerateAllCombinations}
                          className="text-[10px] uppercase font-mono text-zinc-400 hover:text-yellow-500 border border-zinc-800 px-2.5 py-1 hover:border-yellow-500/50 transition-colors cursor-pointer"
                          title="Generate all combinations based on current values"
                        >
                          ⚡ Generate Matrix
                        </button>
                        <button
                          type="button"
                          onClick={handleAddInitialVariant}
                          className="text-[10px] uppercase font-mono text-yellow-500 hover:text-yellow-400 font-bold transition-colors cursor-pointer"
                        >
                          + Add Variant
                        </button>
                      </div>
                    </div>

                    {validationErrors.variants && (
                      <div className="p-2.5 border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono">
                        {validationErrors.variants}
                      </div>
                    )}

                    <div className="space-y-3.5 pt-1">
                      {initialVariants.map((varItem, vIdx) => {
                        const isDuplicate = duplicateIndices.has(vIdx);
                        const stockVal = Number(varItem.stock);
                        return (
                          <div
                            key={vIdx}
                            className={`bg-[#0e0e0e] border p-3.5 space-y-3 transition-colors ${
                              isDuplicate
                                ? "border-red-500/80 bg-red-500/5"
                                : "border-zinc-800 hover:border-zinc-700"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono font-bold uppercase text-yellow-500">
                                  Variant #{vIdx + 1}
                                </span>
                                {isDuplicate && (
                                  <span className="text-[9px] font-mono uppercase bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 font-bold">
                                    ⚠️ Duplicate Combination
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border ${
                                    stockVal > 0
                                      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                      : "text-red-400 bg-red-500/10 border-red-500/20"
                                  }`}
                                >
                                  {stockVal > 0
                                    ? `Available (${stockVal})`
                                    : "Not Available (Out of Stock)"}
                                </span>
                                {initialVariants.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInitialVariant(vIdx)}
                                    className="text-zinc-600 hover:text-red-400 text-xs font-mono p-1 cursor-pointer"
                                    title="Delete variant"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Attribute inputs */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {attributeKeys.map((attrKey, kIdx) => {
                                const keyName = attrKey.trim();
                                if (!keyName) return null;
                                return (
                                  <div
                                    key={kIdx}
                                    className="flex items-center gap-2 bg-black p-2 border border-zinc-900"
                                  >
                                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase w-16 truncate">
                                      {keyName}:
                                    </span>
                                    <input
                                      type="text"
                                      placeholder={`e.g. ${
                                        keyName.toLowerCase() === "color"
                                          ? "Red"
                                          : keyName.toLowerCase() === "size"
                                          ? "M"
                                          : "Value"
                                      }`}
                                      value={varItem.attributes[keyName] || ""}
                                      onChange={(e) =>
                                        handleVariantAttrChange(vIdx, keyName, e.target.value)
                                      }
                                      className="w-full bg-[#0e0e0e] border border-zinc-800 px-2.5 py-1 text-xs text-white focus:border-yellow-500 focus:outline-none font-mono"
                                    />
                                  </div>
                                );
                              })}
                            </div>

                            {/* Stock Quantity Input */}
                            <div className="flex items-center justify-between pt-1 border-t border-zinc-900">
                              <label className="text-[10px] uppercase font-mono text-zinc-400">
                                Stock Quantity:
                              </label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={varItem.stock}
                                  onChange={(e) => handleVariantStockChange(vIdx, e.target.value)}
                                  className="w-24 bg-black border border-zinc-800 px-3 py-1 text-xs text-white font-mono focus:border-yellow-500 focus:outline-none text-right"
                                />
                                <span className="text-[10px] font-mono text-zinc-600">units</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── SECTION 5: Product Images ── */}
                <div>
                  <SectionLabel index="05" label="Product Images" />
                  <div className="pt-2">
                    <ImageUpload
                      images={images}
                      onImagesChange={setImages}
                      availableColors={availableColors}
                    />
                  </div>
                </div>

                {/* ── CTA ── */}
                <div className="pt-4 space-y-3">
                  <button
                    type="submit"
                    disabled={isButtonLoading}
                    className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-bold text-[13px] tracking-[0.12em] uppercase flex items-center justify-between px-7 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
                    style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                  >
                    {isButtonLoading ? (
                      <span className="flex items-center gap-3 mx-auto">
                        <Spinner />
                        Creating Product…
                      </span>
                    ) : (
                      <>
                        <span>Create Product</span>
                        <Icon name="arrow" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth="2.5" />
                      </>
                    )}
                  </button>

                  {/* Button shadow reflection */}
                  <div
                    className="w-full h-1 bg-yellow-500/20 mt-px"
                    style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                  />
                </div>

                {/* Cancel link */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-zinc-900" />
                  <p className="text-[11px] text-zinc-600 tracking-wider font-mono">
                    <Link
                      to="/seller/dashboard"
                      className="text-zinc-500 hover:text-yellow-500 font-semibold transition-colors duration-150"
                    >
                      ← Back to My Products
                    </Link>
                  </p>
                  <div className="h-px flex-1 bg-zinc-900" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
