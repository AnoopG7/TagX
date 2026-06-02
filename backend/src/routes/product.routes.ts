import { Router } from "express";
import * as productController from "../controllers/product.controller.js";

const router = Router();

router.get("/", productController.listProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/:slug", productController.getProductBySlug);

export default router;
