import React from "react";

/**
 * Reusable Loading component matching the SNITCH brand identity & visual system.
 * 
 * @param {boolean} fullScreen - Whether to cover the entire viewport as a fixed overlay.
 * @param {string} message - Custom text message displayed below the loader.
 * @param {'brand' | 'spinner' | 'pulse'} variant - Visual style of the loader.
 * @param {'sm' | 'md' | 'lg' | 'xl'} size - Scale size of the loading animation.
 * @param {boolean} showLogo - Whether to render the SNITCH brand logo badge.
 * @param {string} className - Optional custom class names for the container.
 */
export default function Loading({
  fullScreen = false,
  message = "Loading...",
  variant = "brand",
  size = "md",
  showLogo = true,
  className = "",
}) {
  // Size dimensions mapping for spinner and logo
  const sizeMap = {
    sm: {
      spinner: "w-5 h-5",
      logo: "w-6 h-6 text-xs",
      box: "py-4 px-6 gap-3",
      text: "text-[10px]",
    },
    md: {
      spinner: "w-8 h-8",
      logo: "w-9 h-9 text-sm",
      box: "py-8 px-10 gap-4",
      text: "text-[11px]",
    },
    lg: {
      spinner: "w-12 h-12",
      logo: "w-12 h-12 text-lg",
      box: "py-12 px-14 gap-6",
      text: "text-xs",
    },
    xl: {
      spinner: "w-16 h-16",
      logo: "w-14 h-14 text-xl",
      box: "py-16 px-16 gap-8",
      text: "text-sm",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Base loader inner content
  const loaderContent = (
    <div className={`flex flex-col items-center justify-center text-center ${currentSize.box} select-none relative z-10`}>
      {/* Background ambient glow effect */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-48 h-48 rounded-full bg-yellow-500/5 blur-3xl animate-pulse motion-reduce:animate-none" />
      </div>

      {/* SNITCH Brand Emblem */}
      {showLogo && variant !== "spinner" && (
        <div className="relative group mb-1">
          <div className="absolute -inset-1 rounded-md bg-yellow-500/20 blur-sm animate-pulse motion-reduce:animate-none" />
          <div className={`relative ${currentSize.logo} rounded-md bg-yellow-500 flex items-center justify-center text-black font-black shadow-lg shadow-yellow-500/20 tracking-tighter`}>
            S
          </div>
        </div>
      )}

      {/* Spinner / Progress Indicator */}
      <div className="relative flex items-center justify-center my-1">
        {variant === "pulse" ? (
          <div className="flex items-center gap-1.5 py-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping motion-reduce:animate-none" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 animate-ping motion-reduce:animate-none [animation-delay:200ms]" />
            <span className="w-2 h-2 rounded-full bg-yellow-500/40 animate-ping motion-reduce:animate-none [animation-delay:400ms]" />
          </div>
        ) : (
          <svg
            className={`animate-spin text-yellow-500 ${currentSize.spinner} motion-reduce:animate-none`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-20 text-zinc-700"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="opacity-90 fill-yellow-500"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
      </div>

      {/* Loading message text */}
      {message && (
        <div className="flex flex-col items-center gap-2 mt-1">
          <p
            className={`${currentSize.text} tracking-[0.2em] uppercase text-zinc-300 font-medium`}
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {message}
          </p>
          {/* Animated hairline bar */}
          <div className="w-16 h-[2px] bg-zinc-900 overflow-hidden relative rounded-full">
            <div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent -translate-x-full motion-reduce:hidden"
              style={{ animation: "snitchShimmer 1.5s infinite linear" }}
            />
          </div>
        </div>
      )}

      {/* Visually hidden text for Screen Readers */}
      <span className="sr-only">{message || "Loading content, please wait..."}</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div
        role="status"
        aria-busy="true"
        aria-live="polite"
        aria-label={message || "Loading page"}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a] text-white overflow-hidden ${className}`}
        style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
      >
        {/* Keyframe style for shimmer line */}
        <style>{`
          @keyframes snitchShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>

        {/* Decorative corner borders matching SNITCH luxury theme */}
        <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-zinc-800/60 pointer-events-none hidden sm:block" />
        <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-zinc-800/60 pointer-events-none hidden sm:block" />

        {/* Background brand watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03]">
          <span className="text-[35vw] font-black text-white leading-none tracking-tighter">S</span>
        </div>

        {loaderContent}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      aria-label={message || "Loading"}
      className={`relative w-full flex items-center justify-center min-h-[160px] bg-[#0e0e0e]/50 border border-zinc-900/80 rounded-sm text-white ${className}`}
      style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}
    >
      <style>{`
        @keyframes snitchShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      {loaderContent}
    </div>
  );
}
