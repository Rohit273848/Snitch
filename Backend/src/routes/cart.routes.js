import { Router } from "express";
import { validateAddToCart } from "../validator/cart.validator.js";
import { validate } from "../middleweres/validate.js";
import { authenticateUser } from "../middleweres/auth.middleweres.js";
import { addToCart, getCart } from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authenticateUser, getCart);
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, validate, addToCart);
router.post("/add/:productId", authenticateUser, validateAddToCart, validate, addToCart);

export default router;