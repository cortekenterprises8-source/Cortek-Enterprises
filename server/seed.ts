import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pool, withTransaction } from './db';

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const digest = crypto.scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${digest}`;
}

// Apply migration
const migrationSQL = await fs.readFile(path.resolve('db/migrations/001_initial.sql'), 'utf8');
// Split on semicolons and execute each statement
const statements = migrationSQL
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

for (const stmt of statements) {
  try {
    await pool.query(stmt);
  } catch (err: any) {
    // Ignore duplicate/already-exists errors
    if (!err.message?.includes('already exists') && !err.message?.includes('duplicate')) {
      console.error(`Migration statement failed: ${stmt.slice(0, 80)}...`, err.message);
    }
  }
}
console.log('Migration applied.');

// Seed admin user
const adminHash = hashPassword('admin12345678');
await pool.query(
  `INSERT INTO users (email, password_hash, role, name) VALUES ($1, $2, 'admin', 'Cortek Admin')
   ON CONFLICT (email) DO UPDATE SET password_hash = $2, name = 'Cortek Admin'`,
  ['admin@cortek.com', adminHash]
);

// Seed sales user
const salesHash = hashPassword('sales12345678');
await pool.query(
  `INSERT INTO users (email, password_hash, role, name) VALUES ($1, $2, 'sales', 'Sales Counter')
   ON CONFLICT (email) DO UPDATE SET password_hash = $2, name = 'Sales Counter'`,
  ['sales@cortek.com', salesHash]
);
console.log('Users seeded: admin@cortek.com, sales@cortek.com');

// Seed products from mock data
const { INITIAL_PHONES } = await import('../src/data/mockPhones');

await withTransaction(async (client) => {
  for (const phone of INITIAL_PHONES) {
    const { rows: productRows } = await client.query(
      `INSERT INTO products (category, brand, model, storage, colour, color_hex,
        price_inr, original_msp, bill_available, bill_amount, condition_grade,
        condition_description, battery_health, screen_size, ram, processor,
        stock_tag, price_drop, featured, in_box, key_features)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
       ON CONFLICT (stock_tag) DO NOTHING
       RETURNING id`,
      [
        phone.category || 'Phones', phone.brand, phone.model, phone.storage,
        phone.colour, phone.colorHex || null, phone.price, phone.originalMsp || null,
        phone.billAvailable ?? false, phone.billAmount || null,
        phone.condition, phone.conditionDescription, phone.batteryHealth || null,
        phone.screenSize || null, phone.ram || null, phone.processor || null,
        phone.stockTag || phone.id, phone.priceDrop ?? false, phone.featured ?? false,
        JSON.stringify(phone.inBox), phone.keyFeatures || [],
      ]
    );

    if (productRows.length > 0) {
      const productId = productRows[0].id;

      // Create inventory unit
      const unitTag = `${phone.stockTag || phone.id}-U1`;
      const statusMap: Record<string, string> = { Available: 'available', Booked: 'reserved', 'Sold Out': 'sold' };
      await client.query(
        `INSERT INTO inventory_units (product_id, stock_tag, status, sale_price_inr)
         VALUES ($1, $2, $3::inventory_status, $4) ON CONFLICT (stock_tag) DO NOTHING`,
        [productId, unitTag, statusMap[phone.status] || 'available', phone.price]
      );

      // Create images
      if (phone.images && phone.images.length > 0) {
        for (let i = 0; i < phone.images.length; i++) {
          await client.query(
            `INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
             VALUES ($1, $2, $3, $4, $5)`,
            [productId, phone.images[i], `${phone.brand} ${phone.model}`, i, i === 0]
          );
        }
      }
    }
  }
});

console.log(`Seeded ${INITIAL_PHONES.length} catalog records with inventory units and images.`);
await pool.end();
