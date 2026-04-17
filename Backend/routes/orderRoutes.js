import express from "express";
import {
  getOrders,
  getOrderById,
  createOrder,
updateOrder,
  updateOrderStatus,
  deleteOrder
} from "../controllers/orderController.js";

const router = express.Router();

// GET all orders
router.get("/", getOrders);

// GET single order by ID
router.get("/:orderId", getOrderById);

// CREATE a new order
router.post("/", createOrder);

// UPDATE order status by ID
router.put("/:id/status", updateOrderStatus);

// DELETE order by ID
router.delete("/:id", deleteOrder);

router.put("/:id", updateOrder);



export default router;
