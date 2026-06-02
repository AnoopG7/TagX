import { FamilyMember } from "../models/family-member.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { FamilyPermission, FamilyStatus } from "../models/family-member.model.js";

interface AddMemberInput {
  name: string;
  email?: string;
  phone?: string;
  role: string;
  relationship?: string;
  avatar?: string;
  permissions?: FamilyPermission[];
}

interface UpdateMemberInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  relationship?: string;
  avatar?: string;
  status?: FamilyStatus;
  location?: string;
  permissions?: FamilyPermission[];
  devices?: number;
}

export async function listFamilyMembers(userId: string) {
  return FamilyMember.find({ owner: userId })
    .sort({ isOwner: -1, name: 1 })
    .lean();
}

export async function addFamilyMember(userId: string, input: AddMemberInput) {
  const member = await FamilyMember.create({
    owner: userId,
    ...input,
    invitedAt: new Date(),
  });
  return member;
}

export async function updateFamilyMember(
  userId: string,
  memberId: string,
  input: UpdateMemberInput
) {
  const member = await FamilyMember.findOneAndUpdate(
    { _id: memberId, owner: userId },
    { $set: input },
    { new: true, runValidators: true }
  );
  if (!member) {
    throw ApiError.notFound("Family member not found");
  }
  return member;
}

export async function removeFamilyMember(userId: string, memberId: string) {
  const member = await FamilyMember.findOneAndDelete({
    _id: memberId,
    owner: userId,
  });
  if (!member) {
    throw ApiError.notFound("Family member not found");
  }
  return member;
}
