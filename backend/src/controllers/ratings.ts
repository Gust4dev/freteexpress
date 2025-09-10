import { Request, Response } from "express";
import { z } from "zod";
import { Rating } from "../models/ratings";
import { Order } from "../models/orders";

const createSchema = z.object({
  orderId: z.string().min(1),
  score: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export async function criarAvaliacao(req: Request, res: Response) {
  try {
    const clientId = req.userId!;
    const payload = createSchema.parse(req.body);

    const order = await Order.findById(payload.orderId);
    if (!order) return res.status(404).json({ error: "order_not_found" });
    if (String(order.clientId) !== String(clientId))
      return res.status(403).json({ error: "forbidden" });
    if (order.status !== "delivered")
      return res.status(400).json({ error: "order_not_delivered" });

    const rating = await Rating.create({
      orderId: payload.orderId,
      clientId,
      transporterId: order.transporterId,
      score: payload.score,
      comment: payload.comment,
    });

    return res.status(201).json(rating);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("criarAvaliacao error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function listarAvaliacoesPorPedido(req: Request, res: Response) {
  try {
    const orderId = req.params.orderId;
    const list = await Rating.find({ orderId }).lean();
    return res.json(list);
  } catch (err) {
    console.error("listarAvaliacoesPorPedido error", err);
    return res.status(500).json({ error: "internal" });
  }
}
