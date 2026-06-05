import type { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import * as orderService from "../services/order.service.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;
  if (!userId) throw ApiError.unauthorized();

  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items?.length) throw ApiError.badRequest("Items are required");
  if (!shippingAddress) throw ApiError.badRequest("Shipping address is required");

  const order = await orderService.createOrder(userId, items, shippingAddress, paymentMethod || "cod");
  res.status(201).json(ApiResponse.created({ order }));
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;
  if (!userId) throw ApiError.unauthorized();

  const orders = await orderService.getOrdersByUser(userId);
  res.json(ApiResponse.ok({ orders }));
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user?._id;
  if (!userId) throw ApiError.unauthorized();

  const order = await orderService.getOrderById(String(req.params.id), userId);
  res.json(ApiResponse.ok({ order }));
});
