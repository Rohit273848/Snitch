import { Router } from "express";
import { validateAddToCart, validateIncrementCartItemQuantity, validateDecrementCartItemQuantity } from "../validator/cart.validator.js";
import { validate } from "../middleweres/validate.js";
import { authenticateUser } from "../middleweres/auth.middleweres.js";
import { addToCart, getCart, IncrementItemCartQuantity, DecrementItemCartQuantity } from "../controllers/cart.controller.js";

const router = Router();

router.get("/", authenticateUser, getCart);
router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, validate, addToCart);
router.post("/add/:productId", authenticateUser, validateAddToCart, validate, addToCart);

// Quantity increment routes
router.post("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, validate, IncrementItemCartQuantity);
router.post("/quantity/increment/:productId", authenticateUser, validateIncrementCartItemQuantity, validate, IncrementItemCartQuantity);
router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, validate, IncrementItemCartQuantity);
router.patch("/quantity/increment/:productId", authenticateUser, validateIncrementCartItemQuantity, validate, IncrementItemCartQuantity);

// Quantity decrement routes
router.post("/quantity/decrement/:productId/:variantId", authenticateUser, validateDecrementCartItemQuantity, validate, DecrementItemCartQuantity);
router.post("/quantity/decrement/:productId", authenticateUser, validateDecrementCartItemQuantity, validate, DecrementItemCartQuantity);
router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validateDecrementCartItemQuantity, validate, DecrementItemCartQuantity);
router.patch("/quantity/decrement/:productId", authenticateUser, validateDecrementCartItemQuantity, validate, DecrementItemCartQuantity);

export default router;