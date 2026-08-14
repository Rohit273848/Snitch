import { Router } from "express";
import { authenticateSeller } from "../middleweres/auth.middleweres.js";
import { createProduct, getAllProducts, getProducts } from "../controllers/product.contoller.js";
import upload from "../middleweres/upload.middleware.js";

const router = Router();

router.post("/", authenticateSeller, upload.array('images', 7), createProduct)
router.get("/seller", authenticateSeller, getProducts)
router.get("/",getAllProducts)

export default router;