import { Router } from "express";
import { getMe, googleCallBackController } from "../controllers/auth.controller.js";
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js";
import { register, login } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middleweres/auth.middleweres.js";

const router = Router();
router.post('/register', validateRegisterUser, register)
router.post('/login', validateLoginUser, login)

// Route to initiate Google OAuth flow
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: config.NODE_ENV == "development" ? "http://localhost:5173/login" : "/login"
    }), googleCallBackController
);

router.get("/me", authenticateUser, getMe)

export default router;