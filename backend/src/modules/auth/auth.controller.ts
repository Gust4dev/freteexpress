import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";

const router = Router();

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);
    const exist = await User.findOne({ email });
    if (exist) return res.status(409).json({ error: "email_exists" });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ name, email, passwordHash });
    return res
      .status(201)
      .json({ id: user._id, name: user.name, email: user.email });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const token = jwt.sign(
      { sub: user._id.toString(), email: user.email },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
      }
    );

    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
});

export default router;
