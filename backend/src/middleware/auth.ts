import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { Role } from '../constants/roles';

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
 * authMiddleware: aceita Role | Role[] | undefined
 * - authMiddleware() => apenas valida token e injeta req.userId/req.userRole
 * - authMiddleware('client') => exige que userRole === 'client'
 * - authMiddleware(['client','driver']) => exige que userRole esteja entre os permitidos
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
        payload = jwt.verify(token, secret as unknown as jwt.Secret);
      } catch (err) {
        return res.status(401).json({ error: 'invalid_token' });
      }

      const sub = payload?.sub ?? payload?.id ?? null;
      if (!sub) return res.status(401).json({ error: 'invalid_token_payload' });

      req.userId = String(sub);

      // prioridade: role presente no token
      if (payload?.role) {
        req.userRole = payload.role as Role;
      } else {
        // fallback: buscar no banco
        try {
          const user = await User.findById(req.userId).select('role').lean();
          if (user && (user as any).role) req.userRole = (user as any).role as Role;
        } catch (err) {
          console.warn('auth middleware: failed to load user role', err);
        }
      }

      // se não há role exigida, apenas autenticamos
      if (!allowedRoles) return next();

      // normaliza allowedRoles para array
      const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

      // se userRole não definido -> negar
      if (!req.userRole) return res.status(403).json({ error: 'forbidden_role' });

      // verifica se role do usuário está na lista
      if (!allowed.includes(req.userRole)) return res.status(403).json({ error: 'forbidden_role' });

      return next();
    } catch (err) {
      console.error('auth middleware error', err);
      return res.status(500).json({ error: 'internal_auth_error' });
    }
  };
}
