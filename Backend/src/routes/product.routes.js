import { Router } from "express";
import { authenticateSeller } from "../middleweres/auth.middleweres.js";
import { createProduct } from "../controllers/product.contoller.js";
import upload from "../middleweres/upload.middleware.js";

const router = Router();

router.post("/products", authenticateSeller, upload.array('images', 7), createProduct)

export default router;