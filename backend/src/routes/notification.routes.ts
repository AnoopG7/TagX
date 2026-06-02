import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as notificationController from "../controllers/notification.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", notificationController.listNotifications);
router.post("/", notificationController.createNotification);
router.patch("/:id/read", notificationController.markRead);
router.patch("/read-all", notificationController.markAllRead);

export default router;
