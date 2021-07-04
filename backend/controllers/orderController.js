import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @desc Create order
// @route POST /api/order
// @access Public
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

// @desc Get order by ID
// @route GET /api/order/:id
// @access Private
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("order id: ", id);
  const order = await Order.findById(id).populate("user", "name email");
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Delete order by ID
// @route DELETE /api/admin/orders/:id
// @access Private/Admin
const deleteOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("delete order id: ", id);
  const order = await Order.findById(id);
  if (order) {
    await order.remove();
    res.json({
      message: "Order removed",
    });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Update order as delivered
// @route PUT /api/orders/:id/delivered
// @access Private/Admin
const updateOrderDelivered = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("update order delivered: ", id);
  const order = await Order.findById(id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc Get logged in user orders
// @route GET /api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const id = req.user._id;
  console.log("user id: ", id);
  const orders = await Order.find({ user: id });
  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("Orders not found");
  }
});

// @desc Get all orders
// @route GET /api/orders
// @access Private/Admin
const getOrderList = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "name");
  if (orders) {
    res.json(orders);
  } else {
    res.status(404);
    throw new Error("Orders not found");
  }
});

// @desc Update order pay status by ID
// @route PUT /api/orders/:id/pay
// @access Private
const updateOrderToPay = asyncHandler(async (req, res) => {
  const { id, update_time, payer, status } = req.body;

  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id,
      status,
      update_time,
      email_address: payer.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPay,
  getMyOrders,
  deleteOrderById,
  getOrderList,
  updateOrderDelivered,
};
