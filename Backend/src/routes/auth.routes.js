import { register, login, logout, getMe, googleCallBackController } from "../controllers/auth.controller.js";
import passport from "passport";
import { config } from "../config/config.js";
import { authenticateUser } from "../middleweres/auth.middleweres.js";
import { validateLoginUser, validateRegisterUser } from "../validator/auth.validator.js";
import { validate } from "../middleweres/validate.js";
import { Router } from "express";

const router = Router();
router.post('/register', validateRegisterUser, validate, register);
router.post('/login', validateLoginUser, validate, login);
router.post('/logout', logout);
router.get('/logout', logout);

// Route to initiate Google OAuth flow
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
router.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${config.CLIENT_URL || "http://localhost:5173"}/login`
    }), googleCallBackController
);

router.get("/me", authenticateUser, getMe)

export default router;