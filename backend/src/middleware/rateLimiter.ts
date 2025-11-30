import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

const globalRate = parseInt(process.env.RATE_LIMIT_GLOBAL || '200', 10);
const authRate = parseInt(process.env.RATE_LIMIT_AUTH || '5', 10);
const apiRate = parseInt(process.env.RATE_LIMIT_API || '60', 10);

export const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: globalRate,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Muitas requisições, por favor tente novamente mais tarde.',
  },
});

export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: authRate,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts? User said "5 failed attempts". 
  // express-rate-limit counts all requests by default. 
  // To count only failed, we'd need a custom handler or use skipSuccessfulRequests if supported (it is in v6+).
  message: {
    status: 429,
    message: 'Muitas tentativas de login falhas. Tente novamente em 1 hora.',
  },
});

export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: apiRate,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Muitas requisições à API de mapas. Aguarde um momento.',
  },
});
