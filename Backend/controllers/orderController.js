import Order from '../models/Order.js';  

// CREATE a new order
export const createOrder = async (req, res) => {
  try {
    const newOrder = new Order({
      ...req.body
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      order: newOrder
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// GET all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      orders
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET single order by ID (needed for order-confirm page)
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
      console.log("Params:", req.params);
  console.log("Body:", req.body);

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not " });
    }

    res.status(200).json({
      success: true,
      order: updatedOrder
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
// DELETE an order by ID
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order deleted successfully",
      order: deletedOrder
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status, name, address, phone } = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, name, address, phone },
      { new: true } // return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Emit via Socket.IO if available
    if (req.io) req.io.emit("orderUpdated", updatedOrder);

    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



