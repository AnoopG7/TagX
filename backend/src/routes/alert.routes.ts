import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as alertController from "../controllers/alert.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", alertController.listAlerts);
router.patch("/:id/resolve", alertController.resolveAlert);

export default router;
