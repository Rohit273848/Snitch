import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

// --- Google Fonts loader
function FontLoader() {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap";
        document.head.appendChild(link);
    }, []);
    return null;
}

// --- Icons
const icons = {
    mail: (<path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />),
    lock: (<path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />),
    eyeOff: (<path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.026 10.026 0 013.98-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m-6.158-6.158a3 3 0 104.243 4.243m-4.243-4.243L3 3l18 18" />),
    eye: (<><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></>),
    arrow: (<path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />),
};

function Icon({ name, className = "w-4 h-4", strokeWidth = "1.5" }) {
    return <svg className={className} fill="none" stroke="currentColor" strokeWidth={strokeWidth} viewBox="0 0 24 24">{icons[name]}</svg>;
}

function Spinner() {
    return (
        <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
    );
}

// --- Input Field
function InputField({ id, name, label, type = "text", icon, value, onChange, onFocus, onBlur, placeholder, error, focused, autoFocus, autoComplete, rightEl }) {
    const isActive = focused === name;
    return (
        <div className="group">
            <label htmlFor={id} className={`block text-[10px] font-medium tracking-[0.15em] uppercase mb-3 transition-colors duration-200 ${isActive ? "text-yellow-500" : error ? "text-red-400" : "text-zinc-500"}`}>{label}</label>
            <div className="relative">
                <span className={`absolute left-0 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isActive ? "text-yellow-500" : "text-zinc-600"}`}><Icon name={icon} className="w-[15px] h-[15px]" /></span>
                <input id={id} name={name} type={type} autoFocus={autoFocus} autoComplete={autoComplete} value={value} onChange={onChange} onFocus={onFocus} onBlur={onBlur} placeholder={placeholder}
                    className={`w-full h-12 pl-6 ${rightEl ? "pr-9" : "pr-0"} bg-transparent text-white text-sm placeholder-zinc-700 outline-none border-b transition-all duration-300 ${error ? "border-red-500/60" : isActive ? "border-yellow-500" : "border-zinc-800 hover:border-zinc-600"}`} />
                {rightEl && <div className="absolute right-0 top-1/2 -translate-y-1/2">{rightEl}</div>}
            </div>
            <div className={`h-px bg-yellow-500 transition-all duration-300 origin-left ${isActive && !error ? "scale-x-100" : "scale-x-0"}`} />
            {error && <p className="mt-2 text-[11px] text-red-400 tracking-wide flex items-center gap-1.5" style={{ animation: "slideDown 0.15s ease-out" }}><span className="w-1 h-1 rounded-full bg-red-400 inline-block flex-shrink-0" />{error}</p>}
        </div>
    );
}

// --- Login Page
export default function Login() {
    const navigate = useNavigate();
    const { handleLogin } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focused, setFocused] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [apiError, setApiError] = useState("");

    useEffect(() => { const t = setTimeout(() => setMounted(true), 50); return () => clearTimeout(t); }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        if (apiError) setApiError("");
    };

    const validate = () => {
        const e = {};
        if (!formData.email.trim()) { e.email = "Email address is required"; }
        else if (!/\S+@\S+\.\S+/.test(formData.email)) { e.email = "Enter a valid email"; }
        if (!formData.password) { e.password = "Password is required"; }
        else if (formData.password.length < 6) { e.password = "Min. 6 characters"; }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setIsSubmitting(true);
        setApiError("");
        try {
            const user = await handleLogin({ email: formData.email, password: formData.password });
            if (user.role == "seller") {
                navigate("/seller/dashboard")
            } else if (user.role == "buyer") {
                navigate("/");
            }
        } catch (err) {
            setApiError(err?.message || "Invalid email or password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const field = (name) => ({ name, id: name, value: formData[name], onChange: handleChange, onFocus: () => setFocused(name), onBlur: () => setFocused(null), focused, error: errors[name] });

    return (
        <>
            <FontLoader />
            <style>{`
                *, *::before, *::after { font-family: 'Hanken Grotesk', ui-sans-serif, system-ui, sans-serif; }
                .font-mono-label { font-family: 'JetBrains Mono', 'Courier New', monospace; }
                @keyframes panelIn { from { opacity: 0; transform: translateX(-32px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes formIn  { from { opacity: 0; transform: translateY(24px);  } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes marquee { from { transform: translateY(0); } to { transform: translateY(-50%); } }
                @keyframes pulse-glow { 0%, 100% { opacity: 0.06; } 50% { opacity: 0.12; } }
                @keyframes errorShake { 0%,100% { transform: translateX(0); } 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(4px); } }
                .marquee-track { animation: marquee 22s linear infinite; }
                .s-glow { animation: pulse-glow 5s ease-in-out infinite; }
                .panel-in { animation: panelIn 0.7s cubic-bezier(0.22,1,0.36,1) both; }
                .form-in  { animation: formIn  0.65s cubic-bezier(0.22,1,0.36,1) 0.15s both; }
                input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus {
                    -webkit-box-shadow: 0 0 0 1000px #0e0e0e inset; -webkit-text-fill-color: #fff; caret-color: #fff;
                }
            `}</style>

            <main className="min-h-screen w-full flex bg-[#0a0a0a] selection:bg-yellow-500 selection:text-black overflow-hidden" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>

                {/* LEFT PANEL */}
                <div className={`hidden lg:flex flex-col relative w-[44%] xl:w-[42%] min-h-screen bg-[#0a0a0a] border-r border-zinc-900 overflow-hidden ${mounted ? "panel-in" : "opacity-0"}`}>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                        <span className="s-glow text-[28vw] font-black text-white leading-none tracking-tighter" style={{ opacity: 0.06 }}>S</span>
                    </div>
                    <div className="absolute left-6 top-0 bottom-0 w-5 overflow-hidden pointer-events-none select-none opacity-[0.07]">
                        <div className="marquee-track flex flex-col gap-8">
                            {Array.from({ length: 10 }).map((_, i) => (
                                <span key={i} className="font-mono-label text-[9px] tracking-[0.4em] uppercase text-white" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>SNITCH — WEAR THE FUTURE —</span>
                            ))}
                        </div>
                    </div>
                    <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-zinc-800 pointer-events-none" />
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-zinc-800 pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between px-10 pt-10">
                        <Link to="/" className="inline-flex items-center gap-2.5 group">
                            <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base shadow-lg shadow-yellow-500/20 group-hover:shadow-yellow-500/40 transition-shadow duration-300">S</span>
                            <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white font-mono-label">SNITCH</span>
                        </Link>
                        <span className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-zinc-600">SS / 2025</span>
                    </div>

                    <div className="relative z-10 flex-1 flex flex-col justify-center px-10 xl:px-14">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="h-px w-8 bg-yellow-500" />
                            <span className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-yellow-500">02 / Return</span>
                        </div>
                        <h2 className="text-5xl xl:text-6xl font-black leading-[0.95] tracking-[-0.04em] text-white mb-10 uppercase">
                            Back<br />In<br /><span className="text-yellow-500">Style.</span>
                        </h2>
                        <p className="text-sm text-zinc-500 leading-relaxed max-w-[260px] mb-12 font-light tracking-wide">
                            Welcome back. Your exclusive wardrobe and curated drops are waiting. Sign in to continue.
                        </p>
                        <div className="space-y-4">
                            {[
                                { label: "Your Orders", desc: "Track all deliveries in real-time" },
                                { label: "Saved Looks", desc: "Resume your wishlist & favourites" },
                                { label: "Member Deals", desc: "Access private member-only offers" },
                            ].map(({ label, desc }) => (
                                <div key={label} className="flex items-start gap-4 group cursor-default">
                                    <div className="mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-500 group-hover:scale-150 transition-transform duration-300" />
                                    <div>
                                        <p className="text-[12px] font-semibold text-zinc-200 group-hover:text-white transition-colors tracking-wide">{label}</p>
                                        <p className="text-[11px] text-zinc-600 mt-0.5 tracking-wide">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative z-10 px-10 pb-10">
                        <div className="h-px w-full bg-zinc-900 mb-6" />
                        <p className="font-mono-label text-[9px] tracking-[0.15em] uppercase text-zinc-700">© {new Date().getFullYear()} SNITCH Inc. — All rights reserved</p>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 min-h-screen bg-[#0e0e0e] flex flex-col overflow-y-auto">
                    <div className="lg:hidden flex items-center justify-between px-6 pt-8 pb-4 border-b border-zinc-900">
                        <Link to="/" className="inline-flex items-center gap-2.5">
                            <span className="h-8 w-8 rounded-md bg-yellow-500 flex items-center justify-center text-black font-black text-base">S</span>
                            <span className="text-[13px] font-bold tracking-[0.3em] uppercase text-white">SNITCH</span>
                        </Link>
                    </div>

                    <div className={`flex-1 flex items-center justify-center px-6 py-14 lg:py-0 ${mounted ? "form-in" : "opacity-0"}`}>
                        <div className="w-full max-w-[420px]">

                            <div className="flex items-center gap-2 mb-10">
                                <span className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-zinc-700">Account</span>
                                <span className="text-zinc-800">/</span>
                                <span className="font-mono-label text-[9px] tracking-[0.2em] uppercase text-yellow-500">Login</span>
                            </div>

                            <div className="mb-8">
                                <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.04em] text-white leading-[0.95] uppercase mb-5">Welcome<br />Back</h1>
                                <div className="flex items-center gap-4">
                                    <div className="h-[2px] w-10 bg-yellow-500" />
                                    <p className="text-[12px] text-zinc-500 tracking-wide">Sign in to your SNITCH account</p>
                                </div>
                            </div>

                            {apiError && (
                                <div className="mb-6 px-4 py-3 border border-red-500/30 bg-red-500/5 flex items-center gap-3" style={{ animation: "errorShake 0.4s ease-out" }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                    <p className="text-[12px] text-red-400 tracking-wide">{apiError}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} noValidate className="space-y-7">
                                <InputField {...field("email")} label="Email Address" type="email" icon="mail" placeholder="alexander@example.com" autoFocus autoComplete="email" />
                                <InputField {...field("password")} label="Password" type={showPassword ? "text" : "password"} icon="lock" placeholder="Your password" autoComplete="current-password"
                                    rightEl={
                                        <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"}
                                            className="text-zinc-600 hover:text-zinc-300 focus:text-yellow-500 focus:outline-none transition-colors duration-150 p-0.5">
                                            <Icon name={showPassword ? "eyeOff" : "eye"} className="w-4 h-4" />
                                        </button>
                                    }
                                />

                                <div className="flex justify-end -mt-3">
                                    <button type="button" className="font-mono-label text-[9px] tracking-[0.15em] uppercase text-zinc-600 hover:text-yellow-500 transition-colors duration-150 focus:outline-none focus:text-yellow-500">
                                        Forgot Password?
                                    </button>
                                </div>



                                <div className="pt-2">
                                    <button type="submit" disabled={isSubmitting}
                                        className="w-full h-14 bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-black font-bold text-[13px] tracking-[0.12em] uppercase flex items-center justify-between px-7 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer group"
                                        style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}>
                                        {isSubmitting ? (
                                            <span className="flex items-center gap-3 mx-auto"><Spinner />Signing In…</span>
                                        ) : (
                                            <><span>Sign In</span><Icon name="arrow" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" strokeWidth="2.5" /></>
                                        )}
                                    </button>
                                    <div className="w-full h-1 bg-yellow-500/20 mt-px" style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }} />
                                </div>
                                <ContinueWithGoogle />

                                <div className="flex items-center justify-center gap-3 pt-1">
                                    <div className="h-px flex-1 bg-zinc-900" />
                                    <p className="text-[11px] text-zinc-600 tracking-wider font-mono-label">
                                        New to SNITCH? <Link to="/register" className="text-yellow-500 hover:text-yellow-400 font-semibold underline-offset-4 hover:underline transition-colors duration-150">Create Account</Link>
                                    </p>
                                    <div className="h-px flex-1 bg-zinc-900" />
                                </div>
                            </form>

                            <div className="mt-10 flex items-center justify-center gap-2 opacity-40">
                                <svg className="w-3 h-3 text-zinc-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                                </svg>
                                <span className="font-mono-label text-[9px] tracking-[0.15em] uppercase text-zinc-500">256-bit SSL encrypted</span>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
