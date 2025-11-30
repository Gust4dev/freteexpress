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
    
    // Valida preço
    const { ok, piso } = validatePriceAgainstPiso(
      payload.price,
      payload.distanceKm,
      payload.vehicleType
    );
    
    if (!ok) {
       // Permite por enquanto
       // return res.status(400).json({ error: "price_below_antt_minimum", piso });
    }

    // Gera código de confirmação
    const confirmationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const order = await Order.create({
      clientId,
      transporterId: null,
      origin: payload.origin,
      destination: payload.destination,
      distanceKm: payload.distanceKm,
      vehicleType: payload.vehicleType,
      price: payload.price,
      pisoAntt: piso,
      confirmationCode,
      status: "created",
    });

    return res.status(201).json(order);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("criarPedido error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function aceitarPedido(req: Request, res: Response) {
  try {
    const driverUserId = req.userId!;
    const transporter = await Transporter.findOne({ userId: driverUserId });
    
    if (!transporter) {
      return res.status(403).json({ error: "driver_not_registered" });
    }

    if (!transporter.validated) {
      return res.status(403).json({ error: "driver_not_validated" });
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
    const { id } = req.params;
    const { status, code } = req.body;

    if (!["in_route", "delivered", "cancelled", "arrived_pickup"].includes(status)) {
      return res.status(400).json({ error: "invalid_status" });
    }

    // Load order with confirmationCode for verification
    const order = await Order.findById(id).select("+confirmationCode");
    if (!order) return res.status(404).json({ error: "not_found" });

    const transporter = await Transporter.findOne({ userId });
    
    // Verifica permissão
    const isTransporterOwner = transporter && String(transporter._id) === String(order.transporterId);
    const isClientOwner = String(order.clientId) === userId;

    // Verificações de segurança
    if (status === "cancelled") {
      if (!isClientOwner && !isTransporterOwner && req.userRole !== "admin") {
        return res.status(403).json({ error: "forbidden" });
      }
      if (isTransporterOwner && order.status === "created") {
         return res.status(403).json({ error: "forbidden_cannot_cancel_unaccepted" });
      }
    } else {
      // Atualizações do motorista
      if (!isTransporterOwner) {
        return res.status(403).json({ error: "forbidden" });
      }
    }

    // Verificação do PIN
    if (status === "delivered") {
      if (!code) {
        return res.status(400).json({ error: "missing_code" });
      }
      if (order.confirmationCode !== code) {
        return res.status(400).json({ error: "invalid_code" });
      }
    }

    // Aplica atualizações
    if (status === "cancelled" && isTransporterOwner) {
      order.transporterId = null;
      order.status = "created"; 
    } else {
      order.status = status;
    }

    await order.save();
    
    // Retorna pedido sem código
    const orderObj = order.toObject();
    delete (orderObj as any).confirmationCode;
    
    return res.json(orderObj);
  } catch (err: any) {
    console.error("atualizarStatusPedido error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function getPedidoPorId(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const order = await Order.findById(id)
      .populate("clientId", "name email phone avatarUrl")
      .populate({
        path: "transporterId",
        populate: { path: "userId", select: "name email phone avatarUrl" },
      })
      .select("+confirmationCode");

    if (!order) return res.status(404).json({ error: "not_found" });

    const orderObj = order.toObject();
    
    // Exibe código apenas para o criador
    const isClientOwner = req.userRole === "client" && String(order.clientId._id) === req.userId;
    
    if (!isClientOwner) {
       delete (orderObj as any).confirmationCode;
    }

    return res.json(orderObj);
  } catch (err) {
    console.error("getPedidoPorId error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function listarPedidos(req: Request, res: Response) {
  try {
    const userId = req.userId!;
    const role = req.userRole ?? "client";

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    let query: any = {};

    if (role === "driver") {
      const transporter = await Transporter.findOne({ userId }).lean();
      query = {
        $or: [
          { status: "created", transporterId: null },
          { transporterId: transporter?._id, status: { $in: ["accepted", "arrived_pickup", "in_route"] } }
        ]
      };
    } else {
      query = { clientId: userId };
    }

    const [total, list] = await Promise.all([
      Order.countDocuments(query),
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
    ]);

    return res.json({
      data: list,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error("listarPedidos error", err);
    return res.status(500).json({ error: "internal" });
  }
}