import { Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/user";
import { Transporter } from "../models/transporters";

const updateSchema = z.object({
  name: z.string().min(2).optional().or(z.literal("")),
  phone: z.string().min(8).optional().or(z.literal("")),
  role: z.enum(["client", "driver"]).optional(),
  avatarUrl: z.string().optional(),
});

export async function uploadAvatar(req: Request, res: Response) {
  try {
    const id = req.userId;
    if (!id) return res.status(401).json({ error: "unauthenticated" });

    if (!req.file) {
      return res.status(400).json({ error: "no_file_uploaded" });
    }

    // Construct URL (assuming local storage)
    // In production, this would be an S3 URL or similar
    const avatarUrl = `${process.env.API_URL || "http://localhost:3000"}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      id,
      { avatarUrl },
      { new: true }
    ).select("-passwordHash").lean();

    return res.json(user);
  } catch (err) {
    console.error("uploadAvatar error", err);
    return res.status(500).json({ error: "internal" });
  }
}

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