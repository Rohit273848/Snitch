import { Router } from "express";
import { authenticateSeller } from "../middleweres/auth.middleweres.js";
import { createProduct, getAllProducts, getProductById, getProducts, updateSellerProduct, deleteSellerProduct } from "../controllers/product.contoller.js";
import upload from "../middleweres/upload.middleware.js";
import { createProductValidator } from "../validator/product.validator.js";

const router = Router();

router.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)
router.put("/seller/:id", authenticateSeller, upload.array('images', 7), updateSellerProduct)
router.delete("/seller/:id", authenticateSeller, deleteSellerProduct)
router.get("/seller", authenticateSeller, getProducts)
router.get("/", getAllProducts)
router.get("/:id", getProductById)

export default router;