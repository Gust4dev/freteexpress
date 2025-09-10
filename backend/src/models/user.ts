import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: "client" | "driver";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, minlength: 2 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    phone: { type: String, required: false, trim: true },
    role: {
      type: String,
      required: true,
      enum: ["client", "driver"],
      default: "client",
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", UserSchema);
