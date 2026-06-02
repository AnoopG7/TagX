import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as aiController from "../controllers/ai.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/leave-prediction", aiController.generateLeavePrediction);
router.post("/location-insight", aiController.generateLocationInsight);
router.post("/session-summary", aiController.generateSessionSummary);
router.post("/report-lost", aiController.reportLostDevice);

export default router;
