// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  product: { type: String, required: true },
  shipping: { type: Number, required: true },
  total: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  payment: { type: String, default: 'Cash on delivery' },
  status: { 
    type: String, 
    // enum: ['processing', 'onhold','Delivered', 'completed', 'canceled', 'refunded', 'failed', 'cf_accepted', 'trash'],
    default: 'processing' 
  },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Make a readable `id` virtual
orderSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
