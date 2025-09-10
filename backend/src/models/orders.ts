import { Schema, model, Document, Types } from "mongoose";

export type VehicleType = "moto" | "carro" | "caminhao";
export type OrderStatus =
  | "created"
  | "accepted"
  | "in_route"
  | "delivered"
  | "cancelled";

export interface IOrder extends Document {
  clientId: Types.ObjectId;
  transporterId?: Types.ObjectId | null;
  origin: { address: string; coords?: [number, number] };
  destination: { address: string; coords?: [number, number] };
  distanceKm: number;
  vehicleType: VehicleType;
  price: number;
  pisoAntt: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

const PointSchema = new Schema(
  {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number] },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    transporterId: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Transporter",
      default: null,
    },
    origin: {
      address: { type: String, required: true, trim: true },
      coords: { type: [Number], required: false },
    },
    destination: {
      address: { type: String, required: true, trim: true },
      coords: { type: [Number], required: false },
    },
    distanceKm: { type: Number, required: true, min: 0 },
    vehicleType: {
      type: String,
      required: true,
      enum: ["moto", "carro", "caminhao"],
    },
    price: { type: Number, required: true, min: 0 },
    pisoAntt: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      required: true,
      enum: ["created", "accepted", "in_route", "delivered", "cancelled"],
      default: "created",
    },
  },
  { timestamps: true }
);

OrderSchema.index({ "origin.coords": "2dsphere" });
OrderSchema.index({ "destination.coords": "2dsphere" });

export const Order = model<IOrder>("Order", OrderSchema);
