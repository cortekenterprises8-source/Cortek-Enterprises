import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pool } from './db';
import { verifySchema } from './schemaVerification';

const migration = await fs.readFile(path.resolve('db/migrations/001_initial.sql'), 'utf8');

const client = await pool.connect();
try {
	await client.query('BEGIN');
	await client.query(migration);
	await verifySchema(client);
	await client.query('COMMIT');
	console.log('Database migration 001 applied and schema verified.');
} catch (error) {
	try {
		await client.query('ROLLBACK');
	} catch {
		// Preserve the original migration or verification error.
	}
	const message = error instanceof Error ? error.message : String(error);
	console.error(`Database migration failed: ${message}`);
	console.error('No changes were committed.');
	process.exitCode = 1;
} finally {
	client.release();
	await pool.end();
}
