import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import deviceRoutes from "./device.routes.js";
import notificationRoutes from "./notification.routes.js";
import alertRoutes from "./alert.routes.js";
import insightRoutes from "./insight.routes.js";
import familyRoutes from "./family.routes.js";
import aiRoutes from "./ai.routes.js";
import orderRoutes from "./order.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "TagX API is running 🏷️",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/devices", deviceRoutes);
router.use("/notifications", notificationRoutes);
router.use("/alerts", alertRoutes);
router.use("/insights", insightRoutes);
router.use("/family", familyRoutes);
router.use("/ai", aiRoutes);
router.use("/orders", orderRoutes);
router.use("/contact", contactRoutes);

export default router;

