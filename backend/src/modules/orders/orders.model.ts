import mongoose, { Schema } from mongoose;

export const OrderSchema = new Schema({
  pickup: { type: String, required: true },
  dropoff: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  vehicleType: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, default: created }
}, { timestamps: true });

export const Order = mongoose.model(Order, OrderSchema);
