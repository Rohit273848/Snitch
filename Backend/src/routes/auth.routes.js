import { Router } from "express";
import { } from "../controllers/auth.controller.js";
import { validateRegisterUser } from "../validator/auth.validator.js";

const router = Router();
router.post('/register', validateRegisterUser)

export default router; 