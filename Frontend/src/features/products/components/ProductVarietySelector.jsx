import React, { useState, useMemo, useEffect, useRef } from "react";

// ─── Color name to Hex Color Mapping ──────────────────────────────────────────
const COLOR_MAP = {
  // Blues & Teals
  "mid-blue": "#335577",
  "mid blue": "#335577",
  "blue": "#1e40af",
  "navy": "#111c2e",
  "navy-blue": "#111c2e",
  "navy blue": "#111c2e",
  "dark-blue": "#15243b",
  "sky-blue": "#38bdf8",
  "light-blue": "#7dd3fc",
  "denim": "#2e516b",
  "ice-blue": "#bae6fd",
  "teal": "#0f766e",
  "cyan": "#06b6d4",
  "indigo": "#4338ca",

  // Neutrals & Monochromes
  "black": "#121212",
  "jet-black": "#09090b",
  "white": "#fafafa",
  "off-white": "#f1f5f9",
  "off white": "#f1f5f9",
  "cream": "#fef3c7",
  "ivory": "#fbfbf0",
  "charcoal": "#2b2c2e",
  "grey": "#64748b",
  "gray": "#64748b",
  "light-grey": "#94a3b8",
  "light-gray": "#94a3b8",
  "dark-grey": "#334155",
  "dark-gray": "#334155",
  "silver": "#cbd5e1",
  "ash": "#94a3b8",

  // Earthy & Greens
  "olive": "#4a5335",
  "olive-green": "#3d452b",
  "olive green": "#3d452b",
  "army-green": "#4b5320",
  "green": "#16a34a",
  "dark-green": "#14532d",
  "forest-green": "#166534",
  "sage": "#9ca986",
  "khaki": "#b5a37e",
  "beige": "#d9c5b2",
  "tan": "#c8ad8d",
  "brown": "#593d29",
  "dark-brown": "#3b2618",
  "coffee": "#452b1b",
  "camel": "#b88a58",

  // Warm & Accents
  "red": "#dc2626",
  "maroon": "#5d151e",
  "burgundy": "#50121a",
  "wine": "#54162b",
  "crimson": "#991b1b",
  "rust": "#9a3412",
  "orange": "#ea580c",
  "peach": "#fbcfe8",
  "coral": "#f87171",
  "pink": "#ec4899",
  "baby-pink": "#fbcfe8",
  "yellow": "#eab308",
  "mustard": "#ca8a04",
  "gold": "#d97706",
  "purple": "#7e22ce",
  "lavender": "#c084fc",
  "violet": "#6d28d9"
};

/**
 * Deterministically resolves a color string to a valid CSS background style
 */
export function resolveColorHex(colorName) {
  if (!colorName) return "#27272a";
  const str = String(colorName).trim();

  // If already standard css hex / rgb / hsl
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(str) || /^rgb/i.test(str) || /^hsl/i.test(str)) {
    return str;
  }

  const normalized = str.toLowerCase().replace(/_/g, " ").trim();
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  if (COLOR_MAP[normalized.replace(/\s+/g, "-")]) return COLOR_MAP[normalized.replace(/\s+/g, "-")];

  // Partial substring search
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return hex;
    }
  }

  // Deterministic pleasing HSL fallback based on string hash
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 40%, 42%)`;
}

// ─── Ruler Icon ───────────────────────────────────────────────────────────────
function RulerIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h18M3 16h18M3 8v8M21 8v8M7 8v4M11 8v6M15 8v4M19 8v6" />
    </svg>
  );
}

// ─── Size Chart Modal ─────────────────────────────────────────────────────────
function SizeGuideModal({ isOpen, onClose }) {
  const [unit, setUnit] = useState("in"); // "in" | "cm"

  if (!isOpen) return null;

  const sizeChartData = [
    { size: "28", us: "XS", waist: unit === "in" ? "28 - 29" : "71 - 74", hip: unit === "in" ? "35 - 36" : "89 - 91", length: unit === "in" ? "39.5" : "100" },
    { size: "30", us: "S", waist: unit === "in" ? "30 - 31" : "76 - 79", hip: unit === "in" ? "37 - 38" : "94 - 97", length: unit === "in" ? "40.0" : "102" },
    { size: "32", us: "M", waist: unit === "in" ? "32 - 33" : "81 - 84", hip: unit === "in" ? "39 - 40" : "99 - 102", length: unit === "in" ? "40.5" : "103" },
    { size: "34", us: "L", waist: unit === "in" ? "34 - 35" : "86 - 89", hip: unit === "in" ? "41 - 42" : "104 - 107", length: unit === "in" ? "41.0" : "104" },
    { size: "36", us: "XL", waist: unit === "in" ? "36 - 37" : "91 - 94", hip: unit === "in" ? "43 - 44" : "109 - 112", length: unit === "in" ? "41.5" : "105" },
    { size: "38", us: "XXL", waist: unit === "in" ? "38 - 39" : "96 - 99", hip: unit === "in" ? "45 - 46" : "114 - 117", length: unit === "in" ? "42.0" : "107" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-[#0e0e0e] border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl"
        style={{ clipPath: "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider text-white">Size Guide</h3>
            <p className="text-[11px] text-zinc-400 font-mono">Standard Fit Measurement Guidelines</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 transition-colors cursor-pointer"
            aria-label="Close size guide"
          >
            ✕
          </button>
        </div>

        {/* Unit Selector */}
        <div className="flex items-center justify-between my-4">
          <span className="text-xs uppercase font-mono tracking-widest text-zinc-400">Measurements in</span>
          <div className="flex border border-zinc-800 bg-black p-0.5">
            <button
              onClick={() => setUnit("in")}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                unit === "in" ? "bg-yellow-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              Inches
            </button>
            <button
              onClick={() => setUnit("cm")}
              className={`px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                unit === "cm" ? "bg-yellow-500 text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Measurement Table */}
        <div className="overflow-x-auto border border-zinc-800/80 bg-black/40 mb-5">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-zinc-800 bg-[#141414] text-zinc-400 text-[10px] uppercase tracking-wider">
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Standard</th>
                <th className="py-2.5 px-3">Waist ({unit})</th>
                <th className="py-2.5 px-3">Hip ({unit})</th>
                <th className="py-2.5 px-3">Length ({unit})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {sizeChartData.map((row) => (
                <tr key={row.size} className="hover:bg-zinc-900/40 text-zinc-300">
                  <td className="py-2 px-3 font-bold text-yellow-500">{row.size}</td>
                  <td className="py-2 px-3 text-zinc-400">{row.us}</td>
                  <td className="py-2 px-3">{row.waist}</td>
                  <td className="py-2 px-3">{row.hip}</td>
                  <td className="py-2 px-3">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tip */}
        <p className="text-[11px] text-zinc-500 font-light leading-relaxed mb-6">
          <strong className="text-zinc-300 font-medium">Fit Tip:</strong> If your measurements fall between two sizes, order the larger size for a relaxed drape or smaller size for a tapered fit.
        </p>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
}

// ─── Main ProductVarietySelector Component ─────────────────────────────────────
export default function ProductVarietySelector({
  product,
  onVariantSelect,
  selectedVariantId,
}) {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedOtherAttrs, setSelectedOtherAttrs] = useState({});
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const sizeScrollRef = useRef(null);

  // Normalize variants from product
  const normalizedVariants = useMemo(() => {
    if (!product?.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
      return [];
    }

    return product.variants.map((v) => {
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
  }, [product]);

  // Extract attribute keys and classification
  const { colorKey, sizeKey, otherKeys } = useMemo(() => {
    let cKey = null;
    let sKey = null;
    const oKeys = new Set();

    normalizedVariants.forEach((v) => {
      Object.keys(v.attributes || {}).forEach((k) => {
        const lower = k.toLowerCase().trim();
        if (lower === "color" || lower === "colour") {
          if (!cKey) cKey = k;
        } else if (lower === "size") {
          if (!sKey) sKey = k;
        } else {
          oKeys.add(k);
        }
      });
    });

    return { colorKey: cKey, sizeKey: sKey, otherKeys: Array.from(oKeys) };
  }, [normalizedVariants]);

  // List of all unique available colors for this product
  const availableColors = useMemo(() => {
    if (!colorKey) return [];
    const colors = [];
    const seen = new Set();

    normalizedVariants.forEach((v) => {
      const val = v.attributes?.[colorKey];
      if (val && !seen.has(String(val).trim())) {
        seen.add(String(val).trim());
        colors.push(String(val).trim());
      }
    });

    return colors;
  }, [normalizedVariants, colorKey]);

  // List of all unique available sizes for this product
  const availableSizes = useMemo(() => {
    if (!sizeKey) return [];
    const sizes = [];
    const seen = new Set();

    normalizedVariants.forEach((v) => {
      const val = v.attributes?.[sizeKey];
      if (val && !seen.has(String(val).trim())) {
        seen.add(String(val).trim());
        sizes.push(String(val).trim());
      }
    });

    // Natural sort: numeric sizes first (28, 30, 32...) then standard apparel (XS, S, M, L, XL, XXL)
    const apparelOrder = ["xs", "s", "m", "l", "xl", "xxl", "2xl", "3xl", "4xl"];
    return sizes.sort((a, b) => {
      const numA = Number(a);
      const numB = Number(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      const idxA = apparelOrder.indexOf(a.toLowerCase());
      const idxB = apparelOrder.indexOf(b.toLowerCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      return a.localeCompare(b);
    });
  }, [normalizedVariants, sizeKey]);

  // Initialize selected color and size on mount or when product changes
  useEffect(() => {
    if (normalizedVariants.length === 0) return;

    // Check if an existing selectedVariantId was passed
    let initialVariant = null;
    if (selectedVariantId) {
      initialVariant = normalizedVariants.find((v) => String(v._id) === String(selectedVariantId));
    }
    if (!initialVariant) {
      // Pick first in-stock variant, or the first variant
      initialVariant = normalizedVariants.find((v) => Number(v.stock) > 0) || normalizedVariants[0];
    }

    if (initialVariant) {
      if (colorKey && initialVariant.attributes?.[colorKey]) {
        setSelectedColor(String(initialVariant.attributes[colorKey]).trim());
      } else if (availableColors.length > 0) {
        setSelectedColor(availableColors[0]);
      }

      if (sizeKey && initialVariant.attributes?.[sizeKey]) {
        setSelectedSize(String(initialVariant.attributes[sizeKey]).trim());
      } else if (availableSizes.length > 0) {
        setSelectedSize(availableSizes[0]);
      }

      const initialOthers = {};
      otherKeys.forEach((k) => {
        if (initialVariant.attributes?.[k]) {
          initialOthers[k] = initialVariant.attributes[k];
        }
      });
      setSelectedOtherAttrs(initialOthers);
    }
  }, [normalizedVariants, colorKey, sizeKey, otherKeys, availableColors, availableSizes, selectedVariantId]);

  // Determine active matching variant whenever selections change
  const activeVariant = useMemo(() => {
    if (normalizedVariants.length === 0) return null;

    // 1. Try exact match on all selected attributes
    const exactMatch = normalizedVariants.find((v) => {
      const attrs = v.attributes || {};
      if (colorKey && String(attrs[colorKey] || "").trim() !== String(selectedColor || "").trim()) {
        return false;
      }
      if (sizeKey && String(attrs[sizeKey] || "").trim() !== String(selectedSize || "").trim()) {
        return false;
      }
      for (const [k, val] of Object.entries(selectedOtherAttrs)) {
        if (String(attrs[k] || "").trim() !== String(val || "").trim()) {
          return false;
        }
      }
      return true;
    });

    if (exactMatch) return exactMatch;

    // 2. Fallback: match by selectedColor first
    if (colorKey && selectedColor) {
      const colorMatch = normalizedVariants.find(
        (v) => String(v.attributes?.[colorKey] || "").trim() === String(selectedColor).trim()
      );
      if (colorMatch) return colorMatch;
    }

    // 3. Fallback: first variant
    return normalizedVariants[0];
  }, [normalizedVariants, colorKey, sizeKey, selectedColor, selectedSize, selectedOtherAttrs]);

  // Inform parent component about active variant selection
  useEffect(() => {
    if (activeVariant && onVariantSelect) {
      onVariantSelect({
        variant: activeVariant,
        selectedColor,
        selectedSize,
        selectedOtherAttrs,
      });
    }
  }, [activeVariant, selectedColor, selectedSize, selectedOtherAttrs, onVariantSelect]);

  // Color selection click handler
  const handleSelectColor = (color) => {
    setSelectedColor(color);

    // If current selected size is out of stock for this new color, auto-switch to first available in-stock size
    if (sizeKey && availableSizes.length > 0) {
      const variantsForNewColor = normalizedVariants.filter(
        (v) => String(v.attributes?.[colorKey] || "").trim() === String(color).trim()
      );
      const isCurrentSizeInStock = variantsForNewColor.some(
        (v) => String(v.attributes?.[sizeKey] || "").trim() === String(selectedSize).trim() && Number(v.stock) > 0
      );

      if (!isCurrentSizeInStock) {
        const firstInStock = variantsForNewColor.find((v) => Number(v.stock) > 0);
        if (firstInStock && firstInStock.attributes?.[sizeKey]) {
          setSelectedSize(String(firstInStock.attributes[sizeKey]).trim());
        }
      }
    }
  };

  // Check stock for a given size under currently selected color
  const getSizeStatus = (size) => {
    const matching = normalizedVariants.filter((v) => {
      const attrs = v.attributes || {};
      const matchesSize = String(attrs[sizeKey] || "").trim() === String(size).trim();
      const matchesColor = !colorKey || !selectedColor || String(attrs[colorKey] || "").trim() === String(selectedColor).trim();
      return matchesSize && matchesColor;
    });

    if (matching.length === 0) {
      return { exists: false, inStock: false, stock: 0 };
    }

    const totalStock = matching.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0);
    return { exists: true, inStock: totalStock > 0, stock: totalStock };
  };

  // Size list scroll controls
  const handleScrollSizes = (direction) => {
    if (!sizeScrollRef.current) return;
    const scrollAmount = direction === "left" ? -140 : 140;
    sizeScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // If no variants exist on this product, return null
  if (normalizedVariants.length === 0) {
    return null;
  }

  return (
    <div className="variety-selector space-y-6 pt-3 pb-2 border-y border-zinc-900/90 my-4">
      {/* ─────────────────────────────────────────────────────────────
          1. COLOR SECTION: Title and circular swatches
          (Matches user screenshot: centered color name + circular swatches)
      ───────────────────────────────────────────────────────────── */}
      {availableColors.length > 0 && (
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          {/* Active Color Name */}
          <div className="text-center">
            <span
              className="text-sm sm:text-base font-bold text-zinc-100 tracking-wide capitalize"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              {selectedColor || "Select Color"}
            </span>
          </div>

          {/* Color Circles Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 py-1">
            {availableColors.map((color) => {
              const isSelected = String(selectedColor).toLowerCase().trim() === String(color).toLowerCase().trim();
              const hexColor = resolveColorHex(color);
              const isLight = hexColor === "#fafafa" || hexColor === "#f1f5f9" || hexColor === "#ffffff" || hexColor.toLowerCase() === "white";

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleSelectColor(color)}
                  title={color}
                  aria-label={`Select ${color}`}
                  className="group relative flex items-center justify-center cursor-pointer transition-transform duration-200 active:scale-95"
                >
                  {/* Outer active selection ring (matches screenshot outer circular border) */}
                  <div
                    className={`rounded-full p-[2.5px] transition-all duration-200 ${
                      isSelected
                        ? "border-2 border-zinc-200 shadow-sm shadow-white/10"
                        : "border-2 border-transparent hover:border-zinc-700"
                    }`}
                  >
                    {/* Inner color swatch circle */}
                    <div
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all shadow-inner ${
                        isLight ? "border border-zinc-600/40" : ""
                      }`}
                      style={{ backgroundColor: hexColor }}
                    />
                  </div>

                  {/* Micro tooltip on hover */}
                  <span className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 text-[10px] text-zinc-300 px-2 py-0.5 rounded border border-zinc-800 whitespace-nowrap z-20">
                    {color}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. SIZE SECTION: "Select Size" + Size buttons + Ruler Icon
          (Matches user screenshot: "Select Size" + < [28] [30] [32] [34] [36] > + ruler icon)
      ───────────────────────────────────────────────────────────── */}
      {availableSizes.length > 0 && (
        <div className="flex flex-col items-center justify-center text-center space-y-3.5 pt-1">
          {/* "Select Size" Header */}
          <div className="text-center">
            <span
              className="text-xs sm:text-sm font-medium tracking-wide text-zinc-400"
              style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
            >
              Select Size
            </span>
          </div>

          {/* Carousel / Row of Size Circles */}
          <div className="relative flex items-center justify-center gap-1.5 sm:gap-2.5 max-w-full">
            {/* Left arrow button */}
            {availableSizes.length > 4 && (
              <button
                type="button"
                onClick={() => handleScrollSizes("left")}
                className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Scroll sizes left"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Scrollable container for sizes */}
            <div
              ref={sizeScrollRef}
              className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 px-1 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {availableSizes.map((size) => {
                const isSelected = String(selectedSize).trim() === String(size).trim();
                const status = getSizeStatus(size);
                const isOut = !status.inStock;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    disabled={isOut}
                    title={isOut ? `${size} (Out of stock)` : `Size ${size}`}
                    className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs font-semibold font-mono transition-all duration-200 cursor-pointer overflow-hidden ${
                      isOut
                        ? "bg-zinc-800/40 text-zinc-500 border border-zinc-800 cursor-not-allowed opacity-60"
                        : isSelected
                        ? "bg-white text-black border-2 border-white font-bold shadow-lg shadow-white/10 scale-105"
                        : "bg-transparent text-zinc-300 border border-zinc-700 hover:border-zinc-400 hover:text-white"
                    }`}
                  >
                    <span>{size}</span>

                    {/* Diagonal strike-through line for out-of-stock sizes (matches screenshot) */}
                    {isOut && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="w-[140%] h-[1.5px] bg-zinc-600 -rotate-45 transform" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right arrow button */}
            {availableSizes.length > 4 && (
              <button
                type="button"
                onClick={() => handleScrollSizes("right")}
                className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-white transition-colors cursor-pointer"
                aria-label="Scroll sizes right"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Size Chart Ruler Icon (matches ruler icon in user screenshot) */}
          <div className="pt-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => setShowSizeGuide(true)}
              className="inline-flex items-center gap-1.5 text-zinc-400 hover:text-yellow-500 transition-colors text-[11px] font-mono tracking-widest uppercase cursor-pointer py-1 px-2 group"
              title="Open Size Guide"
            >
              <RulerIcon className="w-4 h-4 text-zinc-400 group-hover:text-yellow-500 transition-colors" />
              <span className="underline underline-offset-4 decoration-zinc-700 group-hover:decoration-yellow-500">
                Size Guide
              </span>
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. OTHER ATTRIBUTES (if seller added custom attributes)
      ───────────────────────────────────────────────────────────── */}
      {otherKeys.length > 0 &&
        otherKeys.map((keyName) => {
          const values = Array.from(
            new Set(
              normalizedVariants
                .map((v) => v.attributes?.[keyName])
                .filter(Boolean)
            )
          );

          if (values.length <= 1) return null;

          return (
            <div key={keyName} className="space-y-2 pt-2">
              <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-mono block">
                {keyName}: <span className="text-white font-bold">{selectedOtherAttrs[keyName] || values[0]}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {values.map((val) => {
                  const isSelected = selectedOtherAttrs[keyName] === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() =>
                        setSelectedOtherAttrs((prev) => ({
                          ...prev,
                          [keyName]: val,
                        }))
                      }
                      className={`px-3 py-1.5 text-xs font-mono transition-all border cursor-pointer ${
                        isSelected
                          ? "border-yellow-500 bg-yellow-500/10 text-yellow-400 font-bold"
                          : "border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white bg-[#0e0e0e]"
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

      {/* Interactive Size Guide Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
}
