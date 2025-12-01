import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/user";
import { Transporter } from "../models/transporters";
import { logger } from "../logger";

const updateSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["client", "driver"]).optional(),
});

export async function uploadAvatar(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!req.file) {
      return res.status(400).json({ error: "no_file_uploaded" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      id,
      { avatarUrl },
      { new: true }
    ).select("-passwordHash").lean();

    if (!user) return res.status(404).json({ error: "not_found" });

    return res.json(user);
  } catch (err) {
    logger.error("uploadAvatar error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function getMeuUsuario(req: Request, res: Response) {
  try {
    const id = req.userId;
    const user = await User.findById(id).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ error: "not_found" });
    return res.json(user);
  } catch (err) {
    logger.error("getMeuUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function atualizarMeuUsuario(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!id) return res.status(401).json({ error: "unauthenticated" });

    const payload = updateSchema.parse(req.body);

    if (payload.role === "driver") {
      let transporter = await Transporter.findOne({ userId: id });
      if (transporter) {
        transporter.validated = true;
        await transporter.save();
      } else {
        await Transporter.create({ userId: id, validated: true });
      }
    }

    const user = await User.findByIdAndUpdate(id, payload, { new: true })
      .select("-passwordHash")
      .lean();
    if (!user) return res.status(404).json({ error: "not_found" });

    return res.json(user);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    logger.error("atualizarMeuUsuario error", err);
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
    logger.error("listarUsuarios error", err);
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
    logger.error("getUsuarioPorId error", err);
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
    logger.error("deletarUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}