import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Role } from '../constants/roles';
import { memoryCache } from '../services/cache';

/* estende Request */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: Role;
    }
  }
}

/**
 * Middleware de auth.
 * Se passar roles, ele valida. Se não, só checa o token.
 */
export default function authMiddleware(allowedRoles?: Role | Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = String(req.headers['authorization'] ?? '');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'missing_authorization' });
      }

      const token = authHeader.slice(7).trim();
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        console.error('JWT_SECRET is not set');
        return res.status(500).json({ error: 'jwt_secret_not_set' });
      }

      let payload: any;
      try {
        payload = jwt.verify(token, secret as string);
      } catch (err) {
        return res.status(401).json({ error: 'invalid_token' });
      }

      const sub = payload?.sub ?? payload?.id ?? null;
      if (!sub) return res.status(401).json({ error: 'invalid_token_payload' });

      req.userId = String(sub);

      // Checa o cache antes
      const cachedRole = memoryCache.get<Role>(`role:${req.userId}`);
      if (cachedRole) {
        req.userRole = cachedRole;
      } else {
        // Pega do banco
        try {
          const user = await User.findById(req.userId).select('role').lean();
          if (user && (user as any).role) {
            req.userRole = (user as any).role as Role;
            memoryCache.set(`role:${req.userId}`, req.userRole, 300); // Cache de 5 min
          }
        } catch (err) {
          console.warn('auth middleware: failed to load user role', err);
        }
      }

      // Se não pediu role, só autentica
      if (!allowedRoles) return next();

      // Normaliza pra array
      const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // Sem role -> nega
      if (!req.userRole) return res.status(403).json({ error: 'forbidden_role' });

      // Verifica se a role tá liberada
      if (!allowed.includes(req.userRole)) return res.status(403).json({ error: 'forbidden_role' });

      return next();
    } catch (err) {
      console.error('auth middleware error', err);
      return res.status(500).json({ error: 'internal_auth_error' });
    }
  };
}
