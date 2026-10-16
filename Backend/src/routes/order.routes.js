import { Router } from "express";
import { authenticateUser, authenticateSeller } from "../middleweres/auth.middleweres.js";
import {
    createRazorpayOrderController,
    verifyPaymentAndPlaceOrderController,
    placeCodOrderController,
    getMyOrdersController,
    getOrderByIdController,
    cancelOrderController,
    getSellerOrdersController,
    updateSellerOrderStatusController,
} from "../controllers/order.controller.js";

const router = Router();

// ─── Payment Initiation & Verification ──────────────────────────────────────
router.post("/create-payment-order", authenticateUser, createRazorpayOrderController);
router.post("/verify-payment", authenticateUser, verifyPaymentAndPlaceOrderController);
router.post("/checkout/cod", authenticateUser, placeCodOrderController);

// ─── Seller Studio Order Management Routes (Must precede /:orderId) ─────────
router.get("/seller/orders", authenticateSeller, getSellerOrdersController);
router.patch("/seller/orders/:orderId/status", authenticateSeller, updateSellerOrderStatusController);
router.put("/seller/orders/:orderId/status", authenticateSeller, updateSellerOrderStatusController);

// ─── Buyer Order History ───────────────────────────────────────────────────
router.get("/my-orders", authenticateUser, getMyOrdersController);
router.get("/", authenticateUser, getMyOrdersController);

// ─── Single Order Live Tracking & Details ──────────────────────────────────
router.get("/track/:orderId", authenticateUser, getOrderByIdController);
router.get("/:orderId", authenticateUser, getOrderByIdController);

// ─── Order Cancellation ────────────────────────────────────────────────────
router.patch("/:orderId/cancel", authenticateUser, cancelOrderController);
router.post("/:orderId/cancel", authenticateUser, cancelOrderController);

export default router;
