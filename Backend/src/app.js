import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import { config } from "./config/config.js";



const app = express();

// Trust reverse proxy (needed for Render and HTTPS cookies)
app.set("trust proxy", 1);

// middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: `${config.SERVER_URL}/api/auth/google/callback`
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

const allowedOrigins = [
    config.CLIENT_URL?.replace(/\/$/, ""),
    "http://localhost:5173",
    "http://localhost:3000"
].filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
                return callback(null, true);
            }
            return callback(new Error(`CORS blocked request from origin: ${origin}`));
        },
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.send("World");
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
    if (err) {
        console.error("Global error handler caught error:", err.message);
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "Image file size exceeds the 5MB limit",
            });
        }
        return res.status(400).json({
            success: false,
            message: err.message || "An error occurred during request processing",
        });
    }
    next();
});

export default app;