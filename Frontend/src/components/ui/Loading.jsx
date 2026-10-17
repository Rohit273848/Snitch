import React from "react";

/**
 * Reusable Loading component aligned with the VELMORA Atelier Luxury Design System.
 * 
 * @param {boolean} fullScreen - Whether to cover the entire viewport as a fixed overlay.
 * @param {string} message - Custom text message displayed below the loader.
 * @param {'brand' | 'spinner' | 'pulse'} variant - Visual style of the loader.
 * @param {'sm' | 'md' | 'lg' | 'xl'} size - Scale size of the loading animation.
 * @param {boolean} showLogo - Whether to render the VELMORA brand monogram badge.
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
  // Size dimensions mapping
  const sizeMap = {
    sm: {
      spinner: "w-5 h-5",
      logo: "w-7 h-7 text-xs",
      box: "py-5 px-6 gap-3",
      text: "text-[9.5px]",
      subtext: "text-[8px]",
    },
    md: {
      spinner: "w-8 h-8",
      logo: "w-10 h-10 text-base",
      box: "py-8 px-10 gap-4",
      text: "text-[11px]",
      subtext: "text-[9px]",
    },
    lg: {
      spinner: "w-11 h-11",
      logo: "w-13 h-13 text-xl",
      box: "py-12 px-14 gap-5",
      text: "text-xs",
      subtext: "text-[10px]",
    },
    xl: {
      spinner: "w-14 h-14",
      logo: "w-16 h-16 text-2xl",
      box: "py-16 px-16 gap-6",
      text: "text-sm",
      subtext: "text-[11px]",
    },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Base loader inner content
  const loaderContent = (
    <div className={`flex flex-col items-center justify-center text-center ${currentSize.box} select-none relative z-10 font-interface-sans`}>
      {/* Background ambient warm diffusion */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-56 h-56 rounded-full bg-[#EAE5D9]/40 blur-3xl animate-pulse motion-reduce:animate-none" />
      </div>

      {/* VELMORA Brand Monogram Badge */}
      {showLogo && variant !== "spinner" && (
        <div className="relative group mb-1">
          <div className="absolute -inset-1.5 rounded-full bg-[#ECE7DD] blur-xs animate-pulse motion-reduce:animate-none" />
          <div
            className={`relative ${currentSize.logo} rounded-full bg-[#1A1917] text-[#FBF9F5] flex items-center justify-center font-editorial-serif font-bold tracking-tight shadow-sm`}
          >
            V
          </div>
        </div>
      )}

      {/* Spinner / Progress Indicator */}
      <div className="relative flex items-center justify-center my-1">
        {variant === "pulse" ? (
          <div className="flex items-center gap-2 py-2">
            <span className="w-2 h-2 rounded-full bg-[#1A1917] animate-ping motion-reduce:animate-none" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A5340] animate-ping motion-reduce:animate-none [animation-delay:200ms]" />
            <span className="w-2 h-2 rounded-full bg-[#8A857B] animate-ping motion-reduce:animate-none [animation-delay:400ms]" />
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <svg
              className={`animate-spin text-[#1A1917] ${currentSize.spinner} motion-reduce:animate-none`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25 text-[#D5CEBF]"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <path
                className="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Loading message text & hairline progress */}
      {message && (
        <div className="flex flex-col items-center gap-2 mt-1">
          <p className={`${currentSize.text} tracking-[0.22em] uppercase text-[#1A1917] font-semibold`}>
            {message}
          </p>
          <span className={`${currentSize.subtext} tracking-[0.24em] uppercase text-[#6C685F] -mt-1 font-medium`}>
            Velmora Atelier
          </span>

          {/* Animated luxury hairline bar */}
          <div className="w-20 h-[1.5px] bg-[#E5DFD3] overflow-hidden relative rounded-full mt-1">
            <div
              className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#1A1917] to-transparent -translate-x-full motion-reduce:hidden"
              style={{ animation: "velmoraHairlineShimmer 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
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
        className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FBF9F5]/95 backdrop-blur-md text-[#1A1917] overflow-hidden ${className}`}
      >
        {/* Custom font definitions and keyframe */}
        <style>{`
          .font-editorial-serif {
            font-family: 'EB Garamond', 'Newsreader', 'Cormorant Garamond', Georgia, serif;
          }
          .font-interface-sans {
            font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          @keyframes velmoraHairlineShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>

        {/* Editorial corner frame accents */}
        <div className="absolute top-8 left-8 w-10 h-10 border-l border-t border-[#D5CEBF] pointer-events-none hidden sm:block" />
        <div className="absolute top-8 right-8 w-10 h-10 border-r border-t border-[#D5CEBF] pointer-events-none hidden sm:block" />
        <div className="absolute bottom-8 left-8 w-10 h-10 border-l border-b border-[#D5CEBF] pointer-events-none hidden sm:block" />
        <div className="absolute bottom-8 right-8 w-10 h-10 border-r border-b border-[#D5CEBF] pointer-events-none hidden sm:block" />

        {/* Subtle background brand watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.035]">
          <span className="font-editorial-serif text-[40vw] font-normal text-[#1A1917] leading-none tracking-tight">
            V
          </span>
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
      className={`relative w-full flex items-center justify-center min-h-[160px] bg-[#F5F2EB]/60 border border-[#ECE7DD] text-[#1A1917] ${className}`}
    >
      <style>{`
        .font-editorial-serif {
          font-family: 'EB Garamond', 'Newsreader', 'Cormorant Garamond', Georgia, serif;
        }
        .font-interface-sans {
          font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        @keyframes velmoraHairlineShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
      {loaderContent}
    </div>
  );
}
