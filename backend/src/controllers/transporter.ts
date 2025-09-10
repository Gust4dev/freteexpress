import { Request, Response } from "express";
import { z } from "zod";
import { Transporter } from "../models/transporters";
import { User } from "../models/user";

const transporterSchema = z.object({
  rntrc: z.string().optional(),
  documents: z
    .array(z.object({ type: z.string(), url: z.string().url() }))
    .optional(),
  vehicle: z
    .object({
      type: z.string().optional(),
      plate: z.string().optional(),
      model: z.string().optional(),
    })
    .optional(),
});

export async function criarOuAtualizarTransportador(
  req: Request,
  res: Response
) {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "unauthenticated" });

    const data = transporterSchema.parse(req.body);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "user_not_found" });

    let transporter = await Transporter.findOne({ userId });
    if (transporter) {
      transporter.set(data);
      await transporter.save();
    } else {
      transporter = await Transporter.create({
        userId,
        ...data,
        validated: false,
      });
    }

    return res.status(201).json(transporter);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("criarOuAtualizarTransportador error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function listarTransportadores(req: Request, res: Response) {
  try {
    const q: any = {};
    if (req.query.validated === "true") q.validated = true;
    const list = await Transporter.find(q).limit(100).lean();
    return res.json(list);
  } catch (err) {
    console.error("listarTransportadores error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function getTransportadorPorId(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const transporter = await Transporter.findById(id).lean();
    if (!transporter) return res.status(404).json({ error: "not_found" });
    return res.json(transporter);
  } catch (err) {
    console.error("getTransportadorPorId error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function validarTransportador(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const transporter = await Transporter.findById(id);
    if (!transporter) return res.status(404).json({ error: "not_found" });

    transporter.validated = true;
    await transporter.save();

    return res.json(transporter);
  } catch (err) {
    console.error("validarTransportador error", err);
    return res.status(500).json({ error: "internal" });
  }
}
