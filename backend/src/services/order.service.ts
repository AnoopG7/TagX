import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { ApiError } from "../utils/ApiError.js";
import type { IShippingAddress, PaymentMethod } from "../models/order.model.js";

interface OrderItemInput {
  productId: string;
  quantity: number;
  color: string;
}

const SHIPPING_THRESHOLD = 2999;
const SHIPPING_COST = 199;
const TAX_RATE = 0.18;

export async function createOrder(
  userId: string,
  items: OrderItemInput[],
  shippingAddress: IShippingAddress,
  paymentMethod: PaymentMethod
) {
  if (!items.length) throw ApiError.badRequest("Order must have at least one item");

  // Validate products and build order items
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) throw ApiError.notFound(`Product ${item.productId} not found`);
    if (!product.isActive) throw ApiError.badRequest(`Product ${product.name} is not available`);

    const primaryImage = product.images.find((img) => img.isPrimary);
    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      color: item.color || "default",
      image: primaryImage?.url || product.images[0]?.url || "",
    });
    subtotal += product.price * item.quantity;
  }

  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + shipping + tax;

  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    paymentMethod,
    subtotal,
    shipping,
    tax,
    total,
    status: "confirmed",
  });

  return order;
}

export async function getOrdersByUser(userId: string) {
  return Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
}

export async function getOrderById(orderId: string, userId: string) {
  const order = await Order.findOne({ _id: orderId, user: userId }).lean();
  if (!order) throw ApiError.notFound("Order not found");
  return order;
}
