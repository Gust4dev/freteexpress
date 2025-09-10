import { Schema, model, Document, Types } from "mongoose";

export interface ITransporter extends Document {
  userId: Types.ObjectId;
  rntrc?: string;
  documents: { type: string; url: string }[];
  validated: boolean;
  vehicle?: { type: string; plate?: string; model?: string };
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransporterSchema = new Schema<ITransporter>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    rntrc: { type: String, required: false, trim: true },
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    validated: { type: Boolean, default: false },
    vehicle: {
      type: { type: String, required: false },
      plate: { type: String, required: false, trim: true },
      model: { type: String, required: false },
    },
    rating: { type: Number, required: false, min: 0, max: 5 },
  },
  { timestamps: true }
);

export const Transporter = model<ITransporter>(
  "Transporter",
  TransporterSchema
);
