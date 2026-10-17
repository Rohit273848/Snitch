import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/useAuth";
import ContinueWithGoogle from "../components/ContinueWithGoogle";

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function UserIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
    );
}

function PhoneIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
        </svg>
    );
}

function MailIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
    );
}

function LockIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
    );
}

function EyeIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

function EyeSlashIcon({ className = "w-4 h-4" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="1.6" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
    );
}

function CheckShieldIcon({ className = "w-3.5 h-3.5" }) {
    return (
        <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
    );
}

// ─── Input Field Component ────────────────────────────────────────────────────
function FormInput({
    id,
    name,
    label,
    type = "text",
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder,
    error,
    autoFocus = false,
    autoComplete,
    rightEl = null,
    icon = null,
}) {
    return (
        <div className="space-y-1.5 font-interface-sans">
            <label
                htmlFor={id}
                className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#6C685F]"
            >
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A857B] pointer-events-none">
                        {icon}
                    </div>
                )}
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    className={`w-full h-12 bg-white text-[#1A1917] text-xs sm:text-sm placeholder-[#A39E93] border ${
                        error
                            ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                            : "border-[#D5CEBF] hover:border-[#1A1917] focus:border-[#1A1917] focus:ring-1 focus:ring-[#1A1917]"
                    } outline-none transition-all duration-200 ${icon ? "pl-10" : "pl-4"} ${rightEl ? "pr-11" : "pr-4"}`}
                />
                {rightEl && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A857B]">
                        {rightEl}
                    </div>
                )}
            </div>
            {error && (
                <p className="text-[11px] text-red-600 tracking-wide flex items-center gap-1.5 pt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
                    <span>{error}</span>
                </p>
            )}
        </div>
    );
}

export default function Register() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { handleRegister } = useAuth();
    const user = useSelector((state) => state.auth.user);

    const [formData, setFormData] = useState({
        fullname: "",
        contactNumber: "",
        email: "",
        password: "",
        isSeller: false,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState("");

    useEffect(() => {
        if (user) {
            navigate(user.role === "seller" ? "/seller/dashboard" : "/", { replace: true });
        }
    }, [user, navigate]);

    useEffect(() => {
        const errorParam = searchParams.get("error");
        if (errorParam === "auth_failed") {
            setApiError("Google registration could not be completed. Please try again or use standard registration.");
        } else if (errorParam === "no_email") {
            setApiError("No email address was provided by your Google account. Please use standard registration.");
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
        if (apiError) setApiError("");
    };

    const validate = () => {
        const e = {};
        if (!formData.fullname.trim()) {
            e.fullname = "Full name is required";
        }
        if (!formData.contactNumber.trim()) {
            e.contactNumber = "Contact number is required";
        } else if (!/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(formData.contactNumber.trim())) {
            e.contactNumber = "Enter a valid phone number";
        }
        if (!formData.email.trim()) {
            e.email = "Email address is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
            e.email = "Please enter a valid email address";
        }
        if (!formData.password) {
            e.password = "Password is required";
        } else if (formData.password.length < 6) {
            e.password = "Password must be at least 6 characters";
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setIsSubmitting(true);
        setApiError("");
        try {
            const user = await handleRegister({
                email: formData.email.trim(),
                contact: formData.contactNumber.trim(),
                password: formData.password,
                fullname: formData.fullname.trim(),
                isSeller: formData.isSeller,
            });

            if (user?.role === "seller") {
                navigate("/seller/dashboard");
            } else {
                navigate("/");
            }
        } catch (err) {
            setApiError(err?.response?.data?.message || err?.message || "Failed to create account. Please check your information.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

            {/* ─── Main Content Split ─────────────────────────────────────────── */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 sm:py-14 flex items-center justify-center">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 w-full items-stretch">

                    {/* ─── LEFT COLUMN: ATELIER SHOWCASE BANNER ────────────────────── */}
                    <div className="hidden lg:flex lg:col-span-5 bg-[#F5F2EB] border border-[#ECE7DD] p-10 flex-col justify-between relative overflow-hidden">
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#4A5340]" />
                                <span className="font-interface-sans text-[10px] font-semibold tracking-[0.24em] text-[#6C685F] uppercase">
                                    CLIENT REGISTRATION
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h2 className="font-editorial-serif text-4xl xl:text-5xl font-normal text-[#1A1917] leading-[1.08] tracking-tight">
                                    Join the Velmora <span className="italic font-normal">Circle.</span>
                                </h2>
                                <p className="font-interface-sans text-xs text-[#6C685F] leading-relaxed">
                                    Create your Atelier profile to unlock complimentary expedited courier transit, tailored wardrobe recommendations, and priority access to limited seasonal runs.
                                </p>
                            </div>

                            {/* Client Perks List */}
                            <div className="pt-6 space-y-4 border-t border-[#E5DFD3] font-interface-sans">
                                {[
                                    {
                                        title: "Complimentary Carbon-Neutral Transit",
                                        desc: "Expedited courier delivery unlocked on all qualified wardrobe acquisitions.",
                                    },
                                    {
                                        title: "Bespoke Measurement Vault",
                                        desc: "Store your fit attributes for personalized sizing across every garment.",
                                    },
                                    {
                                        title: "Merchant Studio Access",
                                        desc: "Optionally register as a verified studio merchant to list menswear drops.",
                                    },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <div className="w-5 h-5 rounded-full bg-[#EAE5D9] text-[#1A1917] flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                                            ✓
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-[#1A1917] uppercase tracking-wider">
                                                {item.title}
                                            </p>
                                            <p className="text-[11px] text-[#6C685F] leading-normal pt-0.5">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Subtle Editorial Tailoring Watermark Quote */}
                        <div className="pt-8 border-t border-[#E5DFD3] relative z-10 font-interface-sans">
                            <p className="font-editorial-serif italic text-sm text-[#5A564D]">
                                "Garments designed with patience, made with intention, cut for modern longevity."
                            </p>
                            <span className="text-[9px] font-semibold tracking-[0.2em] uppercase text-[#8A857B] block pt-1">
                                Velmora Heritage • Collection Look 01
                            </span>
                        </div>
                    </div>

                    {/* ─── RIGHT COLUMN: REGISTRATION FORM CARD ───────────────────── */}
                    <div className="lg:col-span-7 flex items-center justify-center">
                        <div className="w-full max-w-lg bg-[#FFFFFF] border border-[#ECE7DD] p-6 sm:p-10 shadow-xs space-y-6">

                            {/* Form Header */}
                            <div className="space-y-1.5 border-b border-[#ECE7DD] pb-5">
                                <span className="font-interface-sans text-[10px] font-semibold tracking-[0.22em] text-[#6C685F] uppercase block">
                                    NEW ACCOUNT / ONBOARDING
                                </span>
                                <h1 className="font-editorial-serif text-3xl sm:text-4xl font-normal text-[#1A1917] tracking-tight">
                                    Create Atelier Account
                                </h1>
                                <p className="font-interface-sans text-xs text-[#6C685F] leading-relaxed">
                                    Complete your details to register as a client or atelier merchant.
                                </p>
                            </div>

                            {/* Error Banner */}
                            {apiError && (
                                <div className="p-3.5 bg-[#FDF5F5] border border-[#E5B8B8] text-[#9E2A2B] text-xs font-interface-sans space-y-1">
                                    <div className="flex items-center gap-2 font-semibold">
                                        <span>⚠</span>
                                        <span>Registration Notice</span>
                                    </div>
                                    <p className="text-[11px] text-[#7A2021] leading-relaxed">
                                        {apiError}
                                    </p>
                                </div>
                            )}

                            {/* Google OAuth Provider */}
                            <div className="space-y-4">
                                <ContinueWithGoogle />

                                {/* Divider */}
                                <div className="flex items-center gap-3">
                                    <div className="h-px bg-[#ECE7DD] flex-1" />
                                    <span className="font-interface-sans text-[9px] font-semibold tracking-[0.2em] uppercase text-[#8A857B]">
                                        Or Register with Email
                                    </span>
                                    <div className="h-px bg-[#ECE7DD] flex-1" />
                                </div>
                            </div>

                            {/* Traditional Registration Form */}
                            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                                <FormInput
                                    id="fullname"
                                    name="fullname"
                                    label="Full Name"
                                    type="text"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="e.g. Julian Hayes"
                                    autoComplete="name"
                                    autoFocus
                                    error={errors.fullname}
                                    icon={<UserIcon className="w-4 h-4" />}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormInput
                                        id="email"
                                        name="email"
                                        label="Email Address"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="julian@example.com"
                                        autoComplete="email"
                                        error={errors.email}
                                        icon={<MailIcon className="w-4 h-4" />}
                                    />

                                    <FormInput
                                        id="contactNumber"
                                        name="contactNumber"
                                        label="Contact Number"
                                        type="tel"
                                        value={formData.contactNumber}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        autoComplete="tel"
                                        error={errors.contactNumber}
                                        icon={<PhoneIcon className="w-4 h-4" />}
                                    />
                                </div>

                                <FormInput
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 6 characters"
                                    autoComplete="new-password"
                                    error={errors.password}
                                    icon={<LockIcon className="w-4 h-4" />}
                                    rightEl={
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="hover:text-[#1A1917] transition-colors cursor-pointer p-1"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeSlashIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                        </button>
                                    }
                                />

                                {/* Atelier Merchant / Seller Toggle Box */}
                                <div className="p-3.5 rounded-none bg-[#F7F5F0] border border-[#E5DFD3] flex items-center justify-between cursor-pointer"
                                     onClick={() => setFormData((prev) => ({ ...prev, isSeller: !prev.isSeller }))}>
                                    <div className="space-y-0.5 font-interface-sans pr-3">
                                        <p className="text-xs font-semibold text-[#1A1917] uppercase tracking-wider">
                                            Register as Atelier Seller
                                        </p>
                                        <p className="text-[11px] text-[#6C685F] leading-tight">
                                            Enable seller dashboard to publish garments, manage inventory, and fulfill client orders.
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id="isSeller"
                                        name="isSeller"
                                        checked={formData.isSeller}
                                        onChange={handleChange}
                                        className="w-4 h-4 accent-[#1A1917] cursor-pointer"
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </div>

                                {/* Terms Notice */}
                                <p className="text-[10px] text-[#8A857B] font-interface-sans leading-relaxed pt-1">
                                    By registering, you agree to the Velmora{" "}
                                    <Link to="/" className="underline text-[#1A1917]">Terms of Service</Link> and{" "}
                                    <Link to="/" className="underline text-[#1A1917]">Privacy Policy</Link>.
                                </p>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 bg-[#1A1917] hover:bg-[#32312D] disabled:opacity-60 text-[#FBF9F5] font-interface-sans text-xs sm:text-[13px] font-semibold tracking-[0.2em] uppercase transition-all duration-200 active:scale-[0.99] shadow-sm cursor-pointer flex items-center justify-center gap-2 mt-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Creating Atelier Account...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Register Account</span>
                                            <span>→</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Bottom Switcher */}
                            <div className="pt-2 border-t border-[#ECE7DD] text-center font-interface-sans text-xs text-[#6C685F]">
                                <span>Already registered with Velmora? </span>
                                <Link
                                    to="/login"
                                    className="font-semibold text-[#1A1917] underline hover:text-[#4A5340] tracking-wider transition-colors ml-1 uppercase text-[11px]"
                                >
                                    Sign In Here →
                                </Link>
                            </div>

                            {/* Security Notice */}
                            <div className="flex items-center justify-center gap-2 pt-1 text-[10px] font-interface-sans uppercase tracking-[0.18em] text-[#8A857B]">
                                <CheckShieldIcon className="w-3.5 h-3.5 text-[#4A5340]" />
                                <span>256-Bit SSL Encrypted • Atelier Privacy Protected</span>
                            </div>

                        </div>
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
