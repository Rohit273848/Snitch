import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../hook/useProduct";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ─── Google Fonts loader ──────────────────────────────────────────────────────
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap";
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

// ─── Reusable Input Field (matches Register page style exactly) ───────────────
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
      {/* Animated yellow underline accent — matches Register */}
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
        {/* Character counter — UI only */}
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
        {/* Custom chevron */}
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
function ImageUpload({ images, onImagesChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // UI-only: creates local blob URLs for preview
  const processFiles = (files) => {
    const validFiles = Array.from(files).filter((f) =>
      ["image/png", "image/jpeg", "image/webp"].includes(f.type)
    );
    const newImages = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      url: URL.createObjectURL(file),
      file, // raw File object — available when you connect real upload logic
    }));
    // TODO: Store selected images in your form state.
    // Field: images
    // When you connect your hook, pass the File objects (not the blob URLs) to the API.
    onImagesChange((prev) => [...prev, ...newImages]);
  };

  const handleFileInput = (e) => processFiles(e.target.files);
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeImage = (id) => {
    // TODO: Replace mock/temporary image data with the actual selected images.
    // When using real state, also revoke the object URL to avoid memory leaks:
    // URL.revokeObjectURL(images.find(i => i.id === id)?.url)
    onImagesChange((prev) => prev.filter((img) => img.id !== id));
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
          accept="image/png,image/jpeg,image/webp"
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
          <p className="text-[11px] text-zinc-600 mt-1 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            PNG, JPG or WEBP
          </p>
        </div>

        <p className="text-[10px] text-zinc-700 tracking-[0.15em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Drag &amp; drop or click to browse
        </p>
      </div>

      {/* Image previews */}
      {images.length > 0 && (
        <div className="space-y-3">
          {/* TODO: Replace mock/temporary image data with the actual selected images.
                        When connected to real state, images come from formData.images or your hook. */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-900" />
            <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {images.length} image{images.length !== 1 ? "s" : ""} selected
            </span>
            <div className="h-px flex-1 bg-zinc-900" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, index) => (
              <div key={img.id}
                className="group relative border border-zinc-900 hover:border-zinc-700 transition-colors duration-200">
                {/* TODO: Use product.images from the API response when showing existing images. */}
                <div className="aspect-square overflow-hidden bg-zinc-900">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {index === 0 && (
                  <span className="absolute top-2 left-2 text-[8px] tracking-[0.15em] uppercase bg-yellow-500 text-black px-1.5 py-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    Cover
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/70 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:border-red-400/50 transition-colors duration-150 opacity-0 group-hover:opacity-100"
                  title="Remove image"
                >
                  <Icon name="x" className="w-3 h-3" strokeWidth="2.5" />
                </button>
                <div className="px-2 py-1.5 border-t border-zinc-900">
                  <p className="text-[10px] text-zinc-500 truncate" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{img.name}</p>
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
      <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
    { attributes: { Color: "Red", Size: "L" }, stock: 15 }
  ]);
  const [apiError, setApiError] = useState(null);

  const navigate = useNavigate();

  const handleAddAttributeKey = () => {
    const newKey = `Attr${attributeKeys.length + 1}`;
    setAttributeKeys([...attributeKeys, newKey]);
  };

  const handleRemoveAttributeKey = (index) => {
    setAttributeKeys(attributeKeys.filter((_, i) => i !== index));
  };

  const handleAttributeKeyChange = (index, value) => {
    const updated = [...attributeKeys];
    updated[index] = value;
    setAttributeKeys(updated);
  };

  const handleAddInitialVariant = () => {
    const defaultAttrs = {};
    attributeKeys.forEach(k => {
      if (k.trim()) defaultAttrs[k.trim()] = "";
    });
    setInitialVariants([...initialVariants, { attributes: defaultAttrs, stock: 10 }]);
  };

  const handleRemoveInitialVariant = (idx) => {
    setInitialVariants(initialVariants.filter((_, i) => i !== idx));
  };

  const handleVariantAttrChange = (variantIdx, attrKey, val) => {
    const updated = [...initialVariants];
    updated[variantIdx].attributes[attrKey] = val;
    setInitialVariants(updated);
  };

  const handleVariantStockChange = (variantIdx, stockVal) => {
    const updated = [...initialVariants];
    updated[variantIdx].stock = Number(stockVal) || 0;
    setInitialVariants(updated);
  };

  // UI-only local state for visual development
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceAmount: "",
    priceCurrency: "INR",
  });

  const { handleProductCreation } = useProduct();
  const loading = useSelector((state) => state.product.loading);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const field = (name) => ({
    name,
    id: name,
    value: formData[name],
    onChange: handleChange,
    onFocus: () => setFocused(name),
    onBlur: () => setFocused(null),
    focused,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.priceAmount ||
      images.length === 0
    ) {
      return;
    }

    const data = new FormData();

    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("priceAmount", formData.priceAmount);
    data.append("priceCurrency", formData.priceCurrency);
    
    // Filter and append attribute keys defined for this product
    const validKeys = attributeKeys.map(k => k.trim()).filter(Boolean);
    data.append("attributeKeys", JSON.stringify(validKeys));

    // Append initial variants with size and stock availability
    data.append("variants", JSON.stringify(initialVariants));

    images.forEach((img) => {
      data.append("images", img.file);
    });

    try {
      const product = await handleProductCreation(data);

      navigate("/seller/dashboard");
    } catch (error) {
      console.error(error);

      setApiError(
        error.response?.data?.message ||
        "Failed to create product"
      );
    }

  };

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
                    (identical markup to Register for visual consistency)
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
                <span key={i} className="text-[9px] tracking-[0.4em] uppercase text-white"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", fontFamily: "'JetBrains Mono', monospace" }}>
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
              <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                SNITCH
              </span>
            </Link>
            <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-600" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              SS / 2025
            </span>
          </div>

          {/* Editorial content */}
          <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-14">
            <div className="flex items-center gap-3 mb-10">
              <div className="h-px w-8 bg-yellow-500" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                02 / Seller
              </span>
            </div>

            <h2 className="text-5xl xl:text-6xl font-black leading-[0.95] tracking-[-0.04em] text-white mb-10 uppercase">
              List<br />
              <span className="text-yellow-500">Your</span><br />
              Product.
            </h2>

            <p className="text-sm text-zinc-500 leading-relaxed max-w-[260px] mb-12 font-light tracking-wide">
              Reach thousands of style-conscious buyers. Add your product, set a price, and go live instantly.
            </p>

            <div className="space-y-4">
              {[
                { label: "Instant Listing", desc: "Products go live immediately" },
                { label: "Zero Hassle", desc: "Simple, clean product form" },
                { label: "Full Control", desc: "Edit or remove anytime" },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-4 group cursor-default">
                  <div className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-500 group-hover:scale-150 transition-transform duration-300" />
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
            <p className="text-[9px] tracking-[0.15em] uppercase text-zinc-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
              <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                SNITCH
              </span>
            </Link>
          </div>

          {/* Form wrapper */}
          <div className={`flex-1 flex items-start justify-center px-6 py-14 ${mounted ? "form-in" : "opacity-0"}`}>
            <div className="w-full max-w-[480px]">

              {/* Breadcrumb */}
              <div className="flex items-center gap-2 mb-10">
                <span className="text-[9px] tracking-[0.2em] uppercase text-zinc-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Seller
                </span>
                <span className="text-zinc-800">/</span>
                <Link to="/seller/dashboard"
                  className="text-[9px] tracking-[0.2em] uppercase text-zinc-700 hover:text-zinc-400 transition-colors" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Products
                </Link>
                <span className="text-zinc-800">/</span>
                <span className="text-[9px] tracking-[0.2em] uppercase text-yellow-500" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  Create
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
                    Add a new product to your store.
                  </p>
                </div>
              </div>


              {apiError && (
                <div className="mb-6 border border-red-500/20 px-4 py-3 text-red-400 text-sm">
                  {apiError}
                </div>
              )}


              {/* ── FORM ──
                                TODO: Connect this form to your submission handler.
                                Replace the onSubmit with your real handler when ready. */}
              <form onSubmit={handleSubmit} noValidate className="space-y-9">

                {/* ── SECTION 1: Product Details ── */}
                <SectionLabel index="01" label="Product Details" />

                {/* Product Title */}
                {/* TODO: Connect this input to your form state. Field: title */}
                <InputField
                  {...field("title")}
                  label="Product Title"
                  icon="tag"
                  placeholder="Enter product title"
                  autoFocus
                />

                {/* Description */}
                {/* TODO: Connect this input to your form state. Field: description */}
                <TextareaField
                  {...field("description")}
                  label="Description"
                  icon="text"
                  placeholder="Describe your product..."
                />

                {/* ── SECTION 2: Pricing ── */}
                <SectionLabel index="02" label="Pricing" />

                {/* Price row: Amount + Currency side-by-side */}
                <div className="grid grid-cols-[1fr_auto] gap-6 items-start">

                  {/* Price Amount */}
                  {/* TODO: Connect this input to your form state. Field: priceAmount */}
                  <InputField
                    {...field("priceAmount")}
                    label="Price Amount"
                    type="number"
                    icon="currency"
                    placeholder="Enter price"
                  />

                  {/* Price Currency */}
                  {/* TODO: Connect this select to your form state. Field: priceCurrency */}
                  <div className="w-28">
                    <SelectField
                      {...field("priceCurrency")}
                      label="Currency"
                      icon="currency"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </SelectField>
                  </div>
                </div>

                {/* ── SECTION 3: Variety Specification Keys ── */}
                <SectionLabel index="03" label="Variety Attributes Schema" />

                <div className="space-y-4 bg-[#0a0a0a] border border-zinc-900 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono font-bold uppercase text-zinc-300">
                        Product Variety Attributes
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Define attribute keys (e.g., Color, Size, Material). All future product varieties will use these keys.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAttributeKey}
                      className="text-[10px] uppercase font-mono text-yellow-500 hover:underline cursor-pointer"
                    >
                      + Add Attribute Key
                    </button>
                  </div>

                  <div className="space-y-3">
                    {attributeKeys.map((keyVal, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Attribute Key (e.g., Color, Size, Fit)"
                          value={keyVal}
                          onChange={(e) => handleAttributeKeyChange(idx, e.target.value)}
                          className="w-full bg-[#0e0e0e] border border-zinc-800 px-4 py-2.5 text-xs text-white focus:border-yellow-500 focus:outline-none font-mono"
                        />
                        {attributeKeys.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAttributeKey(idx)}
                            className="text-zinc-600 hover:text-red-400 p-1 text-xs font-mono cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SECTION 4: Initial Varieties & Stock Availability ── */}
                <SectionLabel index="04" label="Initial Varieties & Stock" />

                <div className="space-y-4 bg-[#0a0a0a] border border-zinc-900 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono font-bold uppercase text-zinc-300">
                        Add Sizes &amp; Stock Availability
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                        Set availability per size/variety. Stock &gt; 0 shows as Available to buyers; Stock = 0 shows as Not Available.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddInitialVariant}
                      className="text-[10px] uppercase font-mono text-yellow-500 hover:underline cursor-pointer"
                    >
                      + Add Size / Variety
                    </button>
                  </div>

                  <div className="space-y-3">
                    {initialVariants.map((varItem, vIdx) => (
                      <div key={vIdx} className="bg-[#0e0e0e] border border-zinc-800 p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono font-bold uppercase text-yellow-500">
                            Variety Drop #{vIdx + 1}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 border ${
                              Number(varItem.stock) > 0
                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                : "text-red-400 bg-red-500/10 border-red-500/20"
                            }`}>
                              {Number(varItem.stock) > 0 ? `Available (${varItem.stock})` : "Not Available (Out of Stock)"}
                            </span>
                            {initialVariants.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveInitialVariant(vIdx)}
                                className="text-zinc-600 hover:text-red-400 text-xs font-mono p-1 cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Attribute fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {attributeKeys.map((attrKey, kIdx) => {
                            if (!attrKey.trim()) return null;
                            const keyName = attrKey.trim();
                            return (
                              <div key={kIdx} className="flex items-center gap-2 bg-black p-2 border border-zinc-900">
                                <span className="text-[10px] font-mono text-yellow-500 font-bold uppercase w-16 truncate">
                                  {keyName}:
                                </span>
                                <input
                                  type="text"
                                  placeholder={`e.g. ${keyName === 'Color' ? 'Red' : keyName === 'Size' ? 'S / M / L' : 'Value'}`}
                                  value={varItem.attributes[keyName] || ""}
                                  onChange={(e) => handleVariantAttrChange(vIdx, keyName, e.target.value)}
                                  className="w-full bg-[#0e0e0e] border border-zinc-800 px-2.5 py-1 text-xs text-white focus:border-yellow-500 focus:outline-none font-mono"
                                />
                              </div>
                            );
                          })}
                        </div>

                        {/* Stock Input */}
                        <div className="flex items-center gap-3 pt-1">
                          <label className="text-[10px] uppercase font-mono text-zinc-400">
                            Available Stock Quantity:
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={varItem.stock}
                            onChange={(e) => handleVariantStockChange(vIdx, e.target.value)}
                            className="w-28 bg-black border border-zinc-800 px-3 py-1 text-xs text-white font-mono focus:border-yellow-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── SECTION 5: Images ── */}
                <SectionLabel index="05" label="Product Images" />

                {/* Image Upload
                                    TODO: Store selected images in your form state. Field: images
                                    When you connect the real logic, pass image.file (File objects)
                                    to your API, not the temporary blob URLs (preview only). */}
                <ImageUpload images={images} onImagesChange={setImages} />

                {/* ── CTA ── */}
                <div className="pt-3 space-y-2">
                  {/* TODO: Connect this button to your form submission handler.
                                        Submit the form using your useProduct() hook.
                                        Expected flow:
                                        form data → handleProductCreation(formData) → API → backend

                                        TODO: Connect the button's loading/disabled state to Redux loading state.
                                        Example:
                                        const loading = useSelector((state) => state.product.loading);
                                        disabled={loading} */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-bold text-[13px] tracking-[0.12em] uppercase flex items-center justify-between px-7 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
                    style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                  >
                    {loading ? (
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

                  {/* Button shadow reflection — matches Register */}
                  <div
                    className="w-full h-1 bg-yellow-500/20 mt-px"
                    style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                  />
                </div>

                {/* Cancel link */}
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px flex-1 bg-zinc-900" />
                  <p className="text-[11px] text-zinc-600 tracking-wider" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
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
