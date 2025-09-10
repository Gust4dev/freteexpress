import { Schema, model, Document, Types } from "mongoose";

export interface IRating extends Document {
  orderId: Types.ObjectId;
  clientId: Types.ObjectId;
  transporterId: Types.ObjectId;
  score: number;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RatingSchema = new Schema<IRating>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Order",
      index: true,
    },
    clientId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    transporterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Transporter",
    },
    score: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: false, trim: true },
  },
  { timestamps: true }
);

export const Rating = model<IRating>("Rating", RatingSchema);
