import { Router, Request, Response } from 'express';
import { pool, withTransaction } from '../db';
import { authenticate, authorize, getUser } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createAuditLog } from '../middleware/audit';
import { createInventoryUnitSchema, updateInventoryStatusSchema } from '../schemas';

const router = Router();

// GET /api/inventory - List all inventory units
router.get('/', authenticate, authorize('admin', 'sales'), async (req: Request, res: Response) => {
  try {
    const { status, productId } = req.query;
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (status) { conditions.push(`iu.status = $${idx++}`); values.push(status); }
    if (productId) { conditions.push(`iu.product_id = $${idx++}`); values.push(productId); }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT iu.*, p.brand, p.model, p.storage, p.colour, p.price_inr, p.stock_tag as product_stock_tag
       FROM inventory_units iu
       JOIN products p ON p.id = iu.product_id
       ${where}
       ORDER BY iu.created_at DESC`,
      values
    );
    res.json(rows.map(r => ({
      id: r.id,
      productId: r.product_id,
      stockTag: r.stock_tag,
      imei: r.imei,
      status: r.status,
      salePriceInr: r.sale_price_inr,
      brand: r.brand,
      model: r.model,
      storage: r.storage,
      colour: r.colour,
      priceInr: r.price_inr,
      productStockTag: r.product_stock_tag,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error('Inventory list error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/inventory - Create inventory unit
router.post('/', authenticate, authorize('admin'), validate(createInventoryUnitSchema), async (req: Request, res: Response) => {
  try {
    const { productId, stockTag, imei, salePriceInr } = req.body;
    const rows = await withTransaction(async (client) => {
      const { rows: inserted } = await client.query(
        `INSERT INTO inventory_units (product_id, stock_tag, imei, sale_price_inr, created_by)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [productId, stockTag, imei || null, salePriceInr || null, getUser(req)!.id]
      );
      await createAuditLog(req, 'INVENTORY_CREATED', 'inventory_unit', inserted[0].id, { stockTag, productId }, client);
      return inserted;
    });
    res.status(201).json({
      id: rows[0].id,
      productId: rows[0].product_id,
      stockTag: rows[0].stock_tag,
      status: rows[0].status,
    });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Stock tag already exists.' });
    }
    console.error('Inventory create error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PATCH /api/inventory/:id/status - Status transition
router.patch('/:id/status', authenticate, authorize('admin', 'sales'), validate(updateInventoryStatusSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await withTransaction(async (client) => {
      // Lock the row
      const { rows: current } = await client.query(
        `SELECT * FROM inventory_units
         WHERE id = $1 OR product_id = $1
         ORDER BY CASE status WHEN 'available' THEN 0 WHEN 'reserved' THEN 1 ELSE 2 END
         LIMIT 1 FOR UPDATE`,
        [id]
      );
      if (current.length === 0) throw new Error('NOT_FOUND');
      const unit = current[0];

      // Validate status transition
      const validTransitions: Record<string, string[]> = {
        available: ['retired'],
        reserved: [],
        sold: [],
        retired: [],
      };
      if (!validTransitions[unit.status]?.includes(status)) {
        throw new Error(`INVALID_TRANSITION: ${unit.status} -> ${status}`);
      }

      const { rows } = await client.query(
        `UPDATE inventory_units SET status = $1, updated_at = now() WHERE id = $2 RETURNING *`,
        [status, id]
      );
      return rows[0];
    });

    await createAuditLog(req, 'INVENTORY_STATUS_CHANGED', 'inventory_unit', result.id, {
      from: result.status,
      to: status,
    });
    res.json({ id: result.id, status: result.status });
  } catch (err: any) {
    if (err.message === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Inventory unit not found.' });
    }
    if (err.message?.startsWith('INVALID_TRANSITION')) {
      return res.status(400).json({ error: err.message });
    }
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/inventory/:id - Admin deactivate (transactional, enforces valid transitions)
router.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await withTransaction(async (client) => {
      const { rows: current } = await client.query(
        'SELECT * FROM inventory_units WHERE id = $1 FOR UPDATE', [id]
      );
      if (current.length === 0) throw new Error('NOT_FOUND');
      const unit = current[0];

      const validTransitions: Record<string, string[]> = {
        available: ['retired'],
        reserved: [],
        sold: [],
        retired: [],
      };
      if (!validTransitions[unit.status]?.includes('retired')) {
        throw new Error(`INVALID_TRANSITION: ${unit.status} -> retired`);
      }

      const { rows } = await client.query(
        `UPDATE inventory_units SET status = 'retired', updated_at = now() WHERE id = $1 RETURNING *`,
        [id]
      );
      return rows[0];
    });

    await createAuditLog(req, 'INVENTORY_DEACTIVATED', 'inventory_unit', id, { from: result.status });
    res.json({ message: 'Inventory unit deactivated.', status: result.status });
  } catch (err: any) {
    if (err.message === 'NOT_FOUND') return res.status(404).json({ error: 'Inventory unit not found.' });
    if (err.message?.startsWith('INVALID_TRANSITION')) return res.status(400).json({ error: err.message });
    console.error('Inventory deactivate error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
