# Cortek Enterprises Architecture

## Overview

Cortek Enterprises is a retail inventory and sales platform for pre-owned electronics. The React and TypeScript frontend is built with Vite and served by the Express application. Express also provides the JSON API and connects to PostgreSQL.

## Application layers

- React frontend: customer catalog, product details, static merchandising content, staff login, admin dashboard, and sales portal.
- Express API: authentication, role authorization, product and inventory operations, customers, reservations, sales, inspections, uploads, and health checks.
- PostgreSQL: the authoritative store for users, products, physical inventory units, customers, reservations, sales, inspections, images, and audit records.

## Domain model

Products represent catalog identity and may have multiple physical inventory units. Each inventory unit has its own ID, stock tag, IMEI, status, sale price, inspection summary, and lifecycle. Reservations and sales always reference an inventory-unit ID. Product images reference products and include URL, ordering, and primary-image metadata.

Inventory statuses are `available`, `reserved`, `sold`, and `retired`. Customer-facing labels are Available, Booked, Sold Out, and Retired. Reservations and sales use database transactions and row locks for concurrency control.

## Authentication and authorization

Staff authenticate at `/login`. Passwords use the application scrypt format and JWTs authenticate API requests. Protected requests revalidate the user, role, and disabled state against PostgreSQL. Admin operations require the admin role; sales operations use the configured sales/admin permissions. The frontend does not determine authorization.

## Images and storage

Staff upload images through `POST /api/uploads/image`. The API stores the file and returns a URL used by product image records. The current provider is the server filesystem at `UPLOAD_DIR`; Railway deployments require a persistent volume or an object-storage provider for durable media.

## Database operations

`npm run db:migrate` applies the transactional schema migration and verifies required tables, types, indexes, and foreign keys before recording the migration version. `npm run db:seed` requires secure deployment-provided bootstrap passwords and inserts the initialization catalog from `src/data/seedPhones.ts` plus staff users. Accessories and educational material in `src/data/staticAccessories.ts` and `src/data/staticContent.ts` are static merchandising content, not inventory.

## Deployment

Railway builds the Docker image with Node 22, runs `npm run build`, and starts Express with `npm run server:start`. Express serves the Vite output and keeps `/api/*` responses as JSON. Required deployment variables include `DATABASE_URL`, `DATABASE_SSL`, `JWT_SECRET`, `APP_ORIGIN`, `PORT`, `UPLOAD_DIR`, and `MAX_FILE_SIZE`. Bootstrap password variables are required only when seeding.

Production URL: https://cortek-enterprises-production.up.railway.app
