import React from "react";

const ContinueWithGoogle = () => {
    const handleGoogleLogin = () => {
        window.location.href = `/api/auth/google`;
    };
    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4  bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
        >
            <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    fill="#4285F4"
                    d="M21.35 12.23c0-.79-.07-1.55-.22-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                />
                <path
                    fill="#34A853"
                    d="M12 21.8c2.63 0 4.84-.87 6.45-2.35l-3.14-2.45c-.87.58-1.98.93-3.31.93-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.8Z"
                />
                <path
                    fill="#FBBC05"
                    d="M6.53 13.9A5.86 5.86 0 0 1 6.22 12c0-.66.11-1.3.31-1.9V7.57H3.29A9.74 9.74 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.43l3.24-2.53Z"
                />
                <path
                    fill="#EA4335"
                    d="M12 6.07c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.12 14.63 2.2 12 2.2a9.74 9.74 0 0 0-8.71 5.37l3.24 2.53C7.3 7.79 9.46 6.07 12 6.07Z"
                />
            </svg>

            <span>Continue with Google</span>
        </button>
    )
}

export default ContinueWithGoogle;