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

export async function loginUsuario(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(401).json({ error: "invalid_credentials", message: "E-mail ou senha incorretos." });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "invalid_credentials", message: "E-mail ou senha incorretos." });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set");
      return res.status(500).json({ error: "internal_error", message: "Erro interno de configuração." });
    }

    const token = jwt.sign(
      { sub: user._id, role: user.role },
      secret,
      { expiresIn: "30d" }
    );

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
    if (err?.issues) return res.status(400).json({ error: "validation_error", message: "Dados inválidos.", details: err.issues });
    console.error("loginUsuario error", err);
    return res.status(500).json({ error: "internal_error", message: "Erro ao processar login." });
  }
}

export async function logoutUsuario(req: Request, res: Response) {
  // Logout stateless
  return res.json({ message: "logged_out" });
}

export async function criarUsuario(req: Request, res: Response) {
  try {
    const { name, email, password, role } = signupSchema.parse(req.body);

    const exists = await User.findOne({ email }).lean();
    if (exists) return res.status(409).json({ error: "email_exists", message: "Este e-mail já está cadastrado." });

    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role ?? "client",
    });

    // Motorista: registro pendente
    if (role === "driver") {
       // TODO: Implementar criação de Transporter
    }

    return res
      .status(201)
      .json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ error: "validation_error", message: "Dados inválidos.", details: err.issues });
    console.error("criarUsuario error", err);
    return res.status(500).json({ error: "internal_error", message: "Erro ao criar usuário." });
  }
}
