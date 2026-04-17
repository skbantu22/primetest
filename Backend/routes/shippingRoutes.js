import mongoose from 'mongoose';

const shippingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Shipping name is required'],
    trim: true,
  },
  cost: {
    type: Number,
    required: [true, 'Shipping cost is required'],
    min: [0, 'Cost cannot be negative'],
  },
}, {
  timestamps: true,
});

const Shipping = mongoose.model('Shipping', shippingSchema);

export default Shipping;
