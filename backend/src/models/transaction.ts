import { Schema, model, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  amount: number;
  type: "credit" | "debit";
  description: string;
  orderId?: Types.ObjectId;
  createdAt?: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    amount: { type: Number, required: true },
    type: { type: String, required: true, enum: ["credit", "debit"] },
    description: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: false },
  },
  { timestamps: true }
);

export const Transaction = model<ITransaction>("Transaction", TransactionSchema);
