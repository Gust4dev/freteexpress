import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/user";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
});

export async function getMeuUsuario(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!id) return res.status(401).json({ error: "unauthenticated" });

    const user = await User.findById(id).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ error: "not_found" });

    return res.json(user);
  } catch (err) {
    console.error("getMeuUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function atualizarMeuUsuario(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!id) return res.status(401).json({ error: "unauthenticated" });

    const payload = updateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(id, payload, { new: true })
      .select("-passwordHash")
      .lean();
    if (!user) return res.status(404).json({ error: "not_found" });

    return res.json(user);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("atualizarMeuUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function listarUsuarios(req: Request, res: Response) {
  try {
    const q: any = {};
    if (req.query.email) q.email = String(req.query.email).toLowerCase();
    const list = await User.find(q).select("-passwordHash").limit(200).lean();
    return res.json(list);
  } catch (err) {
    console.error("listarUsuarios error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function getUsuarioPorId(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ error: "not_found" });
    return res.json(user);
  } catch (err) {
    console.error("getUsuarioPorId error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function deletarUsuario(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const removed = await User.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ error: "not_found" });
    return res.json({ ok: true });
  } catch (err) {
    console.error("deletarUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}
