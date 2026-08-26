import { pool } from '../db';
import { Request } from 'express';

export async function createAuditLog(
  req: Request,
  action: string,
  entityType: string,
  entityId?: string,
  details: Record<string, unknown> = {}
) {
  try {
    await pool.query(
      `INSERT INTO audit_logs (actor_id, actor_email, actor_role, action, entity_type, entity_id, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        req.user?.id || null,
        req.user?.email || 'system',
        req.user?.role || 'system',
        action,
        entityType,
        entityId || null,
        JSON.stringify(details),
      ]
    );
  } catch (err) {
    console.error('Audit log failed:', err);
  }
}
