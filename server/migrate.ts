import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pool } from './db';

const migration = await fs.readFile(path.resolve('db/migrations/001_initial.sql'), 'utf8');
await pool.query(migration);
await pool.end();
console.log('Database migration 001 applied.');
