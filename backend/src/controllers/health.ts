import { Router, Request, Response } from "express";
import { z } from "zod";
import { User } from "../models/user";
import auth from "../middleware/auth";

const router = Router();

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
});

// GET /users/me
router.get("/me", auth(), async (req: Request, res: Response) => {
  try {
    const id = req.userId;
    if (!id) return res.status(401).json({ error: "unauthenticated" });
    const user = await User.findById(id).select("-passwordHash").lean();
    if (!user) return res.status(404).json({ error: "not_found" });
    return res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
});

// PATCH /users/me
router.patch("/me", auth(), async (req: Request, res: Response) => {
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
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
});

export default router;
