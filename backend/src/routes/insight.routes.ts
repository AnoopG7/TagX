import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as insightController from "../controllers/insight.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", insightController.listInsights);
router.patch("/:id/dismiss", insightController.dismissInsight);
router.patch("/:id/feedback", insightController.submitFeedback);

export default router;
