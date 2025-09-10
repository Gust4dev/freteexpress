import { Request, Response } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["client", "driver"]).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function criarUsuario(req: Request, res: Response) {
  try {
    const { name, email, password, role } = signupSchema.parse(req.body);

    const exists = await User.findOne({ email }).lean();
    if (exists) return res.status(409).json({ error: "email_exists" });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role ?? "client",
    });
    return res
      .status(201)
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("criarUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function loginUsuario(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid_credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ error: "jwt_secret_not_set" });

    const payload = { sub: user._id.toString(), role: user.role };
    const token = jwt.sign(payload, secret as unknown as jwt.Secret, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("loginUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}
