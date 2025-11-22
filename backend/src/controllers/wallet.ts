import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/user";
import { Transaction } from "../models/transaction";

export async function getBalance(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("balance");
    if (!user) return res.status(404).json({ error: "user_not_found" });
    return res.json({ balance: user.balance });
  } catch (err) {
    console.error("getBalance error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function getTransactions(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    return res.json(transactions);
  } catch (err) {
    console.error("getTransactions error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function addFunds(req: Request, res: Response) {
  try {
    const userId = req.userId;
    const schema = z.object({
      amount: z.number().positive(),
    });
    const { amount } = schema.parse(req.body);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "user_not_found" });

    user.balance += amount;
    await user.save();

    await Transaction.create({
      userId,
      amount,
      type: "credit",
      description: "Depósito via PIX",
    });

    return res.json({ balance: user.balance });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("addFunds error", err);
    return res.status(500).json({ error: "internal" });
  }
}
