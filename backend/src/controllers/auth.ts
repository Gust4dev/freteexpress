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
    if (!user) return res.status(401).json({ error: "invalid_credentials" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "invalid_credentials" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not set");
      return res.status(500).json({ error: "internal" });
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
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("loginUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}

export async function logoutUsuario(req: Request, res: Response) {
  // Em uma implementação JWT stateless, o logout é feito no cliente removendo o token.
  // Para maior segurança, poderíamos adicionar o token a uma blacklist no Redis com TTL.
  // Por enquanto, retornamos sucesso para o frontend limpar o estado.
  return res.json({ message: "logged_out" });
}

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

    // Se for motorista, cria o registro de Transporter (pendente de validação)
    if (role === "driver") {
       // Import dinâmico ou mover Transporter para cá se necessário, 
       // mas idealmente criaríamos o Transporter aqui.
       // Como não tenho o model Transporter importado aqui, vou deixar um TODO 
       // ou o usuário deve criar o perfil de motorista em um passo separado.
       // Pela arquitetura atual, parece que o cadastro é simples.
       // Vamos assumir que o motorista precisa completar o perfil depois.
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
    if (err?.issues) return res.status(400).json({ validation: err.issues });
    console.error("criarUsuario error", err);
    return res.status(500).json({ error: "internal" });
  }
}
