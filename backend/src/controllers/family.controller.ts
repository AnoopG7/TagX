import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as familyService from "../services/family.service.js";

export const listMembers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const members = await familyService.listFamilyMembers(req.user!.userId);
  res.json(ApiResponse.ok({ members }));
});

export const addMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, phone, role, relationship, avatar, permissions } = req.body;
  const member = await familyService.addFamilyMember(req.user!.userId, {
    name,
    email,
    phone,
    role,
    relationship,
    avatar,
    permissions,
  });
  res.status(201).json(ApiResponse.created({ member }, "Family member added"));
});

export const updateMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  const member = await familyService.updateFamilyMember(
    req.user!.userId,
    String(req.params.id),
    req.body
  );
  res.json(ApiResponse.ok({ member }, "Family member updated"));
});

export const removeMember = asyncHandler(async (req: AuthRequest, res: Response) => {
  await familyService.removeFamilyMember(req.user!.userId, String(req.params.id));
  res.json(ApiResponse.ok(null, "Family member removed"));
});
