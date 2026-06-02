import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import * as familyController from "../controllers/family.controller.js";
import {
  addMemberRules,
  updateMemberRules,
  memberIdRules,
} from "../validators/family.validator.js";

const router = Router();

router.use(authMiddleware);

router.get("/", familyController.listMembers);
router.post("/", addMemberRules, familyController.addMember);
router.patch("/:id", updateMemberRules, familyController.updateMember);
router.delete("/:id", memberIdRules, familyController.removeMember);

export default router;
