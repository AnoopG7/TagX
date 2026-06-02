import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as deviceController from "../controllers/device.controller.js";
import {
  createDeviceRules,
  updateDeviceRules,
  updateLocationRules,
  deviceIdRules,
} from "../validators/device.validator.js";

const router = Router();

router.use(authMiddleware);

router.get("/", deviceController.listDevices);
router.post("/", createDeviceRules, deviceController.createDevice);
router.get("/:id", deviceIdRules, deviceController.getDevice);
router.patch("/:id", updateDeviceRules, deviceController.updateDevice);
router.delete("/:id", deviceIdRules, deviceController.removeDevice);
router.post("/:id/location", updateLocationRules, deviceController.updateLocation);
router.get("/:id/events", deviceIdRules, deviceController.getDeviceEvents);
router.get("/:id/health", deviceIdRules, deviceController.getDeviceHealth);

export default router;
