import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as contactService from "../services/contact.service.js";

export const submitContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    throw ApiError.badRequest("All fields are required");
  }

  const contact = await contactService.submitContact({ name, email, subject, message });
  res.status(201).json(ApiResponse.created({ contact }, "Message sent successfully"));
});
