import crypto from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';
import { pool } from './db';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is required to start the API.');
}

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(12) });

type AuthUser = { id: string; email: string; role: 'sales' | 'admin' };

declare global {
  namespace Express { interface Request { user?: AuthUser } }
}

function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, digest] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !digest) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(derived, 'hex'), Buffer.from(digest, 'hex'));
}

export async function login(request: Request, response: Response) {
  const parsed = credentialsSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: 'Invalid credentials.' });
  const { rows } = await pool.query('SELECT id, email, role, password_hash FROM users WHERE email = $1 AND disabled_at IS NULL', [parsed.data.email]);
  const user = rows[0];
  if (!user || !verifyPassword(parsed.data.password, user.password_hash)) return response.status(401).json({ error: 'Invalid credentials.' });
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, jwtSecret, { expiresIn: '8h' });
  response.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}

export function requireRole(...roles: AuthUser['role'][]) {
  return (request: Request, response: Response, next: NextFunction) => {
    const header = request.header('authorization');
    if (!header?.startsWith('Bearer ')) return response.status(401).json({ error: 'Authentication required.' });
    try {
      const payload = jwt.verify(header.slice(7), jwtSecret) as jwt.JwtPayload & AuthUser;
      if (!payload.sub || !roles.includes(payload.role)) return response.status(403).json({ error: 'Insufficient permissions.' });
      request.user = { id: payload.sub, email: payload.email, role: payload.role };
      next();
    } catch {
      response.status(401).json({ error: 'Invalid or expired session.' });
    }
  };
}
