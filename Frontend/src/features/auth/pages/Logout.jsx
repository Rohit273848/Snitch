import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";

function ShieldCheckIcon({ className = "w-6 h-6" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

export default function Logout() {
    const navigate = useNavigate();
    const { handleLogout } = useAuth();
    const [isDone, setIsDone] = useState(false);

    useEffect(() => {
        let mounted = true;
        const doLogout = async () => {
            try {
                await handleLogout();
            } catch (err) {
                console.error("Logout error:", err);
            } finally {
                if (mounted) setIsDone(true);
            }
        };

        doLogout();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#FBF9F5] text-[#1A1917] selection:bg-[#1A1917] selection:text-[#FBF9F5] antialiased flex flex-col justify-between">
            {/* Custom font definitions matching reference design system */}
            <style>{`
                .font-editorial-serif {
                    font-family: 'EB Garamond', 'Newsreader', 'Cormorant Garamond', Georgia, serif;
                }
                .font-interface-sans {
                    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
            `}</style>

            {/* ─── Top Minimal Brand Header ────────────────────────────────────── */}
            <header className="border-b border-[#ECE7DD] bg-[#FBF9F5]/90 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="w-8 h-8 rounded-full bg-[#1A1917] text-[#FBF9F5] flex items-center justify-center font-editorial-serif text-lg font-bold">
                            V
                        </span>
                        <div className="flex flex-col">
                            <span className="font-editorial-serif text-lg sm:text-xl font-semibold tracking-wider text-[#1A1917]">
                                VELMORA
                            </span>
                            <span className="text-[8.5px] uppercase tracking-[0.24em] text-[#6C685F] -mt-1 font-interface-sans">
                                Atelier Menswear
                            </span>
                        </div>
                    </Link>

                    <Link
                        to="/"
                        className="text-[10px] sm:text-[11px] font-interface-sans font-semibold tracking-[0.2em] uppercase text-[#6C685F] hover:text-[#1A1917] transition-colors"
                    >
                        ← Return to Shop
                    </Link>
                </div>
            </header>

            {/* ─── Main Content Card ──────────────────────────────────────────── */}
            <main className="flex-1 max-w-xl w-full mx-auto px-4 sm:px-6 py-16 sm:py-24 flex items-center justify-center">
                <div className="w-full bg-[#FFFFFF] border border-[#ECE7DD] p-8 sm:p-12 shadow-xs text-center space-y-7 animate-in zoom-in-95">

                    {/* Emblem Badge */}
                    <div className="w-16 h-16 rounded-full bg-[#F5F2EB] border border-[#E5DFD3] flex items-center justify-center mx-auto text-[#4A5340] shadow-2xs">
                        <ShieldCheckIcon className="w-8 h-8" />
                    </div>

                    {/* Headline and Eyebrow */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-interface-sans uppercase tracking-[0.24em] text-[#6C685F] font-semibold">
                            SESSION CONCLUDED
                        </span>
                        <h1 className="font-editorial-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1917] tracking-tight">
                            You Have Been Signed Out
                        </h1>
                        <p className="font-interface-sans text-xs text-[#6C685F] max-w-sm mx-auto leading-relaxed pt-1">
                            Your Atelier credentials have been cleared and your session has ended securely. We look forward to welcoming you back.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3.5 font-interface-sans">
                        <Link
                            to="/login"
                            className="w-full sm:w-auto px-8 py-3.5 bg-[#1A1917] hover:bg-[#32312D] text-[#FBF9F5] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 text-center shadow-sm"
                        >
                            <span>Sign In Again →</span>
                        </Link>
                        <Link
                            to="/"
                            className="w-full sm:w-auto px-8 py-3.5 border border-[#D5CEBF] hover:border-[#1A1917] hover:bg-[#F7F5F0] text-[#1A1917] text-xs font-semibold tracking-[0.2em] uppercase transition-all duration-200 text-center"
                        >
                            Return to Shop
                        </Link>
                    </div>

                    {/* Security Notice */}
                    <div className="pt-4 border-t border-[#ECE7DD] text-[10px] font-interface-sans uppercase tracking-[0.18em] text-[#8A857B]">
                        256-Bit SSL Encrypted • Atelier Privacy Guaranteed
                    </div>

                </div>
            </main>

            {/* ─── Footer Strip ────────────────────────────────────────────────── */}
            <footer className="border-t border-[#ECE7DD] py-6 bg-[#FBF9F5] font-interface-sans text-center text-[10px] uppercase tracking-[0.2em] text-[#8A857B]">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span>© {new Date().getFullYear()} VELMORA ATELIER INC. ALL RIGHTS RESERVED.</span>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="hover:text-[#1A1917] transition-colors">Client Services</Link>
                        <Link to="/" className="hover:text-[#1A1917] transition-colors">Privacy Policy</Link>
                        <Link to="/" className="hover:text-[#1A1917] transition-colors">Terms of Atelier</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
