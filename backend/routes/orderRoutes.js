import express from "express";
import {
  addOrderItems,
  deleteOrderById,
  getMyOrders,
  getOrderById,
  updateOrderToPay,
  getOrderList,
  updateOrderDelivered,
} from "../controllers/orderController.js";
import { isAdmin, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, isAdmin, getOrderList);
router.route("/myorders").get(protect, getMyOrders);
router
  .route("/:id")
  .get(protect, getOrderById)
  .delete(protect, isAdmin, deleteOrderById);
router.route("/:id/pay").put(protect, updateOrderToPay);
router.route("/:id/delivered").put(protect, isAdmin, updateOrderDelivered);

export default router;
