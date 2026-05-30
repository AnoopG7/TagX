import { Router } from "express";

const router = Router();

/**
 * API Route Aggregator
 * All feature routes will be mounted here as they're built in Phase 3.
 */

// Health check
router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "TagX API is running 🏷️",
    timestamp: new Date().toISOString(),
  });
});

// TODO: Phase 3 — Mount feature routes
// router.use("/auth", authRoutes);
// router.use("/products", productRoutes);
// router.use("/cart", cartRoutes);
// router.use("/orders", orderRoutes);
// router.use("/reviews", reviewRoutes);
// router.use("/tracking", trackingRoutes);
// router.use("/ai", aiRoutes);

export default router;
