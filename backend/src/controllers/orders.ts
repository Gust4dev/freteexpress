import { Request, Response } from "express";
import { z } from "zod";
import { Order } from "../models/orders";
import { Transporter } from "../models/transporters";
import { validatePriceAgainstPiso } from "../libs/antt";

const createSchema = z.object({
  origin: z.object({
    address: z.string().min(3),
    coords: z.array(z.number()).optional(),
  }),
  destination: z.object({
    address: z.string().min(3),
    coords: z.array(z.number()).optional(),
  }),
  distanceKm: z.number().nonnegative(),
  vehicleType: z.enum(["moto", "carro", "caminhao"]),
  price: z.number().nonnegative(),
});

export async function criarPedido(req: Request, res: Response) {
  try {
    const clientId = req.userId;
    if (!clientId) return res.status(401).json({ error: "unauthenticated" });

    const payload = createSchema.parse(req.body);
    const { ok, piso } = validatePriceAgainstPiso(
      payload.price,
      payload.distanceKm,
      payload.vehicleType
    );
    if (!ok)
      return res.status(400).json({ error: "price_below_antt_minimum", piso });

    const order = await Order.create({
      clientId,
      transporterId: null,
      origin: payload.origin,
      destination: payload.destination,
      distanceKm: payload.distanceKm,
      vehicleType: payload.vehicleType,
      price: payload.price,
      pisoAntt: piso,
      status: "created",
    });

    return res.status(201).json(order);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("criarPedido error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function listarPedidos(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const role = req.userRole ?? "client";

    if (role === "driver") {
      const transporter = await Transporter.findOne({ userId }).lean();
      
      const query = {
        $or: [
          { status: "created", transporterId: null },
          { transporterId: transporter?._id, status: { $in: ["accepted", "in_route"] } }
        ]
      };

      const list = await Order.find(query).sort({ createdAt: -1 }).limit(100).lean();
      return res.json(list);
    } else {
      const list = await Order.find({ clientId: userId }).sort({ createdAt: -1 }).limit(100).lean();
      return res.json(list);
    }
  } catch (err) {
    console.error("listarPedidos error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function aceitarPedido(req: Request, res: Response) {
  try {
    const driverUserId = req.userId!;
    let transporter = await Transporter.findOne({ userId: driverUserId });
    
    // Auto-validate for dev environment
    if (!transporter) {
      transporter = await Transporter.create({
        userId: driverUserId,
        validated: true,
        documents: [],
      });
    } else if (!transporter.validated) {
      transporter.validated = true;
      await transporter.save();
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "not_found" });
    if (order.transporterId)
      return res.status(409).json({ error: "already_taken" });

    order.transporterId = transporter._id;
    order.status = "accepted";
    await order.save();

    return res.json(order);
  } catch (err) {
    console.error("aceitarPedido error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function atualizarStatusPedido(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const body = z
      .object({ status: z.enum(["in_route", "delivered", "cancelled"]) })
      .parse(req.body);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "not_found" });

    const transporter = await Transporter.findOne({ userId });
    const isTransporterOwner =
      transporter && String(transporter._id) === String(order.transporterId);
    const isClientOwner = String(order.clientId) === userId;

    if (body.status === "cancelled") {
      if (!isClientOwner && !isTransporterOwner && req.userRole !== "admin") {
        return res.status(403).json({ error: "forbidden" });
      }
      if (isTransporterOwner && order.status === "created") {
         return res.status(403).json({ error: "forbidden_cannot_cancel_unaccepted" });
      }
    } else if (body.status === "in_route" || body.status === "delivered") {
      if (!isTransporterOwner) {
        return res.status(403).json({ error: "forbidden" });
      }
    }

    if (body.status === "cancelled" && isTransporterOwner) {
      order.transporterId = null;
      order.status = "created"; 
    } else {
      order.status = body.status;
    }

    await order.save();
    return res.json(order);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("atualizarStatusPedido error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function getPedidoPorId(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate({
        path: "transporterId",
        populate: { path: "userId", select: "name phone avatarUrl" },
      })
      .lean();
    if (!order) return res.status(404).json({ error: "not_found" });
    return res.json(order);
  } catch (err) {
    console.error("getPedidoPorId error", err);
    return res.status(500).json({ error: "internal" });
  }
}