import { Router } from "express";
import { authenticateUser } from "../middleweres/auth.middleweres.js";
import { validate } from "../middleweres/validate.js";
import {
    validateCreateAddress,
    validateUpdateAddress,
    validateAddressIdParam,
} from "../validator/address.validator.js";
import {
    getUserAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    selectCartAddress,
    clearCartAddress,
} from "../controllers/address.controller.js";

const router = Router();

// Address management routes
router.get("/", authenticateUser, getUserAddresses);
router.post("/", authenticateUser, validateCreateAddress, validate, createAddress);
router.put("/:addressId", authenticateUser, validateUpdateAddress, validate, updateAddress);
router.patch("/:addressId", authenticateUser, validateUpdateAddress, validate, updateAddress);
router.delete("/:addressId", authenticateUser, validateAddressIdParam, validate, deleteAddress);

// Cart address selection routes
router.post("/select/:addressId", authenticateUser, validateAddressIdParam, validate, selectCartAddress);
router.post("/select", authenticateUser, selectCartAddress);
router.delete("/select", authenticateUser, clearCartAddress);

export default router;
