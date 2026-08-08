# Google OAuth 2.0 Authentication with React, Express, Passport, JWT & HTTP-Only Cookies

## 1. Overview

This document explains how to implement **"Continue with Google" authentication** in a MERN-style application using:

* React + Vite
* Node.js
* Express
* Passport.js
* `passport-google-oauth20`
* MongoDB + Mongoose
* JWT
* HTTP-only cookies
* Google OAuth 2.0

The authentication flow allows a user to:

1. Click **Continue with Google**.
2. Get redirected to Google.
3. Authenticate with their Google account.
4. Google redirects back to the backend.
5. Passport verifies the Google account.
6. Backend finds or creates the user.
7. Backend generates a JWT.
8. JWT is stored in an HTTP-only cookie.
9. User is redirected back to the frontend.

---

# 2. Complete Authentication Flow

```text
                    USER
                      |
                      | Click "Continue with Google"
                      ↓
              React Login/Register
                      |
                      | GET /api/auth/google
                      ↓
              Express Backend
                      |
                      ↓
            Passport Google Strategy
                      |
                      | Redirect
                      ↓
                Google OAuth
                      |
                      | User authenticates
                      ↓
          Google redirects to backend
                      |
                      | /api/auth/google/callback
                      ↓
            Passport verifies user
                      |
                      ↓
       googleCallBackController
                      |
              ┌───────┴────────┐
              ↓                ↓
        Find existing       Create new
             user              user
              └───────┬────────┘
                      ↓
                Generate JWT
                      ↓
             Set HTTP-only cookie
                      ↓
            Redirect to frontend
                      ↓
                React application
```

The important idea is:

> **Google authentication happens through browser redirects, not through Axios/fetch API calls.**

---

# 3. Required Packages

Backend:

```bash
npm install passport passport-google-oauth20 jsonwebtoken cookie-parser cors dotenv
```

Frontend does not need a special Google OAuth package for this implementation.

The browser itself handles the Google redirect.

---

# 4. Environment Variables

Create a `.env` file in the backend:

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NODE_ENV=development

PORT=3000

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
```

## What each variable means

### `GOOGLE_CLIENT_ID`

Identifies your application to Google.

### `GOOGLE_CLIENT_SECRET`

Secret credential used by the backend during OAuth authentication.

Never expose this in frontend code.

### `CLIENT_URL`

URL of your React frontend.

Development:

```text
http://localhost:5173
```

Production:

```text
https://your-frontend.vercel.app
```

### `SERVER_URL`

URL of your Express backend.

Development:

```text
http://localhost:3000
```

Production:

```text
https://your-backend.onrender.com
```

---

# 5. Google Cloud Configuration

In Google Cloud Console, create an OAuth 2.0 Client ID.

For development, the authorized redirect URI should match:

```text
http://localhost:3000/api/auth/google/callback
```

For production:

```text
https://your-backend.onrender.com/api/auth/google/callback
```

The redirect URI must match exactly.

For example:

```text
http://localhost:3000/api/auth/google/callback
```

and

```text
http://localhost:3000/api/auth/google/callback/
```

are different URLs.

---

# 6. Backend Configuration

File:

```text
Backend/src/config/config.js
```

```javascript
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
    console.error("Error: Missing MONGO_URI environment variable");
    process.exit(1);
}

if (!process.env.JWT_SECRET) {
    console.error("Error: Missing JWT_SECRET environment variable");
    process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Error: Missing GOOGLE_CLIENT_SECRET environment variable");
    process.exit(1);
}

if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Error: Missing GOOGLE_CLIENT_ID environment variable");
    process.exit(1);
}

export const config = {
    mongo_uri: process.env.MONGO_URI,
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,

    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,

    NODE_ENV: process.env.NODE_ENV,

    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
};
```

## Why validate environment variables?

Without validation, this:

```javascript
clientID: config.GOOGLE_CLIENT_ID
```

could silently become:

```javascript
clientID: undefined
```

Then Passport throws:

```text
TypeError: OAuth2Strategy requires a clientID option
```

Failing early with a clear configuration error is much easier to debug.

---

# 7. Configure Passport

File:

```text
Backend/src/app.js
```

Import:

```javascript
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "./config/config.js";
```

Initialize Passport:

```javascript
app.use(passport.initialize());
```

Then configure Google Strategy:

```javascript
passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: `${config.SERVER_URL}/api/auth/google/callback`,
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);
```

## What happens here?

Passport receives:

```javascript
clientID
clientSecret
callbackURL
```

Google uses these values to identify your application and know where to send the user after authentication.

The callback:

```javascript
(accessToken, refreshToken, profile, done)
```

receives information from Google.

The important value for your implementation is:

```javascript
profile
```

It contains information such as:

```text
Google ID
Name
Email
Profile picture
```

You then pass the profile forward:

```javascript
return done(null, profile);
```

That profile becomes:

```javascript
req.user
```

inside the next middleware/controller.

---

# 8. Authentication Routes

File:

```text
Backend/src/routes/auth.routes.js
```

## Start Google authentication

```javascript
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);
```

When the browser visits:

```text
/api/auth/google
```

Passport redirects the user to Google.

The scopes:

```javascript
scope: ["profile", "email"]
```

request permission to access the user's basic profile and email.

---

# 9. Google Callback Route

```javascript
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect:
            config.NODE_ENV === "development"
                ? "http://localhost:5173/login"
                : "/login",
    }),
    googleCallBackController
);
```

The callback URL must match:

```javascript
callbackURL: `${config.SERVER_URL}/api/auth/google/callback`
```

and therefore:

```text
Development:
http://localhost:3000/api/auth/google/callback

Production:
https://your-backend.onrender.com/api/auth/google/callback
```

## `session: false`

Your application uses JWT authentication instead of Passport sessions.

Therefore:

```javascript
session: false
```

is appropriate.

Passport verifies the Google account, places the profile into:

```javascript
req.user
```

and then executes:

```javascript
googleCallBackController
```

---

# 10. Google Callback Controller

File:

```text
Backend/src/controllers/auth.controller.js
```

The controller receives the authenticated Google profile.

```javascript
export const googleCallBackController = async (req, res) => {
    try {
        const { id, emails, displayName } = req.user;

        const email = emails?.[0]?.value;

        if (!email) {
            return res.status(400).json({
                message: "Google account email not available",
            });
        }

        let user = await userModel.findOne({ email });

        if (!user) {
            user = await userModel.create({
                email,
                fullname: displayName,
                role: "buyer",
                googleID: id,
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            config.jwt_secret,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite:
                config.NODE_ENV === "production"
                    ? "None"
                    : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.redirect(config.CLIENT_URL);

    } catch (error) {
        res.redirect(config.CLIENT_URL);
    }
};
```

---

# 11. Finding or Creating the User

First, get the email:

```javascript
const email = emails?.[0]?.value;
```

Then search MongoDB:

```javascript
let user = await userModel.findOne({ email });
```

If the user exists:

```text
Google account
      ↓
Email
      ↓
MongoDB
      ↓
Existing user
```

No new account is created.

If the user doesn't exist:

```javascript
user = await userModel.create({
    email,
    fullname: displayName,
    role: "buyer",
    googleID: id,
});
```

This creates the account automatically.

The user therefore doesn't need to manually register first.

---

# 12. User Model for Google Authentication

The password field needs to support users who authenticate through Google.

```javascript
password: {
    type: String,
    required: function () {
        return !this.googleID;
    }
},

googleID: {
    type: String,
}
```

## Why?

Normal registration:

```text
Email
Password
Name
       ↓
Normal account
```

Google registration:

```text
Google ID
Email
Name
       ↓
Google account
```

A Google-authenticated user doesn't need a local password.

Therefore:

```javascript
return !this.googleID;
```

means:

```text
googleID exists
    ↓
password not required

googleID doesn't exist
    ↓
password required
```

This is an important part of supporting both normal authentication and Google authentication in the same user collection.

---

# 13. Generate JWT

After finding or creating the user:

```javascript
const token = jwt.sign(
    {
        id: user._id,
    },
    config.jwt_secret,
    {
        expiresIn: "7d",
    }
);
```

The JWT contains:

```javascript
{
    id: user._id
}
```

and expires after:

```text
7 days
```

The JWT is then stored in a cookie.

---

# 14. HTTP-Only Cookie

```javascript
res.cookie("token", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite:
        config.NODE_ENV === "production"
            ? "None"
            : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});
```

## `httpOnly`

```javascript
httpOnly: true
```

Prevents frontend JavaScript from directly reading the cookie.

This is useful for protecting authentication tokens from JavaScript-based attacks such as XSS token theft.

## `secure`

Development:

```javascript
secure: false
```

Production:

```javascript
secure: true
```

With `secure: true`, the browser sends the cookie only over HTTPS.

## `sameSite`

Development:

```javascript
sameSite: "Lax"
```

Production with separate Vercel and Render domains:

```javascript
sameSite: "None"
```

## `maxAge`

```javascript
maxAge: 7 * 24 * 60 * 60 * 1000
```

The cookie lasts for 7 days.

---

# 15. Redirect Back to Frontend

After authentication:

```javascript
res.redirect(config.CLIENT_URL);
```

Development:

```env
CLIENT_URL=http://localhost:5173
```

Production:

```env
CLIENT_URL=https://your-frontend.vercel.app
```

This keeps the backend code environment-independent.

---

# 16. Frontend Google Button

File:

```text
Frontend/src/features/auth/components/ContinueWithGoogle.jsx
```

```jsx
import React from "react";

const ContinueWithGoogle = () => {
    const handleGoogleLogin = () => {
        window.location.href = `/api/auth/google`;
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 bg-gray-50 hover:bg-gray-100 transition cursor-pointer"
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
    );
};

export default ContinueWithGoogle;
```

---

# 17. Why `window.location.href`?

This is important.

You use:

```javascript
window.location.href = "/api/auth/google";
```

instead of:

```javascript
axios.get("/api/auth/google");
```

because Google OAuth is a **redirect-based authentication flow**.

The browser needs to navigate to:

```text
/api/auth/google
```

Then Passport redirects the browser to Google's authentication page.

The flow is:

```text
window.location.href
        ↓
Backend
        ↓
Passport
        ↓
Google
        ↓
Backend callback
        ↓
Frontend
```

Axios/fetch is not necessary for starting this flow.

---

# 18. Reusing the Button

The component can be reused on both login and registration pages.

Login:

```jsx
<ContinueWithGoogle />
```

Register:

```jsx
<ContinueWithGoogle />
```

This avoids duplicating the Google authentication implementation.

---

# 19. Vite Proxy

During development, you can configure Vite:

```javascript
server: {
    proxy: {
        "/api": {
            target: "http://localhost:3000",
            changeOrigin: true,
            secure: false,
        },
    },
}
```

Then:

```javascript
window.location.href = "/api/auth/google";
```

is sent to:

```text
http://localhost:5173/api/auth/google
```

and Vite forwards it to:

```text
http://localhost:3000/api/auth/google
```

The browser sees the request as going to the frontend origin.

---

# 20. Development vs Production

## Development

```text
Frontend
http://localhost:5173

Backend
http://localhost:3000
```

Vite proxy:

```text
/api
   ↓
http://localhost:3000
```

Environment:

```env
CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000
```

---

## Production

Frontend:

```text
https://your-frontend.vercel.app
```

Backend:

```text
https://your-backend.onrender.com
```

Environment:

```env
CLIENT_URL=https://your-frontend.vercel.app
SERVER_URL=https://your-backend.onrender.com
```

Google callback:

```text
https://your-backend.onrender.com/api/auth/google/callback
```

---

# 21. Important Production Difference

Your current frontend code uses:

```javascript
window.location.href = "/api/auth/google";
```

This works naturally with the Vite proxy during development.

However, **Vite's development proxy does not exist in production**.

Therefore, in a Vercel + Render deployment, you need one of these approaches:

### Approach A: Vercel rewrite/proxy

Configure Vercel to forward:

```text
/api/*
```

to your Render backend.

Then your frontend can continue using:

```javascript
window.location.href = "/api/auth/google";
```

### Approach B: Use the backend URL directly

Use an environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com
```

Then:

```javascript
window.location.href =
    `${import.meta.env.VITE_API_URL}/api/auth/google`;
```

This is often simpler for a beginner deployment.

---

# 22. Recommended Frontend Version for Deployment

```javascript
const handleGoogleLogin = () => {
    window.location.href =
        `${import.meta.env.VITE_API_URL}/api/auth/google`;
};
```

Development:

```env
VITE_API_URL=http://localhost:3000
```

Production:

```env
VITE_API_URL=https://your-backend.onrender.com
```

This makes the frontend independent of Vite's development proxy.

---

# 23. CORS Configuration

When frontend and backend have different origins, configure CORS on the backend.

```javascript
app.use(
    cors({
        origin: config.CLIENT_URL,
        credentials: true,
    })
);
```

Development:

```text
Frontend: http://localhost:5173
Backend:  http://localhost:3000
```

Production:

```text
Frontend: https://your-frontend.vercel.app
Backend:  https://your-backend.onrender.com
```

The backend should allow the frontend origin.

---

# 24. Common Errors

## Error 1

```text
OAuth2Strategy requires a clientID option
```

Cause:

```javascript
config.GOOGLE_CLIENT_ID
```

is `undefined`.

Check:

```env
GOOGLE_CLIENT_ID=...
```

and make sure `.env` is loaded.

---

## Error 2

```text
redirect_uri_mismatch
```

Cause:

The callback URL in Google Cloud does not exactly match your backend callback URL.

Check:

```text
Google Cloud Console
        ↓
Authorized redirect URIs
```

It must match:

```text
http://localhost:3000/api/auth/google/callback
```

or your production backend URL.

---

## Error 3

```text
Cannot read properties of undefined
```

Possible cause:

```javascript
emails[0].value
```

Use:

```javascript
emails?.[0]?.value
```

and validate the result.

---

## Error 4

Google authentication works, but the user isn't logged in afterward.

Check:

```javascript
res.cookie("token", token, ...)
```

and:

```javascript
withCredentials: true
```

for frontend API requests.

Also verify production cookie settings:

```javascript
secure: true
sameSite: "None"
```

when frontend and backend are on separate HTTPS sites.

---

## Error 5

User reaches the wrong page after Google login.

Check:

```env
CLIENT_URL=...
```

and:

```javascript
res.redirect(config.CLIENT_URL);
```

---

## Error 6

Frontend works locally but Google login doesn't work after deployment.

Check all four:

```text
1. VITE_API_URL
2. SERVER_URL
3. CLIENT_URL
4. Google Authorized Redirect URI
```

All four need to point to the correct environment.

---

# 25. Recommended Improvements to Current Implementation

Your current implementation works, but I would make these changes before copying it into future projects.

## Improvement 1: Production failure redirect

Instead of:

```javascript
failureRedirect:
    config.NODE_ENV == "development"
        ? "http://localhost:5173/login"
        : "/login"
```

prefer:

```javascript
failureRedirect: `${config.CLIENT_URL}/login`
```

This works in both development and production.

---

## Improvement 2: Don't hide callback errors

Your current catch block:

```javascript
catch (error) {
    res.redirect(config.CLIENT_URL);
}
```

has a problem.

If something goes wrong, you redirect anyway and lose the actual error.

Better:

```javascript
catch (error) {
    console.error("Google OAuth Error:", error);

    res.redirect(`${config.CLIENT_URL}/login?error=google_auth_failed`);
}
```

Now you can inspect the server logs and optionally show an error on the frontend.

---

## Improvement 3: Validate Google email

Already implemented correctly:

```javascript
const email = emails?.[0]?.value;

if (!email) {
    return res.status(400).json({
        message: "Google account email not available",
    });
}
```

Keep this.

---

# 26. Complete Reusable Checklist

When adding Google login to another project:

### Backend

```text
□ Install passport
□ Install passport-google-oauth20
□ Create Google OAuth credentials
□ Add GOOGLE_CLIENT_ID
□ Add GOOGLE_CLIENT_SECRET
□ Configure dotenv
□ Configure Passport
□ Add passport.initialize()
□ Create /google route
□ Create /google/callback route
□ Create Google callback controller
□ Find existing user
□ Create new Google user
□ Generate JWT
□ Store JWT in HTTP-only cookie
□ Redirect to frontend
```

### User Model

```text
□ Add googleID
□ Make password optional for Google users
□ Ensure normal users still require password
```

### Frontend

```text
□ Create ContinueWithGoogle component
□ Use window.location.href
□ Point to /api/auth/google
□ Add component to Login
□ Add component to Register
```

### Development

```text
□ Frontend: localhost:5173
□ Backend: localhost:3000
□ Configure Vite proxy OR use VITE_API_URL
□ Google callback points to localhost:3000
```

### Production

```text
□ Deploy frontend to Vercel
□ Deploy backend to Render
□ Add environment variables
□ Update CLIENT_URL
□ Update SERVER_URL
□ Update VITE_API_URL
□ Update Google redirect URI
□ Enable CORS
□ Configure secure cookies
□ Use HTTPS
```

---

# 27. The Most Important Mental Model

Don't memorize every line.

Remember these four pieces:

```text
1. START
Frontend sends user to:
GET /api/auth/google

2. AUTHENTICATE
Passport redirects user to Google.

3. CALLBACK
Google redirects to:
GET /api/auth/google/callback

4. SESSION
Backend:
Find/Create User
      ↓
Generate JWT
      ↓
HTTP-only Cookie
      ↓
Redirect to Frontend
```

The entire implementation revolves around this flow.

---

# 28. Final Architecture

```text
                    ┌──────────────────┐
                    │      React       │
                    │   Login Page     │
                    └────────┬─────────┘
                             │
                             │ /api/auth/google
                             ↓
                    ┌──────────────────┐
                    │     Express      │
                    │     Passport     │
                    └────────┬─────────┘
                             │
                             │ Redirect
                             ↓
                    ┌──────────────────┐
                    │      Google      │
                    │     OAuth 2.0    │
                    └────────┬─────────┘
                             │
                             │ Callback
                             ↓
                    ┌──────────────────┐
                    │     Express      │
                    │ Passport Verify  │
                    └────────┬─────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ Google Callback  │
                    │    Controller    │
                    └────────┬─────────┘
                             │
                       Find/Create User
                             │
                             ↓
                    ┌──────────────────┐
                    │     MongoDB      │
                    └──────────────────┘
                             │
                             ↓
                         Generate JWT
                             │
                             ↓
                    HTTP-only Cookie
                             │
                             ↓
                    Redirect to React
```

## Key takeaway

Google OAuth is **not**:

```text
React → Axios → Google → React
```

Your implementation is:

```text
React
  ↓
Backend
  ↓
Google
  ↓
Backend callback
  ↓
JWT cookie
  ↓
React
```

That distinction is the single most important thing to remember when implementing Google authentication in your next project.
