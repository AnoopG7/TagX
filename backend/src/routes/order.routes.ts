import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as orderController from "../controllers/order.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", orderController.createOrder);
router.get("/", orderController.listOrders);
router.get("/:id", orderController.getOrder);

export default router;
