import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { authenticate, authorize, getUser } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createAuditLog } from '../middleware/audit';
import { createProductSchema, updateProductSchema, productFilterSchema } from '../schemas';

const router = Router();

// GET /api/products - Public catalog
router.get('/', async (req: Request, res: Response) => {
  try {
    const params = productFilterSchema.parse(req.query);
    const conditions: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (params.category) { conditions.push(`p.category = $${idx++}`); values.push(params.category); }
    if (params.brand) { conditions.push(`p.brand = $${idx++}`); values.push(params.brand); }
    if (params.storage) { conditions.push(`p.storage = $${idx++}`); values.push(params.storage); }
    if (params.condition) { conditions.push(`p.condition_grade = $${idx++}`); values.push(params.condition); }
    if (params.minPrice !== undefined) { conditions.push(`p.price_inr >= $${idx++}`); values.push(params.minPrice); }
    if (params.maxPrice !== undefined) { conditions.push(`p.price_inr <= $${idx++}`); values.push(params.maxPrice); }
    if (params.minBatteryHealth !== undefined) { conditions.push(`p.battery_health >= $${idx++}`); values.push(params.minBatteryHealth); }
    if (params.featured !== undefined) { conditions.push(`p.featured = $${idx++}`); values.push(params.featured); }
    if (params.priceDrop !== undefined) { conditions.push(`p.price_drop = $${idx++}`); values.push(params.priceDrop); }
    if (params.search) {
      conditions.push(`(p.brand ILIKE $${idx} OR p.model ILIKE $${idx} OR p.stock_tag ILIKE $${idx} OR p.colour ILIKE $${idx})`);
      values.push(`%${params.search}%`);
      idx++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let havingClause = '';
    if (params.availableOnly) {
      havingClause = `HAVING COUNT(iu.id) FILTER (WHERE iu.status = 'available') > 0`;
    }

    const sortMap: Record<string, string> = {
      'price-asc': 'p.price_inr ASC',
      'price-desc': 'p.price_inr DESC',
      'battery-desc': 'p.battery_health DESC NULLS LAST',
      'newest': 'p.created_at DESC',
      'featured': 'p.featured DESC, p.created_at DESC',
    };
    const orderBy = sortMap[params.sort || 'featured'] || 'p.featured DESC, p.created_at DESC';
    const offset = (params.page - 1) * params.limit;

    const countQuery = `
      SELECT COUNT(DISTINCT p.id)::int as total
      FROM products p
      LEFT JOIN inventory_units iu ON iu.product_id = p.id
      ${where}
      ${havingClause}
    `;
    const countResult = await pool.query(countQuery, values);
    const total = countResult.rows[0]?.total || 0;

    const dataQuery = `
      SELECT p.*,
        COUNT(iu.id)::int AS total_units,
        COUNT(iu.id) FILTER (WHERE iu.status = 'available')::int AS available_units,
        COUNT(iu.id) FILTER (WHERE iu.status = 'reserved')::int AS reserved_units,
        COUNT(iu.id) FILTER (WHERE iu.status = 'sold')::int AS sold_units
      FROM products p
      LEFT JOIN inventory_units iu ON iu.product_id = p.id
      ${where}
      GROUP BY p.id
      ${havingClause}
      ORDER BY ${orderBy}
      LIMIT $${idx++} OFFSET $${idx++}
    `;
    values.push(params.limit, offset);
    const { rows } = await pool.query(dataQuery, values);

    // Get images for each product
    const productIds = rows.map((r: any) => r.id);
    let imageMap: Record<string, any[]> = {};
    if (productIds.length > 0) {
      const { rows: images } = await pool.query(
        `SELECT * FROM product_images WHERE product_id = ANY($1::uuid[]) ORDER BY sort_order`,
        [productIds]
      );
      for (const img of images) {
        if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
        imageMap[img.product_id].push(img);
      }
    }

    const products = rows.map((r: any) => ({
      id: r.id,
      category: r.category,
      brand: r.brand,
      model: r.model,
      storage: r.storage,
      colour: r.colour,
      colorHex: r.color_hex,
      condition: r.condition_grade,
      conditionDescription: r.condition_description,
      batteryHealth: r.battery_health,
      price: r.price_inr,
      originalMsp: r.original_msp,
      billAvailable: r.bill_available,
      billAmount: r.bill_amount,
      priceDrop: r.price_drop,
      featured: r.featured,
      stockTag: r.stock_tag,
      screenSize: r.screen_size,
      ram: r.ram,
      processor: r.processor,
      inBox: r.in_box,
      keyFeatures: r.key_features,
      images: (imageMap[r.id] || []).map((i: any) => i.url),
      dateAdded: r.created_at?.toISOString?.()?.split('T')[0] || '',
      status: r.available_units > 0 ? 'Available' : r.sold_units > 0 ? 'Sold Out' : r.reserved_units > 0 ? 'Booked' : 'Available',
      totalUnits: r.total_units,
      availableUnits: r.available_units,
    }));

    res.json({ products, total, page: params.page, limit: params.limit, pages: Math.ceil(total / params.limit) });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid query parameters.' });
    }
    console.error('Products list error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/products/:id - Public product detail
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT p.*,
        COUNT(iu.id)::int AS total_units,
        COUNT(iu.id) FILTER (WHERE iu.status = 'available')::int AS available_units
      FROM products p
      LEFT JOIN inventory_units iu ON iu.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const r = rows[0];
    const { rows: images } = await pool.query(
      `SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order`,
      [id]
    );
    const { rows: inspections } = await pool.query(
      `SELECT * FROM device_inspections WHERE inventory_unit_id IN
        (SELECT id FROM inventory_units WHERE product_id = $1)
       ORDER BY created_at DESC LIMIT 1`,
      [id]
    );
    res.json({
      id: r.id,
      category: r.category,
      brand: r.brand,
      model: r.model,
      storage: r.storage,
      colour: r.colour,
      colorHex: r.color_hex,
      condition: r.condition_grade,
      conditionDescription: r.condition_description,
      batteryHealth: r.battery_health,
      price: r.price_inr,
      originalMsp: r.original_msp,
      billAvailable: r.bill_available,
      billAmount: r.bill_amount,
      priceDrop: r.price_drop,
      featured: r.featured,
      stockTag: r.stock_tag,
      screenSize: r.screen_size,
      ram: r.ram,
      processor: r.processor,
      inBox: r.in_box,
      keyFeatures: r.key_features,
      images: images.map((i: any) => i.url),
      dateAdded: r.created_at?.toISOString?.()?.split('T')[0] || '',
      status: r.available_units > 0 ? 'Available' : 'Sold Out',
      totalUnits: r.total_units,
      availableUnits: r.available_units,
      inspection: inspections[0] || null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/products - Admin/Sales create product
router.post('/', authenticate, authorize('admin', 'sales'), validate(createProductSchema), async (req: Request, res: Response) => {
  try {
    const d = req.body;
    const stockTag = d.stockTag || `CK-${Date.now().toString(36).toUpperCase().slice(-6)}`;

    const { rows } = await pool.query(
      `INSERT INTO products (category, brand, model, storage, colour, color_hex, price_inr, original_msp,
        bill_available, bill_amount, condition_grade, condition_description, battery_health,
        screen_size, ram, processor, stock_tag, price_drop, featured, in_box, key_features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
       RETURNING *`,
      [d.category, d.brand, d.model, d.storage, d.colour, d.colorHex || null,
       d.priceInr, d.originalMsp || null, d.billAvailable, d.billAmount || null,
       d.conditionGrade, d.conditionDescription, d.batteryHealth || null,
       d.screenSize || null, d.ram || null, d.processor || null,
       stockTag, d.priceDrop, d.featured, JSON.stringify(d.inBox), d.keyFeatures]
    );

    const product = rows[0];

    // Create inventory unit
    const unitTag = `${stockTag}-U1`;
    await pool.query(
      `INSERT INTO inventory_units (product_id, stock_tag, status, sale_price_inr, created_by)
       VALUES ($1, $2, 'available', $3, $4)`,
      [product.id, unitTag, d.priceInr, getUser(req)!.id]
    );

    // Create images
    if (d.images && d.images.length > 0) {
      for (const img of d.images) {
        await pool.query(
          `INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
           VALUES ($1, $2, $3, $4, $5)`,
          [product.id, img.url, img.altText || '', img.sortOrder || 0, img.isPrimary || false]
        );
      }
    }

    await createAuditLog(req, 'PRODUCT_CREATED', 'product', product.id, { brand: d.brand, model: d.model });

    res.status(201).json({ id: product.id, stockTag: product.stock_tag });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Stock tag already exists.' });
    }
    console.error('Product create error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PATCH /api/products/:id - Admin/Sales update product
router.patch('/:id', authenticate, authorize('admin', 'sales'), validate(updateProductSchema), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const d = req.body;
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    const fieldMap: Record<string, string> = {
      category: 'category', brand: 'brand', model: 'model', storage: 'storage',
      colour: 'colour', colorHex: 'color_hex', priceInr: 'price_inr',
      originalMsp: 'original_msp', billAvailable: 'bill_available',
      billAmount: 'bill_amount', conditionGrade: 'condition_grade',
      conditionDescription: 'condition_description', batteryHealth: 'battery_health',
      screenSize: 'screen_size', ram: 'ram', processor: 'processor',
      stockTag: 'stock_tag', priceDrop: 'price_drop', featured: 'featured',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (d[key] !== undefined) {
        fields.push(`${col} = $${idx++}`);
        values.push(d[key]);
      }
    }
    if (d.inBox) {
      fields.push(`in_box = $${idx++}`);
      values.push(JSON.stringify(d.inBox));
    }
    if (d.keyFeatures) {
      fields.push(`key_features = $${idx++}`);
      values.push(d.keyFeatures);
    }

    fields.push(`updated_at = now()`);
    values.push(id);

    const { rows } = await pool.query(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Update images if provided
    if (d.images) {
      await pool.query('DELETE FROM product_images WHERE product_id = $1', [id]);
      for (const img of d.images) {
        await pool.query(
          `INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, img.url, img.altText || '', img.sortOrder || 0, img.isPrimary || false]
        );
      }
    }

    await createAuditLog(req, 'PRODUCT_UPDATED', 'product', id, { changes: Object.keys(d) });
    res.json({ message: 'Product updated.' });
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Stock tag already exists.' });
    }
    console.error('Product update error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// DELETE /api/products/:id - Admin only
router.delete('/:id', authenticate, authorize('admin'), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING id, model',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    await createAuditLog(req, 'PRODUCT_DELETED', 'product', id, { model: rows[0].model });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    console.error('Product delete error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/products/:id/inventory - Get inventory units for a product
router.get('/:id/inventory', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT * FROM inventory_units WHERE product_id = $1 ORDER BY created_at DESC`,
      [id]
    );
    res.json(rows.map(r => ({
      id: r.id,
      stockTag: r.stock_tag,
      imei: r.imei,
      status: r.status,
      salePriceInr: r.sale_price_inr,
      inspection: r.inspection,
      createdAt: r.created_at,
    })));
  } catch (err) {
    console.error('Inventory list error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
